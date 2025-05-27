
'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'crimson-light', label: 'Crimson Light (Default)' },
    { value: 'dark', label: 'Dark' },
    { value: 'theme-peach', label: 'Soft Peach' },
    { value: 'theme-lavender', label: 'Lavender Bliss' },
    { value: 'theme-blush-pink', label: 'Blush Pink' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Switch theme">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
          {themes.map((t) => (
            <DropdownMenuRadioItem key={t.value} value={t.value}>
              {t.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
