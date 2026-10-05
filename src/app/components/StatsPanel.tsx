import { motion } from "motion/react";
import { ShieldCheck, Clock, Zap, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="flex flex-col gap-1.5 p-3 rounded-xl"
      style={{
        background: accent ? "rgba(255,0,0,0.08)" : "rgba(255,255,255,0.04)",
        border: accent ? "1px solid rgba(255,0,0,0.2)" : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: accent ? "#ff4444" : "#666" }}>{icon}</span>
        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 18,
          fontWeight: 700,
          color: accent ? "#ff6666" : "#e0e0e0",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}

export function StatsPanel() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatCard icon={<ShieldCheck size={11} />} label="Bypassed Today" value="12" accent />
      <StatCard icon={<Clock size={11} />} label="Time Saved" value="6 min" />
      <StatCard icon={<Zap size={11} />} label="This Week" value="74" />
      <StatCard icon={<TrendingUp size={11} />} label="Total Saved" value="3.2 h" />
    </div>
  );
}
