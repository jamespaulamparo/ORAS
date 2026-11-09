import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeKey, ThemeOption, CourseColorStyle } from '../../types/auth';

export const THEMES: ThemeOption[] = [
  // ==========================================
  // 8 DARK THEMES (Appear First)
  // ==========================================
  {
    key: 'leatherbound',
    name: 'Leatherbound',
    description: 'Dark academia after-hours library: deep antique leather, aged parchment, and warm amber.',
    isDark: true,
    sampleBg: '#1c1613',
    sampleAccent: '#b87c4c',
    coursePalette: [
      { id: 'color-1', name: 'Saddle Leather', bg: '#2b1f18', border: '#5c4130', text: '#ebd5c1', tagBg: '#5c4130', tagText: '#fdf8f5' },
      { id: 'color-2', name: 'Aged Parchment', bg: '#28231a', border: '#69573c', text: '#f0e3cc', tagBg: '#69573c', tagText: '#ffffff' },
      { id: 'color-3', name: 'Antique Brass', bg: '#2f2413', border: '#785b24', text: '#fae3b2', tagBg: '#785b24', tagText: '#ffffff' },
      { id: 'color-4', name: 'Mahogany', bg: '#2f1719', border: '#6b3236', text: '#f3d1d4', tagBg: '#6b3236', tagText: '#ffffff' },
      { id: 'color-5', name: 'Library Moss', bg: '#18241b', border: '#3b543f', text: '#d2e8d7', tagBg: '#3b543f', tagText: '#ffffff' },
      { id: 'color-6', name: 'Dark Ochre', bg: '#2b2313', border: '#6e5828', text: '#f8eecf', tagBg: '#6e5828', tagText: '#ffffff' },
      { id: 'color-7', name: 'Terracotta Ink', bg: '#2d1c16', border: '#693e31', text: '#f4d5cc', tagBg: '#693e31', tagText: '#ffffff' },
      { id: 'color-8', name: 'Smoked Walnut', bg: '#231d1b', border: '#574844', text: '#e2dad8', tagBg: '#574844', tagText: '#ffffff' },
    ],
  },
  {
    key: 'red-velvet',
    name: 'Red Velvet',
    description: 'Dark gothic romance: luxurious burgundy velvet, deep crimson, and dusty rose.',
    isDark: true,
    sampleBg: '#1e0f14',
    sampleAccent: '#c93b58',
    coursePalette: [
      { id: 'color-1', name: 'Burgundy Wine', bg: '#2c121b', border: '#6e273f', text: '#f7d3df', tagBg: '#6e273f', tagText: '#ffffff' },
      { id: 'color-2', name: 'Dusty Crimson', bg: '#2d1417', border: '#752d35', text: '#f8d7da', tagBg: '#752d35', tagText: '#ffffff' },
      { id: 'color-3', name: 'Vintage Rose', bg: '#2b1522', border: '#6c3255', text: '#f4d7ea', tagBg: '#6c3255', tagText: '#ffffff' },
      { id: 'color-4', name: 'Black Plum', bg: '#241226', border: '#5b2b61', text: '#ecd2f0', tagBg: '#5b2b61', tagText: '#ffffff' },
      { id: 'color-5', name: 'Spiced Cherry', bg: '#301316', border: '#782d33', text: '#f9d8db', tagBg: '#782d33', tagText: '#ffffff' },
      { id: 'color-6', name: 'Mulled Cider', bg: '#2e1913', border: '#703a27', text: '#f7ded5', tagBg: '#703a27', tagText: '#ffffff' },
      { id: 'color-7', name: 'Mauve Velvet', bg: '#271724', border: '#5f3557', text: '#eed9eb', tagBg: '#5f3557', tagText: '#ffffff' },
      { id: 'color-8', name: 'Deep Berry', bg: '#2d1020', border: '#70254d', text: '#f8d2e6', tagBg: '#70254d', tagText: '#ffffff' },
    ],
  },
  {
    key: 'ultra-dark',
    name: 'Ultra Dark',
    description: 'Deep void black with crisp luminescent jewel accents and high-legibility contrast.',
    isDark: true,
    sampleBg: '#090a0d',
    sampleAccent: '#70a1ff',
    coursePalette: [
      { id: 'color-1', name: 'Electric Cyan', bg: '#0b2028', border: '#17546a', text: '#a6e9fc', tagBg: '#17546a', tagText: '#ffffff' },
      { id: 'color-2', name: 'Neon Emerald', bg: '#0b2216', border: '#185936', text: '#a6f3ca', tagBg: '#185936', tagText: '#ffffff' },
      { id: 'color-3', name: 'Laser Violet', bg: '#1c132c', border: '#4b2e7a', text: '#e0c8ff', tagBg: '#4b2e7a', tagText: '#ffffff' },
      { id: 'color-4', name: 'Solar Amber', bg: '#291e0a', border: '#6e4f16', text: '#fee09e', tagBg: '#6e4f16', tagText: '#ffffff' },
      { id: 'color-5', name: 'Crimson Glow', bg: '#2b0f14', border: '#73202e', text: '#fdbdc6', tagBg: '#73202e', tagText: '#ffffff' },
      { id: 'color-6', name: 'Ice Blue', bg: '#0e1d2c', border: '#214972', text: '#b8dcff', tagBg: '#214972', tagText: '#ffffff' },
      { id: 'color-7', name: 'Teal Flare', bg: '#092323', border: '#175b5b', text: '#a2f1f1', tagBg: '#175b5b', tagText: '#ffffff' },
      { id: 'color-8', name: 'Silver Slate', bg: '#161920', border: '#3b4354', text: '#d9e1f2', tagBg: '#3b4354', tagText: '#ffffff' },
    ],
  },
  {
    key: 'midnight',
    name: 'Midnight',
    description: 'Deep twilight navy night sky with cool starlight sapphire and cyan tones.',
    isDark: true,
    sampleBg: '#0d131d',
    sampleAccent: '#6495ed',
    coursePalette: [
      { id: 'color-1', name: 'Sapphire Wave', bg: '#131e33', border: '#28467d', text: '#c2d8ff', tagBg: '#28467d', tagText: '#ffffff' },
      { id: 'color-2', name: 'Starlight Teal', bg: '#10252b', border: '#205361', text: '#b3e8f5', tagBg: '#205361', tagText: '#ffffff' },
      { id: 'color-3', name: 'Night Iris', bg: '#1a1936', border: '#3d3a82', text: '#d4d2fd', tagBg: '#3d3a82', tagText: '#ffffff' },
      { id: 'color-4', name: 'Abyssal Blue', bg: '#0e1828', border: '#1d355c', text: '#b3d1ff', tagBg: '#1d355c', tagText: '#ffffff' },
      { id: 'color-5', name: 'Northern Sky', bg: '#112228', border: '#254e5c', text: '#b8eefc', tagBg: '#254e5c', tagText: '#ffffff' },
      { id: 'color-6', name: 'Lunar Gold', bg: '#292215', border: '#63512e', text: '#fae6b8', tagBg: '#63512e', tagText: '#ffffff' },
      { id: 'color-7', name: 'Dusk Rose', bg: '#261520', border: '#5c2d4a', text: '#f3c7e3', tagBg: '#5c2d4a', tagText: '#ffffff' },
      { id: 'color-8', name: 'Deep Cobalt', bg: '#12203b', border: '#254b8f', text: '#bdd5ff', tagBg: '#254b8f', tagText: '#ffffff' },
    ],
  },
  {
    key: 'graphite',
    name: 'Graphite',
    description: 'Clean architectural charcoal with soft neutral contrasts and cool steel accents.',
    isDark: true,
    sampleBg: '#15171a',
    sampleAccent: '#94a3b8',
    coursePalette: [
      { id: 'color-1', name: 'Steel Blue', bg: '#1d222b', border: '#3e4a61', text: '#d3dff5', tagBg: '#3e4a61', tagText: '#ffffff' },
      { id: 'color-2', name: 'Slate Teal', bg: '#1a2426', border: '#354f54', text: '#c8e8ec', tagBg: '#354f54', tagText: '#ffffff' },
      { id: 'color-3', name: 'Muted Sage', bg: '#1c241e', border: '#394f3e', text: '#cee4d3', tagBg: '#394f3e', tagText: '#ffffff' },
      { id: 'color-4', name: 'Dusty Indigo', bg: '#211e2b', border: '#473f61', text: '#dfd8f5', tagBg: '#473f61', tagText: '#ffffff' },
      { id: 'color-5', name: 'Charcoal Rose', bg: '#251b1f', border: '#543b44', text: '#f1d6df', tagBg: '#543b44', tagText: '#ffffff' },
      { id: 'color-6', name: 'Smoked Amber', bg: '#242018', border: '#544831', text: '#ede2c7', tagBg: '#544831', tagText: '#ffffff' },
      { id: 'color-7', name: 'Pewter', bg: '#1f2126', border: '#424854', text: '#d9dee8', tagBg: '#424854', tagText: '#ffffff' },
      { id: 'color-8', name: 'Zinc Stone', bg: '#222326', border: '#4a4d54', text: '#dedfe3', tagBg: '#4a4d54', tagText: '#ffffff' },
    ],
  },
  {
    key: 'espresso',
    name: 'Espresso',
    description: 'Dark roasted coffee, warm hazelnut crema, and rich roasted cacao tones.',
    isDark: true,
    sampleBg: '#181311',
    sampleAccent: '#c48a5c',
    coursePalette: [
      { id: 'color-1', name: 'Dark Roast', bg: '#291c16', border: '#5e3c2c', text: '#ecd4c5', tagBg: '#5e3c2c', tagText: '#ffffff' },
      { id: 'color-2', name: 'Hazelnut Crema', bg: '#2c2014', border: '#69492a', text: '#f5ddc3', tagBg: '#69492a', tagText: '#ffffff' },
      { id: 'color-3', name: 'Caramel Drizzle', bg: '#2f2412', border: '#735424', text: '#fbe4b8', tagBg: '#735424', tagText: '#ffffff' },
      { id: 'color-4', name: 'Cacao Bean', bg: '#271717', border: '#5e3131', text: '#f0d0d0', tagBg: '#5e3131', tagText: '#ffffff' },
      { id: 'color-5', name: 'Cardamom Pod', bg: '#1c2419', border: '#405436', text: '#d3e4cb', tagBg: '#405436', tagText: '#ffffff' },
      { id: 'color-6', name: 'Toasted Pecan', bg: '#2d1e18', border: '#694231', text: '#f3d9ce', tagBg: '#694231', tagText: '#ffffff' },
      { id: 'color-7', name: 'Steamed Milk', bg: '#26221f', border: '#574d44', text: '#ede3d8', tagBg: '#574d44', tagText: '#ffffff' },
      { id: 'color-8', name: 'Mocha Stout', bg: '#241a1a', border: '#543939', text: '#e8d4d4', tagBg: '#543939', tagText: '#ffffff' },
    ],
  },
  {
    key: 'evergreen',
    name: 'Evergreen',
    description: 'Deep ancient pine needles, damp moss, dark riverstone, and highland mist.',
    isDark: true,
    sampleBg: '#0f1713',
    sampleAccent: '#529b6f',
    coursePalette: [
      { id: 'color-1', name: 'Pine Needle', bg: '#15251c', border: '#2d543d', text: '#c8ebd4', tagBg: '#2d543d', tagText: '#ffffff' },
      { id: 'color-2', name: 'Highland Moss', bg: '#192716', border: '#39592e', text: '#d3efcb', tagBg: '#39592e', tagText: '#ffffff' },
      { id: 'color-3', name: 'Forest River', bg: '#122323', border: '#245252', text: '#bfebeb', tagBg: '#245252', tagText: '#ffffff' },
      { id: 'color-4', name: 'Lichen Stone', bg: '#1a221f', border: '#384d44', text: '#cfdfd8', tagBg: '#384d44', tagText: '#ffffff' },
      { id: 'color-5', name: 'Juniper Berry', bg: '#191c28', border: '#333b5c', text: '#cfd7fa', tagBg: '#333b5c', tagText: '#ffffff' },
      { id: 'color-6', name: 'Cedar Bark', bg: '#251b14', border: '#593e2b', text: '#ebd4c3', tagBg: '#593e2b', tagText: '#ffffff' },
      { id: 'color-7', name: 'Sunlit Canopy', bg: '#242512', border: '#545722', text: '#ebefa8', tagBg: '#545722', tagText: '#1f240b' },
      { id: 'color-8', name: 'Mountain Fog', bg: '#18201f', border: '#374947', text: '#d2dedc', tagBg: '#374947', tagText: '#ffffff' },
    ],
  },
  {
    key: 'sepia-dark',
    name: 'Sepia Dark',
    description: 'Dark antique darkroom tones, burnished brass, and rich photographic shadows.',
    isDark: true,
    sampleBg: '#1a1611',
    sampleAccent: '#bfa06b',
    coursePalette: [
      { id: 'color-1', name: 'Dark Amber', bg: '#2a2013', border: '#634925', text: '#f7dfb9', tagBg: '#634925', tagText: '#ffffff' },
      { id: 'color-2', name: 'Burnished Gold', bg: '#2c2512', border: '#6b5825', text: '#f9eabf', tagBg: '#6b5825', tagText: '#ffffff' },
      { id: 'color-3', name: 'Walnut Stain', bg: '#261a14', border: '#5c3a2a', text: '#ebd2c3', tagBg: '#5c3a2a', tagText: '#ffffff' },
      { id: 'color-4', name: 'Faded Daguerreotype', bg: '#231f1a', border: '#54493c', text: '#e8dfd5', tagBg: '#54493c', tagText: '#ffffff' },
      { id: 'color-5', name: 'Oxidized Copper', bg: '#18221c', border: '#375241', text: '#cfe3d5', tagBg: '#375241', tagText: '#ffffff' },
      { id: 'color-6', name: 'Antique Crimson', bg: '#2a1617', border: '#612e31', text: '#f4cfd1', tagBg: '#612e31', tagText: '#ffffff' },
      { id: 'color-7', name: 'Raw Umber', bg: '#241c17', border: '#523f33', text: '#e4d6ce', tagBg: '#523f33', tagText: '#ffffff' },
      { id: 'color-8', name: 'Old Parchment', bg: '#252119', border: '#574d39', text: '#ebe3cf', tagBg: '#574d39', tagText: '#ffffff' },
    ],
  },

  // ==========================================
  // 8 LIGHT THEMES (Equal Balance)
  // ==========================================
  {
    key: 'paper',
    name: 'Paper',
    description: 'Clean warm cream, soft charcoal typography, and restrained ink accents.',
    isDark: false,
    sampleBg: '#fcfbf9',
    sampleAccent: '#2e382e',
    coursePalette: [
      { id: 'color-1', name: 'Botanical Sage', bg: '#edf4ee', border: '#a8c6ad', text: '#214028', tagBg: '#355c3c', tagText: '#ffffff' },
      { id: 'color-2', name: 'Dusty Slate', bg: '#edf2f7', border: '#adc0d3', text: '#23394d', tagBg: '#3a546d', tagText: '#ffffff' },
      { id: 'color-3', name: 'Warm Wheat', bg: '#fbf5e6', border: '#d9c693', text: '#4e3c12', tagBg: '#705619', tagText: '#ffffff' },
      { id: 'color-4', name: 'Terracotta', bg: '#faeee8', border: '#dfb2a1', text: '#542618', tagBg: '#7e3d29', tagText: '#ffffff' },
      { id: 'color-5', name: 'Soft Plum', bg: '#f7eff9', border: '#d2b6d8', text: '#46234b', tagBg: '#693770', tagText: '#ffffff' },
      { id: 'color-6', name: 'Subdued Ochre', bg: '#fbf7e8', border: '#d9cc93', text: '#4d4111', tagBg: '#6e5e19', tagText: '#ffffff' },
      { id: 'color-7', name: 'Faded Navy', bg: '#ebf1f8', border: '#a6bfdb', text: '#1c3452', tagBg: '#2f517a', tagText: '#ffffff' },
      { id: 'color-8', name: 'Warm Stone', bg: '#f4f3f0', border: '#c7c4bc', text: '#3c3a35', tagBg: '#59564f', tagText: '#ffffff' },
    ],
  },
  {
    key: 'maple',
    name: 'Maple',
    description: 'Autumn golden hour: warm crisp amber, toasted chestnut, and fallen leaves.',
    isDark: false,
    sampleBg: '#fcf7f0',
    sampleAccent: '#b24f1c',
    coursePalette: [
      { id: 'color-1', name: 'Maple Leaf', bg: '#fcedea', border: '#e8aba0', text: '#691e14', tagBg: '#962b1d', tagText: '#ffffff' },
      { id: 'color-2', name: 'Golden Amber', bg: '#fcf2e3', border: '#ecc182', text: '#5e3a09', tagBg: '#8c550c', tagText: '#ffffff' },
      { id: 'color-3', name: 'Roasted Pecan', bg: '#f7eee6', border: '#d5b69f', text: '#4e3020', tagBg: '#734832', tagText: '#ffffff' },
      { id: 'color-4', name: 'Spiced Honey', bg: '#fbf5e6', border: '#e0c888', text: '#57430e', tagBg: '#7d6015', tagText: '#ffffff' },
      { id: 'color-5', name: 'Autumn Pine', bg: '#ecf3ec', border: '#a8caa9', text: '#214224', tagBg: '#345e38', tagText: '#ffffff' },
      { id: 'color-6', name: 'Cinnamon Bark', bg: '#faece6', border: '#d9ac97', text: '#592916', tagBg: '#823f24', tagText: '#ffffff' },
      { id: 'color-7', name: 'Crisp Orchard', bg: '#fbf0e8', border: '#e0b89f', text: '#5c3319', tagBg: '#854b25', tagText: '#ffffff' },
      { id: 'color-8', name: 'Warm Birch', bg: '#f5f0e9', border: '#ccbfae', text: '#423b32', tagBg: '#61574a', tagText: '#ffffff' },
    ],
  },
  {
    key: 'pumpkin-spice',
    name: 'Pumpkin Spice',
    description: 'Cozy rainy day: roasted cinnamon, pumpkin puree, nutmeg, and warm steamed foam.',
    isDark: false,
    sampleBg: '#fcf6ed',
    sampleAccent: '#ad521b',
    coursePalette: [
      { id: 'color-1', name: 'Spiced Pumpkin', bg: '#faede1', border: '#e4b68e', text: '#632e0a', tagBg: '#94440f', tagText: '#ffffff' },
      { id: 'color-2', name: 'Ground Cinnamon', bg: '#f7ebe6', border: '#d8ab9a', text: '#592617', tagBg: '#853721', tagText: '#ffffff' },
      { id: 'color-3', name: 'Nutmeg Foam', bg: '#fbf4e6', border: '#dfc693', text: '#543f11', tagBg: '#785b18', tagText: '#ffffff' },
      { id: 'color-4', name: 'Clove Bud', bg: '#f5ebe9', border: '#cca89f', text: '#4d2621', tagBg: '#733b33', tagText: '#ffffff' },
      { id: 'color-5', name: 'Warm Vanilla', bg: '#fdf7eb', border: '#e8d5a6', text: '#544618', tagBg: '#7a6624', tagText: '#ffffff' },
      { id: 'color-6', name: 'Toasted Hazel', bg: '#f6eee7', border: '#ceb49f', text: '#4a3222', tagBg: '#6e4c34', tagText: '#ffffff' },
      { id: 'color-7', name: 'Ginger Snap', bg: '#faefe3', border: '#ddbe94', text: '#5a3810', tagBg: '#855319', tagText: '#ffffff' },
      { id: 'color-8', name: 'Brown Butter', bg: '#f8f1e6', border: '#d4c0a5', text: '#473a27', tagBg: '#6b583c', tagText: '#ffffff' },
    ],
  },
  {
    key: 'true-valentine',
    name: 'True Valentine',
    description: 'Lovecore blush: sweet petal pink, dusty crimson, and soft romantic tones.',
    isDark: false,
    sampleBg: '#fdf5f6',
    sampleAccent: '#b32d4b',
    coursePalette: [
      { id: 'color-1', name: 'Rose Petal', bg: '#fcecf0', border: '#ebb2c1', text: '#69152b', tagBg: '#9e1f40', tagText: '#ffffff' },
      { id: 'color-2', name: 'Sweet Raspberry', bg: '#fdeaf1', border: '#eeadc5', text: '#6e1939', tagBg: '#992451', tagText: '#ffffff' },
      { id: 'color-3', name: 'Blush Velvet', bg: '#faf0f4', border: '#debbcd', text: '#542640', tagBg: '#7d385f', tagText: '#ffffff' },
      { id: 'color-4', name: 'Strawberry Cream', bg: '#fdf0ee', border: '#f0c0b8', text: '#69251a', tagBg: '#9c3827', tagText: '#ffffff' },
      { id: 'color-5', name: 'Soft Carnation', bg: '#fbeef4', border: '#e9b5cf', text: '#611b43', tagBg: '#8c2861', tagText: '#ffffff' },
      { id: 'color-6', name: 'Candied Plum', bg: '#f8ecf7', border: '#dbb0d8', text: '#52214e', tagBg: '#783172', tagText: '#ffffff' },
      { id: 'color-7', name: 'Peach Satin', bg: '#fef1ec', border: '#f3c4b5', text: '#6e2f1f', tagBg: '#9c442e', tagText: '#ffffff' },
      { id: 'color-8', name: 'Warm Truffle', bg: '#f7eee9', border: '#cfb5a7', text: '#473024', tagBg: '#6b4837', tagText: '#ffffff' },
    ],
  },
  {
    key: 'roseglow',
    name: 'Roseglow',
    description: 'Luminous morning daylight with dusty mauve, tea rose, and soft dawn warmth.',
    isDark: false,
    sampleBg: '#fcf6f7',
    sampleAccent: '#944458',
    coursePalette: [
      { id: 'color-1', name: 'Tea Rose', bg: '#fcedf0', border: '#e8b8c2', text: '#612130', tagBg: '#8a2f44', tagText: '#ffffff' },
      { id: 'color-2', name: 'Dusty Mauve', bg: '#f7eef3', border: '#d5b9ca', text: '#542d45', tagBg: '#784062', tagText: '#ffffff' },
      { id: 'color-3', name: 'Dawn Mist', bg: '#fdf1ec', border: '#ecc1b1', text: '#612f1e', tagBg: '#8f462c', tagText: '#ffffff' },
      { id: 'color-4', name: 'Warm Quartz', bg: '#faeff1', border: '#e0bac2', text: '#572b35', tagBg: '#7a3e4c', tagText: '#ffffff' },
      { id: 'color-5', name: 'Dried Peony', bg: '#f8ecf0', border: '#dbb0bd', text: '#5c2333', tagBg: '#853249', tagText: '#ffffff' },
      { id: 'color-6', name: 'Golden Glow', bg: '#fdf5e8', border: '#ecc991', text: '#5e400f', tagBg: '#8a5e17', tagText: '#ffffff' },
      { id: 'color-7', name: 'Sage Blossom', bg: '#f0f5f1', border: '#b5ceb8', text: '#2a442e', tagBg: '#416646', tagText: '#ffffff' },
      { id: 'color-8', name: 'Rosewood Gray', bg: '#f6f1f2', border: '#cbbdc1', text: '#44373a', tagBg: '#665357', tagText: '#ffffff' },
    ],
  },
  {
    key: 'sage',
    name: 'Sage',
    description: 'Quiet botanical herbal tones: dried eucalyptus, lichen, and smooth river stone.',
    isDark: false,
    sampleBg: '#f7f9f6',
    sampleAccent: '#3b6b4d',
    coursePalette: [
      { id: 'color-1', name: 'Dried Eucalyptus', bg: '#eef5ee', border: '#a6cba9', text: '#1e4724', tagBg: '#326639', tagText: '#ffffff' },
      { id: 'color-2', name: 'Matcha Foam', bg: '#f1f6ec', border: '#bad2a7', text: '#2e491c', tagBg: '#4a6e30', tagText: '#ffffff' },
      { id: 'color-3', name: 'Lichen Gray', bg: '#edf4f1', border: '#acc6bd', text: '#214238', tagBg: '#365f52', tagText: '#ffffff' },
      { id: 'color-4', name: 'River Reed', bg: '#f6f7eb', border: '#cbd49a', text: '#3c4515', tagBg: '#59661f', tagText: '#ffffff' },
      { id: 'color-5', name: 'Fern Shade', bg: '#e9f3eb', border: '#99c49f', text: '#194220', tagBg: '#275c31', tagText: '#ffffff' },
      { id: 'color-6', name: 'Pale Olive', bg: '#f4f6e9', border: '#c3cca1', text: '#394217', tagBg: '#546123', tagText: '#ffffff' },
      { id: 'color-7', name: 'Morning Dew', bg: '#ebf4f5', border: '#a4cace', text: '#1b3f44', tagBg: '#2c5d64', tagText: '#ffffff' },
      { id: 'color-8', name: 'Slate Moss', bg: '#edf1ee', border: '#b2beb5', text: '#344037', tagBg: '#4f5c53', tagText: '#ffffff' },
    ],
  },
  {
    key: 'mist',
    name: 'Mist',
    description: 'Minimalist morning fog: cool architectural slate, pale denim, and stone surfaces.',
    isDark: false,
    sampleBg: '#f6f8fa',
    sampleAccent: '#416788',
    coursePalette: [
      { id: 'color-1', name: 'Faded Denim', bg: '#edf3f8', border: '#acc7de', text: '#1f3e5c', tagBg: '#345e85', tagText: '#ffffff' },
      { id: 'color-2', name: 'Morning Harbor', bg: '#eaf4f6', border: '#a3ced6', text: '#1b444d', tagBg: '#2b626e', tagText: '#ffffff' },
      { id: 'color-3', name: 'Glacier Blue', bg: '#eef5fc', border: '#afcff2', text: '#1b3f69', tagBg: '#2d5c94', tagText: '#ffffff' },
      { id: 'color-4', name: 'Storm Cloud', bg: '#edf0f5', border: '#b3bdd0', text: '#29354e', tagBg: '#43516f', tagText: '#ffffff' },
      { id: 'color-5', name: 'Pale Iris', bg: '#f2f1fa', border: '#c2bee4', text: '#342f61', tagBg: '#4f478a', tagText: '#ffffff' },
      { id: 'color-6', name: 'Cool Mint', bg: '#eef7f4', border: '#addcd0', text: '#1a4e41', tagBg: '#2d7160', tagText: '#ffffff' },
      { id: 'color-7', name: 'Silver Sky', bg: '#f1f4f6', border: '#bdc7cf', text: '#2e3b44', tagBg: '#495a66', tagText: '#ffffff' },
      { id: 'color-8', name: 'Cobblestone', bg: '#eeeff2', border: '#b8bcc4', text: '#323740', tagBg: '#4f545e', tagText: '#ffffff' },
    ],
  },
  {
    key: 'sepia-light',
    name: 'Sepia Light',
    description: 'Sun-faded vintage book pages: warm walnut ink, antique vellum, and aged cotton paper.',
    isDark: false,
    sampleBg: '#f7f2e8',
    sampleAccent: '#7a5a3a',
    coursePalette: [
      { id: 'color-1', name: 'Walnut Ink', bg: '#f4ede1', border: '#ceb696', text: '#4e3319', tagBg: '#704c27', tagText: '#ffffff' },
      { id: 'color-2', name: 'Antique Vellum', bg: '#f9f3e4', border: '#dec99d', text: '#4d3914', tagBg: '#735722', tagText: '#ffffff' },
      { id: 'color-3', name: 'Burnt Ochre', bg: '#f7eee3', border: '#d5b593', text: '#543415', tagBg: '#7d4d22', tagText: '#ffffff' },
      { id: 'color-4', name: 'Sun-Bleached Page', bg: '#fbf7ed', border: '#e0d3af', text: '#4d421e', tagBg: '#736331', tagText: '#ffffff' },
      { id: 'color-5', name: 'Old Rose Ink', bg: '#f6eceb', border: '#d2aba7', text: '#522926', tagBg: '#783e3a', tagText: '#ffffff' },
      { id: 'color-6', name: 'Vintage Spruce', bg: '#edf3ed', border: '#adc4ae', text: '#233d25', tagBg: '#3a5c3d', tagText: '#ffffff' },
      { id: 'color-7', name: 'Warm Tin', bg: '#f2eee6', border: '#c4baa8', text: '#3d362a', tagBg: '#5e5443', tagText: '#ffffff' },
      { id: 'color-8', name: 'Faded Umber', bg: '#f4ece5', border: '#ccb29f', text: '#4a3324', tagBg: '#6e4f39', tagText: '#ffffff' },
    ],
  },
];

