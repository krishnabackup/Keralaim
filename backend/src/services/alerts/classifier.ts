
import {
  DistrictConfig,
  CombinedWeatherData,
  ClassificationResult,
  AlertLevel,
  AlertColor,
} from '../../types/alerts.types';

const LEVEL_ORDER: Record<AlertLevel, number> = {
  GREEN: 0,
  ORANGE: 1,
  RED: 2,
};

export function isEscalation(prev: AlertLevel, next: AlertLevel): boolean {
  return LEVEL_ORDER[next] > LEVEL_ORDER[prev];
}

export function classifyAlert(
  district: DistrictConfig,
  weatherData: CombinedWeatherData
): ClassificationResult {
  const {
    rainMm = 0,
    riverDischarge = 0,
    gdacsAlert = null,
    windSpeedKmh = 0,
  } = weatherData;

  const sources: string[] = [];
  if (rainMm > 0)          sources.push('Open-Meteo Weather');
  if (riverDischarge > 0)  sources.push('Open-Meteo GloFAS Flood');
  if (gdacsAlert)          sources.push('GDACS (UN)');
  if (windSpeedKmh > 0)    sources.push('OpenWeatherMap');

  const isGdacsRed    = gdacsAlert === 'Red';
  const isGdacsOrange = gdacsAlert === 'Orange';
  const isHeavyWind   = windSpeedKmh >= 60;
  const isFloodHigh   = riverDischarge >= 800;
  const isRedRain     = rainMm >= district.redThresholdMm;
  const isOrangeRain  = rainMm >= district.orangeThresholdMm;

  // ── RED ────────────────────────────────────────────────────
  if (isRedRain || isGdacsRed || isHeavyWind || isFloodHigh) {
    const reasons: string[] = [];
    if (isRedRain)   reasons.push(`Extreme rainfall: ${rainMm.toFixed(1)}mm/day`);
    if (isGdacsRed)  reasons.push('GDACS Red disaster alert active');
    if (isHeavyWind) reasons.push(`Dangerous winds: ${windSpeedKmh.toFixed(0)}km/h`);
    if (isFloodHigh) reasons.push(`River discharge critical: ${riverDischarge.toFixed(0)}m³/s`);

    return {
      level: 'RED' as AlertLevel,
      color: '#EF4444' as AlertColor,
      description: `⚠️ DANGER — ${reasons.join(' · ')}. Stay indoors, avoid travel, follow evacuation orders.`,
      sources,
    };
  }

  // ── ORANGE ─────────────────────────────────────────────────
  if (isOrangeRain || isGdacsOrange || riverDischarge >= 400) {
    const reasons: string[] = [];
    if (isOrangeRain)          reasons.push(`Heavy rainfall: ${rainMm.toFixed(1)}mm/day`);
    if (isGdacsOrange)         reasons.push('GDACS Orange alert nearby');
    if (riverDischarge >= 400) reasons.push(`River discharge elevated: ${riverDischarge.toFixed(0)}m³/s`);

    return {
      level: 'ORANGE' as AlertLevel,
      color: '#F97316' as AlertColor,
      description: `⚡ WATCH — ${reasons.join(' · ')}. Monitor situation, avoid low-lying areas.`,
      sources,
    };
  }

  // ── GREEN ──────────────────────────────────────────────────
  return {
    level: 'GREEN' as AlertLevel,
    color: '#22C55E' as AlertColor,
    description: `✅ SAFE — Weather normal. Rainfall: ${rainMm.toFixed(1)}mm/day. No active alerts.`,
    sources,
  };
}