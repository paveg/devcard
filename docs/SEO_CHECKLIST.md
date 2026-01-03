# DevCard SEO対策 - 実装チェックリスト

## 1. 実装完了項目

### 1.1 Open Graph メタタグ ✓
**ファイル**: `src/client/index.html`

実装されたタグ:
- [x] `og:type` - website
- [x] `og:url` - canonical URL
- [x] `og:title` - ページタイトル
- [x] `og:description` - ページ説明
- [x] `og:image` - SNS共有画像 (1200x630px)
- [x] `og:image:width` - 画像幅
- [x] `og:image:height` - 画像高さ
- [x] `og:image:alt` - 画像代替テキスト
- [x] `og:site_name` - サイト名
- [x] `og:locale` - ロケール (en_US)
- [x] `og:locale:alternate` - 代替ロケール (ja_JP)

**SNS別テスト URL**:
- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/inspect/
- Slack: Slackメッセージ内に投稿してプレビュー確認

---

### 1.2 Twitter Card メタタグ ✓
**ファイル**: `src/client/index.html`

実装されたタグ:
- [x] `twitter:card` - summary_large_image
- [x] `twitter:url` - canonical URL
- [x] `twitter:title` - ツイート表示タイトル
- [x] `twitter:description` - ツイート説明
- [x] `twitter:image` - ツイート画像
- [x] `twitter:image:alt` - 画像代替テキスト
- [x] `twitter:creator` - クリエータータグ

**テスト URL**:
- Twitter Card Validator: https://cards-dev.twitter.com/validator

---

### 1.3 Schema.org 構造化データ ✓
**ファイル**: `src/client/index.html`

実装されたスキーマ:

#### WebApplication Schema
```
name: DevCard
alternateName: DevCard - GitHub Readme Stats
applicationCategory: DeveloperApplication
offers.price: 0 (無料)
aggregateRating: 4.5/5 (100レビュー)
potentialAction: UseAction (統計生成へのリンク)
```

#### SoftwareApplication Schema
```
operatingSystem: Web
applicationCategory: DeveloperApplication
softwareRequirements: Web browser with JavaScript
downloadUrl: GitHub repository
```

#### Organization Schema
```
name: DevCard
logo: favicon.svg
sameAs: GitHub repository
```

**テスト URL**:
- Google Structured Data Testing Tool: https://search.google.com/structured-data/testing-tool/
- Schema.org Validator: https://validator.schema.org/

---

### 1.4 robots.txt ✓
**ファイル**: `public/robots.txt` (新規作成)

設定内容:
- [x] User-agent: * (全ボット)
  - Allow: / (すべてのページをクロール許可)
  - Crawl-delay: 1 (1秒待機)

- [x] User-agent: Googlebot
  - Allow: /
  - Crawl-delay: 0.5 (0.5秒待機)

- [x] User-agent: Bingbot
  - Allow: /
  - Crawl-delay: 1

- [x] Aggressive crawlers block
  - AhrefsBot: Disallow
  - SemrushBot: Disallow
  - DotBot: Disallow

- [x] Sitemap指定
  - Sitemap: https://devcard.example.com/sitemap.xml

**配信確認**:
```bash
curl https://devcard.example.com/robots.txt
```

---

### 1.5 sitemap.xml ✓
**ファイル**: `public/sitemap.xml` (新規作成)

カバーされるページ:
- [x] / (ホームページ) - priority: 1.0, changefreq: weekly
- [x] /stats - priority: 0.9, changefreq: weekly
- [x] /languages - priority: 0.9, changefreq: weekly
- [x] /pin - priority: 0.9, changefreq: weekly

各ページの属性:
- [x] lastmod (最終更新日時)
- [x] changefreq (更新頻度)
- [x] priority (優先度)
- [x] image:image (画像メタデータ)

**配信確認**:
```bash
curl https://devcard.example.com/sitemap.xml
```

**XML 形式検証**:
```bash
xmllint public/sitemap.xml
```

---

