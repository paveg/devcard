import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette,
  Globe,
  Zap,
  Code2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Palette,
    title: 'Beautiful Themes',
    description:
      'Choose from multiple themes or customize colors to match your README aesthetic.',
  },
  {
    icon: Globe,
    title: 'i18n Support',
    description:
      'Display your stats in English or Japanese. More languages coming soon.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Powered by Cloudflare Workers with intelligent caching for instant loading.',
  },
  {
    icon: Code2,
    title: 'Multiple Card Types',
    description:
      'Stats card, language breakdown, and repository pins - all in one service.',
  },
  {
    icon: Sparkles,
    title: 'Minimal Design',
    description: 'Clean, modern SVG cards that look great in any README.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    description: 'No tracking, no cookies. Just beautiful stats for your profile.',
  },
];

export function Home() {
  const [username, setUsername] = useState('paveg');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setPreviewUrl(`/api?username=${username.trim()}`);
  };

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          Beautiful GitHub Stats for Your README
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Minimal, modern, and customizable GitHub statistics cards. Showcase
          your contributions with style.
        </p>

        {/* Demo Form */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <form onSubmit={handleGenerate} className="mb-6 flex gap-2">
              <Input
                type="text"
                placeholder="GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Generate</Button>
            </form>

            <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-muted/50 p-4">
              {!previewUrl && (
                <p className="text-sm text-muted-foreground">
                  Enter a GitHub username to preview
                </p>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="GitHub Stats Preview"
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                  className={loading ? 'opacity-50' : ''}
                />
              )}
            </div>

            {previewUrl && (
              <div className="mt-4 flex justify-center gap-2">
                <Button asChild variant="outline">
                  <Link to="/stats">Customize Stats</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/languages">Top Languages</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pin">Repo Pin</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-center text-3xl font-bold">Features</h2>
        <p className="mb-8 text-center text-muted-foreground">
          Everything you need to showcase your GitHub profile
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <feature.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
