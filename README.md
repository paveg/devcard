# DevCard

Minimal, modern GitHub statistics cards for your profile README.

![Stats Card](https://devcard.paveg.workers.dev/api?username=paveg)

## Features

- 🎨 **Minimal Design** - Clean and modern SVG cards
- 🌏 **i18n Support** - English and Japanese localization
- 🎭 **Themes** - Multiple built-in themes
- ⚡ **Fast** - Powered by Cloudflare Workers
- 📊 **Three Card Types** - Stats, Languages, and Repository cards

## Usage

### Stats Card

Show your GitHub statistics:

```markdown
![GitHub Stats](https://devcard.paveg.workers.dev/api?username=YOUR_USERNAME)
```

#### Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `username` | GitHub username | Required |
| `hide` | Hide specific stats (comma-separated: `stars,commits,prs,issues,contribs`) | None |
| `hide_rank` | Hide the rank circle | `false` |
| `show_icons` | Show icons | `false` |
| `theme` | Theme name | `default` |
| `locale` | Language (`en` or `ja`) | `en` |
| `include_all_commits` | Count all commits | `false` |
| `card_width` | Card width in pixels | `450` |

### Top Languages Card

Display your most used programming languages:

```markdown
![Top Languages](https://devcard.paveg.workers.dev/api/top-langs?username=YOUR_USERNAME)
```

#### Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `username` | GitHub username | Required |
| `layout` | Layout type (`normal` or `compact`) | `normal` |
| `langs_count` | Number of languages to show | `8` |
| `exclude_repo` | Exclude specific repos (comma-separated) | None |
| `theme` | Theme name | `default` |
| `locale` | Language (`en` or `ja`) | `en` |
| `card_width` | Card width in pixels | `300` |

### Repository Pin Card

Showcase a specific repository:

```markdown
![Repo Card](https://devcard.paveg.workers.dev/api/pin?username=YOUR_USERNAME&repo=REPO_NAME)
```

#### Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `username` | GitHub username | Required |
| `repo` | Repository name | Required |
| `show_owner` | Show owner name | `false` |
| `theme` | Theme name | `default` |
| `locale` | Language (`en` or `ja`) | `en` |
| `card_width` | Card width in pixels | `400` |

## Themes

Available themes:
- `default` - Light theme
- `dark` - Dark theme
- `radical` - Gradient theme
- `merko` - Green theme
- `gruvbox` - Gruvbox theme
- `tokyonight` - Tokyo Night theme
- `onedark` - One Dark theme
- `cobalt` - Cobalt theme
- `synthwave` - Synthwave theme
- `dracula` - Dracula theme

## Localization

Add `locale=ja` to any card URL for Japanese:

```markdown
![GitHub Stats](https://devcard.paveg.workers.dev/api?username=YOUR_USERNAME&locale=ja)
```

## Development

### Prerequisites

- Node.js 18+
- pnpm
- Cloudflare account
- GitHub personal access token

### Setup

1. Clone the repository:
```bash
git clone https://github.com/paveg/devcard.git
cd devcard
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.dev.vars` file:
```
GITHUB_TOKEN=your_github_token_here
```

4. Start development server:
```bash
pnpm dev
```

### Deployment

Deploy to Cloudflare Workers:

```bash
pnpm deploy
```

## Performance & Cost Optimization

### Caching
- **Cloudflare KV**: API responses are cached to reduce GitHub API calls
  - Stats: 1 hour
  - Languages: 2 hours
  - Repository: 30 minutes
- **Browser caching**: Proper cache headers for CDN and browser caching
- **Error caching**: Failed requests are cached for 5 minutes to prevent API hammering

### Rate Limiting
- **Per IP**: 30 requests/minute, 100 requests/hour
- **Per username**: 50 requests/hour (prevents abuse of specific users)
- Returns 429 status with retry information when exceeded

### Response Optimization
- **Compression**: SVG responses are automatically compressed
- **Minimal design**: Optimized SVG output for smaller file sizes

## API Rate Limits

This service uses the GitHub GraphQL API. Each card request counts against your rate limit:
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour

Consider deploying your own instance for heavy usage.

## License

MIT

## Credits

Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)