import type { RankInfo, CardOptions } from '../types';
import { getTheme } from '../themes';

export * from './locale';
export * from './fonts';
export * from './cache';

// Number formatting
export const formatNumber = (num: number, precision: number = 1): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(precision).replace(/\.0+$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(precision).replace(/\.0+$/, '') + 'k';
  }
  return num.toString();
};

// Calculate rank based on stats
export const calculateRank = (stats: {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  totalStars: number;
  followers: number;
}): RankInfo => {
  const { totalCommits, totalPRs, totalIssues, totalReviews, totalStars, followers } = stats;

  const COMMITS_WEIGHT = 0.25;
  const PRS_WEIGHT = 0.25;
  const ISSUES_WEIGHT = 0.1;
  const REVIEWS_WEIGHT = 0.1;
  const STARS_WEIGHT = 0.2;
  const FOLLOWERS_WEIGHT = 0.1;

  const normalize = (value: number, median: number): number => {
    if (value <= 0) return 0;
    return Math.min(1, Math.log10(value + 1) / Math.log10(median + 1));
  };

  const score =
    normalize(totalCommits, 1000) * COMMITS_WEIGHT +
    normalize(totalPRs, 100) * PRS_WEIGHT +
    normalize(totalIssues, 50) * ISSUES_WEIGHT +
    normalize(totalReviews, 50) * REVIEWS_WEIGHT +
    normalize(totalStars, 500) * STARS_WEIGHT +
    normalize(followers, 100) * FOLLOWERS_WEIGHT;

  const percentile = Math.round((1 - score) * 100);

  let level: string;
  if (percentile <= 1) level = 'S+';
  else if (percentile <= 5) level = 'S';
  else if (percentile <= 12.5) level = 'A+';
  else if (percentile <= 25) level = 'A';
  else if (percentile <= 37.5) level = 'A-';
  else if (percentile <= 50) level = 'B+';
  else if (percentile <= 62.5) level = 'B';
  else if (percentile <= 75) level = 'B-';
  else if (percentile <= 87.5) level = 'C+';
  else level = 'C';

  return { level, percentile, score };
};

// Parse color
export const parseColor = (color: string | undefined, defaultColor: string): string => {
  if (!color) return defaultColor;
  const cleaned = color.replace(/^#/, '');
  if (/^[0-9A-Fa-f]{3,8}$/.test(cleaned)) {
    return cleaned;
  }
  return defaultColor;
};

// Get colors from options with theme support
export const getColors = (options: CardOptions) => {
  const theme = getTheme(options.theme);
  
  return {
    titleColor: parseColor(options.titleColor, theme.titleColor),
    textColor: parseColor(options.textColor, theme.textColor),
    iconColor: parseColor(options.iconColor, theme.iconColor),
    borderColor: parseColor(options.borderColor, theme.borderColor),
    bgColor: parseColor(options.bgColor, theme.bgColor),
  };
};

// Parse gradient background
export const parseGradient = (bgColor: string): string => {
  const parts = bgColor.split(',');
  if (parts.length < 3) return `#${bgColor}`;
  return `url(#gradient)`;
};

export const createGradientDef = (bgColor: string): string => {
  const parts = bgColor.split(',');
  if (parts.length < 3) return '';
  
  const angle = parseInt(parts[0]) || 0;
  const colors = parts.slice(1);
  
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 + Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 - Math.sin(rad) * 50;
  
  const stops = colors.map((color, i) => {
    const percent = (i / (colors.length - 1)) * 100;
    return `<stop offset="${percent}%" stop-color="#${color.trim()}" />`;
  }).join('\n      ');
  
  return `
    <linearGradient id="gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
      ${stops}
    </linearGradient>`;
};

// Measure text width (approximation)
export const measureText = (text: string, fontSize: number = 14): number => {
  const avgCharWidth = fontSize * 0.7;
  return text.length * avgCharWidth;
};

// Wrap text to fit width
export const wrapText = (text: string, maxWidth: number, fontSize: number = 12): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (measureText(testLine, fontSize) > maxWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word.slice(0, Math.floor(maxWidth / (fontSize * 0.6)) - 3) + '...');
        currentLine = '';
      }
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

// Escape XML special characters
export const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Language colors fallback
export const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#239120',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

export const getLanguageColor = (language: string, color?: string | null): string => {
  if (color) return color;
  return languageColors[language] || '#858585';
};
