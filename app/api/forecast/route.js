import { NextResponse } from "next/server";
import { getIntervalsWellness } from "../../../lib/intervals";
import { getAthleteProfile } from "../../../lib/db";

function calculateWeightTrend(weights, dates) {
  if (weights.length < 2) return { slope: 0, direction: "stable", rate: 0 };

  // Simple linear regression
  const n = weights.length;
  const sumX = dates.reduce((s, d, i) => s + i, 0);
  const sumY = weights.reduce((s, w) => s + w, 0);
  const sumXY = dates.reduce((s, d, i) => s + i * weights[i], 0);
  const sumXX = dates.reduce((s, d, i) => s + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const rate = slope * 7; // kg per week

  let direction = "stable";
  if (Math.abs(rate) < 0.1) direction = "stable";
  else if (rate > 0) direction = "gaining";
  else direction = "losing";

  return { slope, direction, rate: Math.abs(rate) };
}

function forecastWeight(currentWeight, trend, targetWeight, raceDate) {
  const daysToRace = Math.ceil((new Date(raceDate) - new Date()) / (1000 * 60 * 60 * 24));
  const weeksToRace = daysToRace / 7;

  // Project weight at race date
  const projectedWeight = currentWeight + (trend.rate * weeksToRace * (trend.direction === "gaining" ? 1 : -1));

  // Calculate if target will be met
  const willMeetTarget = trend.direction === "losing" ?
    projectedWeight <= targetWeight :
    projectedWeight >= targetWeight;

  // Calculate required weekly rate to meet target
  const weightDiff = targetWeight - currentWeight;
  const requiredRate = Math.abs(weightDiff) / weeksToRace;

  return {
    projectedWeight: Math.round(projectedWeight * 10) / 10,
    willMeetTarget,
    requiredWeeklyRate: Math.round(requiredRate * 10) / 10,
    daysToRace,
    currentTrend: trend
  };
}

function generateRecommendations(forecast, athlete) {
  const recommendations = [];

  if (!forecast.willMeetTarget) {
    const direction = forecast.projectedWeight > athlete.target_weight ? "lose" : "gain";
    const weeklyNeeded = forecast.requiredWeeklyRate;

    if (direction === "lose") {
      recommendations.push({
        type: "caloric_deficit",
        title: "Caloric Deficit Required",
        action: `Need to create ~${Math.round(weeklyNeeded * 7700)} kcal weekly deficit (${Math.round(weeklyNeeded * 1100)} kcal/day)`,
        priority: "high"
      });

      if (athlete.current_weight > athlete.target_weight + 5) {
        recommendations.push({
          type: "training_adjustment",
          title: "Consider Training Load",
          action: "High training volume may hinder weight loss. Consider 1-2 easier weeks",
          priority: "medium"
        });
      }
    } else {
      recommendations.push({
        type: "caloric_surplus",
        title: "Caloric Surplus Required",
        action: `Need to create ~${Math.round(weeklyNeeded * 7700)} kcal weekly surplus (${Math.round(weeklyNeeded * 1100)} kcal/day)`,
        priority: "high"
      });
    }
  }

  // General recommendations
  if (forecast.currentTrend.direction === "stable") {
    recommendations.push({
      type: "monitoring",
      title: "Weight Stable",
      action: "Continue current nutrition and training. Monitor weekly weigh-ins",
      priority: "low"
    });
  }

  if (forecast.daysToRace < 30) {
    recommendations.push({
      type: "race_prep",
      title: "Race Prep Focus",
      action: "Focus on race-specific training. Weight goals secondary to performance",
      priority: "medium"
    });
  }

  return recommendations;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get("raceId");

    if (!raceId) {
      return NextResponse.json({ error: "Race ID required" }, { status: 400 });
    }

    // Get athlete profile and race data
    const athlete = await getAthleteProfile();
    const races = await getAthleteProfile(); // This should be getRaces() but using profile for now
    const race = races?.races?.find(r => r.id === raceId);

    if (!race || !athlete) {
      return NextResponse.json({ error: "Race or athlete data not found" }, { status: 404 });
    }

    // Get recent weight data (last 4 weeks)
    const wellness = await getIntervalsWellness();
    const recentWeights = wellness
      .filter(w => w.weight && w.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 28) // Last 28 days
      .reverse(); // Chronological order

    if (recentWeights.length === 0) {
      return NextResponse.json({
        error: "No weight data available",
        forecast: null,
        recommendations: [{
          type: "data_collection",
          title: "Weight Data Needed",
          action: "Start logging weight daily in Intervals.icu for accurate forecasting",
          priority: "high"
        }]
      });
    }

    const weights = recentWeights.map(w => w.weight);
    const dates = recentWeights.map((w, i) => i); // Days from start

    const trend = calculateWeightTrend(weights, dates);
    const currentWeight = weights[weights.length - 1];
    const targetWeight = athlete.target_weight || race.target_weight || athlete.weight - 5;

    const forecast = forecastWeight(currentWeight, trend, targetWeight, race.date);

    const recommendations = generateRecommendations(forecast, {
      ...athlete,
      target_weight: targetWeight,
      current_weight: currentWeight
    });

    return NextResponse.json({
      race: {
        id: race.id,
        name: race.name,
        date: race.date,
        target_weight: targetWeight
      },
      currentWeight,
      trend,
      forecast,
      recommendations,
      dataPoints: recentWeights.length,
      lastUpdated: recentWeights[recentWeights.length - 1]?.date
    });

  } catch (err) {
    console.error("Forecast error:", err);
    return NextResponse.json({ error: "Failed to generate forecast" }, { status: 500 });
  }
}