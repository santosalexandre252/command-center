// Guardrail Engine — Real-time danger detection for training decisions
// Combines 6 burnout signals + specific rule-based alerts

// ── Burnout Score Calculation (shared by dashboard + load pages) ─────

export function calculateBurnoutSignals({ atl, ctl, tsb, avg7HRV, avg30HRV, avgSleep, workStress, avgEnergy, calendarConnected }) {
  const training = atl ? Math.round(Math.min(100, (atl / 80) * 100)) : 40;
  const form = tsb !== null && tsb !== undefined ? Math.round(Math.max(0, Math.min(100, 50 - tsb * 3))) : 40;
  const hrv = avg30HRV && avg7HRV ? Math.round(Math.max(0, Math.min(100, 70 - (avg7HRV - avg30HRV)))) : 40;
  const sleep = avgSleep ? Math.round(Math.max(0, Math.min(100, avgSleep < 7 ? 80 : avgSleep < 7.5 ? 55 : avgSleep < 8 ? 35 : 20))) : 40;
  const work = calendarConnected ? Math.round(Math.min(100, workStress || 0)) : 40;
  const energy = avgEnergy ? Math.round(Math.max(0, Math.min(100, (5 - avgEnergy) * 25))) : 40;

  const total = Math.round(
    training * 0.25 +
    form * 0.15 +
    hrv * 0.15 +
    sleep * 0.15 +
    work * 0.15 +
    energy * 0.15
  );

  const level = total < 40 ? "LOW" : total < 55 ? "MODERATE" : total < 75 ? "HIGH" : "CRITICAL";

  return { total, level, signals: { training, form, hrv, sleep, work, energy } };
}

// ── Work Stress Score from Calendar Data ─────────────────────────────

export function calculateWorkStress(calendarData) {
  if (!calendarData || Object.keys(calendarData).length === 0) return 0;
  const heavyDays = Object.values(calendarData).filter((d) => d.density === "heavy" || d.density === "travel").length;
  const totalMeetings = Object.values(calendarData).reduce((s, d) => s + d.count, 0);
  return Math.min(100, heavyDays * 20 + totalMeetings * 5);
}

// ── Guardrail Rules ──────────────────────────────────────────────────
// Each rule returns null (no alert) or an alert object

const SEVERITY = { INFO: "info", WARNING: "warning", DANGER: "danger" };

function checkATLCTLRatio({ atl, ctl }) {
  if (!atl || !ctl || ctl === 0) return null;
  const ratio = atl / ctl;
  if (ratio > 1.5) {
    return {
      id: "atl-ctl-spike",
      severity: SEVERITY.DANGER,
      title: "Training load spike",
      message: `ATL:CTL ratio is ${ratio.toFixed(2)} (danger >1.5). Acute load far exceeds chronic fitness.`,
      action: "Drop to Z1-Z2 only for the next 2-3 days. No intervals or hard sessions until ratio drops below 1.3.",
      icon: "🔴",
    };
  }
  if (ratio > 1.3) {
    return {
      id: "atl-ctl-elevated",
      severity: SEVERITY.WARNING,
      title: "Training load ramping fast",
      message: `ATL:CTL ratio is ${ratio.toFixed(2)} (caution >1.3). You're building load quickly.`,
      action: "Keep tomorrow easy or take a rest day. Avoid stacking two hard days.",
      icon: "🟡",
    };
  }
  return null;
}

function checkHRVTrend({ hrvLast3, avg30HRV }) {
  if (!hrvLast3 || hrvLast3.length < 3 || !avg30HRV) return null;
  const avg3 = hrvLast3.reduce((s, v) => s + v, 0) / hrvLast3.length;
  const dropPercent = ((avg30HRV - avg3) / avg30HRV) * 100;

  if (dropPercent > 15) {
    return {
      id: "hrv-declining",
      severity: SEVERITY.DANGER,
      title: "HRV declining sharply",
      message: `3-day HRV avg (${Math.round(avg3)}ms) is ${Math.round(dropPercent)}% below your 30-day avg (${Math.round(avg30HRV)}ms).`,
      action: "Your autonomic system is stressed. Swap any hard session for easy movement or full rest today.",
      icon: "🔴",
    };
  }
  if (dropPercent > 8) {
    return {
      id: "hrv-dipping",
      severity: SEVERITY.WARNING,
      title: "HRV trending down",
      message: `3-day HRV avg (${Math.round(avg3)}ms) is ${Math.round(dropPercent)}% below your 30-day avg (${Math.round(avg30HRV)}ms).`,
      action: "Monitor closely. If you train today, keep intensity moderate and stop if RPE feels higher than expected.",
      icon: "🟡",
    };
  }
  return null;
}

