import type { StatsCardOptions, UserStats } from '../types';
import {
  escapeXml,
  formatNumberLocale,
  getColors,
  getFontFamily,
  getFontSizes,
  type Locale,
  t,
} from '../utils';

// SVG icon paths (16x16 viewBox)
const icons: Record<string, string> = {
  stars:
    'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z',
  commits:
    'M1.643 3.143.427 1.927A.25.25 0 0 1 .604 1.5h2.792a.25.25 0 0 1 .177.427l-1.216 1.216a.25.25 0 0 1-.354 0Zm6.354 1.854a3.5 3.5 0 1 0 0 6.006v1.078a.75.75 0 0 0 1.5 0v-1.078c1.503-.273 2.648-1.577 2.648-3.003 0-1.426-1.145-2.73-2.648-3.003V3.919a.75.75 0 0 0-1.5 0v1.078ZM8 6.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  prs: 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z',
  issues:
    'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z',
  contribs:
    'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
};

const createIcon = (iconKey: string, color: string, x: number, y: number): string => {
  const path = icons[iconKey];
  if (!path) return '';
  return `<svg x="${x}" y="${y - 12}" width="16" height="16" viewBox="0 0 16 16" fill="#${color}"><path d="${path}"/></svg>`;
};

// Standard card height for consistent alignment
const CARD_HEIGHT = 195;

export const createStatsCard = (stats: UserStats, options: StatsCardOptions = {}): string => {
  const colors = getColors(options);
  const showIcons = options.showIcons ?? false;
  const hideRank = options.hideRank ?? false;
  const hide = options.hide ?? [];
  const customTitle = options.customTitle;
  const locale = (options.locale as Locale) || 'en';
  const trans = t(locale);
  const fontFamily = getFontFamily(locale);
  const fontSize = getFontSizes(locale);

  // Card dimensions - fixed height for consistency
  const width = options.cardWidth ?? 495;
  const height = CARD_HEIGHT;
  const padding = 20;
  const iconOffset = showIcons ? 22 : 0;

  // Vertical layout: top 20px, title, 15px gap, content, bottom 20px
  const titleY = 35;
  const contentStart = 55;
  const contentEnd = height - 20;
  const contentHeight = contentEnd - contentStart;

  // Stats to display
  const statItems = [
    { key: 'stars', label: trans.stats.totalStars, value: stats.totalStars },
    { key: 'commits', label: trans.stats.totalCommits, value: stats.totalCommits },
    { key: 'prs', label: trans.stats.totalPRs, value: stats.totalPRs },
    { key: 'issues', label: trans.stats.totalIssues, value: stats.totalIssues },
    { key: 'contribs', label: trans.stats.contributedTo, value: stats.contributedTo },
  ].filter((stat) => !hide.includes(stat.key));

  const title = escapeXml(customTitle ?? trans.stats.title(stats.name));

  // Stats area width (leave room for rank circle on right if shown)
  const statsAreaWidth = hideRank ? width - padding * 2 : width - 115;
  const lineHeight = Math.floor(contentHeight / Math.max(statItems.length, 1));

  // Build stats rows
  let statsContent = '';
  statItems.forEach((stat, index) => {
    const y = contentStart + index * lineHeight + 12;
    const textX = padding + iconOffset;
    const iconContent = showIcons ? createIcon(stat.key, colors.iconColor, padding, y) : '';
    statsContent += `
      ${iconContent}
      <text x="${textX}" y="${y}" fill="#${colors.textColor}" font-size="${fontSize.label}" font-family="${fontFamily}" opacity="0.8">${stat.label}</text>
      <text x="${statsAreaWidth}" y="${y}" fill="#${colors.titleColor}" font-size="${fontSize.value}" font-family="${fontFamily}" font-weight="600" text-anchor="end">${formatNumberLocale(stat.value, locale)}</text>
    `;
  });

  // Rank circle (positioned on right side if not hidden)
  let rankContent = '';
  if (!hideRank) {
    const circleX = width - 55;
    const circleY = height / 2 + 5;
    const circleRadius = 35;
    const circumference = 2 * Math.PI * circleRadius;
    const progress = ((100 - stats.rank.percentile) / 100) * circumference;

    rankContent = `
      <g transform="translate(${circleX}, ${circleY})">
        <circle cx="0" cy="0" r="${circleRadius}" fill="none" stroke="#${colors.borderColor}" stroke-width="4" opacity="0.3" />
        <circle cx="0" cy="0" r="${circleRadius}" fill="none" stroke="#${colors.titleColor}" stroke-width="4"
                stroke-dasharray="${circumference}" stroke-dashoffset="${circumference - progress}"
                transform="rotate(-90)" stroke-linecap="round" />
        <text x="0" y="6" fill="#${colors.titleColor}" font-size="20" font-family="${fontFamily}" font-weight="700" text-anchor="middle">${stats.rank.level}</text>
        <text x="0" y="-46" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}" text-anchor="middle" opacity="0.7">${trans.stats.top} ${stats.rank.percentile}%</text>
      </g>
    `;
  }

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />

  <text x="${padding}" y="${titleY}" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>

  ${statsContent}
  ${rankContent}
</svg>`;
};
