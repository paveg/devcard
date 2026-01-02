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
  theme: string;
  locale: string;
  showIcons: boolean;
  hideRank: boolean;
  hideBorder: boolean;
  hideTitle: boolean;
  includeAllCommits: boolean;
  disableAnimations: boolean;
  customTitle: string;
  hide: string;
  show: string;
  rankIcon: string;
}

export function StatsGenerator() {
  const [form, setForm] = useState<FormState>({
    username: '',
    theme: 'default',
    locale: 'en',
    showIcons: true,
    hideRank: false,
    hideBorder: false,
    hideTitle: false,
    includeAllCommits: false,
    disableAnimations: false,
    customTitle: '',
    hide: '',
    show: '',
    rankIcon: '',
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
    if (!form.username.trim()) return null;

    const params = new URLSearchParams();
    params.set('username', form.username.trim());

    if (form.theme && form.theme !== 'default') params.set('theme', form.theme);
    if (form.locale && form.locale !== 'en') params.set('locale', form.locale);
    if (form.showIcons) params.set('show_icons', 'true');
    if (form.hideRank) params.set('hide_rank', 'true');
    if (form.hideBorder) params.set('hide_border', 'true');
    if (form.hideTitle) params.set('hide_title', 'true');
    if (form.includeAllCommits) params.set('include_all_commits', 'true');
    if (form.disableAnimations) params.set('disable_animations', 'true');
    if (form.customTitle.trim()) params.set('custom_title', form.customTitle.trim());
    if (form.hide.trim()) params.set('hide', form.hide.trim());
    if (form.show.trim()) params.set('show', form.show.trim());
    if (form.rankIcon) params.set('rank_icon', form.rankIcon);

    return `/api?${params.toString()}`;
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewUrl(buildUrl());
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Stats Card Generator</h1>
        <p className="text-muted-foreground">
          Display your GitHub profile statistics with a beautiful card.
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
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'showIcons' as const, label: 'Show Icons' },
                    { key: 'hideRank' as const, label: 'Hide Rank' },
                    { key: 'hideBorder' as const, label: 'Hide Border' },
                    { key: 'hideTitle' as const, label: 'Hide Title' },
                    { key: 'includeAllCommits' as const, label: 'All Commits' },
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
                    <Label htmlFor="customTitle">Custom Title</Label>
                    <Input
                      id="customTitle"
                      placeholder="My GitHub Stats"
                      value={form.customTitle}
                      onChange={(e) => updateForm('customTitle', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hide">Hide Stats</Label>
                    <Input
                      id="hide"
                      placeholder="stars,commits,prs"
                      value={form.hide}
                      onChange={(e) => updateForm('hide', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated: stars, commits, prs, issues, contribs
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="show">Show Stats</Label>
                    <Input
                      id="show"
                      placeholder="reviews,prs_merged"
                      value={form.show}
                      onChange={(e) => updateForm('show', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated: reviews, prs_merged, prs_merged_percentage
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
          alt={`${form.username}'s GitHub Stats`}
        />
      </div>
    </div>
  );
}
