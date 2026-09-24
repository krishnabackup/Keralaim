

import { Router, Request, Response } from 'express';
import { Alert } from '../models/Alerts';

const Alertrouter = Router();

// GET /api/alerts
Alertrouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { district, level, limit = '50' } = req.query as Record<string, string>;
    const query: Record<string, string> = {};
    if (district) query.district   = district;
    if (level)    query.alertLevel = level.toUpperCase();

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

// GET /api/alerts/:district
Alertrouter.get('/:district', async (req: Request, res: Response): Promise<void> => {
  try {
    const { district } = req.params;
    if (!district) {
      res.status(400).json({ success: false, message: 'District parameter is required' });
      return;
    }

    const alerts = await Alert.find({ district })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});

export default Alertrouter;