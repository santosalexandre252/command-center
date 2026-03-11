export function evaluateGuardrails({ fitness, calendar, energyLogs, races, athlete }) {
  const warnings = [];
  const today = new Date().toISOString().split("T")[0];

  const ctl = fitness?.ctl || 0;
  const atl = fitness?.atl || 0;
  const tsb = fitness?.tsb ?? (ctl - atl);
  const weight = fitness?.weight || null;

  const recentEnergy = Object.values(energyLogs || {}).filter(l => l.energy).slice(-3);
  const avgEnergy = recentEnergy.length > 0 ? recentEnergy.reduce((s, l) => s + l.energy, 0) / recentEnergy.length : null;

  const todayLog = energyLogs?.[today];
  const kneeStatus = todayLog?.knee_status || 0;
  const todaySoreness = todayLog?.soreness || 0;

  const todayCal = calendar?.[today];
  const density = todayCal?.density || "rest";
  const meetingCount = todayCal?.count || 0;
  const heavyDays = Object.values(calendar || {}).filter(d => d.density === "heavy" || d.density === "travel").length;

  const nextRace = (races || []).filter(r => r.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  const daysToNextRace = nextRace ? Math.ceil((new Date(nextRace.date) - new Date()) / 86400000) : null;

  // RULE 1: Deep fatigue
  if (tsb < -15) {
    warnings.push({ level: "critical", signal: "Form (TSB)", title: "Deep fatigue detected", detail: `TSB is ${Math.round(tsb)}. Your body is accumulating fatigue faster than it recovers.`, action: "Swap today for easy Z1-Z2 (30-40min max) or full rest day. Consider an easy week.", icon: "🔴" });
  } else if (tsb < -10) {
    warnings.push({ level: "warning", signal: "Form (TSB)", title: "Fatigue building", detail: `TSB is ${Math.round(tsb)}. Functional overreaching zone.`, action: "Keep today but reduce intensity by one zone. No intervals.", icon: "🟡" });
  }

  // RULE 2: ATL:CTL ratio (acute overload)
  if (ctl > 0 && atl / ctl > 1.3) {
    warnings.push({ level: "critical", signal: "Training Load", title: "Acute overload risk", detail: `ATL/CTL ratio: ${(atl / ctl).toFixed(2)} (limit: 1.3). Loading faster than fitness supports.`, action: "Reduce today by 30-40% or swap for recovery. Don't add volume this week.", icon: "🔴" });
  } else if (ctl > 0 && atl / ctl > 1.15) {
    warnings.push({ level: "warning", signal: "Training Load", title: "Load ramping fast", detail: `ATL/CTL ratio: ${(atl / ctl).toFixed(2)}. Building quickly.`, action: "Train as planned but skip bonus sets or extra km.", icon: "🟡" });
  }

  // RULE 3: Heavy work + hard training
  if ((density === "heavy" || density === "travel") && tsb < -5) {
    warnings.push({ level: "critical", signal: "Work + Training", title: "Heavy work + fatigued", detail: `${meetingCount} meetings today, form is ${Math.round(tsb)}. Burnout combo.`, action: "Move hard session to tomorrow. Do 30min easy Z2 or full rest.", icon: "🔴" });
  } else if (density === "heavy" || density === "travel") {
    warnings.push({ level: "info", signal: "Work", title: `Heavy work day (${meetingCount} meetings)`, detail: "High cognitive load. Recovery will be slower.", action: "Train as planned but prioritize sleep tonight.", icon: "🔵" });
  }

  if (heavyDays >= 3 && tsb < 0) {
    warnings.push({ level: "warning", signal: "Work Week", title: "Stressful work week", detail: `${heavyDays} heavy days + negative form (TSB ${Math.round(tsb)}).`, action: "Cut training volume 20%. Replace one hard session with easy Z2.", icon: "🟡" });
  }

  // RULE 4: Low energy streak
  if (avgEnergy !== null && avgEnergy <= 2) {
    warnings.push({ level: "critical", signal: "Energy", title: "Low energy streak", detail: `Avg energy: ${avgEnergy.toFixed(1)}/5 over last ${recentEnergy.length} days.`, action: "Rest day or easy 20-30min walk. Check sleep and nutrition.", icon: "🔴" });
  } else if (avgEnergy !== null && avgEnergy <= 3) {
    warnings.push({ level: "warning", signal: "Energy", title: "Energy running low", detail: `Avg energy: ${avgEnergy.toFixed(1)}/5.`, action: "Drop intensity one zone. Extra carbs at dinner.", icon: "🟡" });
  }

  // RULE 5: Knee / ACL
  if (kneeStatus >= 4) {
    warnings.push({ level: "critical", signal: "Right Knee", title: `Knee pain (${kneeStatus}/5)`, detail: "Significant knee discomfort. Do not load.", action: "Skip leg exercises entirely. Upper body or core only. Rest if pain persists.", icon: "🔴" });
  } else if (kneeStatus >= 3) {
    warnings.push({ level: "warning", signal: "Right Knee", title: `Knee discomfort (${kneeStatus}/5)`, detail: "ACL-sensitive exercises need modification.", action: "Swap Bulgarian split squats → step-ups. Swap leg extension → terminal knee ext or wall sits.", icon: "🟡" });
  }

  // RULE 6: High soreness
  if (todaySoreness >= 4) {
    warnings.push({ level: "warning", signal: "Soreness", title: `Heavy soreness (${todaySoreness}/5)`, detail: "Increases injury risk during intense training.", action: "Z1-Z2 only, 30-40min max. Foam rolling and mobility.", icon: "🟡" });
  }

  // RULE 7: Race taper
  if (daysToNextRace !== null && daysToNextRace <= 14 && daysToNextRace > 0) {
    const name = nextRace.short_name || nextRace.name;
    if (daysToNextRace <= 3) {
      warnings.push({ level: "info", signal: "Race", title: `${name} in ${daysToNextRace} days`, detail: "Final days. Minimal training, max rest.", action: "15-20min shakeout or full rest. Carb-load. Lay out race gear.", icon: "🏁" });
    } else if (daysToNextRace <= 7) {
      warnings.push({ level: "info", signal: "Race", title: `${name} — taper week`, detail: "Reduce volume 40-50%. Keep one race-pace session.", action: "No long runs. One 30min with race-pace strides. Start White Diet 2 days pre-race.", icon: "🏁" });
    } else {
      warnings.push({ level: "info", signal: "Race", title: `${name} in ${daysToNextRace} days`, detail: "Begin taper window.", action: "Reduce volume 20%. Keep one quality session. Nothing new.", icon: "🏁" });
    }
  }

  // RULE 8: Weight
  const targetWeight = athlete?.target_weight || 71;
  if (weight && weight > targetWeight + 3) {
    warnings.push({ level: "info", signal: "Weight", title: `${(weight - targetWeight).toFixed(1)}kg above target`, detail: `Current ${weight}kg vs target ${targetWeight}kg.`, action: "Slight deficit on easy days. Never restrict on hard training days.", icon: "⚖️" });
  }

  warnings.sort((a, b) => ({ critical: 0, warning: 1, info: 2 }[a.level] || 3) - ({ critical: 0, warning: 1, info: 2 }[b.level] || 3));

  const hasCritical = warnings.some(w => w.level === "critical");
  const hasWarning = warnings.some(w => w.level === "warning");
  const status = hasCritical ? "critical" : hasWarning ? "warning" : warnings.length > 0 ? "info" : "clear";

  return { warnings, status, signalCount: warnings.length };
}
