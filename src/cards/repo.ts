import type { GitHubRepo, RepoCardOptions } from '../types';
import { getColors, formatNumber, escapeXml, wrapText, getLanguageColor, t, formatNumberLocale, type Locale, getFontFamily, getFontSizes } from '../utils';

export const createRepoCard = (
  repo: GitHubRepo,
  options: RepoCardOptions = {}
): string => {
  const colors = getColors(options);
  const showOwner = options.showOwner ?? false;
  const descriptionLinesCount = options.descriptionLinesCount ?? 2;
  const locale = (options.locale as Locale) || 'en';
  const trans = t(locale);
  const fontFamily = getFontFamily(locale);
  const fontSize = getFontSizes(locale);
  
  const width = options.cardWidth ?? 400;
  const padding = 20;
  const titleHeight = 50;
  const lineHeight = 18;
  
  const titleText = showOwner ? repo.nameWithOwner : repo.name;
  const description = repo.description || trans.repo.noDescription;
  const descLines = wrapText(description, width - padding * 2, 13).slice(0, descriptionLinesCount);
  
  const descriptionHeight = descLines.length * lineHeight + 10;
  const statsHeight = 30;
  const height = titleHeight + descriptionHeight + statsHeight + padding * 2;
  
  // Description lines
  let descContent = '';
  descLines.forEach((line, i) => {
    descContent += `<text x="${padding}" y="${titleHeight + 10 + i * lineHeight}" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}" opacity="0.8">${escapeXml(line)}</text>\n`;
  });
  
  // Stats section
  const statsY = titleHeight + descriptionHeight + 15;
  let statsX = padding;
  
  // Language dot
  let langContent = '';
  if (repo.primaryLanguage) {
    langContent = `
      <circle cx="${statsX + 5}" cy="${statsY}" r="5" fill="${getLanguageColor(repo.primaryLanguage.name, repo.primaryLanguage.color)}" />
      <text x="${statsX + 15}" y="${statsY + 4}" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">${escapeXml(repo.primaryLanguage.name)}</text>
    `;
    statsX += 100;
  }
  
  // Stars
  const starContent = `
    <text x="${statsX}" y="${statsY + 4}" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">⭐ ${formatNumberLocale(repo.stargazerCount, locale)}</text>
  `;
  statsX += 60;
  
  // Forks
  const forkContent = `
    <text x="${statsX}" y="${statsY + 4}" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">🍴 ${formatNumberLocale(repo.forkCount, locale)}</text>
  `;
  
  // Archived badge
  let archivedBadge = '';
  if (repo.isArchived) {
    archivedBadge = `
      <rect x="${width - 80}" y="10" width="60" height="20" fill="#${colors.textColor}" opacity="0.2" rx="10" />
      <text x="${width - 50}" y="24" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}" text-anchor="middle">${trans.repo.archived}</text>
    `;
  }
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />
  
  <text x="${padding}" y="35" fill="#${colors.titleColor}" font-size="${fontSize.value}" font-family="${fontFamily}" font-weight="600">📦 ${escapeXml(titleText)}</text>
  ${archivedBadge}
  
  ${descContent}
  
  ${langContent}
  ${starContent}
  ${forkContent}
</svg>`;
};