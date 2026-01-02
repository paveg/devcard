import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeOutput } from './CodeOutput';

interface PreviewPanelProps {
  url: string | null;
  alt: string;
}

export function PreviewPanel({ url, alt }: PreviewPanelProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (url) {
      setLoading(true);
      setError(false);
      setImageLoaded(false);
    }
  }, [url]);

  const handleImageLoad = () => {
    setLoading(false);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('generator.preview')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-muted/50 p-4">
          {!url && (
            <p className="text-sm text-muted-foreground">
              {t('generator.previewEmpty')}
            </p>
          )}
          {url && loading && (
            <p className="text-sm text-muted-foreground">{t('generator.previewLoading')}</p>
          )}
          {url && error && (
            <p className="text-sm text-destructive">
              {t('generator.previewError')}
            </p>
          )}
          {url && (
            <img
              src={url}
              alt={alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={imageLoaded ? 'max-w-full' : 'hidden'}
            />
          )}
        </div>

        {url && imageLoaded && (
          <CodeOutput url={url} alt={alt} />
        )}
      </CardContent>
    </Card>
  );
}
