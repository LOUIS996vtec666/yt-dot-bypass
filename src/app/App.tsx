import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Info, Clock } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { UrlFormatter } from "./components/UrlFormatter";
import { FooterBar } from "./components/FooterBar";
import { SettingsPanel } from "./components/SettingsPanel";
import { HistoryPanel, type HistoryItem } from "./components/HistoryPanel";
import { LogoPicker, DEFAULT_LOGO } from "./components/LogoPicker";
import { ThemeContext, darkTokens, lightTokens, type ThemeMode } from "./context/ThemeContext";

export default function App() {
  const [autoApply, setAutoApply] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logoSrc, setLogoSrc] = useState<string>(DEFAULT_LOGO);
  const [showLogoPicker, setShowLogoPicker] = useState(false);

  const tokens = themeMode === "dark" ? darkTokens : lightTokens;

  function handleSaveToHistory(original: string, formatted: string) {
    setHistory((prev) => {
      if (prev[0]?.formatted === formatted) return prev;
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        original,
        formatted,
        timestamp: new Date(),
      };
      return [item, ...prev].slice(0, 50);
    });
  }

  function closeOverlays() {
    setShowSettings(false);
    setShowTooltip(false);
  }

  return (
    <ThemeContext.Provider value={{ mode: themeMode, tokens, setMode: setThemeMode }}>
      <div
        className="size-full flex items-center justify-center"
        style={{ background: tokens.pageBackground, fontFamily: "'Inter', sans-serif" }}
      >
        {/* Chrome extension popup frame */}
        <div
          className="relative flex flex-col overflow-hidden"
          style={{
            width: 360,
            height: 480,
            background: tokens.popupBg,
            borderRadius: 16,
            boxShadow: tokens.popupShadow,
            border: `1px solid ${tokens.popupBorder}`,
          }}
        >
          {/* Subtle top-edge glow */}
          <div
            className="absolute top-0 left-1/2 pointer-events-none"
            style={{
              transform: "translateX(-50%)",
              width: 180,
              height: 1,
              background: tokens.topGlow,
            }}
          />

          {/* ── HEADER ── */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ borderBottom: `1px solid ${tokens.headerBorder}` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 28,
                  height: 28,
                  background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
                  boxShadow: "0 2px 12px #ff000066",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polygon points="10,8 16,12 10,16" fill="white" />
                  <circle cx="18" cy="8" r="3" fill="white" opacity="0.9"/>
                  <text x="16" y="11" style={{ fontSize: 5, fill: "#cc0000", fontWeight: 700 }}>·</text>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: tokens.titleColor, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                  YT Dot-Bypass
                </p>
                <p style={{ fontSize: 9, color: tokens.subtitleColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
                  v1.0.0
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Info tooltip */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    width: 28,
                    height: 28,
                    background: tokens.iconBg,
                    border: `1px solid ${tokens.iconBorder}`,
                    color: tokens.iconColor,
                  }}
                  aria-label="How it works"
                >
                  <Info size={13} />
                </button>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 z-50 p-3 rounded-xl"
                    style={{
                      top: 34,
                      width: 200,
                      background: tokens.tooltipBg,
                      border: `1px solid ${tokens.tooltipBorder}`,
                      boxShadow: tokens.tooltipShadow,
                    }}
                  >
                    <p style={{ fontSize: 11, color: tokens.tooltipText, lineHeight: 1.5 }}>
                      Adds a <span style={{ color: "#ff4444", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>.</span> after{" "}
                      <span style={{ color: "#ff4444", fontFamily: "'JetBrains Mono', monospace" }}>.com</span> to load the video
                      via the DNS root domain, skipping ad injection.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* History button */}
              <div className="relative">
                <button
                  onClick={() => { setShowHistory((v) => !v); closeOverlays(); }}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    width: 28,
                    height: 28,
                    background: showHistory ? "#ff000020" : tokens.iconBg,
                    border: showHistory ? "1px solid #ff000040" : `1px solid ${tokens.iconBorder}`,
                    color: showHistory ? "#ff4444" : tokens.iconColor,
                  }}
                  aria-label="History"
                  aria-expanded={showHistory}
                >
                  <Clock size={13} />
                </button>
                {history.length > 0 && !showHistory && (
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center rounded-full"
                    style={{
                      width: 14,
                      height: 14,
                      background: "#ff0000",
                      fontSize: 8,
                      color: "#fff",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                    }}
                  >
                    {history.length > 9 ? "9+" : history.length}
                  </span>
                )}
              </div>

              {/* Settings button */}
              <div className="relative">
                <button
                  onClick={() => { setShowSettings((v) => !v); setShowTooltip(false); setShowHistory(false); }}
                  className="flex items-center justify-center rounded-lg transition-colors"
                  style={{
                    width: 28,
                    height: 28,
                    background: showSettings ? "#ff000020" : tokens.iconBg,
                    border: showSettings ? "1px solid #ff000040" : `1px solid ${tokens.iconBorder}`,
                    color: showSettings ? "#ff4444" : tokens.iconColor,
                  }}
                  aria-label="Settings"
                  aria-expanded={showSettings}
                >
                  <motion.span
                    animate={{ rotate: showSettings ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ display: "flex" }}
                  >
                    <Settings size={13} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showSettings && (
                    <SettingsPanel onClose={() => setShowSettings(false)} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="relative flex-1 overflow-hidden">
            <div
              className="absolute inset-0 overflow-y-auto flex flex-col gap-3 px-4 py-4"
              style={{ scrollbarWidth: "none" }}
              onClick={() => closeOverlays()}
            >
              {/* Brand logo — click to change */}
              <button
                onClick={() => setShowLogoPicker(true)}
                className="group relative flex flex-col items-center justify-center py-5 rounded-2xl w-full transition-all"
                style={{
                  background: tokens.cardBg,
                  border: `1px solid ${tokens.cardBorder}`,
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                }}
                aria-label="Change logo"
              >
                <ImageWithFallback
                  src={logoSrc}
                  alt="YT Dot-Bypass logo"
                  style={{ width: 180, height: 180, objectFit: "contain" }}
                />
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "#00000055" }}
                >
                  <span
                    className="px-3 py-1.5 rounded-lg"
                    style={{
                      fontSize: 11,
                      color: "#fff",
                      background: "#ff000099",
                      border: "1px solid #ff000080",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    更換圖示
                  </span>
                </div>
              </button>

              {/* URL Formatter section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1">
                  <span
                    className="uppercase tracking-widest"
                    style={{ fontSize: 9, color: tokens.sectionLabelColor, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    URL Formatter
                  </span>
                  <div className="flex-1 h-px" style={{ background: tokens.dividerColor }} />
                </div>
                <UrlFormatter onSave={handleSaveToHistory} />
              </div>
            </div>

            {/* History panel */}
            <AnimatePresence>
              {showHistory && (
                <HistoryPanel
                  items={history}
                  onClear={() => setHistory([])}
                  onClose={() => setShowHistory(false)}
                />
              )}
            </AnimatePresence>

            {/* Logo picker */}
            <AnimatePresence>
              {showLogoPicker && (
                <LogoPicker
                  current={logoSrc}
                  onChange={setLogoSrc}
                  onClose={() => setShowLogoPicker(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ── FOOTER ── */}
          <div
            className="px-4 py-3 shrink-0"
            style={{ borderTop: `1px solid ${tokens.footerBorder}` }}
          >
            <FooterBar autoApply={autoApply} onAutoApplyToggle={() => setAutoApply((v) => !v)} />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
