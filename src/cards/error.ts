import { escapeXml } from '../utils';

// Returns a valid SVG so image proxies (e.g. GitHub camo) render
// something instead of rejecting the response.
export const createErrorCard = (message: string, title = 'Something went wrong'): string => {
  const safeTitle = escapeXml(title);
  const safeMessage = escapeXml(message.slice(0, 200));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="120" viewBox="0 0 495 120" fill="none" role="img" aria-labelledby="descId">
  <title id="titleId">${safeTitle}</title>
  <desc id="descId">${safeMessage}</desc>
  <rect x="0.5" y="0.5" rx="4.5" width="494" height="119" stroke="#e4e2e2" fill="#fffefe" stroke-opacity="1"/>
  <g transform="translate(25, 35)">
    <text x="0" y="0" font-family="'Segoe UI', Ubuntu, Sans-Serif" font-weight="600" fill="#d73a49" font-size="18">${safeTitle}</text>
    <text x="0" y="28" font-family="'Segoe UI', Ubuntu, Sans-Serif" fill="#586069" font-size="12">${safeMessage}</text>
  </g>
</svg>`;
};
