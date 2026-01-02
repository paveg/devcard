import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const themes = [
  { value: '', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'radical', label: 'Radical' },
  { value: 'tokyonight', label: 'Tokyo Night' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'github_dark', label: 'GitHub Dark' },
  { value: 'github_light', label: 'GitHub Light' },
  { value: 'gruvbox', label: 'Gruvbox' },
  { value: 'nord', label: 'Nord' },
  { value: 'catppuccin_mocha', label: 'Catppuccin Mocha' },
  { value: 'catppuccin_latte', label: 'Catppuccin Latte' },
  { value: 'onedark', label: 'One Dark' },
  { value: 'cobalt', label: 'Cobalt' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'md3_light', label: 'Material 3 Light' },
  { value: 'md3_dark', label: 'Material 3 Dark' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'slate', label: 'Slate' },
];

interface ThemeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ThemeSelect({ value, onValueChange }: ThemeSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Theme</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.value || 'default'} value={theme.value || 'default'}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
