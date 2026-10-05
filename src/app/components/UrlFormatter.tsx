import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function formatUrl(url: string): string {
  return url.replace(/\.com(?!\.)(?=\/|$|\?|#)/, ".com.");
}

function hasDotInserted(original: string, formatted: string): boolean {
  return original !== formatted;
}

function renderFormattedUrl(formatted: string, original: string, urlTextColor: string) {
  if (!hasDotInserted(original, formatted))
    return <span style={{ color: urlTextColor }}>{formatted || "Formatted URL will appear here"}</span>;

  const comDotIdx = formatted.indexOf(".com.");
  if (comDotIdx === -1) return <span style={{ color: urlTextColor }}>{formatted}</span>;

  const dotPos = comDotIdx + 4;
  const before = formatted.slice(0, dotPos);
  const after = formatted.slice(dotPos + 1);

  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
      <span style={{ color: urlTextColor }}>{before}</span>
      <span
        style={{
          color: "#ff4444",
          fontWeight: 700,
          background: "#ff444426",
          borderRadius: 3,
          padding: "0 2px",
        }}
      >
        .
      </span>
      <span style={{ color: urlTextColor }}>{after}</span>
    </span>
  );
}

interface UrlFormatterProps {
  onSave?: (original: string, formatted: string) => void;
  /** Pre-fills the input (used by Storybook to show states without typing). */
  initialValue?: string;
}

export function UrlFormatter({ onSave, initialValue = "" }: UrlFormatterProps) {
  const { tokens } = useTheme();
  const [input, setInput] = useState(initialValue);
  const [copied, setCopied] = useState(false);

  const formatted = formatUrl(input);
  const isModified = hasDotInserted(input, formatted) && input.length > 0;

  function handleCopy() {
    if (!isModified) return;
    try {
      const ta = document.createElement("textarea");
      ta.value = formatted;
      ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      onSave?.(input, formatted);
    } catch {
      // silent fail
    }
  }

  function handleOpenTab() {
    if (!isModified) return;
    window.open(formatted, "_blank", "noopener,noreferrer");
    onSave?.(input, formatted);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Input */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: tokens.inputBg, border: `1px solid ${tokens.inputBorder}` }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={tokens.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={tokens.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste YouTube URL…"
          className="flex-1 bg-transparent outline-none"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: tokens.inputText,
          }}
        />
        {input && (
          <button
            onClick={() => setInput("")}
            style={{ color: tokens.iconColor }}
            className="transition-opacity hover:opacity-60"
            aria-label="Clear"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <motion.div
          animate={isModified ? { y: [0, 3, 0] } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke={isModified ? "#ff4444" : tokens.arrowColorInactive}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Output */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{
          background: isModified ? "#ff44440f" : tokens.outputNormalBg,
          border: isModified ? "1px solid #ff444440" : `1px solid ${tokens.outputNormalBorder}`,
          transition: "all 0.2s ease",
        }}
      >
        <div className="flex-1 min-w-0 overflow-hidden" style={{ lineHeight: 1.4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={formatted}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {input
                ? renderFormattedUrl(formatted, input, tokens.urlTextColor)
                : <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: tokens.outputPlaceholder }}>Formatted URL will appear here</span>
              }
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            disabled={!isModified}
            aria-label="Copy formatted URL"
            className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-150 disabled:opacity-30"
            style={{
              background: copied ? "#22c55e26" : "#ff44441f",
              border: copied ? "1px solid #22c55e4d" : "1px solid #ff444440",
              color: copied ? "#4ade80" : "#ff6666",
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: isModified ? "pointer" : "default",
            }}
          >
            <AnimatePresence mode="wait">
              {copied
                ? <motion.span key="check" initial={{ scale: 0.7 }} animate={{ scale: 1 }}><Check size={10} /></motion.span>
                : <motion.span key="copy" initial={{ scale: 0.7 }} animate={{ scale: 1 }}><Copy size={10} /></motion.span>
              }
            </AnimatePresence>
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            onClick={handleOpenTab}
            disabled={!isModified}
            aria-label="Open in new tab"
            className="flex items-center justify-center p-1 rounded-lg transition-all duration-150 disabled:opacity-30"
            style={{
              background: tokens.openTabBg,
              border: `1px solid ${tokens.openTabBorder}`,
              color: tokens.openTabColor,
              cursor: isModified ? "pointer" : "default",
            }}
          >
            <ExternalLink size={10} />
          </button>
        </div>
      </div>

      {isModified && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          style={{ fontSize: 10, color: tokens.hintText, fontFamily: "'JetBrains Mono', monospace" }}
        >
          dot inserted after <span style={{ color: "#ff4444" }}>.com</span> — ads skip DNS lookup
        </motion.p>
      )}
    </div>
  );
}
