import React from "react";

export const FONTS = {
  mono: "'JetBrains Mono','IBM Plex Mono',ui-monospace,Menlo,monospace",
  display: "'Inter','Helvetica Neue',system-ui,sans-serif",
};

export const THEMES = {
  dark: {
    name: "dark",
    bg: "#0a0a0a",
    surface: "rgba(255,255,255,0.025)",
    surface2: "rgba(255,255,255,0.045)",
    surface3: "rgba(255,255,255,0.07)",
    border: "rgba(255,255,255,0.08)",
    border2: "rgba(255,255,255,0.14)",
    text: "#ffffff",
    text2: "rgba(255,255,255,0.78)",
    muted: "rgba(255,255,255,0.5)",
    muted2: "rgba(255,255,255,0.32)",
    accent: "#00FF87",
    accent2: "#1aff97",
    red: "#ff4d5e",
    yellow: "#ffcc4d",
    ...FONTS,
  },
  light: {
    name: "light",
    bg: "#f5f6f6",
    surface: "rgba(0,0,0,0.025)",
    surface2: "rgba(0,0,0,0.05)",
    surface3: "rgba(0,0,0,0.08)",
    border: "rgba(0,0,0,0.1)",
    border2: "rgba(0,0,0,0.16)",
    text: "#0a0a0a",
    text2: "rgba(0,0,0,0.72)",
    muted: "rgba(0,0,0,0.5)",
    muted2: "rgba(0,0,0,0.35)",
    accent: "#00c46a",
    accent2: "#00b35f",
    red: "#e23d4d",
    yellow: "#d99a00",
    ...FONTS,
  },
};

export const ThemeContext = React.createContext(THEMES.dark);
export const useTheme = () => React.useContext(ThemeContext);

export const DatePickerContext = React.createContext(null);
export const useDatePicker = () => React.useContext(DatePickerContext);

export const TimePickerContext = React.createContext(null);
export const useTimePicker = () => React.useContext(TimePickerContext);

export const LOGO = "data:image/jpeg;base64,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";

export const LANDING_URL = "https://athlos-sync-flow.lovable.app";
