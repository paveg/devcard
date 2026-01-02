import type { GitHubRepo, RepoCardOptions } from '../types';
import {
  escapeXml,
  formatNumberLocale,
  getColors,
  getFontFamily,
  getFontSizes,
  getLanguageColor,
  type Locale,
  t,
  wrapText,
} from '../utils';

// Standard card height for consistent alignment
const CARD_HEIGHT = 195;

// SVG icon paths
const repoIcon =
  'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z';
const starIcon =
  'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z';
const forkIcon =
  'M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.878Zm6.5-.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm-3 8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z';

export const createRepoCard = (repo: GitHubRepo, options: RepoCardOptions = {}): string => {
  const colors = getColors(options);
  const showOwner = options.showOwner ?? false;
  const locale = (options.locale as Locale) || 'en';
  const trans = t(locale);
  const fontFamily = getFontFamily(locale);
  const fontSize = getFontSizes(locale);

  const width = options.cardWidth ?? 400;
  const height = CARD_HEIGHT;
  const padding = 15;

  const titleText = showOwner ? repo.nameWithOwner : repo.name;
  const description = repo.description || trans.repo.noDescription;
  // Fixed max lines to fit in 195px height
  const descLines = wrapText(description, width - padding * 2 - 20, 12).slice(0, 4);

  // Description section
  let descContent = '';
  descLines.forEach((line, i) => {
    descContent += `<text x="${padding}" y="${52 + i * 18}" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}" opacity="0.8">${escapeXml(line)}</text>\n`;
  });

  // Stats section at fixed position
  const statsY = height - 25;
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

  // Stars with icon
  const starContent = `
    <g transform="translate(${statsX}, ${statsY - 7})">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="#${colors.iconColor}"><path d="${starIcon}"/></svg>
      <text x="18" y="11" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">${formatNumberLocale(repo.stargazerCount, locale)}</text>
    </g>
  `;
  statsX += 55;

  // Forks with icon
  const forkContent = `
    <g transform="translate(${statsX}, ${statsY - 7})">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="#${colors.iconColor}"><path d="${forkIcon}"/></svg>
      <text x="18" y="11" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">${formatNumberLocale(repo.forkCount, locale)}</text>
    </g>
  `;

  // Archived badge
  let archivedBadge = '';
  if (repo.isArchived) {
    archivedBadge = `
      <rect x="${width - 75}" y="12" width="60" height="18" fill="#${colors.textColor}" opacity="0.15" rx="9" />
      <text x="${width - 45}" y="24" fill="#${colors.textColor}" font-size="10" font-family="${fontFamily}" text-anchor="middle">${trans.repo.archived}</text>
    `;
  }

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />

  <g transform="translate(${padding}, 18)">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#${colors.iconColor}"><path d="${repoIcon}"/></svg>
    <text x="22" y="13" fill="#${colors.titleColor}" font-size="${fontSize.value}" font-family="${fontFamily}" font-weight="600">${escapeXml(titleText)}</text>
  </g>
  ${archivedBadge}

  ${descContent}

  ${langContent}
  ${starContent}
  ${forkContent}
</svg>`;
};
