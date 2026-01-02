import type { UserStats, StatsCardOptions } from '../types';
import { getColors, formatNumber, escapeXml, t, formatNumberLocale, type Locale, getFontFamily, getFontSizes } from '../utils';

export const createStatsCard = (
  stats: UserStats,
  options: StatsCardOptions = {}
): string => {
  const colors = getColors(options);
  const showIcons = options.showIcons ?? false;
  const hideRank = options.hideRank ?? false;
  const hide = options.hide ?? [];
  const customTitle = options.customTitle;
  const locale = (options.locale as Locale) || 'en';
  const trans = t(locale);
  const fontFamily = getFontFamily(locale);
  const fontSize = getFontSizes(locale);
  
  // Card dimensions
  const width = options.cardWidth ?? 450;
  const padding = 20;
  const titleHeight = 50;
  const lineHeight = 30;
  
  // Stats to display
  const statItems = [
    { key: 'stars', label: trans.stats.totalStars, value: stats.totalStars },
    { key: 'commits', label: trans.stats.totalCommits, value: stats.totalCommits },
    { key: 'prs', label: trans.stats.totalPRs, value: stats.totalPRs },
    { key: 'issues', label: trans.stats.totalIssues, value: stats.totalIssues },
    { key: 'contribs', label: trans.stats.contributedTo, value: stats.contributedTo },
  ].filter(stat => !hide.includes(stat.key));
  
  const contentHeight = statItems.length * lineHeight;
  const rankHeight = hideRank ? 0 : 120;
  const height = titleHeight + contentHeight + rankHeight + padding * 2;
  
  const title = escapeXml(customTitle ?? trans.stats.title(stats.name));
  
  // Build stats rows
  let statsContent = '';
  statItems.forEach((stat, index) => {
    const y = titleHeight + (index * lineHeight) + 5;
    statsContent += `
      <text x="${padding}" y="${y}" fill="#${colors.textColor}" font-size="${fontSize.label}" font-family="${fontFamily}" opacity="0.8">${stat.label}</text>
      <text x="${width - padding}" y="${y}" fill="#${colors.titleColor}" font-size="${fontSize.value}" font-family="${fontFamily}" font-weight="600" text-anchor="end">${formatNumberLocale(stat.value, locale)}</text>
    `;
  });
  
  // Rank circle (if not hidden)
  let rankContent = '';
  if (!hideRank) {
    const rankY = titleHeight + contentHeight + 60;
    const circleRadius = 40;
    const circumference = 2 * Math.PI * circleRadius;
    const progress = ((100 - stats.rank.percentile) / 100) * circumference;
    
    rankContent = `
      <g transform="translate(${width / 2}, ${rankY})">
        <circle cx="0" cy="0" r="${circleRadius}" fill="none" stroke="#${colors.borderColor}" stroke-width="4" opacity="0.3" />
        <circle cx="0" cy="0" r="${circleRadius}" fill="none" stroke="#${colors.titleColor}" stroke-width="4"
                stroke-dasharray="${circumference}" stroke-dashoffset="${circumference - progress}"
                transform="rotate(-90)" stroke-linecap="round" />
        <text x="0" y="5" fill="#${colors.titleColor}" font-size="24" font-family="${fontFamily}" font-weight="700" text-anchor="middle">${stats.rank.level}</text>
        <text x="0" y="-55" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}" text-anchor="middle" opacity="0.8">${trans.stats.top} ${stats.rank.percentile}%</text>
      </g>
    `;
  }
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />
  
  <text x="${padding}" y="35" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>
  
  ${statsContent}
  ${rankContent}
</svg>`;
};