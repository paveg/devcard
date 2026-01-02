import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { useUsername } from '@/contexts/username';

export function Home() {
  const { t } = useTranslation();
  const { username, setUsername } = useUsername();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const features = [
    {
      icon: Palette,
      title: t('features.themes.title'),
      description: t('features.themes.desc'),
    },
    {
      icon: Globe,
      title: t('features.i18n.title'),
      description: t('features.i18n.desc'),
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.desc'),
    },
    {
      icon: Code2,
      title: t('features.cards.title'),
      description: t('features.cards.desc'),
    },
    {
      icon: Sparkles,
      title: t('features.design.title'),
      description: t('features.design.desc'),
    },
    {
      icon: ShieldCheck,
      title: t('features.privacy.title'),
      description: t('features.privacy.desc'),
    },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(false);
    setImageLoaded(false);
    setPreviewUrl(`/api?username=${username.trim()}`);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {t('home.subtitle')}
        </p>

        {/* Demo Form */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <form onSubmit={handleGenerate} className="mb-6 flex gap-2">
              <Input
                type="text"
                placeholder={t('home.placeholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">{t('home.generate')}</Button>
            </form>

            <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-muted/50 p-4">
              {!previewUrl && (
                <p className="text-sm text-muted-foreground">
                  {t('home.preview.empty')}
                </p>
              )}
              {previewUrl && loading && (
                <p className="text-sm text-muted-foreground">
                  {t('home.preview.loading')}
                </p>
              )}
              {previewUrl && error && (
                <p className="text-sm text-destructive">
                  {t('home.preview.error')}
                </p>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="GitHub Stats Preview"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={imageLoaded ? 'max-w-full' : 'hidden'}
                />
              )}
            </div>

            {previewUrl && imageLoaded && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button asChild variant="outline">
                  <Link to="/stats">{t('home.customize.stats')}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/languages">{t('home.customize.languages')}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pin">{t('home.customize.pin')}</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-5xl">
        <h2 className="mb-2 text-center text-3xl font-bold">
          {t('features.title')}
        </h2>
        <p className="mb-8 text-center text-muted-foreground">
          {t('features.subtitle')}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-transform hover:-translate-y-1"
            >
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
