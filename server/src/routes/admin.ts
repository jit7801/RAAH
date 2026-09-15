import { Router, Request, Response } from 'express';
import { getLocationStore, updateLocationStore } from './locations';
import { getClassroomStore, setClassroomStore } from './classrooms';

const router = Router();
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

// Middleware to verify PIN
const verifyPin = (req: Request, res: Response, next: any) => {
  const pin = req.headers['x-admin-pin'] || req.body.pin;
  if (pin !== ADMIN_PIN) {
    return res.status(401).json({ error: "Invalid Admin PIN" });
  }
  next();
};

router.post('/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    return res.json({ success: true, message: "Admin authenticated successfully" });
  }
  return res.status(401).json({ error: "Invalid PIN code" });
});

router.get('/locations', verifyPin, (req: Request, res: Response) => {
  return res.json(getLocationStore());
});

router.post('/locations', verifyPin, (req: Request, res: Response) => {
  const newLoc = req.body;
  newLoc.id = `loc-${Date.now()}`;
  const store = getLocationStore();
  store.push(newLoc);
  updateLocationStore(store);
  return res.status(201).json(newLoc);
});

router.put('/locations/:id', verifyPin, (req: Request, res: Response) => {
  const { id } = req.params;
  const store = getLocationStore();
  const index = store.findIndex(l => l.id === id);
  if (index === -1) return res.status(404).json({ error: "Location not found" });

  store[index] = { ...store[index], ...req.body };
  updateLocationStore(store);
  return res.json(store[index]);
});

router.put('/classrooms/:id', verifyPin, (req: Request, res: Response) => {
  const { id } = req.params;
  const store = getClassroomStore();
  const index = store.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Assignment not found" });

  store[index] = {
    ...store[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  setClassroomStore(store);
  return res.json(store[index]);
});

export default router;
