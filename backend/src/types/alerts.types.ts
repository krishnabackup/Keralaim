
export type AlertLevel =
  | "GREEN"
  | "ORANGE"
  | "RED";

export type AlertColor =
  | "#22C55E"
  | "#F97316"
  | "#EF4444";

export type BaseRisk =
  | "EXTREME"
  | "HIGH"
  | "MODERATE";


export interface Coordinates {
  lat: number;
  lon: number;
}


export interface IAlert {

  district: string;

  alertLevel: AlertLevel;
  alertColor: AlertColor;

  description: string;

  threats: string[];

  rainMm?: number;

  riverDischarge?: number;

  gdacsAlert?: string | null;

  windSpeedKmh?: number;

  sources: string[];

  pushSent: boolean;

  fetchedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}


export interface IDistrictStatus {
  district: string;

  alertLevel: AlertLevel;

  alertColor: AlertColor;

  description?: string;

  threats: string[];

  rainMm?: number;

  riverDischarge?: number;

  gdacsAlert?: string | null;

  lat?: number;

  lon?: number;

  baseRisk?: BaseRisk;

  mainThreats: string[];

  lastUpdated: Date;

  createdAt?: Date;
  updatedAt?: Date;
}



export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: unknown;
}



export interface AlertsApiResponse
  extends ApiSuccessResponse<IAlert[]> {}

export interface AlertApiResponse
  extends ApiSuccessResponse<IAlert> {}



export interface DistrictStatusApiResponse
  extends ApiSuccessResponse<IDistrictStatus[]> {}

export interface SingleDistrictStatusApiResponse
  extends ApiSuccessResponse<IDistrictStatus> {}

export interface PushNotificationPayload {
  topic: string;

  title: string;

  body: string;

  data?: Record<string, string>;
}

export interface DistrictConfig {
  district: string;

  state?: string;

  lat: number;

  lon: number;

  /*
    Rain threshold for ORANGE alert
    Example: 120 mm/day
  */
  orangeThresholdMm: number;

  /*
    Rain threshold for RED alert
    Example: 200 mm/day
  */
  redThresholdMm: number;

  /*
    Optional static district risk level
  */
  baseRisk?: "LOW" | "MODERATE" | "HIGH" | "EXTREME";

  /*
    Main disaster risks in district
  */
  mainThreats?: string[];
}


export interface CombinedWeatherData {
  /*
    Daily rainfall in mm
  */
  rainMm?: number;

  /*
    River flow discharge
    Unit: m³/s
  */
  riverDischarge?: number;

  /*
    GDACS alert level
  */
  gdacsAlert?: "Green" | "Orange" | "Red" | null;

  /*
    Wind speed in km/h
  */
  windSpeedKmh?: number;
}


export interface ClassificationResult {
  level: AlertLevel;

  color: AlertColor;

  description: string;

  /*
    APIs/data providers used
  */
  sources: string[];
}

// src/types/alerts.types.ts

/* ============================================================
   BASIC WEATHER TYPES
============================================================ */

export interface WeatherData {
  rainMm: number;

  windSpeedKmh: number;
}

export interface FloodData {
  riverDischarge: number;
}


/* ============================================================
   GDACS ALERT LEVEL
============================================================ */

export type GdacsLevel =
  | "Green"
  | "Orange"
  | "Red"
  | null;


/* ============================================================
   COMBINED WEATHER DATA
============================================================ */

export interface CombinedWeatherData {
  rainMm?: number;

  riverDischarge?: number;

  gdacsAlert?: GdacsLevel;

  windSpeedKmh?: number;
}


/* ============================================================
   OPEN-METEO WEATHER RESPONSE
============================================================ */

export interface OpenMeteoWeatherResponse {
  daily?: {
    precipitation_sum?: number[];

    rain_sum?: number[];

    windspeed_10m_max?: number[];
  };
}


/* ============================================================
   OPEN-METEO FLOOD RESPONSE
============================================================ */

export interface OpenMeteoFloodResponse {
  daily?: {
    river_discharge?: number[];

    river_discharge_max?: number[];
  };
}


/* ============================================================
   GDACS RESPONSE
============================================================ */

export interface GdacsResponse {
  features?: GdacsFeature[];
}


/* ============================================================
   GDACS FEATURE
============================================================ */

export interface GdacsFeature {
  properties: {
    alertlevel?: "Green" | "Orange" | "Red";

    affectedcountries?: string;
  };

  geometry?: {
    coordinates?: [number, number];
    /*
      [longitude, latitude]
    */
  };
}