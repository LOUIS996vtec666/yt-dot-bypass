// All persistence lives in this file. To move to a real database later,
// replace the bodies of loadAppData / saveAppData and keep the signatures.
import type { HistoryItem } from "./components/HistoryPanel";
import type { ThemeMode } from "./context/ThemeContext";

const STORAGE_KEY = "yt-dot-bypass:v1";
const MAX_HISTORY = 50;

export interface AppData {
  history: HistoryItem[];
  logoId: string;
  themeMode: ThemeMode;
  autoApply: boolean;
}

export const DEFAULT_APP_DATA: AppData = {
  history: [],
  logoId: "default",
  themeMode: "dark",
  autoApply: true,
};

function parseHistory(raw: unknown): HistoryItem[] {
  if (!Array.isArray(raw)) return [];
  const items: HistoryItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const { id, original, formatted, timestamp } = entry as Record<string, unknown>;
    if (typeof id !== "string" || typeof original !== "string" || typeof formatted !== "string") continue;
    if (typeof timestamp !== "string" && typeof timestamp !== "number") continue;
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) continue;
    items.push({ id, original, formatted, timestamp: date });
  }
  return items.slice(0, MAX_HISTORY);
}

export function loadAppData(): AppData {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return DEFAULT_APP_DATA;
    const raw = JSON.parse(text);
    if (!raw || typeof raw !== "object") return DEFAULT_APP_DATA;
    return {
      history: parseHistory(raw.history),
      logoId: typeof raw.logoId === "string" ? raw.logoId : DEFAULT_APP_DATA.logoId,
      themeMode: raw.themeMode === "light" || raw.themeMode === "dark" ? raw.themeMode : DEFAULT_APP_DATA.themeMode,
      autoApply: typeof raw.autoApply === "boolean" ? raw.autoApply : DEFAULT_APP_DATA.autoApply,
    };
  } catch {
    return DEFAULT_APP_DATA;
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable: keep running without persistence.
  }
}
