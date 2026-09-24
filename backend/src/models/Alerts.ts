// ============================================================
// src/models/index.ts — Mongoose models with TypeScript
// ============================================================

import { Schema, model, Document } from 'mongoose';
import { IAlert, IDistrictStatus, AlertLevel, AlertColor, BaseRisk} from '../types/alerts.types';

// ── Alert Document ───────────────────────────────────────────
export interface AlertDocument extends IAlert, Document {}

const alertSchema = new Schema<AlertDocument>(
  {
    district:      { type: String, required: true, index: true },
    alertLevel:    { type: String, enum: ['GREEN', 'ORANGE', 'RED'] as AlertLevel[], required: true },
    alertColor:    { type: String, enum: ['#22C55E', '#F97316', '#EF4444'] as AlertColor[], required: true },
    description:   { type: String, required: true },
    threats:       [String],
    rainMm:        Number,
    riverDischarge: Number,
    gdacsAlert:    { type: String, default: null },
    windSpeedKmh:  Number,
    sources:       [String],
    pushSent:      { type: Boolean, default: false },
    fetchedAt:     { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export interface DistrictStatusDocument extends IDistrictStatus, Document {}

const districtStatusSchema = new Schema<DistrictStatusDocument>(
  {
    district:      { type: String, required: true, unique: true },
    alertLevel:    { type: String, enum: ['GREEN', 'ORANGE', 'RED'] as AlertLevel[], default: 'GREEN' },
    alertColor:    { type: String, default: '#22C55E' },
    description:   String,
    threats:       [String],
    rainMm:        Number,
    riverDischarge: Number,
    gdacsAlert:    { type: String, default: null },
    lat:           Number,
    lon:           Number,
    baseRisk:      { type: String, enum: ['EXTREME', 'HIGH', 'MODERATE'] as BaseRisk[] },
    mainThreats:   [String],
    lastUpdated:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Alert         = model<AlertDocument>('Alert', alertSchema);
export const DistrictStatus = model<DistrictStatusDocument>('DistrictStatus', districtStatusSchema);