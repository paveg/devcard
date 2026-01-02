import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface CodeOutputProps {
  url: string;
  alt: string;
}

export function CodeOutput({ url, alt }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('markdown');

  const getCode = (format: string) => {
    switch (format) {
      case 'markdown':
        return `![${alt}](${url})`;
      case 'html':
        return `<img src="${url}" alt="${alt}" />`;
      case 'url':
        return url;
      default:
        return url;
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
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
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
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
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
