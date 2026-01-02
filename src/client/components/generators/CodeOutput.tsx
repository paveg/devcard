import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface CodeOutputProps {
  url: string;
  alt: string;
}

const PRODUCTION_BASE_URL = 'https://devcard.pavegy.workers.dev';

export function CodeOutput({ url, alt }: CodeOutputProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('markdown');

  // Convert relative URL to absolute production URL for code output
  const getFullUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `${PRODUCTION_BASE_URL}${relativeUrl}`;
  };

  const getCode = (format: string) => {
    const fullUrl = getFullUrl(url);
    switch (format) {
      case 'markdown':
        return `![${alt}](${fullUrl})`;
      case 'html':
        return `<img src="${fullUrl}" alt="${alt}" />`;
      case 'url':
        return fullUrl;
      default:
        return fullUrl;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCode(activeTab));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="markdown">{t('code.markdown')}</TabsTrigger>
            <TabsTrigger value="html">{t('code.html')}</TabsTrigger>
            <TabsTrigger value="url">{t('code.url')}</TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                {t('code.copied')}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                {t('code.copy')}
              </>
            )}
          </Button>
        </div>

        <TabsContent value="markdown" className="mt-2">
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-sm">
            <code>{getCode('markdown')}</code>
          </pre>
        </TabsContent>
        <TabsContent value="html" className="mt-2">
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-sm">
            <code>{getCode('html')}</code>
          </pre>
        </TabsContent>
        <TabsContent value="url" className="mt-2">
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-sm">
            <code>{getCode('url')}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
