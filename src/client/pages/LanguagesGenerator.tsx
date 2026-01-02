import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ThemeSelect } from '@/components/generators/ThemeSelect';
import { LocaleSelect } from '@/components/generators/LocaleSelect';
import { PreviewPanel } from '@/components/generators/PreviewPanel';
import { useUsername } from '@/contexts/username';

const layouts = [
  { value: '', label: 'Default' },
  { value: 'compact', label: 'Compact' },
  { value: 'donut', label: 'Donut' },
  { value: 'donut-vertical', label: 'Donut Vertical' },
  { value: 'pie', label: 'Pie' },
];

interface FormState {
  theme: string;
  locale: string;
  layout: string;
  langsCount: string;
  hideBorder: boolean;
  hideTitle: boolean;
  hideProgress: boolean;
  disableAnimations: boolean;
  customTitle: string;
  hide: string;
  excludeRepo: string;
}

export function LanguagesGenerator() {
  const { t } = useTranslation();
  const { username, setUsername } = useUsername();
  const [form, setForm] = useState<FormState>({
    theme: 'default',
    locale: 'en',
    layout: '',
    langsCount: '5',
    hideBorder: false,
    hideTitle: false,
    hideProgress: false,
    disableAnimations: false,
    customTitle: '',
    hide: '',
    excludeRepo: '',
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
    if (!username.trim()) return null;

    const params = new URLSearchParams();
    params.set('username', username.trim());

    if (form.theme && form.theme !== 'default') params.set('theme', form.theme);
    if (form.locale && form.locale !== 'en') params.set('locale', form.locale);
    if (form.layout) params.set('layout', form.layout);
    if (form.langsCount && form.langsCount !== '5') params.set('langs_count', form.langsCount);
    if (form.hideBorder) params.set('hide_border', 'true');
    if (form.hideTitle) params.set('hide_title', 'true');
    if (form.hideProgress) params.set('hide_progress', 'true');
    if (form.disableAnimations) params.set('disable_animations', 'true');
    if (form.customTitle.trim()) params.set('custom_title', form.customTitle.trim());
    if (form.hide.trim()) params.set('hide', form.hide.trim());
    if (form.excludeRepo.trim()) params.set('exclude_repo', form.excludeRepo.trim());

    return `/api/top-langs?${params.toString()}`;
  }, [form, username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewUrl(buildUrl());
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('languages.title')}</h1>
        <p className="text-muted-foreground">
          {t('languages.subtitle')}
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

              <ThemeSelect
                value={form.theme}
                onValueChange={(v) => updateForm('theme', v)}
              />

              <div className="space-y-2">
                <Label>{t('languages.layout')}</Label>
                <Select
                  value={form.layout}
                  onValueChange={(v) => updateForm('layout', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a layout" />
                  </SelectTrigger>
                  <SelectContent>
                    {layouts.map((layout) => (
                      <SelectItem
                        key={layout.value || 'default'}
                        value={layout.value || 'default'}
                      >
                        {layout.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="langsCount">{t('languages.langsCount')}</Label>
                <Input
                  id="langsCount"
                  type="number"
                  min="1"
                  max="20"
                  value={form.langsCount}
                  onChange={(e) => updateForm('langsCount', e.target.value)}
                />
              </div>

              <LocaleSelect
                value={form.locale}
                onValueChange={(v) => updateForm('locale', v)}
              />

              <div className="space-y-2">
                <Label>{t('generator.options')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'hideBorder' as const, label: t('languages.hideBorder') },
                    { key: 'hideTitle' as const, label: t('languages.hideTitle') },
                    { key: 'hideProgress' as const, label: t('languages.hideProgress') },
                    { key: 'disableAnimations' as const, label: t('languages.noAnimation') },
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
                    <Label htmlFor="customTitle">{t('languages.customTitle')}</Label>
                    <Input
                      id="customTitle"
                      placeholder="Most Used Languages"
                      value={form.customTitle}
                      onChange={(e) => updateForm('customTitle', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hide">{t('languages.hide')}</Label>
                    <Input
                      id="hide"
                      placeholder="html,css,javascript"
                      value={form.hide}
                      onChange={(e) => updateForm('hide', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('languages.hideHint')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excludeRepo">{t('languages.excludeRepo')}</Label>
                    <Input
                      id="excludeRepo"
                      placeholder="repo1,repo2"
                      value={form.excludeRepo}
                      onChange={(e) => updateForm('excludeRepo', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('languages.excludeRepoHint')}
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
          alt={`${username}'s Top Languages`}
        />
      </div>
    </div>
  );
}
