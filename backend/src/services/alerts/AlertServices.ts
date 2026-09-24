
import axios from 'axios';
import KERALA_DISTRICTS from '../../config/districts';
import { classifyAlert, isEscalation } from './classifier';
import { Alert, DistrictStatus } from '../../models/Alerts';
import { sendPushNotification } from './fcmServices';
import {
  WeatherData,
  FloodData,
  GdacsLevel,
  CombinedWeatherData,
  OpenMeteoWeatherResponse,
  OpenMeteoFloodResponse,
  GdacsResponse,
  AlertLevel,
} from '../../types/alerts.types';

// ── Open-Meteo weather ───────────────────────────────────────
async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const { data } = await axios.get<OpenMeteoWeatherResponse>(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: lat,
          longitude: lon,
          daily: 'precipitation_sum,rain_sum,windspeed_10m_max',
          timezone: 'Asia/Kolkata',
          forecast_days: 1,
        },
        timeout: 8000,
      }
    );

    const rain      = data.daily?.rain_sum?.[0] ?? 0;
    const precip    = data.daily?.precipitation_sum?.[0] ?? 0;
    const windSpeed = data.daily?.windspeed_10m_max?.[0] ?? 0;

    return { rainMm: Math.max(rain, precip), windSpeedKmh: windSpeed };
  } catch (err) {
    console.error(`⚠️  Weather fetch failed (${lat},${lon}):`, (err as Error).message);
    return { rainMm: 0, windSpeedKmh: 0 };
  }
}

// ── Open-Meteo GloFAS flood ──────────────────────────────────
async function fetchFlood(lat: number, lon: number): Promise<FloodData> {
  try {
    const { data } = await axios.get<OpenMeteoFloodResponse>(
      'https://flood-api.open-meteo.com/v1/flood',
      {
        params: {
          latitude: lat,
          longitude: lon,
          daily: 'river_discharge,river_discharge_max',
          forecast_days: 1,
        },
        timeout: 8000,
      }
    );

    const discharge    = data.daily?.river_discharge?.[0] ?? 0;
    const maxDischarge = data.daily?.river_discharge_max?.[0] ?? 0;
    return { riverDischarge: Math.max(discharge, maxDischarge) };
  } catch (err) {
    console.error(`⚠️  Flood fetch failed (${lat},${lon}):`, (err as Error).message);
    return { riverDischarge: 0 };
  }
}

// ── GDACS ────────────────────────────────────────────────────
async function fetchGdacsAlert(): Promise<GdacsLevel> {
  try {
    const { data } = await axios.get<GdacsResponse>(
      'https://www.gdacs.org/gdacsapi/api/Events/geteventlist/EVENTS4APP',
      { timeout: 10000 }
    );

    const features = data?.features ?? [];

    const indiaEvents = features.filter((f) => {
      const props      = f.properties ?? {};
      const countries  = props.affectedcountries ?? '';
      const alertLevel = props.alertlevel ?? '';
      const lat        = f.geometry?.coordinates?.[1] ?? 0;
      const lon        = f.geometry?.coordinates?.[0] ?? 0;

      const isIndia      = countries.includes('IND') || countries.includes('India');
      const isNearKerala = lat >= 7.0 && lat <= 13.0 && lon >= 74.0 && lon <= 78.0;

      return (isIndia || isNearKerala) && alertLevel !== '';
    });

    if (indiaEvents.some((f) => f.properties.alertlevel === 'Red'))    return 'Red';
    if (indiaEvents.some((f) => f.properties.alertlevel === 'Orange')) return 'Orange';
    if (indiaEvents.length > 0)                                         return 'Green';
    return null;
  } catch (err) {
    console.error('⚠️  GDACS fetch failed:', (err as Error).message);
    return null;
  }
}

// ── Main Fetcher ─────────────────────────────────────────────
export async function runAlertFetcher(): Promise<void> {
  console.log(`\n🔄 [${new Date().toISOString()}] Starting alert fetch for Kerala...`);

  const gdacsAlert = await fetchGdacsAlert();
  console.log(`📡 GDACS alert level: ${gdacsAlert ?? 'None'}`);

  for (const district of KERALA_DISTRICTS) {
    try {
      const [weatherData, floodData] = await Promise.all([
        fetchWeather(district.lat, district.lon),
        fetchFlood(district.riverCoords.lat, district.riverCoords.lon),
      ]);

      const combinedData: CombinedWeatherData = {
        rainMm:        weatherData.rainMm,
        windSpeedKmh:  weatherData.windSpeedKmh,
        riverDischarge: floodData.riverDischarge,
        gdacsAlert,
      };

      const result = classifyAlert(district, combinedData);

      // Fetch previous level for escalation check
      const prevStatus = await DistrictStatus.findOne({ district: district.name });
      const prevLevel  = (prevStatus?.alertLevel ?? 'GREEN') as AlertLevel;

      // Upsert current status
      await DistrictStatus.findOneAndUpdate(
        { district: district.name },
        {
          district:      district.name,
          alertLevel:    result.level,
          alertColor:    result.color,
          description:   result.description,
          threats:       district.mainThreats,
          rainMm:        combinedData.rainMm,
          riverDischarge: combinedData.riverDischarge,
          gdacsAlert,
          lat:           district.lat,
          lon:           district.lon,
          baseRisk:      district.baseRisk,
          mainThreats:   district.mainThreats,
          lastUpdated:   new Date(),
        },
        { upsert: true, new: true }
      );

      // Save alert history
      await Alert.create({
        district:      district.name,
        alertLevel:    result.level,
        alertColor:    result.color,
        description:   result.description,
        threats:       district.mainThreats,
        rainMm:        combinedData.rainMm ?? 0,
        riverDischarge: combinedData.riverDischarge ?? 0,
        gdacsAlert,
        windSpeedKmh:  combinedData.windSpeedKmh ?? 0,
        sources:       result.sources,
      });

      // Send push if escalated
      if (isEscalation(prevLevel, result.level)) {
        console.log(`🔔 Escalation in ${district.name}: ${prevLevel} → ${result.level}`);
        await sendPushNotification({
          topic: district.fcmTopic,
          title: `${result.level === 'RED' ? '🔴' : '🟠'} ${district.name} — ${result.level}`,
          body:  result.description,
          data: {
            district:   district.name,
            alertLevel: result.level,
            alertColor: result.color,
          },
        });
      }

      console.log(
        `  ✅ ${district.name.padEnd(20)} ${result.level.padEnd(7)} | Rain: ${(combinedData.rainMm ?? 0).toFixed(1)}mm | River: ${(combinedData.riverDischarge ?? 0).toFixed(0)}m³/s`
      );
    } catch (err) {
      console.error(`  ❌ Error processing ${district.name}:`, (err as Error).message);
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('✅ Alert fetch complete.\n');
}