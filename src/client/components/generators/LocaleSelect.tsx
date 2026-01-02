import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const locales = [
  { value: '', label: 'English' },
  { value: 'ja', label: 'Japanese' },
];

interface LocaleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function LocaleSelect({ value, onValueChange }: LocaleSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Language</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {locales.map((locale) => (
            <SelectItem key={locale.value || 'en'} value={locale.value || 'en'}>
              {locale.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
