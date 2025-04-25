import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ColorSchemeSelector: React.FC = () => {
  const { theme, colorScheme, setColorScheme } = useTheme();

  const schemes = [
    {
      name: 'default',
      label: 'Default',
      colors: ['#4f46e5', '#f59e0b', '#10b981'],
    },
    {
      name: 'blue',
      label: 'Ocean',
      colors: ['#2563eb', '#0ea5e9', '#06b6d4'],
    },
    {
      name: 'green',
      label: 'Forest',
      colors: ['#16a34a', '#10b981', '#84cc16'],
    },
    {
      name: 'purple',
      label: 'Royal',
      colors: ['#9333ea', '#d946ef', '#ec4899'],
    },
    {
      name: 'orange',
      label: 'Sunset',
      colors: ['#ea580c', '#f59e0b', '#eab308'],
    },
  ] as const;

  return (
    <div
      className={`rounded-lg shadow-lg p-4 ${
        theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
      } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Palette
          className={`w-5 h-5 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        />
        <span className="text-sm font-medium">Color Theme</span>
      </div>
      <div className="grid gap-2">
        {schemes.map(({ name, label, colors }) => (
          <button
            key={name}
            onClick={() => setColorScheme(name)}
            className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              colorScheme === name
                ? 'bg-gray-200 dark:bg-gray-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={`Select ${label} theme`}
            type="button"
          >
            <div className="flex gap-1">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;