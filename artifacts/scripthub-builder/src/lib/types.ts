export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).substring(2, 15);
};

export type ElementType = 'button' | 'toggle' | 'slider' | 'section' | 'notification';

export interface BaseElement {
  id: string;
  type: ElementType;
  label: string;
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  code: string;
  notify?: { title: string; message: string; duration: number };
}

export interface ToggleElement extends BaseElement {
  type: 'toggle';
  defaultState: boolean;
  codeOn: string;
  codeOff: string;
}

export interface SliderElement extends BaseElement {
  type: 'slider';
  min: number;
  max: number;
  defaultValue: number;
  code: string;
}

export interface SectionElement extends BaseElement {
  type: 'section';
}

export interface NotificationElement extends BaseElement {
  type: 'notification';
  title: string;
  message: string;
  duration: number;
  notifType: 'info' | 'success' | 'warning' | 'error';
  trigger: 'tab-load' | 'hub-load';
}

export type UIElement = ButtonElement | ToggleElement | SliderElement | SectionElement | NotificationElement;

export interface Tab {
  id: string;
  name: string;
  elements: UIElement[];
}

export interface HubTheme {
  preset: string;
  accent: string;
  bg: string;
  bgAlt: string;
  borderRadius?: number;
  opacity?: number;
  titleColor?: string;
  font?: string;
  width?: number;
  height?: number;
}

export interface HubConfig {
  name: string;
  theme: HubTheme;
  tabs: Tab[];
  activeTabId: string | null;
}

export const THEME_PRESETS: HubTheme[] = [
  { preset: 'neon-purple', accent: '#a855f7', bg: '#1a1a24', bgAlt: '#2d2d3b' },
  { preset: 'cyber-cyan', accent: '#06b6d4', bg: '#0d1a1f', bgAlt: '#1a2d35' },
  { preset: 'blood-red', accent: '#ef4444', bg: '#1f1414', bgAlt: '#2d2020' },
  { preset: 'matrix-green', accent: '#22c55e', bg: '#0d1a0f', bgAlt: '#1a2d1c' },
  { preset: 'electric-blue', accent: '#3b82f6', bg: '#0d1220', bgAlt: '#1a2035' },
  { preset: 'gold-rush', accent: '#f59e0b', bg: '#1a1708', bgAlt: '#2d2a10' },
];

export const ROBLOX_FONTS = [
  'GothamBold', 'GothamSemibold', 'Gotham', 'GothamLight',
  'Arial', 'ArialBold', 'Code', 'Arcade', 'Fantasy', 'Antique',
];
