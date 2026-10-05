import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import bypassIcon from "../../imports/image.png";

interface MasterToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function MasterToggle({ active, onToggle }: MasterToggleProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Glow ring */}
      <div className="relative flex items-center justify-center">
        {active && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 96,
              height: 96,
              background: "radial-gradient(circle, rgba(255,0,0,0.25) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <button
          onClick={onToggle}
          aria-label={active ? "Pause bypass" : "Activate bypass"}
          className="relative z-10 flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none"
          style={{
            width: 72,
            height: 72,
            background: active
              ? "linear-gradient(135deg, #ff0000 0%, #ff4444 100%)"
              : "rgba(255,255,255,0.08)",
            boxShadow: active
              ? "0 0 0 2px rgba(255,0,0,0.35), 0 8px 32px rgba(255,0,0,0.4)"
              : "0 0 0 1px rgba(255,255,255,0.1)",
            border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <ImageWithFallback
            src={bypassIcon}
            alt="Bypass icon"
            style={{
              width: 52,
              height: 52,
              objectFit: "contain",
              opacity: active ? 1 : 0.4,
              transition: "opacity 0.3s ease",
            }}
          />
        </button>
      </div>

      {/* Status badge */}
      <motion.div
        key={String(active)}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={{
          background: active ? "rgba(255,0,0,0.15)" : "rgba(255,255,255,0.06)",
          border: active ? "1px solid rgba(255,0,0,0.3)" : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span
          className="inline-block rounded-full"
          style={{
            width: 6,
            height: 6,
            background: active ? "#ff4444" : "#555",
            boxShadow: active ? "0 0 6px #ff4444" : "none",
          }}
        />
        <span
          className="tracking-widest uppercase"
          style={{
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            color: active ? "#ff6666" : "#666",
          }}
        >
          {active ? "ACTIVE" : "PAUSED"}
        </span>
      </motion.div>
    </div>
  );
}
