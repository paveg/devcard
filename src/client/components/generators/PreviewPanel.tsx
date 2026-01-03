import { ImageIcon, Maximize2 } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { CodeOutput } from './CodeOutput';

interface PreviewPanelProps {
  url: string | null;
  alt: string;
}

type ImageState = 'idle' | 'loading' | 'loaded' | 'error';

/** Image preview component that resets on URL change via key prop */
function ImagePreview({
  url,
  alt,
  onStateChange,
  onClick,
  scaledDown = false,
}: {
  url: string;
  alt: string;
  onStateChange: (state: ImageState) => void;
  onClick?: () => void;
  scaledDown?: boolean;
}) {
  const [state, setState] = useState<ImageState>('loading');

  const handleLoad = () => {
    setState('loaded');
    onStateChange('loaded');
  };

  const handleError = () => {
    setState('error');
    onStateChange('error');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <img
      src={url}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={scaledDown ? 0 : undefined}
      role={scaledDown ? 'button' : undefined}
      className={`transition-opacity duration-300 ${
        state === 'loaded' ? 'opacity-100' : 'hidden opacity-0'
      } ${
        scaledDown
          ? 'w-full max-w-full cursor-pointer object-contain hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          : 'max-w-full'
      }`}
    />
  );
}

export const PreviewPanel = memo(function PreviewPanel({ url, alt }: PreviewPanelProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  // Track both the state and which URL it belongs to
  const [stateForUrl, setStateForUrl] = useState<{ url: string | null; state: ImageState }>({
    url: null,
    state: 'idle',
  });

  // Reset state when URL changes (React's recommended pattern for derived state)
  const imageState = stateForUrl.url === url ? stateForUrl.state : url ? 'loading' : 'idle';

  const handleStateChange = (state: ImageState) => {
    setStateForUrl({ url, state });
  };

  // Determine display state based on URL and image loading state
  const showEmpty = !url;
  const showLoading = url && imageState !== 'loaded' && imageState !== 'error';
  const showError = url && imageState === 'error';
  const showImage = url && imageState === 'loaded';

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">
              {t('generator.preview')}
            </CardTitle>
            {showImage && (
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t('generator.fullscreen')}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-muted/30 p-4 sm:p-6">
            {showEmpty && (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <ImageIcon className="h-10 w-10 opacity-50" />
                <p className="text-center text-sm">{t('generator.previewEmpty')}</p>
              </div>
            )}
            {showLoading && (
              <div className="w-full max-w-md space-y-3">
                <Skeleton className="mx-auto h-6 w-2/3" />
                <Skeleton className="mx-auto h-28 w-full" />
                <div className="flex justify-center gap-6">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            )}
            {showError && (
              <p className="text-center text-sm text-destructive">{t('generator.previewError')}</p>
            )}
            {url && (
              // key={url} resets the ImagePreview component when URL changes
              <ImagePreview
                key={url}
                url={url}
                alt={alt}
                onStateChange={handleStateChange}
                onClick={() => setDialogOpen(true)}
                scaledDown
              />
            )}
          </div>

          {showImage && <CodeOutput url={url} alt={alt} />}
        </CardContent>
      </Card>

      {/* Full-size preview dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-auto sm:max-w-fit">
          <DialogTitle className="sr-only">{t('generator.preview')}</DialogTitle>
          {url && (
            <div className="flex items-center justify-center p-2">
              <img src={url} alt={alt} className="max-h-[80vh] max-w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
