import type { Locale } from './locale';

// Font stacks based on locale
export const getFontFamily = (locale: Locale = 'en'): string => {
  if (locale === 'ja') {
    // Japanese font stack similar to GitHub's
    return 'Hiragino Kaku Gothic Pro, Yu Gothic UI, Meiryo UI, Meiryo, Noto Sans JP, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif';
  }

  // Default font stack for English and other languages
  return '-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif';
};

// Get font size adjustments based on locale
export const getFontSizes = (locale: Locale = 'en') => {
  if (locale === 'ja') {
    return {
      title: 16,
      label: 13,
      value: 15,
      small: 11,
      normal: 13,
    };
  }

  return {
    title: 18,
    label: 14,
    value: 16,
    small: 12,
    normal: 14,
  };
};
