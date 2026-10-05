import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTheme } from "../context/ThemeContext";
import imgDefault from "../../imports/image-1.png";
import img1 from "../../imports/1.png";
import img2 from "../../imports/2.png";

export const PRESETS: { id: string; src: string; label: string }[] = [
  { id: "default", src: imgDefault, label: "預設" },
  { id: "preset-1", src: img1,      label: "滑板牛" },
  { id: "preset-2", src: img2,      label: "嚴肅貓" },
];

export const DEFAULT_LOGO = PRESETS[0].src;

export function logoSrcFromId(id: string): string {
  return (PRESETS.find((p) => p.id === id) ?? PRESETS[0]).src;
}

export function logoIdFromSrc(src: string): string {
  return (PRESETS.find((p) => p.src === src) ?? PRESETS[0]).id;
}

interface LogoPickerProps {
  current: string;
  onChange: (src: string) => void;
  onClose: () => void;
}

export function LogoPicker({ current, onChange, onClose }: LogoPickerProps) {
  const { tokens } = useTheme();

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40"
        style={{ background: "#00000066" }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="absolute z-50 flex flex-col gap-4 p-4 rounded-2xl"
        style={{
          top: "38%",
          left: 16,
          right: 16,
          transform: "translateY(-50%)",
          background: tokens.tooltipBg,
          border: `1px solid ${tokens.tooltipBorder}`,
          boxShadow: tokens.tooltipShadow,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: tokens.titleColor }}>
              選擇主題圖片
            </p>
            <p style={{ fontSize: 10, color: tokens.hintText, fontFamily: "'JetBrains Mono', monospace" }}>
              點擊套用，右上角打勾為目前使用中
            </p>
          </div>
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
            aria-label="Close"
          >
            <X size={13} />
          </button>
        </div>

        <div style={{ height: 1, background: tokens.dividerColor }} />

        {/* Preset grid */}
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => {
            const isSelected = current === preset.src;
            return (
              <button
                key={preset.id}
                onClick={() => { onChange(preset.src); onClose(); }}
                className="relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all"
                style={{
                  background: isSelected ? "#ff000018" : tokens.cardBg,
                  border: isSelected ? "1.5px solid #ff000050" : `1px solid ${tokens.cardBorder}`,
                  cursor: "pointer",
                }}
              >
                <ImageWithFallback
                  src={preset.src}
                  alt={preset.label}
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }}
                />
                <span style={{ fontSize: 10, color: isSelected ? "#ff4444" : tokens.sectionLabelColor, fontFamily: "'Inter', sans-serif", fontWeight: isSelected ? 600 : 400 }}>
                  {preset.label}
                </span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-full"
                      style={{ width: 16, height: 16, background: "#ff0000" }}
                    >
                      <Check size={9} color="#fff" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
