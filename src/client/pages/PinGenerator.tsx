import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ThemeSelect } from '@/components/generators/ThemeSelect';
import { LocaleSelect } from '@/components/generators/LocaleSelect';
import { PreviewPanel } from '@/components/generators/PreviewPanel';

interface FormState {
  username: string;
  repo: string;
  theme: string;
  locale: string;
  showOwner: boolean;
  hideBorder: boolean;
  disableAnimations: boolean;
  descriptionLinesCount: string;
}

export function PinGenerator() {
  const [form, setForm] = useState<FormState>({
    username: '',
    repo: '',
    theme: 'default',
    locale: 'en',
    showOwner: false,
    hideBorder: false,
    disableAnimations: false,
    descriptionLinesCount: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const updateForm = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const buildUrl = useCallback(() => {
    if (!form.username.trim() || !form.repo.trim()) return null;

    const params = new URLSearchParams();
    params.set('username', form.username.trim());
    params.set('repo', form.repo.trim());

    if (form.theme && form.theme !== 'default') params.set('theme', form.theme);
    if (form.locale && form.locale !== 'en') params.set('locale', form.locale);
    if (form.showOwner) params.set('show_owner', 'true');
    if (form.hideBorder) params.set('hide_border', 'true');
    if (form.disableAnimations) params.set('disable_animations', 'true');
    if (form.descriptionLinesCount)
      params.set('description_lines_count', form.descriptionLinesCount);

    return `/api/pin?${params.toString()}`;
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewUrl(buildUrl());
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Repository Pin Generator</h1>
        <p className="text-muted-foreground">
          Highlight your best repositories with beautiful pin cards.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Options</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">GitHub Username *</Label>
                <Input
                  id="username"
                  placeholder="octocat"
                  value={form.username}
                  onChange={(e) => updateForm('username', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo">Repository Name *</Label>
                <Input
                  id="repo"
                  placeholder="Hello-World"
                  value={form.repo}
                  onChange={(e) => updateForm('repo', e.target.value)}
                  required
                />
              </div>

              <ThemeSelect
                value={form.theme}
                onValueChange={(v) => updateForm('theme', v)}
              />

              <LocaleSelect
                value={form.locale}
                onValueChange={(v) => updateForm('locale', v)}
              />

              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {[
                    { key: 'showOwner' as const, label: 'Show Owner' },
                    { key: 'hideBorder' as const, label: 'Hide Border' },
                    { key: 'disableAnimations' as const, label: 'No Animation' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={key}
                        checked={form[key]}
                        onCheckedChange={(checked) =>
                          updateForm(key, checked === true)
                        }
                      />
                      <Label htmlFor={key} className="text-sm font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between border-t pt-4"
                    type="button"
                  >
                    Advanced Options
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        advancedOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="descriptionLinesCount">Description Lines</Label>
                    <Input
                      id="descriptionLinesCount"
                      type="number"
                      min="1"
                      max="5"
                      placeholder="2"
                      value={form.descriptionLinesCount}
                      onChange={(e) =>
                        updateForm('descriptionLinesCount', e.target.value)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of lines for description (1-5)
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button type="submit" className="w-full">
                Generate Card
              </Button>
            </form>
          </CardContent>
        </Card>

        <PreviewPanel
          url={previewUrl}
          alt={form.repo}
        />
      </div>
    </div>
  );
}
