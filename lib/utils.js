export function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function getBurnoutColor(score) {
  if (score < 40) return "text-emerald-400";
  if (score < 55) return "text-yellow-400";
  if (score < 75) return "text-amber-400";
  return "text-red-400";
}

export function getBurnoutBg(score) {
  if (score < 40) return "bg-emerald-500/10 border-emerald-500/20";
  if (score < 55) return "bg-yellow-500/10 border-yellow-500/20";
  if (score < 75) return "bg-amber-500/10 border-amber-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export function getWorkDensityColor(density) {
  const colors = {
    rest: "bg-emerald-500/20 text-emerald-400",
    light: "bg-sky-500/20 text-sky-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    heavy: "bg-orange-500/20 text-orange-400",
    travel: "bg-red-500/20 text-red-400",
  };
  return colors[density] || colors.light;
}

export function getRaceTypeIcon(type) {
  const icons = { road_run: "🏃", trail: "⛰️", cycling: "🚴" };
  return icons[type] || "🏅";
}

export function getRaceTypeColor(type) {
  const colors = {
    road_run: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    trail: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cycling: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };
  return colors[type] || "";
}
