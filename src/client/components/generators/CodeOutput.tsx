import { useState, useCallback, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface CodeOutputProps {
  url: string;
  alt: string;
}

const PRODUCTION_BASE_URL = 'https://devcard.pavegy.workers.dev';

export const CodeOutput = memo(function CodeOutput({ url, alt }: CodeOutputProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('markdown');

  // Memoize the full URL calculation
  const fullUrl = useMemo(() => {
    if (url.startsWith('http')) return url;
    return `${PRODUCTION_BASE_URL}${url}`;
  }, [url]);

  // Memoize all code formats
  const codes = useMemo(() => ({
    markdown: `![${alt}](${fullUrl})`,
    html: `<img src="${fullUrl}" alt="${alt}" />`,
    url: fullUrl,
  }), [alt, fullUrl]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(codes[activeTab as keyof typeof codes]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codes, activeTab]);

  return (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between gap-2">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="markdown" className="text-xs">
              {t('code.markdown')}
            </TabsTrigger>
            <TabsTrigger value="html" className="text-xs">
              {t('code.html')}
            </TabsTrigger>
            <TabsTrigger value="url" className="text-xs">
              {t('code.url')}
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                {t('code.copied')}
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                {t('code.copy')}
              </>
            )}
          </Button>
        </div>

        {(['markdown', 'html', 'url'] as const).map((format) => (
          <TabsContent key={format} value={format} className="mt-3">
            <pre className="overflow-x-auto rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
              <code className="font-mono text-foreground/90">
                {codes[format]}
              </code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
});
