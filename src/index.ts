import { Hono } from 'hono';
import { api } from './api';
import type { Env } from './types';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { compressionMiddleware } from './middleware/compression';

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200);
  }
  await next();
});

app.get('/health', (c) => c.json({ status: 'ok' }));

// Apply rate limiting and compression to API routes
app.use('/api/*', rateLimitMiddleware);
app.use('/api/*', compressionMiddleware);

app.route('/api', api);

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Minimal, modern GitHub statistics cards for your profile README.">
  <title>DevCard - GitHub Readme Stats</title>
  <link rel="preconnect" href="https://rsms.me/">
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    :root {
      /* Shadcn/ui Zinc Theme (Dark Mode Default) */
      --background: 240 10% 3.9%;
      --foreground: 0 0% 98%;
      --card: 240 10% 3.9%;
      --card-foreground: 0 0% 98%;
      --popover: 240 10% 3.9%;
      --popover-foreground: 0 0% 98%;
      --primary: 0 0% 98%;
      --primary-foreground: 240 5.9% 10%;
      --secondary: 240 3.7% 15.9%;
      --secondary-foreground: 0 0% 98%;
      --muted: 240 3.7% 15.9%;
      --muted-foreground: 240 5% 64.9%;
      --accent: 240 3.7% 15.9%;
      --accent-foreground: 0 0% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 3.7% 15.9%;
      --input: 240 3.7% 15.9%;
      --ring: 240 4.9% 83.9%;
      
      --radius: 0.5rem;
    }

    /* Reset & Base */
    * { box-sizing: border-box; border-color: hsl(var(--border)); }
    
    body {
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      margin: 0;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      line-height: 1.5;
    }

    /* Layout */
    .container {
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    header {
      margin-bottom: 3rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      border-bottom: 1px solid hsl(var(--border));
      padding-bottom: 2rem;
    }

    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-icon {
      color: hsl(var(--foreground));
    }

    p.subtitle {
      color: hsl(var(--muted-foreground));
      font-size: 1rem;
      margin: 0;
    }

    /* Controls */
    .controls {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(var(--foreground));
    }

    .input-wrapper {
      position: relative;
    }
    
    .input-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: hsl(var(--muted-foreground));
      width: 16px;
      height: 16px;
    }

    input {
      height: 2.5rem;
      padding: 0 0.75rem 0 2.25rem;
      background-color: transparent;
      border: 1px solid hsl(var(--input));
      border-radius: var(--radius);
      color: hsl(var(--foreground));
      font-size: 0.875rem;
      width: 240px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
      outline: none;
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
    }
    
    .hint {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    /* Card Component */
    .card {
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      background-color: hsl(var(--card));
      color: hsl(var(--card-foreground));
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      padding: 1.5rem 1.5rem 0 1.5rem;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1;
      letter-spacing: -0.025em;
      margin: 0 0 0.25rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .card-icon {
      color: hsl(var(--muted-foreground));
    }

    .card-desc {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      margin: 0;
    }

    .card-content {
      padding: 0 1.5rem 1.5rem 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Preview Area */
    .preview-area {
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      background-color: hsl(240 5% 5%); /* Slightly distinct from bg */
      min-height: 160px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      align-items: start;
      justify-items: center;
      padding: 1rem;
      gap: 1rem;
      overflow: hidden;
    }
    
    .preview-area img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    /* Code Block */
    .code-wrapper {
      position: relative;
    }

    .code-block {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.8rem;
      padding: 0.75rem;
      background-color: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
      border-radius: var(--radius);
      overflow-x: auto;
      white-space: pre-wrap; /* Allow wrapping for multiple badges */
      cursor: pointer;
      border: 1px solid transparent;
      transition: border-color 0.2s;
    }

    .code-block:hover {
      border-color: hsl(var(--ring));
    }

    .copy-feedback {
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
      font-size: 0.75rem;
      background-color: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    .code-wrapper.copied .copy-feedback {
      opacity: 1;
    }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px; /* Pill */
      border: 1px solid transparent;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      transition: colors 0.2s;
      background-color: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
      margin: 0.25rem;
      cursor: pointer;
    }

    .badge:hover {
      background-color: hsl(var(--secondary) / 0.8);
    }
    
    .theme-selector {
      margin-top: 3rem;
    }
    
    .theme-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    /* Footer */
    footer {
      margin-top: 4rem;
      border-top: 1px solid hsl(var(--border));
      padding: 2rem 0;
      text-align: center;
      color: hsl(var(--muted-foreground));
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-top">
        <div>
          <h1>
            <i data-lucide="zap" class="logo-icon"></i>
            DevCard
          </h1>
          <p class="subtitle">Beautiful, dynamic GitHub statistics for your README.</p>
        </div>
      </div>
      
      <div class="controls">
        <div class="input-group">
          <label for="username">GitHub Username</label>
          <div class="input-wrapper">
            <i data-lucide="user" class="input-icon"></i>
            <input type="text" id="username" value="octocat" placeholder="octocat">
          </div>
        </div>
        <div class="input-group">
          <label for="repo">Repositories</label>
          <div class="input-wrapper">
            <i data-lucide="folder-git-2" class="input-icon"></i>
            <input type="text" id="repo" value="Hello-World" placeholder="repo1, repo2">
          </div>
          <span class="hint">Comma separated for multiple pins</span>
        </div>
      </div>
    </header>

    <div class="grid">
      <!-- Stats Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="bar-chart-2" class="card-icon"></i> Stats Card</h3>
          <p class="card-desc">Your general profile statistics.</p>
        </div>
        <div class="card-content">
          <div class="preview-area">
            <img id="img-stats" src="" alt="Stats Card Preview" loading="lazy">
          </div>
          <div class="code-wrapper" onclick="copyCode(this)">
            <div class="code-block" id="code-stats"></div>
            <span class="copy-feedback">Copied!</span>
          </div>
        </div>
      </div>

      <!-- Languages Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="code-2" class="card-icon"></i> Top Languages</h3>
          <p class="card-desc">Most used languages across your repos.</p>
        </div>
        <div class="card-content">
          <div class="preview-area">
            <img id="img-langs" src="" alt="Languages Card Preview" loading="lazy">
          </div>
          <div class="code-wrapper" onclick="copyCode(this)">
            <div class="code-block" id="code-langs"></div>
            <span class="copy-feedback">Copied!</span>
          </div>
        </div>
      </div>

      <!-- Repo Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="pin" class="card-icon"></i> Repository Pin</h3>
          <p class="card-desc">Highlight specific projects.</p>
        </div>
        <div class="card-content">
          <div class="preview-area" id="preview-repo-container">
            <!-- Dynamic repo images -->
          </div>
          <div class="code-wrapper" onclick="copyCode(this)">
            <div class="code-block" id="code-repo"></div>
            <span class="copy-feedback">Copied!</span>
          </div>
        </div>
      </div>
    </div>

    <div class="theme-selector">
      <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        <i data-lucide="palette" style="width:18px;height:18px;"></i> Available Themes
      </h3>
      <div class="theme-grid">
        <span class="badge" onclick="setTheme('zinc')">zinc</span>
        <span class="badge" onclick="setTheme('slate')">slate</span>
        <span class="badge" onclick="setTheme('md3_dark')">md3_dark</span>
        <span class="badge" onclick="setTheme('md3_light')">md3_light</span>
        <span class="badge" onclick="setTheme('dracula')">dracula</span>
        <span class="badge" onclick="setTheme('tokyonight')">tokyonight</span>
        <span class="badge" onclick="setTheme('github_dark')">github_dark</span>
        <span class="badge" onclick="setTheme('catppuccin_mocha')">catppuccin_mocha</span>
        <span class="badge" onclick="setTheme('transparent')">transparent</span>
      </div>
    </div>

    <footer>
      <p>Built with Hono & Cloudflare Workers.</p>
    </footer>
  </div>

  <script>
    lucide.createIcons();

    const usernameInput = document.getElementById('username');
    const repoInput = document.getElementById('repo');
    
    // Default config
    const BASE_URL = window.location.origin;
    let THEME = 'zinc';
    
    window.setTheme = (theme) => {
      THEME = theme;
      update();
    };
    
    const update = () => {
      const u = usernameInput.value.trim() || 'octocat';
      const rawRepo = repoInput.value.trim() || 'Hello-World';
      
      // Split repos by comma
      const repos = rawRepo.split(',').map(r => r.trim()).filter(Boolean);
      
      // URLs
      const stats = '/api?username=' + u + '&theme=' + THEME + '&hide_rank=true&show_icons=true';
      const langs = '/api/top-langs?username=' + u + '&theme=' + THEME + '&layout=compact';
      
      // Update DOM for single cards
      document.getElementById('img-stats').src = stats;
      document.getElementById('img-langs').src = langs;
      
      document.getElementById('code-stats').textContent = '![Stats](' + BASE_URL + stats + ')';
      document.getElementById('code-langs').textContent = '![Languages](' + BASE_URL + langs + ')';
      
      // Update DOM for Repo Pin (handle multiple)
      const repoContainer = document.getElementById('preview-repo-container');
      repoContainer.innerHTML = ''; // Clear previous
      
      let repoCode = '';
      
      repos.forEach(r => {
        const repoUrl = '/api/pin?username=' + u + '&repo=' + r + '&theme=' + THEME;
        
        // Create IMG
        const img = document.createElement('img');
        img.src = repoUrl;
        img.alt = r;
        img.loading = 'lazy';
        
        repoContainer.appendChild(img);
        
        // Append Markdown
        repoCode += '![Repo: ' + r + '](' + BASE_URL + repoUrl + ')\\n';
      });
      
      document.getElementById('code-repo').textContent = repoCode.trim();
    };

    // Debounce
    let timer;
    const debounceUpdate = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 500);
    };

    usernameInput.addEventListener('input', debounceUpdate);
    repoInput.addEventListener('input', debounceUpdate);
    
    // Copy interaction
    window.copyCode = (wrapper) => {
      const code = wrapper.querySelector('.code-block').textContent;
      navigator.clipboard.writeText(code);
      
      wrapper.classList.add('copied');
      setTimeout(() => wrapper.classList.remove('copied'), 2000);
    };

    // Init
    update();
  </script>
</body>
</html>
  `);
});

export default app;
