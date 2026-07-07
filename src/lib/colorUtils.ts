/**
 * Converts a hex color to an 11-shade Tailwind-like palette in RGB format.
 * The returned values are space-separated RGB numbers like "234 90 139"
 * which are perfect for injecting into CSS variables and using with Tailwind.
 */

// Basic Hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

// Basic RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

// Basic HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function generateColorPalette(hex: string): Record<string, string> {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  // Tailwind default lightness stops
  const lightnessStops = {
    50: 0.95,
    100: 0.9,
    200: 0.8,
    300: 0.7,
    400: 0.6,
    500: l, // Set 500 to the original color's lightness
    600: 0.4,
    700: 0.3,
    800: 0.2,
    900: 0.1,
    950: 0.05,
  };

  const palette: Record<string, string> = {};
  for (const [key, stopL] of Object.entries(lightnessStops)) {
    let finalL = stopL;
    if (key === '500') finalL = l;
    
    let finalS = s;
    if (finalL > 0.8 || finalL < 0.2) finalS = s * 0.9;
    
    const [finalR, finalG, finalB] = hslToRgb(h, finalS, finalL);
    palette[key] = `${finalR} ${finalG} ${finalB}`;
  }

  return palette;
}
