# DevCard SEO & Semantic HTML Implementation Guide

## Overview
このドキュメントは、DevCardプロジェクトのSEO対策とセマンティックHTML改善のガイドを提供します。

---

## 1. 実装済みのSEO対策

### 1.1 Open Graph Meta Tags
**ファイル**: `src/client/index.html`

以下のOpen Graphメタタグが実装されました:
- `og:type`: Website
- `og:title`: ページタイトル
- `og:description`: ページ説明
- `og:image`: SNS共有時の画像 (1200x630px推奨)
- `og:url`: カノニカルURL
- `og:locale`: 多言語サポート (en_US, ja_JP)

**SNS共有最適化**:
```html
<meta property="og:image" content="https://devcard.example.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### 1.2 Twitter Card Meta Tags
**対応形式**: `summary_large_image`

- `twitter:card`: Large image card type
- `twitter:title`: Tweet表示用タイトル
- `twitter:description`: Tweet説示説明
- `twitter:image`: 表示画像
- `twitter:creator`: クリエータータグ

### 1.3 Schema.org 構造化データ

3種類のSchema.orgマークアップが実装されました:

#### A) WebApplication Schema
アプリケーション全体の構造を定義
```json
{
  "@type": "WebApplication",
  "name": "DevCard",
  "applicationCategory": "DeveloperApplication",
  "aggregateRating": {...}
}
```

#### B) SoftwareApplication Schema
ソフトウェアの詳細情報
```json
{
  "@type": "SoftwareApplication",
  "operatingSystem": "Web",
  "downloadUrl": "https://github.com/paveg/devcard"
}
```

#### C) Organization Schema
組織情報とソーシャルリンク
```json
{
  "@type": "Organization",
  "name": "DevCard",
  "sameAs": ["https://github.com/paveg/devcard"]
}
```

### 1.4 追加的なSEOメタタグ
- `robots`: インデックス設定 (index, follow)
- `canonical`: 正規URL指定
- `theme-color`: ブラウザテーマカラー
- `keywords`: キーワード指定
- `language`: サポート言語指定

### 1.5 作成されたファイル

#### `public/robots.txt`
検索エンジンのクローリング指示:
- ユーザーエージェント別のアクセス制御
- Crawl-delayの指定 (Googlebot: 0.5, その他: 1)
- アグレッシブなクローラーのブロック
- Sitemapの指定

#### `public/sitemap.xml`
サイトマップ:
- すべてのページのURL
- 最終更新日時
- 更新頻度
- 優先度
- 画像メタデータ

---

## 2. セマンティックHTML改善提案

### 2.1 現状の課題

DevCardの現在のHTMLは、React SPAの典型的な構造になっていますが、以下の改善が可能です:

### 2.2 推奨される改善事項

#### A) Layout コンポーネントの改善
**現状**: 汎用的な`<Layout />`コンポーネント

**改善提案**: セマンティックタグを活用

```tsx
// src/client/components/layout/Layout.tsx の例

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 py-4">
          {/* ナビゲーションリスト */}
          <ul role="navigation">
            <li><a href="/">Home</a></li>
            <li><a href="/stats">Stats</a></li>
            <li><a href="/languages">Languages</a></li>
            <li><a href="/pin">Pin</a></li>
          </ul>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <p>&copy; 2026 DevCard. Open source on GitHub.</p>
        </div>
      </footer>
    </div>
  );
}
```

**セマンティックタグの活用**:
- `<header>`: ページヘッダー
- `<nav>`: ナビゲーション
- `<main>`: メインコンテンツ領域
- `<footer>`: ページフッター
- `<article>`: 独立したコンテンツ
- `<section>`: 関連するコンテンツのセクション

#### B) ホームページ (Home) の改善

```tsx
export function Home() {
  return (
    <>
      <section aria-labelledby="hero-title" className="py-16 text-center">
        <h1 id="hero-title" className="text-4xl font-bold mb-4">
          GitHub Stats Cards Made Easy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Create beautiful, customizable GitHub statistics cards for your profile README
        </p>
        <button className="primary-button">
          Get Started
        </button>
      </section>

      <section aria-labelledby="features-title" className="py-16">
        <h2 id="features-title" className="text-3xl font-bold mb-12">
          Powerful Features
        </h2>
        <article className="feature-card">
          <h3>GitHub Stats</h3>
          <p>Display your GitHub statistics with customizable styles</p>
        </article>
        {/* More feature articles */}
      </section>
    </>
  );
}
```

**改善ポイント**:
- `aria-labelledby`: アクセシビリティのセクション命名
- `<section>`: セクション分割
- `<article>`: 機能説明の独立した記事化
- 見出し階層の適切な使用 (h1 -> h2 -> h3)

#### C) フォーム要素の改善 (StatsGenerator など)

```tsx
export function StatsGenerator() {
  return (
    <form onSubmit={handleSubmit} method="GET" action="/api/stats">
      <fieldset>
        <legend className="text-lg font-bold mb-4">
          GitHub Username
        </legend>

        <div className="form-group">
          <label htmlFor="username">GitHub Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="e.g., paveg"
            required
            aria-required="true"
            aria-describedby="username-hint"
          />
          <span id="username-hint" className="hint">
            Enter your GitHub username to generate stats
          </span>
        </div>

        <fieldset>
          <legend>Options</legend>
          <label>
            <input type="checkbox" name="hide_title" />
            Hide title
          </label>
          {/* More options */}
        </fieldset>

        <button type="submit">Generate Card</button>
        <button type="reset">Reset</button>
      </fieldset>
    </form>
  );
}
```

**改善ポイント**:
- `<form>`: フォームの明示的定義
- `<fieldset>`: 関連フォーム要素のグループ化
- `<legend>`: フィールドセットのラベル
- `htmlFor`: labelとinputの結合
- `aria-required`: 必須フィールドの明示
- `aria-describedby`: ヘルプテキストの関連付け

#### D) 画像の最適化

```tsx
// 画像コンポーネント
<figure>
  <img
    src="/stats-preview.png"
    alt="Example GitHub stats card showing user contributions"
    width="600"
    height="300"
    loading="lazy"
    decoding="async"
  />
  <figcaption>
    GitHub stats card with customizable theme and layout options
  </figcaption>