interface ThemeContextType {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  themes: ThemeOption[];
  currentTheme: ThemeOption;
  getSubjectColor: (colorKey?: string | null, index?: number) => CourseColorStyle;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('ssp_theme') as ThemeKey;
    if (saved && THEMES.some(t => t.key === saved)) {
      return saved;
    }
    return 'leatherbound'; // Leatherbound dark default
  });

  const currentTheme = THEMES.find(t => t.key === theme) || THEMES[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (currentTheme.isDark) {
      document.documentElement.setAttribute('data-mode', 'dark');
    } else {
      document.documentElement.removeAttribute('data-mode');
    }
    localStorage.setItem('ssp_theme', theme);
  }, [theme, currentTheme]);

  const setTheme = (newTheme: ThemeKey) => {
    setThemeState(newTheme);
  };

  /**
   * CRITICAL REQUIREMENT:
   * Course block colors are derived directly from the currently active theme!
   * When theme changes, course colors automatically transform into the active theme's palette!
   */
  const getSubjectColor = (colorKey?: string | null, index: number = 0): CourseColorStyle => {
    // If user provided a custom hex color (e.g. #3b82f6)
    if (colorKey && colorKey.startsWith('#')) {
      // Calculate perceptual luminance to pick optimal high-contrast text color
      const hex = colorKey.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const isLightColor = luminance > 0.55;

      return {
        id: colorKey,
        name: 'Custom',
        bg: colorKey,
        border: isLightColor ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
        text: isLightColor ? '#111827' : '#ffffff',
        tagBg: isLightColor ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.22)',
        tagText: isLightColor ? '#111827' : '#ffffff',
      };
    }

    const palette = currentTheme.coursePalette;
    if (colorKey) {
      const match = palette.find(c => c.id === colorKey);
      if (match) return match;
    }
    return palette[index % palette.length];
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, currentTheme, getSubjectColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
