# Lighthouse CI Configuration

## Disabled Assertions

| Assertion | Reason |
|-----------|--------|
| `uses-text-compression` | Cloudflare handles compression at edge |
| `unused-css-rules` | Google Fonts CSS includes styles for all unicode ranges (especially Noto Sans JP) |
| `unused-javascript` | Code splitting causes "unused" JS on initial page load, but chunks are used on other routes |
| `render-blocking-resources` | Returns NaN in SPA configuration |

## Thresholds

- **LCP**: < 2.5s (error)
- **CLS**: < 0.1 (error)
- **FCP**: < 2s (warn)
- **TBT**: < 300ms (warn)
- **Category scores**: ≥ 90% (accessibility is error, others are warn)
