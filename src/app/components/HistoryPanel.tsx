import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export interface HistoryItem {
  id: string;
  original: string;
  formatted: string;
  timestamp: Date;
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function FormattedUrl({ url, textColor }: { url: string; textColor: string }) {
  const idx = url.indexOf(".com.");
  if (idx === -1) return <span style={{ color: textColor }}>{url}</span>;
  return (
    <>
      <span style={{ color: textColor }}>{url.slice(0, idx + 4)}</span>
      <span style={{ color: "#ff4444", fontWeight: 700 }}>.</span>
      <span style={{ color: textColor }}>{url.slice(idx + 5)}</span>
    </>
  );
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onClear: () => void;
  onClose: () => void;
}

export function HistoryPanel({ items, onClear, onClose }: HistoryPanelProps) {
  const { tokens } = useTheme();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(item: HistoryItem) {
    try {
      const ta = document.createElement("textarea");
      ta.value = item.formatted;
      ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // silent fail
    }
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 360, damping: 32 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: tokens.popupBg, borderRadius: 16 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${tokens.headerBorder}` }}
      >
        <div className="flex items-center gap-2">
          <Clock size={13} style={{ color: tokens.iconColor }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: tokens.titleColor }}>
            歷史紀錄
          </span>
          {items.length > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full"
              style={{
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
                background: "#ff000020",
                color: "#ff4444",
                border: "1px solid #ff000033",
              }}
            >
              {items.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition-opacity hover:opacity-60"
              style={{
                fontSize: 10,
                color: tokens.iconColor,
                background: tokens.iconBg,
                border: `1px solid ${tokens.iconBorder}`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Trash2 size={10} />
              清除
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-opacity hover:opacity-60"
            style={{
              width: 28,
              height: 28,
              background: tokens.iconBg,
              border: `1px solid ${tokens.iconBorder}`,
              color: tokens.iconColor,
            }}
            aria-label="Close history"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 h-full"
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 48,
                  height: 48,
                  background: tokens.cardBg,
                  border: `1px solid ${tokens.cardBorder}`,
                }}
              >
                <Clock size={20} style={{ color: tokens.sectionLabelColor }} />
              </div>
              <p style={{ fontSize: 12, color: tokens.sectionLabelColor, fontFamily: "'Inter', sans-serif" }}>
                還沒有紀錄
              </p>
              <p style={{ fontSize: 10, color: tokens.hintText, fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
                複製連結後會自動儲存在這裡
              </p>
            </motion.div>
          ) : (
            items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col gap-1.5 p-3 rounded-xl"
                style={{
                  background: tokens.cardBg,
                  border: `1px solid ${tokens.cardBorder}`,
                }}
              >
                {/* Original (struck through) */}
                <p
                  className="truncate"
                  style={{
                    fontSize: 10,
                    color: tokens.sectionLabelColor,
                    fontFamily: "'JetBrains Mono', monospace",
                    textDecoration: "line-through",
                  }}
                >
                  {item.original}
                </p>

                {/* Formatted + copy button */}
                <div className="flex items-center gap-2">
                  <p
                    className="flex-1 truncate"
                    style={{
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <FormattedUrl url={item.formatted} textColor={tokens.urlTextColor} />
                  </p>
                  <button
                    onClick={() => handleCopy(item)}
                    className="shrink-0 flex items-center justify-center rounded-lg transition-all"
                    style={{
                      width: 24,
                      height: 24,
                      background: copiedId === item.id ? "#22c55e1a" : "#ff00001a",
                      border: copiedId === item.id ? "1px solid #22c55e40" : "1px solid #ff000033",
                      color: copiedId === item.id ? "#4ade80" : "#ff4444",
                    }}
                    aria-label="Copy"
                  >
                    {copiedId === item.id ? <Check size={10} /> : <Copy size={10} />}
                  </button>
                </div>

                {/* Timestamp */}
                <p style={{ fontSize: 9, color: tokens.hintText, fontFamily: "'JetBrains Mono', monospace" }}>
                  {timeAgo(item.timestamp)}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
