export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
}

export type ThemeKey = 
  // 8 Dark Themes (equal balance, appear first)
  | 'leatherbound'
  | 'red-velvet'
  | 'ultra-dark'
  | 'midnight'
  | 'graphite'
  | 'espresso'
  | 'evergreen'
  | 'sepia-dark'
  // 8 Light Themes
  | 'paper'
  | 'maple'
  | 'pumpkin-spice'
  | 'true-valentine'
  | 'roseglow'
  | 'sage'
  | 'mist'
  | 'sepia-light';

export interface CourseColorStyle {
  id: string; // e.g. "color-1", "color-2", etc.
  name: string;
  bg: string;
  border: string;
  text: string;
  tagBg: string;
  tagText: string;
}

export interface ThemeOption {
  key: ThemeKey;
  name: string;
  description: string;
  isDark: boolean;
  sampleBg: string;
  sampleAccent: string;
  coursePalette: CourseColorStyle[];
}
