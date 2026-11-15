import { DocumentData } from '../types/document';
import { getTemplateById } from '../templates/registry';

export interface ATSCheckItem {
  id: string;
  category: 'contact' | 'summary' | 'experience' | 'skills' | 'layout';
  title: string;
  passed: boolean;
  score: number;
  maxScore: number;
  detail: string;
  fixSuggestion?: string;
}

export interface ATSAnalysisResult {
  overallScore: number; // 0 - 100
  rating: 'Exceptional' | 'Competitive' | 'Needs Improvement' | 'Critical Issues';
  summary: string;
  checks: ATSCheckItem[];
  categoryScores: {
    contact: { score: number; max: number };
    summary: { score: number; max: number };
    experience: { score: number; max: number };
    skills: { score: number; max: number };
    layout: { score: number; max: number };
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export function analyzeResumeATS(doc: DocumentData, jobDescription?: string): ATSAnalysisResult {
  const checks: ATSCheckItem[] = [];
  const recs: string[] = [];
  const template = getTemplateById(doc.templateId);
  const isATSLayout = Boolean(template ? template.isATS : true);

  // 1. Contact Information (20 pts)
  const hasName = Boolean(doc.personal?.fullName && doc.personal.fullName.trim().length > 2);
  const hasEmail = Boolean(doc.contact?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doc.contact.email.trim()));
  const hasPhone = Boolean(doc.contact?.phone && doc.contact.phone.replace(/\D/g, '').length >= 10);
  const hasLocation = Boolean((doc.contact?.city || doc.personal?.placeOfBirth || doc.contact?.address || '').trim());
  const hasLinkedIn = Boolean((doc.contact?.linkedin || doc.contact?.website || '').trim());

  let contactScore = 0;
  if (hasName) contactScore += 5;
  if (hasEmail) contactScore += 5;
  if (hasPhone) contactScore += 4;
  if (hasLocation) contactScore += 3;
  if (hasLinkedIn) contactScore += 3;

  checks.push({
    id: 'contact_core',
    category: 'contact',
    title: 'Essential Contact Information',
    passed: hasName && hasEmail && hasPhone,
    score: contactScore,
    maxScore: 20,
    detail: `${hasEmail ? '✓ Valid email' : '✗ Missing email'}; ${hasPhone ? '✓ Valid phone' : '✗ Missing phone'}; ${hasLocation ? '✓ Location included' : '✗ Location missing'}; ${hasLinkedIn ? '✓ Portfolio/LinkedIn included' : '✗ Professional link missing'}.`,
    fixSuggestion: !hasEmail ? 'Add a professional email address for recruiter contact.' : !hasPhone ? 'Include a direct contact phone number.' : undefined,
  });

  if (!hasEmail) recs.push('Add a valid professional email address.');
  if (!hasPhone) recs.push('Add a primary contact phone number.');
  if (!hasLinkedIn) recs.push('Include a LinkedIn profile or professional portfolio URL.');

  // 2. Professional Title & Summary (15 pts)
  const title = (doc.personal?.professionalTitle || '').trim();
  const summary = (doc.summary || '').trim();
  const wordCount = summary ? summary.split(/\s+/).length : 0;
  let summaryScore = 0;
  if (title.length > 3) summaryScore += 5;
  if (wordCount >= 25 && wordCount <= 120) summaryScore += 10;
  else if (wordCount > 0) summaryScore += 5;

  checks.push({
    id: 'summary_depth',
    category: 'summary',
    title: 'Professional Headline & Executive Summary',
    passed: title.length > 0 && wordCount >= 25,
    score: summaryScore,
    maxScore: 15,
    detail: title ? `Target Role: "${title}". Summary length: ${wordCount} words (optimal: 30-80 words).` : 'Missing explicit target job headline.',
    fixSuggestion: wordCount < 25 ? 'Expand summary to 3-4 sentences describing your core specialization and measurable impact.' : undefined,
  });

  if (!title) recs.push('Specify a clear target professional headline (e.g., "Senior Software Engineer" or "Financial Analyst").');
  if (wordCount < 25) recs.push('Expand your professional summary to at least 30-50 words highlighting career highlights.');

  // 3. Work Experience & Achievements (25 pts)
  const expItems = doc.experience || [];
  let experienceScore = 0;
  const actionVerbsRegex = /\b(spearheaded|architected|orchestrated|engineered|accelerated|increased|decreased|reduced|delivered|launched|directed|managed|built|designed|implemented|optimized|generated|achieved)\b/i;
  const metricsRegex = /\b(\d+%|\$\d+|\d+\+? million|\d+\+? users|\d+x|\d+ team members|\d+ projects)\b/i;

  let hasActionVerbs = false;
  let hasMetrics = false;

  if (expItems.length > 0) {
    experienceScore += 10;
    const combinedDesc = expItems.map((e) => `${e.description || ''} ${e.achievements || ''}`).join(' ');
    if (actionVerbsRegex.test(combinedDesc)) {
      experienceScore += 8;
      hasActionVerbs = true;
    }
    if (metricsRegex.test(combinedDesc)) {
      experienceScore += 7;
      hasMetrics = true;
    }
  }

  checks.push({
    id: 'experience_rigor',
    category: 'experience',
    title: 'Work Experience & Quantifiable Achievements',
    passed: expItems.length > 0 && hasActionVerbs,
    score: experienceScore,
    maxScore: 25,
    detail: `${expItems.length} experience roles recorded. Action verbs: ${hasActionVerbs ? '✓ Detected strong power verbs' : '✗ Lacking active impact verbs'}. Metrics: ${hasMetrics ? '✓ Quantified results detected' : '✗ Add quantifiable metrics (% / $ / counts)'}.`,
    fixSuggestion: !hasMetrics ? 'Add numbers and measurable results (e.g., "Increased sales by 24%", "Cut latency by 40%").' : undefined,
  });

  if (expItems.length === 0) recs.push('Add at least one relevant work experience role or internship.');
  if (!hasActionVerbs) recs.push('Start bullet points with strong action verbs (e.g., "Engineered", "Orchestrated", "Delivered").');
  if (!hasMetrics) recs.push('Quantify your achievements with numbers, percentages, team sizes, or dollar impact.');

  // 4. Skills & Keywords (20 pts)
  const skillsList = (doc.skills || []).map((s) => s.name.trim()).filter(Boolean);
  let skillsScore = 0;
  if (skillsList.length >= 6) skillsScore += 12;
  else if (skillsList.length >= 3) skillsScore += 6;

  const skillCategories = new Set((doc.skills || []).map((s) => s.category));
  if (skillCategories.size >= 2) skillsScore += 8;
  else if (skillCategories.size >= 1) skillsScore += 4;

  checks.push({
    id: 'skills_keywords',
    category: 'skills',
    title: 'Skills Breadth & Categorization',
    passed: skillsList.length >= 6,
    score: Math.min(20, skillsScore),
    maxScore: 20,
    detail: `${skillsList.length} skills identified across ${skillCategories.size} categories.`,
    fixSuggestion: skillsList.length < 6 ? 'List at least 6-10 specific technical tools, methodologies, and core competencies.' : undefined,
  });

  if (skillsList.length < 6) recs.push('List at least 6 core technical competencies and industry keywords.');

  // 5. Layout & Heading Structure (20 pts)
  let layoutScore = 0;
  if (isATSLayout) {
    layoutScore += 12;
  } else {
    layoutScore += 6;
  }

  const hasEducation = (doc.education || []).length > 0;
  if (hasEducation) layoutScore += 8;

  checks.push({
    id: 'layout_parseable',
    category: 'layout',
    title: 'ATS-Friendly Formatting & Single-Column Structure',
    passed: isATSLayout,
    score: Math.min(20, layoutScore),
    maxScore: 20,
    detail: isATSLayout
      ? '✓ Selected template uses ATS-friendly linear layout with standard machine-readable heading hierarchy.'
      : '⚠ Visual layout contains multi-column styling. Consider testing with an ATS-Friendly template for high-volume automated portals.',
    fixSuggestion: !isATSLayout ? 'For corporate ATS portals, select an ATS-Friendly template from the gallery.' : undefined,
  });

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  if (jobDescription && jobDescription.trim().length > 20) {
    const jdWords = jobDescription
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4);
    const resumeFullText = JSON.stringify(doc).toLowerCase();
    const commonTechnicalTerms = Array.from(new Set(jdWords)).slice(0, 15);
    for (const term of commonTechnicalTerms) {
      if (resumeFullText.includes(term)) {
        matchedKeywords.push(term);
      } else {
        missingKeywords.push(term);
      }
    }
  }

  const totalScore = checks.reduce((acc, c) => acc + c.score, 0);
  let rating: ATSAnalysisResult['rating'] = 'Needs Improvement';
  if (totalScore >= 88) rating = 'Exceptional';
  else if (totalScore >= 75) rating = 'Competitive';
  else if (totalScore >= 55) rating = 'Needs Improvement';
  else rating = 'Critical Issues';

  return {
    overallScore: Math.min(100, Math.max(0, totalScore)),
    rating,
    summary: `Your resume scored ${totalScore}/100 on our ATS-Friendly scanner (${rating}). ${
      recs.length === 0 ? 'Excellent machine readability and content structure.' : `Identified ${recs.length} actionable suggestions to maximize recruiter visibility.`
    }`,
    checks,
    categoryScores: {
      contact: { score: contactScore, max: 20 },
      summary: { score: summaryScore, max: 15 },
      experience: { score: experienceScore, max: 25 },
      skills: { score: Math.min(20, skillsScore), max: 20 },
      layout: { score: Math.min(20, layoutScore), max: 20 },
    },
    matchedKeywords,
    missingKeywords,
    recommendations: recs,
  };
}
