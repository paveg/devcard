import type { LanguageStats, LanguagesCardOptions } from '../types';
import {
  escapeXml,
  getColors,
  getFontFamily,
  getFontSizes,
  getLanguageColor,
  type Locale,
  t,
} from '../utils';

// Standard card height for consistent alignment
const CARD_HEIGHT = 195;

export const createLanguagesCard = (
  languages: LanguageStats,
  options: LanguagesCardOptions = {}
): string => {
  const colors = getColors(options);
  const layout = options.layout ?? 'normal';
  const customTitle = options.customTitle;
  const locale = (options.locale as Locale) || 'en';
  const trans = t(locale);
  const fontFamily = getFontFamily(locale);
  const fontSize = getFontSizes(locale);
  const title = escapeXml(customTitle ?? trans.languages.title);

  // Limit languages to fit in fixed height
  const maxLangs = layout === 'compact' ? 8 : 5;
  const langArray = Object.values(languages).slice(
    0,
    Math.min(options.langsCount ?? maxLangs, maxLangs)
  );

  if (langArray.length === 0) {
    return createEmptyCard(
      title,
      colors,
      options.cardWidth ?? 300,
      locale,
      trans,
      fontFamily,
      fontSize
    );
  }

  switch (layout) {
    case 'compact':
      return createCompactLayout(
        langArray,
        title,
        colors,
        options.cardWidth ?? 300,
        locale,
        fontFamily,
        fontSize
      );
    default:
      return createNormalLayout(
        langArray,
        title,
        colors,
        options.cardWidth ?? 300,
        locale,
        fontFamily,
        fontSize
      );
  }
};

const createNormalLayout = (
  langs: any[],
  title: string,
  colors: any,
  width: number,
  _locale: Locale,
  fontFamily: string,
  fontSize: any
): string => {
  const padding = 20;
  const height = CARD_HEIGHT;

  // Vertical layout: top 20px, title, 15px gap, content, bottom 20px
  const titleY = 35;
  const contentStart = 55;
  const contentEnd = height - 20;
  const itemHeight = Math.floor((contentEnd - contentStart) / Math.max(langs.length, 1));
  const barWidth = width - padding * 2;

  let content = '';
  langs.forEach((lang, index) => {
    const y = contentStart + index * itemHeight;
    const progressWidth = (lang.percentage / 100) * barWidth;

    content += `
      <g transform="translate(${padding}, ${y})">
        <circle cx="6" cy="8" r="5" fill="${getLanguageColor(lang.name, lang.color)}" />
        <text x="18" y="12" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">${escapeXml(lang.name)}</text>
        <text x="${barWidth}" y="12" fill="#${colors.titleColor}" font-size="${fontSize.small}" font-family="${fontFamily}" font-weight="600" text-anchor="end">${lang.percentage.toFixed(1)}%</text>

        <rect x="0" y="16" width="${barWidth}" height="5" fill="#${colors.borderColor}" opacity="0.2" rx="2.5" />
        <rect x="0" y="16" width="${progressWidth}" height="5" fill="${getLanguageColor(lang.name, lang.color)}" rx="2.5" />
      </g>
    `;
  });

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />

  <text x="${padding}" y="${titleY}" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>

  ${content}
</svg>`;
};

const createCompactLayout = (
  langs: any[],
  title: string,
  colors: any,
  width: number,
  _locale: Locale,
  fontFamily: string,
  fontSize: any
): string => {
  const padding = 20;
  const height = CARD_HEIGHT;
  const barHeight = 8;
  const barWidth = width - padding * 2;

  // Vertical layout: top 20px, title, 15px gap, content, bottom 20px
  const titleY = 35;

  // Create stacked bar
  let stackedBar = '';
  let currentX = 0;
  langs.forEach((lang) => {
    const segmentWidth = (lang.percentage / 100) * barWidth;
    stackedBar += `<rect x="${currentX}" y="0" width="${segmentWidth}" height="${barHeight}" fill="${getLanguageColor(lang.name, lang.color)}" />`;
    currentX += segmentWidth;
  });

  // Create legend (2 columns, max 4 rows = 8 items)
  let legend = '';
  const cols = 2;
  const colWidth = barWidth / cols;
  const legendStartY = 72;
  const legendRowHeight = 24;

  langs.forEach((lang, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * colWidth;
    const y = legendStartY + row * legendRowHeight;

    legend += `
      <g transform="translate(${padding + x}, ${y})">
        <rect x="0" y="0" width="10" height="10" fill="${getLanguageColor(lang.name, lang.color)}" rx="2" />
        <text x="14" y="9" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">${escapeXml(lang.name)} ${lang.percentage.toFixed(1)}%</text>
      </g>
    `;
  });

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />

  <text x="${padding}" y="${titleY}" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>

  <g transform="translate(${padding}, 52)">
    <rect x="0" y="0" width="${barWidth}" height="${barHeight}" fill="#${colors.borderColor}" opacity="0.2" rx="${barHeight / 2}" />
    <g mask="url(#bar-mask)">
      ${stackedBar}
    </g>
  </g>

  ${legend}

  <defs>
    <mask id="bar-mask">
      <rect x="0" y="0" width="${barWidth}" height="${barHeight}" fill="white" rx="${barHeight / 2}" />
    </mask>
  </defs>
</svg>`;
};

const createEmptyCard = (
  title: string,
  colors: any,
  width: number,
  _locale: Locale,
  trans: any,
  fontFamily: string,
  fontSize: any
): string => {
  const height = CARD_HEIGHT;
  const padding = 15;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />

  <text x="${padding}" y="28" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>
  <text x="${width / 2}" y="${height / 2 + 10}" fill="#${colors.textColor}" font-size="${fontSize.normal}" font-family="${fontFamily}" text-anchor="middle" opacity="0.6">${trans.languages.noData}</text>
</svg>`;
};