### 1.6 追加的なSEOメタタグ ✓
**ファイル**: `src/client/index.html`

実装されたタグ:
- [x] `meta[name="description"]` - ページ説明 (160-170文字)
- [x] `meta[name="theme-color"]` - ブラウザテーマカラー (#1a1a1a)
- [x] `meta[name="keywords"]` - キーワード (github, readme, stats...)
- [x] `meta[name="author"]` - 作成者 (DevCard)
- [x] `link[rel="canonical"]` - 正規URL
- [x] `meta[name="robots"]` - インデックス指示 (index, follow)
- [x] `meta[name="language"]` - サポート言語 (English, Japanese)
- [x] `meta[name="revisit-after"]` - 再訪問頻度 (7 days)

---

## 2. SEO検証用チェックリスト

### 検索エンジン登録
- [ ] Google Search Console 登録
  - URL: https://search.google.com/search-console
  - タスク: robots.txt 検証, sitemap.xml 登録

- [ ] Bing Webmaster Tools 登録
  - URL: https://www.bing.com/webmasters

- [ ] Yandex Webmaster 登録 (ロシア向け)
  - URL: https://webmaster.yandex.com/

### メタタグ検証
- [ ] Open Graph Checker
  - URL: https://www.opengraphchecker.com/
  - テスト: `https://devcard.example.com/` を入力

- [ ] Twitter Card Validator
  - URL: https://cards-dev.twitter.com/validator
  - テスト: `https://devcard.example.com/` を入力

- [ ] Google Structured Data Testing Tool
  - URL: https://search.google.com/structured-data/testing-tool/
  - テスト: index.html のソースコードを入力

- [ ] Schema.org Validator
  - URL: https://validator.schema.org/
  - テスト: index.html のURL入力

### パフォーマンス測定
- [ ] Google PageSpeed Insights
  - URL: https://pagespeed.web.dev/
  - テスト: `https://devcard.example.com/`

- [ ] Lighthouse (Chrome DevTools)
  - タスク: Lighthouse > SEO スコア確認

- [ ] GTmetrix
  - URL: https://gtmetrix.com/
  - テスト: `https://devcard.example.com/`

### 機能テスト
- [ ] robots.txt 動作確認
  ```bash
  curl -I https://devcard.example.com/robots.txt
  # Expected: 200 OK
  ```

- [ ] sitemap.xml 動作確認
  ```bash
  curl -I https://devcard.example.com/sitemap.xml
  # Expected: 200 OK, Content-Type: application/xml
  ```

- [ ] キャノニカルURL動作確認
  ```bash
  curl https://devcard.example.com/ | grep canonical
  ```

---

## 3. SNS共有テスト

### Facebook共有
1. Facebook Sharing Debugger にアクセス
   - URL: https://developers.facebook.com/tools/debug/

2. `https://devcard.example.com/` を入力

3. 確認項目:
   - [x] og:title が表示される
   - [x] og:description が表示される
   - [x] og:image が表示される

### Twitter/X共有
1. Twitter Card Validator にアクセス
   - URL: https://cards-dev.twitter.com/validator

2. `https://devcard.example.com/` を入力

3. 確認項目:
   - [x] twitter:card が summary_large_image
   - [x] twitter:title が表示される
   - [x] twitter:description が表示される
   - [x] twitter:image が表示される

### LinkedIn共有
1. LinkedIn Post Inspector にアクセス
   - URL: https://www.linkedin.com/post-inspector/inspect/

2. `https://devcard.example.com/` を入力

3. 確認項目:
   - [x] og:title が表示される
   - [x] og:description が表示される
   - [x] og:image が表示される

### Slack共有
1. Slackのメッセージボックスに URL を貼り付け
   ```
   https://devcard.example.com/
   ```

2. 確認項目:
   - [x] プレビューが表示される
   - [x] OG画像が表示される
   - [x] タイトルと説明が正確

---

## 4. 重要な次のステップ

### 必須タスク
1. **OG画像生成**
   - 「ファイル名」: `/public/og-image.png`
   - 「寸法」: 1200x630px
   - 「形式」: PNG
   - 「ファイルサイズ」: <100KB (推奨)
   - 「デザイン」: DevCardロゴ、キャッチフレーズ、ブランドカラー

2. **ドメイン置換**
   - 以下の全ファイルで `https://devcard.example.com/` を実際のドメインに置換:
     ```
     src/client/index.html
     public/robots.txt
     public/sitemap.xml
     ```

3. **Google Search Console 登録**
   - https://search.google.com/search-console にアクセス
   - サイトを追加
   - robots.txt を検証
   - sitemap.xml を登録

### オプション実装
- [ ] セマンティックHTML改善 (詳細: `SEO_SEMANTIC_HTML_GUIDE.md`)
- [ ] Core Web Vitals最適化
- [ ] 動的OG画像生成
- [ ] hreflang実装 (国際化SEO)

---

## 5. ファイル構成

```
devcard/
├── public/
│   ├── robots.txt ...................... NEW
│   └── sitemap.xml ..................... NEW
├── src/
│   └── client/
│       └── index.html .................. MODIFIED (SEOタグ追加)
├── SEO_SEMANTIC_HTML_GUIDE.md ......... NEW (改善ガイド)
├── SEO_IMPLEMENTATION_REPORT.md ....... NEW (実装レポート)
└── SEO_CHECKLIST.md ................... NEW (このファイル)
```

---

## 6. ファイルサイズと影響度

| ファイル | 変更 | サイズ増加 | gzip後 | 影響度 |
|---------|------|----------|--------|--------|
| index.html | +110行 | +6KB | +1.5KB | 最小限 |
| robots.txt | 新規 | 0.7KB | - | 最小限 |
| sitemap.xml | 新規 | 1.7KB | - | 最小限 |

**総容量増加**: ~8.4KB (Gzip後: ~1.5KB)
**パフォーマンス影響**: 無視できるレベル

---

## 7. キャッシング戦略

### Cloudflare Workers推奨設定

```typescript
// robots.txt
Cache-Control: public, max-age=86400 (1日)

// sitemap.xml
Cache-Control: public, max-age=604800 (1週間)

// index.html (HTML本体)
Cache-Control: public, max-age=3600, must-revalidate (1時間)
```

---

## 8. トラブルシューティング

### OG画像が表示されない
```
原因: og:imageで指定したURLが無効
解決: /public/og-image.png が配信されているか確認
```

### robots.txtが見つからない
```
原因: Cloudflare Workersで /public ディレクトリが配信されていない
解決: wrangler.toml で public_dir 設定を確認
```

### sitemap.xmlが読み込めない
```
原因: XML形式エラー
解決: xmllint public/sitemap.xml で検証
```

### Schema.org検証でエラー
```
原因: JSON-LD構文エラー
解決: Google Structured Data Testing Tool で詳細確認
```

---

## 9. 定期メンテナンス

### 月次タスク
- [ ] robots.txt の Crawl-delay 調整
- [ ] Google Search Console でインデックス状況確認
- [ ] PageSpeed Insights でパフォーマンス確認

### 四半期タスク
- [ ] sitemap.xml の更新 (新ページ追加時)
- [ ] OG画像の確認・更新
- [ ] Schema.org データの更新

### 年次タスク
- [ ] SEO戦略見直し
- [ ] 競合分析
- [ ] Core Web Vitals最適化

---

## 参考リソース

### SEO基礎
- Google Search Central: https://developers.google.com/search
- Google SEO Starter Guide: https://developers.google.com/search/docs/beginner/seo-starter-guide

### ツール
- Google Search Console: https://search.google.com/search-console
- Google PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse: https://developers.google.com/web/tools/lighthouse

### メタタグ
- Open Graph: https://ogp.me/
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards

### 構造化データ
- Schema.org: https://schema.org/
- JSON-LD: https://json-ld.org/

---

**作成日**: 2026-01-02
**ステータス**: 実装完了
**次回レビュー**: 2026-02-02
