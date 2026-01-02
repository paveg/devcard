// Localization utilities

export type Locale = 'en' | 'ja';

// Translation keys
export const translations = {
  en: {
    // Stats card
    stats: {
      title: (name: string) => `${name}'s GitHub Stats`,
      totalStars: 'Total Stars',
      totalCommits: 'Total Commits',
      totalPRs: 'Total PRs',
      totalIssues: 'Total Issues',
      contributedTo: 'Contributed to',
      codeReviews: 'Code Reviews',
      githubRank: 'GitHub Rank',
      top: 'Top',
    },
    // Languages card
    languages: {
      title: 'Most Used Languages',
      noData: 'No language data available',
    },
    // Repository card
    repo: {
      noDescription: 'No description provided',
      archived: 'Archived',
    },
  },
  ja: {
    // Stats card
    stats: {
      title: (name: string) => `${name}のGitHub統計`,
      totalStars: '獲得スター数',
      totalCommits: '総コミット数',
      totalPRs: 'プルリクエスト数',
      totalIssues: 'イシュー数',
      contributedTo: 'コントリビュート数',
      codeReviews: 'コードレビュー数',
      githubRank: 'GitHubランク',
      top: '上位',
    },
    // Languages card
    languages: {
      title: '最も使用されている言語',
      noData: '言語データがありません',
    },
    // Repository card
    repo: {
      noDescription: '説明はありません',
      archived: 'アーカイブ済み',
    },
  },
};

export const t = (locale: Locale = 'en') => translations[locale] || translations.en;

// Format numbers with locale
export const formatNumberLocale = (num: number, locale: Locale = 'en'): string => {
  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(1).replace(/\.0+$/, '');
    return locale === 'ja' ? `${formatted}百万` : `${formatted}M`;
  }
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1).replace(/\.0+$/, '');
    return locale === 'ja' ? `${formatted}千` : `${formatted}k`;
  }
  return num.toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US');
};