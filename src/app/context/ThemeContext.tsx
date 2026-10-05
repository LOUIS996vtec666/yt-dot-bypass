import { createContext, useContext } from "react";

export type ThemeMode = "dark" | "light";

export interface ThemeTokens {
  pageBackground: string;
  popupBg: string;
  popupBorder: string;
  popupShadow: string;
  topGlow: string;
  headerBorder: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  titleColor: string;
  subtitleColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipShadow: string;
  tooltipText: string;
  cardBg: string;
  cardBorder: string;
  sectionLabelColor: string;
  dividerColor: string;
  footerBorder: string;
  footerCardBg: string;
  footerCardBorder: string;
  footerLinkColor: string;
  autoApplyText: string;
  switchOffBg: string;
  switchOffBorder: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  outputPlaceholder: string;
  outputNormalBg: string;
  outputNormalBorder: string;
  openTabBg: string;
  openTabBorder: string;
  openTabColor: string;
  arrowColorInactive: string;
  hintText: string;
  urlTextColor: string;
}

export const darkTokens: ThemeTokens = {
  pageBackground: "#0a0a0a",
  popupBg: "linear-gradient(160deg, #121212 0%, #0d0d0d 100%)",
  popupBorder: "#ffffff0f",
  popupShadow: "0 32px 80px #000000cc, 0 0 0 1px #ffffff0f",
  topGlow: "linear-gradient(90deg, transparent, #ff000080, transparent)",
  headerBorder: "#ffffff0f",
  iconBg: "#ffffff0d",
  iconBorder: "#ffffff14",
  iconColor: "#666",
  titleColor: "#f1f1f1",
  subtitleColor: "#555",
  tooltipBg: "#141414f7",
  tooltipBorder: "#ffffff1f",
  tooltipShadow: "0 12px 40px #00000099",
  tooltipText: "#bbb",
  cardBg: "#ffffff08",
  cardBorder: "#ffffff0f",
  sectionLabelColor: "#555",
  dividerColor: "#ffffff0d",
  footerBorder: "#ffffff0f",
  footerCardBg: "#ffffff08",
  footerCardBorder: "#ffffff0f",
  footerLinkColor: "#555",
  autoApplyText: "#888",
  switchOffBg: "#ffffff1f",
  switchOffBorder: "#ffffff26",
  inputBg: "#ffffff0d",
  inputBorder: "#ffffff1a",
  inputText: "#ddd",
  outputPlaceholder: "#555",
  outputNormalBg: "#ffffff08",
  outputNormalBorder: "#ffffff0f",
  openTabBg: "#ffffff0f",
  openTabBorder: "#ffffff1a",
  openTabColor: "#aaa",
  arrowColorInactive: "#444",
  hintText: "#666",
  urlTextColor: "#aaa",
};

export const lightTokens: ThemeTokens = {
  pageBackground: "#e8e8e8",
  popupBg: "linear-gradient(160deg, #ffffff 0%, #f5f5f5 100%)",
  popupBorder: "#0000001a",
  popupShadow: "0 32px 80px #00000033, 0 0 0 1px #0000001a",
  topGlow: "linear-gradient(90deg, transparent, #ff000060, transparent)",
  headerBorder: "#0000001a",
  iconBg: "#0000000d",
  iconBorder: "#00000018",
  iconColor: "#999",
  titleColor: "#111111",
  subtitleColor: "#aaa",
  tooltipBg: "#fffffff5",
  tooltipBorder: "#0000001f",
  tooltipShadow: "0 12px 40px #00000022",
  tooltipText: "#555",
  cardBg: "#00000008",
  cardBorder: "#0000001a",
  sectionLabelColor: "#aaa",
  dividerColor: "#0000000d",
  footerBorder: "#0000001a",
  footerCardBg: "#00000008",
  footerCardBorder: "#0000001a",
  footerLinkColor: "#aaa",
  autoApplyText: "#777",
  switchOffBg: "#00000018",
  switchOffBorder: "#0000001f",
  inputBg: "#0000000d",
  inputBorder: "#0000001a",
  inputText: "#333",
  outputPlaceholder: "#aaa",
  outputNormalBg: "#00000008",
  outputNormalBorder: "#0000001a",
  openTabBg: "#00000010",
  openTabBorder: "#0000001a",
  openTabColor: "#777",
  arrowColorInactive: "#ccc",
  hintText: "#aaa",
  urlTextColor: "#666",
};

interface ThemeContextValue {
  mode: ThemeMode;
  tokens: ThemeTokens;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  tokens: darkTokens,
  setMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}
