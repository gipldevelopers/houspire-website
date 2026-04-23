"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultPalette } from '@/lib/palette';
import { toast } from 'sonner';

// Helper to translate HEX to HSL for Tailwind support
const hexToHSL = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return `${h} ${s}% ${l}%`;
};

const ColorThemeContext = createContext();

export function ColorThemeProvider({ children }) {
  const [palette, setPalette] = useState(defaultPalette);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount and Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'housepire-custom-palette' && e.newValue) {
        setPalette(JSON.parse(e.newValue));
      }
    };

    const savedPalette = localStorage.getItem('housepire-custom-palette');
    if (savedPalette) {
      try {
        const parsed = JSON.parse(savedPalette);
        setPalette(parsed);
      } catch (e) {
        console.error("Failed to parse saved palette", e);
      }
    }
    
    window.addEventListener('storage', handleStorageChange);
    setIsInitialized(true);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update CSS variables whenever palette changes
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;
    
    // Map palette keys to HEX CSS variables
    Object.entries(palette).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // Map Specific Core variables back to Tailwind's HSL system for deep integration
    root.style.setProperty('--primary', hexToHSL(palette.primary));
    root.style.setProperty('--secondary', hexToHSL(palette.secondary));
    root.style.setProperty('--background', hexToHSL(palette.background));
    root.style.setProperty('--accent', hexToHSL(palette.accent));
    root.style.setProperty('--foreground', hexToHSL(palette.text));
    root.style.setProperty('--card', hexToHSL(palette.card));
    root.style.setProperty('--border', hexToHSL(palette.border));

    // Instant Save to make it truly dynamic across tabs
    localStorage.setItem('housepire-custom-palette', JSON.stringify(palette));
  }, [palette, isInitialized]);

  const updateColor = (key, value) => {
    setPalette(prev => ({ ...prev, [key]: value }));
  };

  const savePalette = () => {
    localStorage.setItem('housepire-custom-palette', JSON.stringify(palette));
    toast.success("Theme permanently locked in!");
    return true;
  };

  const resetToDefault = () => {
    setPalette(defaultPalette);
    localStorage.removeItem('housepire-custom-palette');
  };

  const importPalette = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      setPalette(parsed);
    } catch (e) {
      alert("Invalid Palette JSON");
    }
  };

  return (
    <ColorThemeContext.Provider value={{ 
      palette, 
      updateColor, 
      savePalette,
      resetToDefault, 
      importPalette,
      isInitialized 
    }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};
