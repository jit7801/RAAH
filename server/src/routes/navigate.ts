import { Router, Request, Response } from 'express';
import { calculateRoute } from '../services/routeService';

const router = Router();

router.get('/route', (req: Request, res: Response) => {
  const { from = 'main_gate', to } = req.query;
  if (!to || typeof to !== 'string') {
    return res.status(400).json({ error: "Query parameter 'to' is required" });
  }

  const result = calculateRoute(from as string, to);
  if (!result) {
    return res.status(404).json({ error: "Route not found or invalid nodes" });
  }

  return res.json(result);
});

export default router;
