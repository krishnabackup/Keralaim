// ============================================================
// src/routes/districtRoutes.ts
// Main API for the Expo frontend table
// ============================================================

import { Router, Request, Response } from 'express';
import { DistrictStatus } from '../models/Alerts';
import { runAlertFetcher } from '../services/alerts/AlertServices';
import { subscribeToTopic } from '../services/alerts/fcmServices';
import { AlertLevel } from '../types/alerts.types';

const districtRouter = Router();

const LEVEL_ORDER: Record<AlertLevel, number> = { RED: 0, ORANGE: 1, GREEN: 2 };

// GET /api/districts — all 14 districts sorted RED → ORANGE → GREEN
districtRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const districts = await DistrictStatus.find({}).lean();

    districts.sort(
      (a, b) =>
        (LEVEL_ORDER[a.alertLevel as AlertLevel] ?? 3) -
        (LEVEL_ORDER[b.alertLevel as AlertLevel] ?? 3)
    );

    res.json({
      success: true,
      count: districts.length,
      lastUpdated: districts[0]?.lastUpdated ?? null,
      data: districts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// GET /api/districts/:name
districtRouter.get('/:name', async (req: Request, res: Response): Promise<void> => {
  try {
    const district = await DistrictStatus.findOne({
      district: { $regex: new RegExp(`^${req.params.name}$`, 'i') },
    }).lean();

    if (!district) {
      res.status(404).json({ success: false, message: 'District not found' });
      return;
    }
    res.json({ success: true, data: district });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// POST /api/districts/refresh — manual trigger
districtRouter.post('/refresh', (_req: Request, res: Response): void => {
  res.json({ success: true, message: 'Alert fetch started in background' });
  runAlertFetcher().catch(console.error);
});

// POST /api/districts/register-token — subscribe device to FCM topic
districtRouter.post('/register-token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, district } = req.body as { token: string; district: string };

    if (!token || !district) {
      res.status(400).json({ success: false, message: 'token and district are required' });
      return;
    }

    const topic       = `kerala-${district.toLowerCase().replace(/\s+/g, '-')}-alerts`;
    const globalTopic = 'kerala-all-alerts';

    await subscribeToTopic([token], topic);
    await subscribeToTopic([token], globalTopic);

    res.json({ success: true, message: `Subscribed to ${topic}` });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

export default districtRouter;