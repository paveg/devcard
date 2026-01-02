import {
  ArrowRight,
  Code2,
  Globe,
  type LucideIcon,
  Palette,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useUsername } from '@/contexts/username';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = memo(function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
      </CardContent>
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Card>
  );
});

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
    <div className="container py-12 md:py-16 lg:py-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-balance bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          {t('home.title')}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          {t('home.subtitle')}
        </p>

        {/* Demo Form */}
        <Card className="mb-16 border-border/50 bg-card/50 shadow-xl backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleGenerate} className="mb-6 flex gap-3">
              <Input
                type="text"
                placeholder={t('home.placeholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 flex-1 bg-background/50 text-base"
              />
              <Button type="submit" size="lg" className="h-12 gap-2 px-6">
                {t('home.generate')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex min-h-[200px] items-center justify-center rounded-xl bg-muted/30 p-6">
              {!previewUrl && (
                <p className="text-center text-sm text-muted-foreground">
                  {t('home.preview.empty')}
                </p>
              )}
              {previewUrl && loading && (
                <div className="w-full max-w-md space-y-3">
                  <Skeleton className="mx-auto h-6 w-3/4" />
                  <Skeleton className="mx-auto h-24 w-full" />
                  <div className="flex justify-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              )}
              {previewUrl && error && (
                <p className="text-center text-sm text-destructive">{t('home.preview.error')}</p>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="GitHub Stats Preview"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`max-w-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'hidden opacity-0'}`}
                />
              )}
            </div>

            {previewUrl && imageLoaded && (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/stats">
                    {t('home.customize.stats')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/languages">
                    {t('home.customize.languages')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/pin">
                    {t('home.customize.pin')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-balance text-3xl font-bold tracking-tight">
            {t('features.title')}
          </h2>
          <p className="mx-auto max-w-xl text-pretty text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
