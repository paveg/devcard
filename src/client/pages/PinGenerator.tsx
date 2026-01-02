import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useUsername } from '@/contexts/username';

interface FormState {
  repo: string;
  theme: string;
  locale: string;
  showOwner: boolean;
  hideBorder: boolean;
  disableAnimations: boolean;
  descriptionLinesCount: string;
}

export function PinGenerator() {
  const { t } = useTranslation();
  const { username, setUsername } = useUsername();
  const [form, setForm] = useState<FormState>({
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
    if (!username.trim() || !form.repo.trim()) return null;

    const params = new URLSearchParams();
    params.set('username', username.trim());
    params.set('repo', form.repo.trim());

    if (form.theme && form.theme !== 'default') params.set('theme', form.theme);
    if (form.locale && form.locale !== 'en') params.set('locale', form.locale);
    if (form.showOwner) params.set('show_owner', 'true');
    if (form.hideBorder) params.set('hide_border', 'true');
    if (form.disableAnimations) params.set('disable_animations', 'true');
    if (form.descriptionLinesCount)
      params.set('description_lines_count', form.descriptionLinesCount);

    return `/api/pin?${params.toString()}`;
  }, [form, username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewUrl(buildUrl());
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('pin.title')}</h1>
        <p className="text-muted-foreground">
          {t('pin.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('generator.options')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('generator.usernameRequired')}</Label>
                <Input
                  id="username"
                  placeholder="octocat"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo">{t('generator.repoRequired')}</Label>
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
                <Label>{t('generator.options')}</Label>
                <div className="space-y-2">
                  {[
                    { key: 'showOwner' as const, label: t('pin.showOwner') },
                    { key: 'hideBorder' as const, label: t('pin.hideBorder') },
                    { key: 'disableAnimations' as const, label: t('pin.noAnimation') },
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
                    {t('generator.advanced')}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        advancedOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="descriptionLinesCount">{t('pin.descriptionLines')}</Label>
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
                      {t('pin.descriptionLinesHint')}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button type="submit" className="w-full">
                {t('generator.generate')}
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