</figure>
```

**改善ポイント**:
- `<figure>`: 画像のコンテナ
- `<figcaption>`: 画像の説明
- `alt`: 代替テキスト (SEO重要)
- `loading="lazy"`: 遅延読み込み
- `width/height`: 画像寸法指定 (レイアウトシフト防止)

#### E) カード出力結果の改善

```tsx
<article className="stats-card" role="region" aria-label="Generated GitHub stats card">
  <header>
    <h2>Generated Card</h2>
  </header>

  <div className="card-preview">
    <img
      src={generatedImageUrl}
      alt="Generated GitHub stats card for user"
      title="Click to copy embed code"
    />
  </div>

  <aside role="complementary" aria-label="Card customization options">
    {/* カスタマイズオプション */}
  </aside>

  <footer className="card-actions">
    <button>Copy Markdown</button>
    <button>Copy HTML</button>
    <button>Download Image</button>
  </footer>
</article>
```

**改善ポイント**:
- `<article>`: 独立したカード要素
- `role="region"`: リージョンの定義
- `role="complementary"`: 補助コンテンツ
- `<aside>`: サイドバーコンテンツ

#### F) リスト構造の改善

```tsx
// 言語統計の表示
<section aria-labelledby="languages-title">
  <h2 id="languages-title">Programming Languages</h2>

  <ul className="languages-list">
    <li>
      <span className="language-name">TypeScript</span>
      <meter
        value="75"
        min="0"
        max="100"
        title="75% TypeScript code"
        aria-label="TypeScript: 75%"
      />
    </li>
    {/* More languages */}
  </ul>
</section>
```

**改善ポイント**:
- `<ul>`: リスト構造の明示
- `<meter>`: 進捗メータ要素
- `aria-label`: スクリーンリーダー対応

### 2.3 アクセシビリティ属性の追加

#### キーボードナビゲーション
```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  tabIndex={0}
  role="button"
>
  Interactive Button
</button>
```

#### スクリーンリーダー対応
```tsx
<div aria-busy="true" aria-live="polite" aria-label="Loading stats...">
  <Spinner />
</div>
```

### 2.4 見出しの階層構造

**現在の構造**:
```
index.html
  title: "DevCard - GitHub Readme Stats"

Home page:
  h1: "DevCard" (なし・改善必要)

StatsGenerator page:
  h1: "GitHub Stats Generator"
  h2: "Options"
  h3: "Color Scheme" (例)
```

**改善提案**:
```
h1: 各ページのメインタイトル (1つだけ)
  h2: セクションタイトル
    h3: サブセクションタイトル