function checkTSBWorkCombo({ tsb, todayWorkDensity }) {
  if (tsb === null || tsb === undefined) return null;
  const isHeavyWork = todayWorkDensity === "heavy" || todayWorkDensity === "travel";

  if (tsb < -15 && isHeavyWork) {
    return {
      id: "tsb-work-danger",
      severity: SEVERITY.DANGER,
      title: "Deep fatigue + heavy work day",
      message: `TSB is ${Math.round(tsb)} (very fatigued) and today is a ${todayWorkDensity} work day.`,
      action: "Skip training entirely or do 20-30min easy walk. Prioritise sleep tonight. Burnout risk is high.",
      icon: "🔴",
    };
  }
  if (tsb < -10 && isHeavyWork) {
    return {
      id: "tsb-work-warning",
      severity: SEVERITY.WARNING,
      title: "Fatigued + busy work day",
      message: `TSB is ${Math.round(tsb)} and today is a ${todayWorkDensity} work day.`,
      action: "Reduce session intensity or duration by 30%. Easy Z2 only. No intervals.",
      icon: "🟡",
    };
  }
  return null;
}

function checkSleepStreak({ recentSleep }) {
  if (!recentSleep || recentSleep.length < 3) return null;
  const last3 = recentSleep.slice(-3);
  const poorNights = last3.filter((s) => s !== null && s < 6.5).length;

  if (poorNights >= 3) {
    return {
      id: "sleep-streak-bad",
      severity: SEVERITY.DANGER,
      title: "3+ nights of poor sleep",
      message: `Last 3 nights averaged under 6.5 hours. Recovery is severely compromised.`,
      action: "No high-intensity training until you get two consecutive nights >7h. Easy movement only.",
      icon: "🔴",
    };
  }
  if (poorNights >= 2) {
    return {
      id: "sleep-streak-warn",
      severity: SEVERITY.WARNING,
      title: "Poor sleep streak",
      message: `2 of your last 3 nights were under 6.5 hours.`,
      action: "Reduce today's session volume. Prioritise an early bedtime tonight — aim for 8+ hours.",
      icon: "🟡",
    };
  }
  return null;
}

function checkKneeBeforeLegDay({ kneeStatus, todayPlanned, energyLog }) {
  if (!todayPlanned) return null;
  const isLegDay = /leg|gym\s*a|gym\s*d|squat|lunge/i.test(
    todayPlanned.name || todayPlanned.category || ""
  ) || todayPlanned.category === "WeightTraining";

  if (!isLegDay) return null;

  // Knee status from energy log: 1=perfect, 5=painful
  const knee = energyLog?.knee_status || kneeStatus || 0;
  if (knee >= 4) {
    return {
      id: "knee-leg-day-danger",
      severity: SEVERITY.DANGER,
      title: "Knee sore — leg day today",
      message: `Your right knee is rated ${knee}/5 and today's plan includes legs.`,
      action: "Swap Bulgarian split squats → step-ups/reverse lunges. Swap lever leg extensions → terminal knee extensions/wall sits. Reduce load by 20%.",
      icon: "🦵",
    };
  }
  if (knee >= 3) {
    return {
      id: "knee-leg-day-warning",
      severity: SEVERITY.WARNING,
      title: "Knee moderate — leg day caution",
      message: `Your right knee is rated ${knee}/5. Leg session planned today.`,
      action: "Consider ACL-safe swaps: step-ups instead of Bulgarian split squats. Use lighter weight on any single-leg exercises. Stop if pain increases.",
      icon: "🦵",
    };
  }
  return null;
}

function checkOverallBurnout({ burnoutTotal }) {
  if (burnoutTotal >= 75) {
    return {
      id: "burnout-critical",
      severity: SEVERITY.DANGER,
      title: "Burnout risk critical",
      message: `Composite burnout score is ${burnoutTotal}/100 — multiple signals are elevated.`,
      action: "Take a full rest day. Consider rearranging the week to front-load recovery. Talk to your coach.",
      icon: "🔥",
    };
  }
  if (burnoutTotal >= 55) {
    return {
      id: "burnout-elevated",
      severity: SEVERITY.WARNING,
      title: "Burnout risk elevated",
      message: `Composite burnout score is ${burnoutTotal}/100.`,
      action: "Reduce training volume today. Prioritise sleep and nutrition. Avoid adding unplanned sessions.",
      icon: "⚠️",
    };
  }
  return null;
}

