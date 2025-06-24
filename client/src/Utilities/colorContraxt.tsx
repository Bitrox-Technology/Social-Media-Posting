interface ContrastRatioFunction {
  (color1: string, color2: string): number;
}

interface LuminanceFunction {
  (hex: string): number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RgbColor {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

interface RgbToHexFunction {
  (r: number, g: number, b: number): string;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

interface BlendColorsFunction {
  (c1: string, c2: string): string;
}

function blendColors(c1: string, c2: string): string {
  const rgb1: RgbColor = hexToRgb(c1);
  const rgb2: RgbColor = hexToRgb(c2);

  const r: number = Math.round((rgb1.r + rgb2.r) / 2);
  const g: number = Math.round((rgb1.g + rgb2.g) / 2);
  const b: number = Math.round((rgb1.b + rgb2.b) / 2);

  return rgbToHex(r, g, b);
}



const getLuminance: LuminanceFunction = function (hex: string): number {
  const r: number = parseInt(hex.substr(1, 2), 16) / 255;
  const g: number = parseInt(hex.substr(3, 2), 16) / 255;
  const b: number = parseInt(hex.substr(5, 2), 16) / 255;
  const a: number[] = [r, g, b].map((v: number): number =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

const getContrastRatio: ContrastRatioFunction = function (color1: string, color2: string): number {
  const lum1: number = getLuminance(color1);
  const lum2: number = getLuminance(color2);
  const brightest: number = Math.max(lum1, lum2);
  const darkest: number = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

interface EnsureContrastFunction {
  (color: string, background: string, logoColor?: string, minRatio?: number): {
    suggestedTextColor: string;
    unsuitableColors: string[];
    contrastRatio: number;
  };
}
function getComplementaryColor(hex: string): string {
  const rgb: RgbColor = hexToRgb(hex);
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}
// Updated ensureContrast function
const ensureContrast: EnsureContrastFunction = function (
  color: string,
  background: string,
  logoColor?: string,
  minRatio: number = 4.5
): { suggestedTextColor: string; unsuitableColors: string[]; contrastRatio: number } {
  // Default text color options
  let textOptions: string[] = ['#000000', '#FFFFFF'];

  // If logoColor is provided, add its complementary color to options
  if (logoColor) {
    const compColor = getComplementaryColor(logoColor);
    textOptions.push(compColor);
    // Optionally blend logo color with background for aesthetic variation
    textOptions.push(blendColors(logoColor, background));
  }

  let textColor: string = textOptions[0]; // Default to black
  let maxRatio: number = 0;

  // Find the text color with the highest contrast ratio
  textOptions.forEach((option) => {
    const ratio = getContrastRatio(option, background);
    if (ratio >= minRatio && ratio > maxRatio) {
      maxRatio = ratio;
      textColor = option;
    }
  });

  // If no color meets minRatio, choose the one with the highest contrast
  if (maxRatio < minRatio) {
    textOptions.forEach((option) => {
      const ratio = getContrastRatio(option, background);
      if (ratio > maxRatio) {
        maxRatio = ratio;
        textColor = option;
      }
    });
  }

  // Identify unsuitable colors (low contrast or similar to background)
  const unsuitableColors: string[] = [];
  const testColors: string[] = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    background,
    ...(logoColor ? [logoColor] : []),
  ].filter((c): c is string => !!c);

  testColors.forEach((testColor) => {
    const ratio = getContrastRatio(testColor, background);
    const testLum = getLuminance(testColor);
    const bgLum = getLuminance(background);
    if (ratio < minRatio || Math.abs(testLum - bgLum) < 0.1) {
      unsuitableColors.push(testColor);
    }
  });

  console.log(`Best text color for ${background}: ${textColor} with ratio ${maxRatio.toFixed(2)}:1`);

  return {
    suggestedTextColor: textColor,
    unsuitableColors,
    contrastRatio: maxRatio,
  };
};


// Select best text color
const selectTextColor = (backgroundColor: string, textOptions: string[] = ['#000000', '#FFFFFF']): string => {
  let textColor = textOptions[0]; // Default to first option
  let maxRatio = 0;

  textOptions.forEach((option) => {
    const ratio = getContrastRatio(backgroundColor, option);
    if (ratio > maxRatio) {
      maxRatio = ratio;
      textColor = option;
    }
  });

  console.log(`Best text color for ${backgroundColor}: ${textColor} with ratio ${maxRatio.toFixed(2)}:1`);
  return textColor;
};

export { selectTextColor, ensureContrast,  blendColors}