import type { LanguageStats, LanguagesCardOptions } from '../types';
import { getColors, escapeXml, getLanguageColor, t, type Locale, getFontFamily, getFontSizes } from '../utils';

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
  
  const langArray = Object.values(languages).slice(0, options.langsCount ?? 8);
  
  if (langArray.length === 0) {
    return createEmptyCard(title, colors, options.cardWidth ?? 300, locale, trans, fontFamily, fontSize);
  }

  switch (layout) {
    case 'compact':
      return createCompactLayout(langArray, title, colors, options.cardWidth ?? 300, locale, fontFamily, fontSize);
    default:
      return createNormalLayout(langArray, title, colors, options.cardWidth ?? 300, locale, fontFamily, fontSize);
  }
};

const createNormalLayout = (
  langs: any[],
  title: string,
  colors: any,
  width: number,
  locale: Locale,
  fontFamily: string,
  fontSize: any
): string => {
  const padding = 20;
  const titleHeight = 50;
  const itemHeight = 35;
  const height = titleHeight + langs.length * itemHeight + padding * 2;
  
  let content = '';
  langs.forEach((lang, index) => {
    const y = titleHeight + index * itemHeight;
    const barY = 18;
    const barWidth = width - padding * 2;
    const progressWidth = (lang.percentage / 100) * barWidth;
    
    content += `
      <g transform="translate(${padding}, ${y})">
        <circle cx="6" cy="10" r="5" fill="${getLanguageColor(lang.name, lang.color)}" />
        <text x="20" y="14" fill="#${colors.textColor}" font-size="${fontSize.normal}" font-family="${fontFamily}">${escapeXml(lang.name)}</text>
        <text x="${barWidth}" y="14" fill="#${colors.titleColor}" font-size="${fontSize.normal}" font-family="${fontFamily}" font-weight="600" text-anchor="end">${lang.percentage.toFixed(1)}%</text>
        
        <rect x="0" y="${barY}" width="${barWidth}" height="6" fill="#${colors.borderColor}" opacity="0.2" rx="3" />
        <rect x="0" y="${barY}" width="${progressWidth}" height="6" fill="${getLanguageColor(lang.name, lang.color)}" rx="3" />
      </g>
    `;
  });
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />
  
  <text x="${padding}" y="35" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>
  
  ${content}
</svg>`;
};

const createCompactLayout = (
  langs: any[],
  title: string,
  colors: any,
  width: number,
  locale: Locale,
  fontFamily: string,
  fontSize: any
): string => {
  const padding = 20;
  const barHeight = 8;
  const barWidth = width - padding * 2;
  
  // Calculate height based on legend rows
  const cols = 2;
  const legendRows = Math.ceil(langs.length / cols);
  const legendHeight = legendRows * 20;
  const height = 80 + legendHeight + padding;
  
  // Create stacked bar
  let stackedBar = '';
  let currentX = 0;
  langs.forEach((lang, i) => {
    const segmentWidth = (lang.percentage / 100) * barWidth;
    stackedBar += `<rect x="${currentX}" y="0" width="${segmentWidth}" height="${barHeight}" fill="${getLanguageColor(lang.name, lang.color)}" />`;
    currentX += segmentWidth;
  });
  
  // Create legend
  let legend = '';
  const legendY = 25;
  const colWidth = barWidth / cols;
  
  langs.forEach((lang, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * colWidth;
    const y = legendY + row * 20;
    
    legend += `
      <g transform="translate(${x}, ${y})">
        <rect x="0" y="3" width="10" height="10" fill="${getLanguageColor(lang.name, lang.color)}" rx="2" />
        <text x="14" y="11" fill="#${colors.textColor}" font-size="${fontSize.small}" font-family="${fontFamily}">${escapeXml(lang.name)} ${lang.percentage.toFixed(1)}%</text>
      </g>
    `;
  });
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />
  
  <text x="${padding}" y="35" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>
  
  <g transform="translate(${padding}, 55)">
    <rect x="0" y="0" width="${barWidth}" height="${barHeight}" fill="#${colors.borderColor}" opacity="0.2" rx="${barHeight/2}" />
    <g mask="url(#bar-mask)">
      ${stackedBar}
    </g>
    <g transform="translate(0, ${legendY})">
      ${legend}
    </g>
  </g>
  
  <defs>
    <mask id="bar-mask">
      <rect x="0" y="0" width="${barWidth}" height="${barHeight}" fill="white" rx="${barHeight/2}" />
    </mask>
  </defs>
</svg>`;
};

const createEmptyCard = (title: string, colors: any, width: number, locale: Locale, trans: any, fontFamily: string, fontSize: any): string => {
  const height = 120;
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${colors.bgColor}" rx="12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="#${colors.borderColor}" stroke-opacity="0.5" rx="12" />
  
  <text x="20" y="35" fill="#${colors.titleColor}" font-size="${fontSize.title}" font-family="${fontFamily}" font-weight="600">${title}</text>
  <text x="${width/2}" y="70" fill="#${colors.textColor}" font-size="${fontSize.normal}" font-family="${fontFamily}" text-anchor="middle" opacity="0.6">${trans.languages.noData}</text>
</svg>`;
};