// ── Main Guardrail Runner ────────────────────────────────────────────

export function runGuardrails({
  atl, ctl, tsb,
  hrvLast3, avg30HRV,
  recentSleep,
  todayWorkDensity,
  kneeStatus,
  todayPlanned,
  energyLog,
  burnoutTotal,
}) {
  const alerts = [
    checkATLCTLRatio({ atl, ctl }),
    checkHRVTrend({ hrvLast3, avg30HRV }),
    checkTSBWorkCombo({ tsb, todayWorkDensity }),
    checkSleepStreak({ recentSleep }),
    checkKneeBeforeLegDay({ kneeStatus, todayPlanned, energyLog }),
    checkOverallBurnout({ burnoutTotal }),
  ].filter(Boolean);

  // Sort: danger first, then warning, then info
  const order = { danger: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => order[a.severity] - order[b.severity]);

  return alerts;
}

// ── AI Briefing Decision Helper ──────────────────────────────────────

export function buildBriefingDecision(alerts) {
  const dangerCount = alerts.filter((a) => a.severity === "danger").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  if (dangerCount >= 2) return "rest";
  if (dangerCount === 1) return "swap";
  if (warningCount >= 2) return "modify";
  if (warningCount === 1) return "caution";
  return "go";
}

// ── Race Readiness Calculations ──────────────────────────────────────

export function calculateRaceReadiness({ race, currentCTL, weeksRemaining, weeklyVolumes, longSessions, currentWeight }) {
  const targetCTL = race.target_ctl;
  const ctlGap = targetCTL - (currentCTL || 0);
  const ctlPercent = Math.min(100, Math.round(((currentCTL || 0) / targetCTL) * 100));
  const ctlRampNeeded = weeksRemaining > 0 ? Math.round(ctlGap / weeksRemaining * 10) / 10 : 0;

  // Volume progression — are weekly volumes trending up?
  let volumeTrend = "insufficient_data";
  if (weeklyVolumes && weeklyVolumes.length >= 3) {
    const last3 = weeklyVolumes.slice(-3);
    const isIncreasing = last3[2] > last3[0];
    const avgRecent = last3.reduce((s, v) => s + v, 0) / 3;
    volumeTrend = isIncreasing ? "building" : avgRecent > 0 ? "flat" : "declining";
  }

  // Long session progression — approaching race distance?
  let longRunProgress = null;
  if (longSessions && longSessions.length > 0) {
    const raceDistance = race.distance;
    const longestRecent = Math.max(...longSessions.map((s) => s.distance || 0));
    const targetLong = race.type === "cycling" ? raceDistance * 0.75 : raceDistance * 0.85;
    longRunProgress = {
      longest: longestRecent,
      target: Math.round(targetLong * 10) / 10,
      percent: Math.min(100, Math.round((longestRecent / targetLong) * 100)),
    };
  }

  // Weight trajectory
  let weightStatus = null;
  if (currentWeight && race.target_weight) {
    const weightGap = currentWeight - race.target_weight;
    const weeklyLossNeeded = weeksRemaining > 0 ? weightGap / weeksRemaining : 0;
    weightStatus = {
      current: currentWeight,
      target: race.target_weight,
      gap: Math.round(weightGap * 10) / 10,
      weeklyLossNeeded: Math.round(weeklyLossNeeded * 100) / 100,
      onTrack: weeklyLossNeeded <= 0.5, // max safe loss ~0.5kg/week
    };
  }

  // Overall readiness
  let readiness = "on_track";
  if (ctlPercent < 60 && weeksRemaining < 6) readiness = "behind";
  else if (ctlPercent < 75 && weeksRemaining < 3) readiness = "at_risk";
  else if (ctlPercent >= 90) readiness = "ready";

  return {
    ctlPercent,
    ctlGap: Math.round(ctlGap * 10) / 10,
    ctlRampNeeded,
    volumeTrend,
    longRunProgress,
    weightStatus,
    weeksRemaining,
    readiness,
  };
}
