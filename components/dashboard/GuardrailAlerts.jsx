"use client";

const levelStyles = {
  critical: {
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    icon: "🚨",
    badge: "bg-red-500/20 text-red-400",
    badgeText: "CRITICAL",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    icon: "⚠️",
    badge: "bg-amber-500/20 text-amber-400",
    badgeText: "WARNING",
  },
  info: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    icon: "ℹ️",
    badge: "bg-blue-500/20 text-blue-400",
    badgeText: "INFO",
  },
  ok: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    icon: "✅",
    badge: "bg-emerald-500/20 text-emerald-400",
    badgeText: "ALL CLEAR",
  },
};

export default function GuardrailAlerts({ alerts, compact = false }) {
  if (!alerts || alerts.length === 0) return null;

  // In compact mode, show only critical/warning, collapsed
  const visibleAlerts = compact
    ? alerts.filter((a) => a.level === "critical" || a.level === "warning").slice(0, 3)
    : alerts;

  if (visibleAlerts.length === 0 && compact) {
    // All clear in compact mode — show a small green badge
    const ok = alerts.find((a) => a.level === "ok");
    if (ok) {
      return (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <span>✅</span>
          <span className="text-sm text-emerald-400 font-medium">All systems go</span>
          <span className="text-xs text-gray-500 ml-1">— train as planned</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert, i) => {
        const style = levelStyles[alert.level] || levelStyles.info;
        return (
          <div key={`${alert.signal}-${i}`} className={`${style.bg} border ${style.border} rounded-xl p-4`}>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{style.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{alert.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${style.badge}`}>{style.badgeText}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{alert.message}</p>
                <div className="bg-surface-900/50 rounded-lg px-3 py-2">
                  <div className="text-[10px] text-gray-500 font-medium mb-0.5">RECOMMENDED ACTION</div>
                  <p className="text-xs text-gray-200">{alert.action}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {compact && alerts.filter((a) => a.level === "warning" || a.level === "critical").length > 3 && (
        <div className="text-xs text-gray-500 text-center">+{alerts.filter((a) => a.level === "warning" || a.level === "critical").length - 3} more alerts</div>
      )}
    </div>
  );
}
