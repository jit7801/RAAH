import { Router, Request, Response } from 'express';
import { INITIAL_CLASSROOMS, INITIAL_LOCATIONS } from '../data/initialLocations';

const router = Router();
let classroomsStore = [...INITIAL_CLASSROOMS];

router.get('/', (req: Request, res: Response) => {
  const { course } = req.query;
  if (course && typeof course === 'string') {
    const q = course.toLowerCase();
    const found = classroomsStore.filter(c =>
      c.course_code.toLowerCase().includes(q) ||
      c.course_name.toLowerCase().includes(q)
    );
    return res.json(found);
  }
  return res.json(classroomsStore);
});

export function getClassroomStore() {
  return classroomsStore;
}

export function setClassroomStore(newStore: any[]) {
  classroomsStore = newStore;
}

export default router;
