import { Router, Request, Response } from 'express';
import { INITIAL_LOCATIONS } from '../data/initialLocations';

const router = Router();
let locationsStore = [...INITIAL_LOCATIONS];

router.get('/', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = locationsStore.filter(l => l.is_active);

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter(l => l.category === category);
  }

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    results = results.filter(l =>
      l.name.toLowerCase().includes(s) ||
      l.building.toLowerCase().includes(s) ||
      l.official_name.toLowerCase().includes(s) ||
      l.aliases.some(a => a.toLowerCase().includes(s))
    );
  }

  return res.json(results);
});

router.get('/:id', (req: Request, res: Response) => {
  const loc = locationsStore.find(l => l.id === req.params.id || l.node_id === req.params.id);
  if (!loc) return res.status(404).json({ error: "Location not found" });
  return res.json(loc);
});

export function updateLocationStore(updated: any[]) {
  locationsStore = updated;
}

export function getLocationStore() {
  return locationsStore;
}

export default router;
