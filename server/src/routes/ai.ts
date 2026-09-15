import { Router, Request, Response } from 'express';
import { processUserQuery } from '../services/geminiService';
import { calculateRoute } from '../services/routeService';

const router = Router();

router.post('/query', async (req: Request, res: Response) => {
  try {
    const { query, startNode = 'main_gate' } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query string is required" });
    }

    const nluResult = await processUserQuery(query);

    let routeData = null;
    if (nluResult.intent === 'navigate' && nluResult.destination_node_id) {
      routeData = calculateRoute(startNode, nluResult.destination_node_id);
    }

    return res.json({
      nlu: nluResult,
      route: routeData
    });
  } catch (err: any) {
    console.error("AI Router error:", err);
    return res.status(500).json({ error: "Failed to process query", details: err.message });
  }
});

export default router;
