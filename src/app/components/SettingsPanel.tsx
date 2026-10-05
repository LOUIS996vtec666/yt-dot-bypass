import { motion } from "motion/react";
import { X, Sun, Moon } from "lucide-react";
import { useTheme, type ThemeMode } from "../context/ThemeContext";

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { mode, tokens, setMode } = useTheme();

  const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "淺色", icon: <Sun size={14} /> },
    { value: "dark",  label: "深色", icon: <Moon size={14} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="absolute right-4 z-50 p-4 rounded-2xl flex flex-col gap-3"
      style={{
        top: 50,
        width: 200,
        background: tokens.tooltipBg,
        border: `1px solid ${tokens.tooltipBorder}`,
        boxShadow: tokens.tooltipShadow,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="uppercase tracking-widest"
          style={{ fontSize: 9, color: tokens.sectionLabelColor, fontFamily: "'JetBrains Mono', monospace" }}
        >
          Settings
        </span>
        <button
          onClick={onClose}
          style={{ color: tokens.iconColor }}
          className="transition-opacity hover:opacity-60"
          aria-label="Close settings"
        >
          <X size={13} />
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: tokens.dividerColor }} />

      {/* Theme section */}
      <div className="flex flex-col gap-2">
        <span style={{ fontSize: 11, color: tokens.tooltipText, fontWeight: 500 }}>
          介面主題
        </span>
        <div className="flex gap-2">
          {options.map(({ value, label, icon }) => {
            const isActive = mode === value;
            return (
              <button
                key={value}
                onClick={() => setMode(value)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all duration-150"
                style={{
                  background: isActive ? "#ff000020" : tokens.iconBg,
                  border: isActive ? "1px solid #ff000040" : `1px solid ${tokens.iconBorder}`,
                  color: isActive ? "#ff4444" : tokens.iconColor,
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                }}
                aria-pressed={isActive}
              >
                {icon}
                <span style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
