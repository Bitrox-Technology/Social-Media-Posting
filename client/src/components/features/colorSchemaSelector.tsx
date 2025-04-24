import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ColorSchemeSelector: React.FC = () => {
  const { setColorScheme, colorScheme } = useTheme();

  const schemes = [
    { name: 'default', label: 'Default', colors: ['#6366f1', '#f59e0b', '#10b981'] },
    { name: 'blue', label: 'Ocean', colors: ['#2563eb', '#0ea5e9', '#06b6d4'] },
    { name: 'green', label: 'Forest', colors: ['#16a34a', '#059669', '#84cc16'] },
    { name: 'purple', label: 'Royal', colors: ['#9333ea', '#d946ef', '#ec4899'] },
    { name: 'orange', label: 'Sunset', colors: ['#ea580c', '#f59e0b', '#eab308'] },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Color Theme</span>
      </div>
      <div className="grid gap-2">
        {schemes.map(({ name, label, colors }) => (
          <button
            key={name}
            onClick={() => setColorScheme(name)}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
              colorScheme === name ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
            aria-label={`Select ${label} theme`}
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
            <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;