import { createContext, type ReactNode, useContext, useState } from 'react';

export type Locale = 'en' | 'ja';

const translations = {
  en: {
    // Header
    'nav.stats': 'Stats',
    'nav.languages': 'Languages',
    'nav.pin': 'Pin',

    // Home
    'home.title': 'Beautiful GitHub Stats for Your README',
    'home.subtitle':
      'Minimal, modern, and customizable GitHub statistics cards. Showcase your contributions with style.',
    'home.placeholder': 'GitHub username',
    'home.generate': 'Generate',
    'home.preview.empty': 'Enter a GitHub username to preview',
    'home.preview.loading': 'Loading...',
    'home.preview.error': 'Failed to load stats. Check username or try again.',
    'home.customize.stats': 'Customize Stats',
    'home.customize.languages': 'Top Languages',
    'home.customize.pin': 'Repo Pin',

    // Features
    'features.title': 'Features',
    'features.subtitle': 'Everything you need to showcase your GitHub profile',
    'features.themes.title': 'Beautiful Themes',
    'features.themes.desc':
      'Choose from multiple themes or customize colors to match your README aesthetic.',
    'features.i18n.title': 'i18n Support',
    'features.i18n.desc': 'Display your stats in English or Japanese. More languages coming soon.',
    'features.fast.title': 'Lightning Fast',
    'features.fast.desc':
      'Powered by Cloudflare Workers with intelligent caching for instant loading.',
    'features.cards.title': 'Multiple Card Types',
    'features.cards.desc':
      'Stats card, language breakdown, and repository pins - all in one service.',
    'features.design.title': 'Minimal Design',
    'features.design.desc': 'Clean, modern SVG cards that look great in any README.',
    'features.privacy.title': 'Privacy First',
    'features.privacy.desc': 'No tracking, no cookies. Just beautiful stats for your profile.',

    // Generator common
    'generator.username': 'GitHub Username',
    'generator.username.required': 'GitHub Username *',
    'generator.repo': 'Repository Name',
    'generator.repo.required': 'Repository Name *',
    'generator.theme': 'Theme',
    'generator.locale': 'Card Language',
    'generator.options': 'Options',
    'generator.advanced': 'Advanced Options',
    'generator.generate': 'Generate Card',
    'generator.preview': 'Preview',
    'generator.preview.empty': 'Enter details to generate preview',
    'generator.preview.loading': 'Loading...',
    'generator.preview.error': 'Failed to load. Check the username.',

    // Stats page
    'stats.title': 'Stats Card Generator',
    'stats.subtitle': 'Display your GitHub profile statistics with a beautiful card.',
    'stats.showIcons': 'Show Icons',
    'stats.hideRank': 'Hide Rank',
    'stats.hideBorder': 'Hide Border',
    'stats.hideTitle': 'Hide Title',
    'stats.allCommits': 'All Commits',
    'stats.noAnimation': 'No Animation',
    'stats.customTitle': 'Custom Title',
    'stats.hide': 'Hide Stats',
    'stats.hide.hint': 'Comma-separated: stars, commits, prs, issues, contribs',
    'stats.show': 'Show Stats',
    'stats.show.hint': 'Comma-separated: reviews, prs_merged, prs_merged_percentage',

    // Languages page
    'languages.title': 'Top Languages Generator',
    'languages.subtitle':
      'Display the programming languages you use most across your repositories.',
    'languages.layout': 'Layout',
    'languages.langsCount': 'Languages Count',
    'languages.hideBorder': 'Hide Border',
    'languages.hideTitle': 'Hide Title',
    'languages.hideProgress': 'Hide Progress',
    'languages.noAnimation': 'No Animation',
    'languages.customTitle': 'Custom Title',
    'languages.hide': 'Hide Languages',
    'languages.hide.hint': 'Comma-separated language names to exclude',
    'languages.excludeRepo': 'Exclude Repositories',
    'languages.excludeRepo.hint': 'Comma-separated repository names to exclude',

    // Pin page
    'pin.title': 'Repository Pin Generator',
    'pin.subtitle': 'Highlight your best repositories with beautiful pin cards.',
    'pin.showOwner': 'Show Owner',
    'pin.hideBorder': 'Hide Border',
    'pin.noAnimation': 'No Animation',
    'pin.descriptionLines': 'Description Lines',
    'pin.descriptionLines.hint': 'Number of lines for description (1-5)',

    // Code output
    'code.markdown': 'Markdown',
    'code.html': 'HTML',
    'code.url': 'URL',
    'code.copy': 'Copy',
    'code.copied': 'Copied',

    // Footer
    'footer.madeWith': 'Made with',
    'footer.by': 'by',
  },
  ja: {
    // Header
    'nav.stats': '統計',
    'nav.languages': '言語',
    'nav.pin': 'ピン',

    // Home
    'home.title': 'README用の美しいGitHub統計',
    'home.subtitle':
      'ミニマル、モダン、カスタマイズ可能なGitHub統計カード。あなたの貢献をスタイリッシュに紹介。',
    'home.placeholder': 'GitHubユーザー名',
    'home.generate': '生成',
    'home.preview.empty': 'プレビューするにはGitHubユーザー名を入力',
    'home.preview.loading': '読み込み中...',
    'home.preview.error': '読み込みに失敗しました。ユーザー名を確認してください。',
    'home.customize.stats': '統計をカスタマイズ',
    'home.customize.languages': 'トップ言語',
    'home.customize.pin': 'リポジトリピン',

    // Features
    'features.title': '機能',
    'features.subtitle': 'GitHubプロフィールを彩るすべてが揃っています',
    'features.themes.title': '美しいテーマ',
    'features.themes.desc': '多数のテーマから選択するか、READMEに合わせて色をカスタマイズ。',
    'features.i18n.title': '多言語対応',
    'features.i18n.desc': '統計を日本語または英語で表示。今後も言語追加予定。',
    'features.fast.title': '超高速',
    'features.fast.desc': 'Cloudflare Workersとインテリジェントキャッシュによる瞬時の読み込み。',
    'features.cards.title': '複数のカードタイプ',
    'features.cards.desc': '統計カード、言語分布、リポジトリピン、すべて1つのサービスで。',
    'features.design.title': 'ミニマルデザイン',
    'features.design.desc': 'どんなREADMEにも映える、クリーンでモダンなSVGカード。',
    'features.privacy.title': 'プライバシー重視',
    'features.privacy.desc': 'トラッキングなし、クッキーなし。美しい統計だけ。',

    // Generator common
    'generator.username': 'GitHubユーザー名',
    'generator.username.required': 'GitHubユーザー名 *',
    'generator.repo': 'リポジトリ名',
    'generator.repo.required': 'リポジトリ名 *',
    'generator.theme': 'テーマ',
    'generator.locale': 'カード言語',
    'generator.options': 'オプション',
    'generator.advanced': '詳細オプション',
    'generator.generate': 'カードを生成',
    'generator.preview': 'プレビュー',
    'generator.preview.empty': '詳細を入力してプレビューを生成',
    'generator.preview.loading': '読み込み中...',
    'generator.preview.error': '読み込みに失敗しました。ユーザー名を確認してください。',

    // Stats page
    'stats.title': '統計カードジェネレーター',
    'stats.subtitle': 'GitHubプロフィールの統計を美しいカードで表示します。',
    'stats.showIcons': 'アイコンを表示',
    'stats.hideRank': 'ランクを非表示',
    'stats.hideBorder': '枠線を非表示',
    'stats.hideTitle': 'タイトルを非表示',
    'stats.allCommits': 'すべてのコミット',
    'stats.noAnimation': 'アニメーションなし',
    'stats.customTitle': 'カスタムタイトル',
    'stats.hide': '統計を非表示',
    'stats.hide.hint': 'カンマ区切り: stars, commits, prs, issues, contribs',
    'stats.show': '統計を表示',
    'stats.show.hint': 'カンマ区切り: reviews, prs_merged, prs_merged_percentage',

    // Languages page
    'languages.title': 'トップ言語ジェネレーター',
    'languages.subtitle': 'リポジトリで最も使用しているプログラミング言語を表示します。',
    'languages.layout': 'レイアウト',
    'languages.langsCount': '言語数',
    'languages.hideBorder': '枠線を非表示',
    'languages.hideTitle': 'タイトルを非表示',
    'languages.hideProgress': 'プログレスを非表示',
    'languages.noAnimation': 'アニメーションなし',
    'languages.customTitle': 'カスタムタイトル',
    'languages.hide': '言語を除外',
    'languages.hide.hint': '除外する言語名をカンマ区切りで',
    'languages.excludeRepo': 'リポジトリを除外',
    'languages.excludeRepo.hint': '除外するリポジトリ名をカンマ区切りで',

    // Pin page
    'pin.title': 'リポジトリピンジェネレーター',
    'pin.subtitle': '美しいピンカードでベストリポジトリをハイライト。',
    'pin.showOwner': 'オーナーを表示',
    'pin.hideBorder': '枠線を非表示',
    'pin.noAnimation': 'アニメーションなし',
    'pin.descriptionLines': '説明行数',
    'pin.descriptionLines.hint': '説明の行数（1-5）',

    // Code output
    'code.markdown': 'Markdown',
    'code.html': 'HTML',
    'code.url': 'URL',
    'code.copy': 'コピー',
    'code.copied': 'コピー済み',

    // Footer
    'footer.madeWith': 'Made with',
    'footer.by': 'by',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devcard-locale');
      if (saved === 'ja' || saved === 'en') return saved;
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'ja' ? 'ja' : 'en';
    }
    return 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('devcard-locale', newLocale);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
