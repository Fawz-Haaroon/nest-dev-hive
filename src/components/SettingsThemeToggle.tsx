
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Label } from '@/components/ui/label';

export const SettingsThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="space-y-0.5">
        <Label className="text-base font-medium">Theme</Label>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Choose your preferred theme for the application
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme('light')}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          Dark
        </Button>
      </div>
    </div>
  );
};
