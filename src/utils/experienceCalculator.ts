import { ExperienceItem } from '../types/document';

function parseDateToken(token?: string, isEnd: boolean = false): Date | null {
  if (!token || !token.trim()) {
    return isEnd ? new Date() : null;
  }
  const clean = token.trim().toLowerCase();
  if (clean === 'present' || clean === 'current' || clean === 'now' || clean === 'ongoing') {
    return new Date();
  }
  const yyyyMm = clean.match(/^(\d{4})[-/.](\d{1,2})$/);
  if (yyyyMm) {
    const year = parseInt(yyyyMm[1], 10);
    const month = parseInt(yyyyMm[2], 10) - 1;
    if (year >= 1950 && year <= 2050 && month >= 0 && month <= 11) {
      return new Date(year, month, 1);
    }
  }
  const yyyy = clean.match(/^(\d{4})$/);
  if (yyyy) {
    const year = parseInt(yyyy[1], 10);
    if (year >= 1950 && year <= 2050) {
      return new Date(year, isEnd ? 11 : 0, 1);
    }
  }
  const parsed = Date.parse(token);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    if (d.getFullYear() >= 1950 && d.getFullYear() <= 2050) {
      return d;
    }
  }
  return null;
}

interface MonthRange {
  startMonthIndex: number;
  endMonthIndex: number;
}

export function calculateExperienceFromDates(experiences: ExperienceItem[]): {
  totalYears: number;
  totalMonths: number;
  formattedText: string;
  hasValidDates: boolean;
} {
  if (!experiences || experiences.length === 0) {
    return { totalYears: 0, totalMonths: 0, formattedText: '', hasValidDates: false };
  }

  const ranges: MonthRange[] = [];
  for (const exp of experiences) {
    const startDate = parseDateToken(exp.startDate, false);
    let endDate = parseDateToken(exp.endDate, true);
    if (exp.currentlyWorking) {
      endDate = new Date();
    }
    if (startDate && endDate && endDate >= startDate) {
      const startMonthIndex = startDate.getFullYear() * 12 + startDate.getMonth();
      const endMonthIndex = endDate.getFullYear() * 12 + endDate.getMonth();
      ranges.push({ startMonthIndex, endMonthIndex });
    }
  }

  if (ranges.length === 0) {
    return { totalYears: 0, totalMonths: 0, formattedText: '', hasValidDates: false };
  }

  ranges.sort((a, b) => a.startMonthIndex - b.startMonthIndex);

  const merged: MonthRange[] = [];
  let current = { ...ranges[0] };
  for (let i = 1; i < ranges.length; i++) {
    const next = ranges[i];
    if (next.startMonthIndex <= current.endMonthIndex + 1) {
      current.endMonthIndex = Math.max(current.endMonthIndex, next.endMonthIndex);
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);

  let totalMonths = 0;
  for (const r of merged) {
    totalMonths += Math.max(1, r.endMonthIndex - r.startMonthIndex + 1);
  }

  const totalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  let formattedText = '';
  if (totalYears > 0 && remainingMonths > 0) {
    formattedText = `${totalYears} yr${totalYears > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
  } else if (totalYears > 0) {
    formattedText = `${totalYears} year${totalYears > 1 ? 's' : ''}`;
  } else if (totalMonths > 0) {
    formattedText = `${totalMonths} month${totalMonths > 1 ? 's' : ''}`;
  }

  return {
    totalYears,
    totalMonths,
    formattedText,
    hasValidDates: true,
  };
}
