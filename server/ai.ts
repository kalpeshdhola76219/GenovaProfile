export const GEMINI_MODEL = 'disabled';

export async function checkAIRateLimit(): Promise<{ allowed: boolean; retryAfterSeconds: number; error?: string }> {
  return { allowed: false, retryAfterSeconds: 0, error: 'AI features have been disabled.' };
}

export async function generateResumeSummaryAI(_data: any) {
  return { success: false, result: '', source: 'none', error: 'AI features have been disabled.' };
}

export async function improveExperienceBulletAI(_data: any) {
  return { success: false, result: '', source: 'none', error: 'AI features have been disabled.' };
}

export async function generateCoverLetterAI(_data: any) {
  return { success: false, result: '', source: 'none', error: 'AI features have been disabled.' };
}

export async function improveBiodataWordingAI(_data: any) {
  return { success: false, result: '', source: 'none', error: 'AI features have been disabled.' };
}