```

---

## 3. 実装チェックリスト

### 必須項目 (実装済み)
- [x] Open Graph メタタグ
- [x] Twitter Card メタタグ
- [x] Schema.org 構造化データ
- [x] robots.txt
- [x] sitemap.xml

### 推奨項目 (実装予定)
- [ ] Semantic HTML tags (header, nav, main, footer, section, article)
- [ ] Form accessibility improvements
- [ ] Image alt text audit
- [ ] Heading hierarchy review
- [ ] ARIA labels and descriptions
- [ ] Keyboard navigation support
- [ ] Focus management

### レポート・分析
- [ ] Google Search Console登録
- [ ] Bing Webmaster Tools登録
- [ ] Core Web Vitals の測定
- [ ] PageSpeed Insights での分析

---

## 4. CDN & キャッシング戦略

### Cloudflare Workers での設定例

```typescript
// src/worker/index.ts

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // robots.txtのキャッシング
    if (url.pathname === '/robots.txt') {
      const response = await env.ASSETS.fetch(request);
      response.headers.set('Cache-Control', 'public, max-age=86400');
      return response;
    }

    // sitemap.xmlのキャッシング
    if (url.pathname === '/sitemap.xml') {
      const response = await env.ASSETS.fetch(request);
      response.headers.set('Cache-Control', 'public, max-age=604800');
      return response;
    }

    // HTMLページのキャッシング設定
    if (url.pathname === '/' || url.pathname.endsWith('.html')) {
      const response = await env.ASSETS.fetch(request);
      response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
      return response;
    }

    return env.ASSETS.fetch(request);
  },
};
```

---

## 5. OG画像生成戦略

DevCardはSPA（シングルページアプリケーション）のため、動的OG画像生成が推奨されます:

### A) 静的OG画像
```
/public/og-image.png (1200x630px)
  - DevCard ロゴ
  - メインメッセージ
  - ブランドカラー
```

### B) 動的OG画像 (Cloudflare Workers)

```typescript
// src/worker/og-image.ts

export async function generateOGImage(
  username?: string,
  type: 'home' | 'stats' | 'languages' | 'pin' = 'home'
): Promise<Response> {
  // キャンバスライブラリ (Satori など) で動的OG画像生成
  // username が指定されている場合、ユーザー名をOG画像に含める

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#1a1a1a"/>
      <text x="600" y="300" font-size="72" font-weight="bold" text-anchor="middle" fill="white">
        DevCard
      </text>
      <text x="600" y="380" font-size="32" text-anchor="middle" fill="#888">
        ${type === 'stats' ? 'GitHub Stats Generator' : 'Generate Your GitHub Card'}
      </text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
```

---

## 6. 多言語SEO対策

現在、DevCardは英語と日本語をサポートしています。

### hreflang実装例

```html
<!-- index.htmlに追加 -->
<link rel="alternate" hreflang="en" href="https://devcard.example.com/" />
<link rel="alternate" hreflang="ja" href="https://devcard.example.com/?lang=ja" />
<link rel="alternate" hreflang="x-default" href="https://devcard.example.com/" />
```

### URLベースの言語切り替え戦略

```
https://devcard.example.com/          (English)
https://devcard.example.com/?lang=ja  (Japanese)

または

https://en.devcard.example.com/       (English)
https://ja.devcard.example.com/       (Japanese)
```

---

## 7. パフォーマンス最適化

### Core Web Vitals対策

#### LCP (Largest Contentful Paint)
- 画像の最適化 (WebP形式)
- 重要なCSS/JSの優先度付け
- フォントの遅延読み込み

#### FID (First Input Delay)
- メインスレッドの作業削減
- インタラクティブ性能の改善

#### CLS (Cumulative Layout Shift)
- 画像の寸法指定
- フォント読み込み戦略

### Viteビルド設定の最適化

```typescript
// vite.config.ts

export default defineConfig({
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
});
```

---

## 8. 検証ツール

### SEO検証

1. **Google Search Console**
   - robots.txt検証
   - sitemap.xml登録
   - インデックス状況確認

2. **Google PageSpeed Insights**
   - Core Web Vitals測定
   - パフォーマンス最適化提案

3. **Lighthouse**
   - SEO スコア確認
   - アクセシビリティ検査

4. **schema.org検証**
   ```
   https://validator.schema.org/
   ```

5. **OG画像確認**
   ```
   https://www.opengraphchecker.com/
   ```

6. **Twitter Card確認**
   ```
   https://cards-dev.twitter.com/validator
   ```

---

## 9. 今後のロードマップ

### Phase 1 (実装済み)
- Open Graph メタタグ
- Twitter Card メタタグ
- Schema.org 構造化データ
- robots.txt
- sitemap.xml

### Phase 2 (推奨)
- セマンティックHTML改善
- フォームアクセシビリティ
- 画像の最適化
- Core Web Vitals最適化

### Phase 3 (オプション)
- 動的OG画像生成
- hreflang実装
- 国際化SEO対策
- ブログセクション (技術情報共有)

---

## まとめ

DevCardのSEO対策により、以下が実現しました:

1. **検索エンジン最適化**: 正確なインデックス登録
2. **SNS共有最適化**: 魅力的なプレビュー表示
3. **構造化データ**: 検索結果での拡張表示
4. **アクセシビリティ**: すべてのユーザーへの対応

これらの改善により、DevCardの可視性とユーザー体験が大幅に向上します。

---

**参考リンク**:
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter for Developers](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org Documentation](https://schema.org/)
- [W3C Semantic HTML](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
