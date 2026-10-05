import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const { tokens } = useTheme();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit() {
    if (!text.trim()) return;
    setSent(true);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40"
        style={{ background: "#00000066" }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 12 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="absolute z-50 flex flex-col gap-3 p-4 rounded-2xl"
        style={{
          bottom: 60,
          left: 16,
          right: 16,
          background: tokens.tooltipBg,
          border: `1px solid ${tokens.tooltipBorder}`,
          boxShadow: tokens.tooltipShadow,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: tokens.titleColor }}>
                Feedback
              </p>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us what you think…"
                rows={3}
                className="w-full resize-none rounded-xl px-3 py-2 outline-none transition-colors"
                style={{
                  background: tokens.inputBg,
                  border: `1px solid ${tokens.inputBorder}`,
                  color: tokens.inputText,
                  fontSize: 11,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.5,
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg transition-opacity hover:opacity-60"
                  style={{
                    fontSize: 11,
                    color: tokens.iconColor,
                    background: tokens.iconBg,
                    border: `1px solid ${tokens.iconBorder}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
                  style={{
                    fontSize: 11,
                    color: "#fff",
                    background: "linear-gradient(135deg, #ff0000, #cc0000)",
                    border: "none",
                    cursor: text.trim() ? "pointer" : "default",
                  }}
                >
                  <Send size={11} />
                  Send
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 py-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.05 }}
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 44,
                  height: 44,
                  background: "#ff000018",
                  border: "1px solid #ff000033",
                }}
              >
                <Trash2 size={20} color="#ff4444" />
              </motion.div>
              <p style={{ fontSize: 12, color: tokens.titleColor, fontWeight: 600, textAlign: "center" }}>
                Sent successfully....
              </p>
              <p style={{ fontSize: 11, color: tokens.hintText, textAlign: "center", lineHeight: 1.5 }}>
                into trash bin{" "}
                <span style={{ color: tokens.subtitleColor }}>(coz we don&apos;t care).</span>
              </p>
              <button
                onClick={onClose}
                className="mt-1 px-4 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                style={{
                  fontSize: 11,
                  color: tokens.iconColor,
                  background: tokens.iconBg,
                  border: `1px solid ${tokens.iconBorder}`,
                }}
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

interface FooterBarProps {
  autoApply: boolean;
  onAutoApplyToggle: () => void;
}

export function FooterBar({ autoApply, onAutoApplyToggle }: FooterBarProps) {
  const { tokens } = useTheme();
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-xl"
        style={{
          background: tokens.footerCardBg,
          border: `1px solid ${tokens.footerCardBorder}`,
        }}
      >
        <div className="flex items-center gap-2">
          <button
            role="switch"
            aria-checked={autoApply}
            onClick={onAutoApplyToggle}
            className="relative shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
            style={{
              width: 32,
              height: 18,
              background: autoApply ? "#ff0000cc" : tokens.switchOffBg,
              border: autoApply ? "1px solid #ff000080" : `1px solid ${tokens.switchOffBorder}`,
              boxShadow: autoApply ? "0 0 8px #ff000033" : "none",
            }}
          >
            <motion.span
              className="absolute rounded-full bg-white"
              style={{ width: 12, height: 12, top: 2 }}
              animate={{ left: autoApply ? 16 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
          </button>
          <span style={{ fontSize: 11, color: tokens.autoApplyText, fontFamily: "'Inter', sans-serif" }}>
            Auto-apply on YouTube open
          </span>
        </div>

        <button
          onClick={() => setShowFeedback(true)}
          className="transition-opacity hover:opacity-60"
          style={{ fontSize: 11, color: tokens.footerLinkColor, fontFamily: "'Inter', sans-serif" }}
        >
          Feedback
        </button>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
