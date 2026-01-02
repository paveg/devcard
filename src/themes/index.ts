import type { Theme } from '../types';

export const themes: Record<string, Theme> = {
  default: {
    titleColor: '2f80ed',
    textColor: '434d58',
    iconColor: '4c71f2',
    borderColor: 'e4e2e2',
    bgColor: 'fffefe',
  },
  dark: {
    titleColor: 'fff',
    textColor: 'adbac7',
    iconColor: '79c0ff',
    borderColor: '444c56',
    bgColor: '22272e',
  },
  radical: {
    titleColor: 'fe428e',
    textColor: 'a9fef7',
    iconColor: 'f8d847',
    borderColor: 'e4e2e2',
    bgColor: '141321',
  },
  tokyonight: {
    titleColor: '70a5fd',
    textColor: 'a9b1d6',
    iconColor: 'bb9af7',
    borderColor: '2a2e3f',
    bgColor: '1a1b27',
  },
  dracula: {
    titleColor: 'ff79c6',
    textColor: 'f8f8f2',
    iconColor: 'bd93f9',
    borderColor: '6272a4',
    bgColor: '282a36',
  },
  github_dark: {
    titleColor: 'f0f6fc',
    textColor: 'c9d1d9',
    iconColor: '58a6ff',
    borderColor: '30363d',
    bgColor: '0d1117',
  },
  github_light: {
    titleColor: '1f2328',
    textColor: '656d76',
    iconColor: '1a7f37',
    borderColor: 'd1d9e0',
    bgColor: 'ffffff',
  },
  gruvbox: {
    titleColor: 'fabd2f',
    textColor: 'ebdbb2',
    iconColor: 'fe8019',
    borderColor: '504945',
    bgColor: '282828',
  },
  nord: {
    titleColor: '81a1c1',
    textColor: 'd8dee9',
    iconColor: '88c0d0',
    borderColor: '4c566a',
    bgColor: '2e3440',
  },
  catppuccin_mocha: {
    titleColor: 'cba6f7',
    textColor: 'cdd6f4',
    iconColor: 'f5c2e7',
    borderColor: '6c7086',
    bgColor: '1e1e2e',
  },
  catppuccin_latte: {
    titleColor: '8839ef',
    textColor: '4c4f69',
    iconColor: 'ea76cb',
    borderColor: 'bcc0cc',
    bgColor: 'eff1f5',
  },
  onedark: {
    titleColor: 'e4bf7a',
    textColor: 'abb2bf',
    iconColor: '8eb573',
    borderColor: '5c6370',
    bgColor: '282c34',
  },
  cobalt: {
    titleColor: 'e683d9',
    textColor: '75eeb2',
    iconColor: '0480ef',
    borderColor: '75eeb2',
    bgColor: '193549',
  },
  synthwave: {
    titleColor: 'e2e9ec',
    textColor: 'e5289e',
    iconColor: 'ef8539',
    borderColor: 'e2e9ec',
    bgColor: '2b213a',
  },
  transparent: {
    titleColor: '006AFF',
    textColor: '417E87',
    iconColor: '00AEFF',
    borderColor: '0000',
    bgColor: '0000',
  },
  md3_light: {
    titleColor: '6750A4',
    textColor: '1D1B20',
    iconColor: '6750A4',
    borderColor: '79747E',
    bgColor: 'FEF7FF',
  },
  md3_dark: {
    titleColor: 'D0BCFF',
    textColor: 'E6E1E5',
    iconColor: 'D0BCFF',
    borderColor: '938F99',
    bgColor: '141218',
  },
  zinc: {
    titleColor: 'fafafa',
    textColor: 'd4d4d8',
    iconColor: 'fafafa',
    borderColor: '3f3f46',
    bgColor: '18181b',
  },
  slate: {
    titleColor: '1e293b',
    textColor: '475569',
    iconColor: '1e293b',
    borderColor: 'cbd5e1',
    bgColor: 'f8fafc',
  },
};

export const getTheme = (themeName?: string): Theme => {
  if (!themeName) return themes.default;
  return themes[themeName] ?? themes.default;
};
