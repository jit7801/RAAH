import { INITIAL_LOCATIONS } from '../data/initialLocations';

export interface ServerGraphNode {
  id: string;
  label: string;
  building: string;
  floor: number;
  x: number;
  y: number;
}

export interface ServerGraphEdge {
  from: string;
  to: string;
  distance: number;
  direction_hint: 'straight' | 'left' | 'right' | 'stairs_up' | 'stairs_down';
}

const NODES: Record<string, ServerGraphNode> = {
  main_gate: { id: "main_gate", label: "JIET Main Gate (Pali Road)", building: "Gate Complex", floor: 0, x: 120, y: 530 },
  gate_inner: { id: "gate_inner", label: "Pali Road Inner Corridor", building: "Outdoors", floor: 0, x: 230, y: 530 },
  central_path: { id: "central_path", label: "Central Academic Pathway Junction", building: "Outdoors", floor: 0, x: 400, y: 530 },

  block_a_entrance: { id: "block_a_entrance", label: "Main Academic Block Entrance", building: "Main Academic Block", floor: 0, x: 230, y: 300 },
  block_a_gf: { id: "block_a_gf", label: "Kalam Library Hall", building: "Main Academic Block", floor: 0, x: 230, y: 230 },
  library: { id: "library", label: "Dr. APJ Abdul Kalam Central Library", building: "Main Academic Block", floor: 0, x: 230, y: 200 },
  placement: { id: "placement", label: "Training & Placement Cell (A-105)", building: "Main Academic Block", floor: 1, x: 260, y: 200 },
  aids_dept: { id: "aids_dept", label: "Department of AI & Data Science", building: "Main Academic Block", floor: 2, x: 430, y: 150 },
  ai_lab: { id: "ai_lab", label: "AI & IoT Innovation Lab (A-204)", building: "Main Academic Block", floor: 2, x: 430, y: 130 },

  block_b_entrance: { id: "block_b_entrance", label: "CSE & IT Department Hall", building: "Main Academic Block", floor: 0, x: 430, y: 300 },
  stairs_b: { id: "stairs_b", label: "Main Academic Staircase", building: "Main Academic Block", floor: 0, x: 430, y: 250 },
  block_b_1f: { id: "block_b_1f", label: "CSE 1st Floor Hall", building: "Main Academic Block", floor: 1, x: 430, y: 210 },
  cse_dept: { id: "cse_dept", label: "Department of CSE", building: "Main Academic Block", floor: 1, x: 430, y: 200 },
  cse_lab1: { id: "cse_lab1", label: "Advanced Computing Lab 1 (A-102)", building: "Main Academic Block", floor: 1, x: 460, y: 180 },
  classroom_a101: { id: "classroom_a101", label: "Lecture Hall LT-101 (A-101)", building: "Main Academic Block", floor: 1, x: 430, y: 170 },

  corridor_main: { id: "corridor_main", label: "Visvesvaraya Corridor", building: "Main Academic Block", floor: 0, x: 400, y: 430 },
  auditorium: { id: "auditorium", label: "Visvesvaraya Grand Auditorium", building: "Main Academic Block", floor: 0, x: 400, y: 380 },
  admin_office: { id: "admin_office", label: "Administrative & Registrar Office", building: "Main Academic Block", floor: 1, x: 400, y: 330 },
  principal_office: { id: "principal_office", label: "Director & Principal Office", building: "Main Academic Block", floor: 2, x: 400, y: 310 },

  block_c_entrance: { id: "block_c_entrance", label: "Engineering Block B Entrance", building: "Engineering Block B", floor: 0, x: 630, y: 300 },
  stairs_c: { id: "stairs_c", label: "Block B Staircase", building: "Engineering Block B", floor: 0, x: 630, y: 240 },
  mech_dept: { id: "mech_dept", label: "Department of Mechanical Engineering", building: "Engineering Block B", floor: 0, x: 630, y: 200 },
  mech_lab: { id: "mech_lab", label: "Central Mechanical Workshop (C-001)", building: "Engineering Block B", floor: 0, x: 650, y: 230 },
  classroom_b202: { id: "classroom_b202", label: "Lecture Hall LT-202 (B-202)", building: "Engineering Block B", floor: 2, x: 630, y: 160 },

  block_d_entrance: { id: "block_d_entrance", label: "Block C Electrical Wing Entrance", building: "Block C", floor: 0, x: 650, y: 430 },
  elec_lab: { id: "elec_lab", label: "Electrical Machines Lab (E-101)", building: "Block C", floor: 0, x: 650, y: 380 },

  canteen: { id: "canteen", label: "JIET Student Canteen & Cafeteria", building: "Amenities", floor: 0, x: 230, y: 380 },
  medical_room: { id: "medical_room", label: "Dispensary & Medical Post", building: "Amenities", floor: 0, x: 180, y: 380 },
  tagore_hostel: { id: "tagore_hostel", label: "Tagore Boys Hostel", building: "Hostel Zone", floor: 0, x: 120, y: 200 },
  gargi_hostel: { id: "gargi_hostel", label: "Gargi Girls Hostel", building: "Hostel Zone", floor: 0, x: 120, y: 260 },
  sports: { id: "sports", label: "JIET Sports Complex & Cricket Ground", building: "Outdoors", floor: 0, x: 630, y: 480 }
};

const EDGES: ServerGraphEdge[] = [
  { from: "main_gate", to: "gate_inner", distance: 40, direction_hint: "straight" },
  { from: "gate_inner", to: "central_path", distance: 80, direction_hint: "straight" },
  { from: "gate_inner", to: "tagore_hostel", distance: 130, direction_hint: "left" },
  { from: "tagore_hostel", to: "gargi_hostel", distance: 50, direction_hint: "straight" },
  { from: "gate_inner", to: "medical_room", distance: 100, direction_hint: "right" },

  { from: "central_path", to: "block_a_entrance", distance: 70, direction_hint: "left" },
  { from: "central_path", to: "corridor_main", distance: 50, direction_hint: "straight" },
  { from: "central_path", to: "block_b_entrance", distance: 90, direction_hint: "right" },
  { from: "central_path", to: "canteen", distance: 60, direction_hint: "left" },
  { from: "central_path", to: "sports", distance: 160, direction_hint: "right" },

  { from: "block_a_entrance", to: "block_a_gf", distance: 30, direction_hint: "straight" },
  { from: "block_a_gf", to: "library", distance: 20, direction_hint: "straight" },
  { from: "block_a_gf", to: "placement", distance: 35, direction_hint: "stairs_up" },
  { from: "block_a_gf", to: "aids_dept", distance: 50, direction_hint: "stairs_up" },
  { from: "aids_dept", to: "ai_lab", distance: 20, direction_hint: "straight" },

  { from: "corridor_main", to: "auditorium", distance: 30, direction_hint: "straight" },
  { from: "corridor_main", to: "admin_office", distance: 45, direction_hint: "stairs_up" },
  { from: "admin_office", to: "principal_office", distance: 30, direction_hint: "stairs_up" },

  { from: "block_b_entrance", to: "stairs_b", distance: 30, direction_hint: "straight" },
  { from: "stairs_b", to: "block_b_1f", distance: 25, direction_hint: "stairs_up" },
  { from: "block_b_1f", to: "cse_dept", distance: 20, direction_hint: "straight" },
  { from: "block_b_1f", to: "cse_lab1", distance: 35, direction_hint: "right" },
  { from: "block_b_1f", to: "classroom_a101", distance: 40, direction_hint: "straight" },

  { from: "block_b_entrance", to: "block_c_entrance", distance: 100, direction_hint: "right" },
  { from: "block_c_entrance", to: "stairs_c", distance: 30, direction_hint: "straight" },
  { from: "stairs_c", to: "mech_dept", distance: 25, direction_hint: "straight" },
  { from: "stairs_c", to: "mech_lab", distance: 40, direction_hint: "right" },
  { from: "stairs_c", to: "classroom_b202", distance: 45, direction_hint: "stairs_up" },

  { from: "block_c_entrance", to: "block_d_entrance", distance: 80, direction_hint: "right" },
  { from: "block_d_entrance", to: "elec_lab", distance: 30, direction_hint: "straight" },

  { from: "canteen", to: "medical_room", distance: 40, direction_hint: "left" }
];

export function calculateRoute(startNodeId: string, endNodeId: string) {
  if (!NODES[startNodeId] || !NODES[endNodeId]) {
    return null;
  }

  const adj: Record<string, Array<{ node: string; dist: number; hint: any }>> = {};
  for (const k in NODES) adj[k] = [];

  for (const e of EDGES) {
    if (adj[e.from] && adj[e.to]) {
      adj[e.from].push({ node: e.to, dist: e.distance, hint: e.direction_hint });
      adj[e.to].push({ node: e.from, dist: e.distance, hint: e.direction_hint });
    }
  }

  const dists: Record<string, number> = {};
  const prev: Record<string, { node: string; hint: any; dist: number } | null> = {};
  const visited = new Set<string>();
  const pq: Array<{ node: string; dist: number }> = [];

  for (const k in NODES) {
    dists[k] = Infinity;
    prev[k] = null;
  }

  dists[startNodeId] = 0;
  pq.push({ node: startNodeId, dist: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const curr = pq.shift()!;

    if (visited.has(curr.node)) continue;
    visited.add(curr.node);
    if (curr.node === endNodeId) break;

    for (const neighbor of adj[curr.node] || []) {
      if (visited.has(neighbor.node)) continue;
      const alt = dists[curr.node] + neighbor.dist;
      if (alt < dists[neighbor.node]) {
        dists[neighbor.node] = alt;
        prev[neighbor.node] = { node: curr.node, hint: neighbor.hint, dist: neighbor.dist };
        pq.push({ node: neighbor.node, dist: alt });
      }
    }
  }

  if (dists[endNodeId] === Infinity) return null;

  const path: string[] = [];
  let current: string | null = endNodeId;
  const edgeInfo: Record<string, { hint: any; dist: number }> = {};

  while (current) {
    path.unshift(current);
    const p = prev[current];
    if (p) {
      edgeInfo[current] = { hint: p.hint, dist: p.dist };
      current = p.node;
    } else {
      current = null;
    }
  }

  const polyline: Array<[number, number]> = path.map(id => [NODES[id].x, NODES[id].y]);
  const totalDistance = dists[endNodeId];
  const etaMinutes = Math.max(1, Math.ceil(totalDistance / 75));

  const steps = path.map((id, index) => {
    const node = NODES[id];
    return {
      nodeId: id,
      label: node.label,
      building: node.building,
      floor: node.floor,
      x: node.x,
      y: node.y,
      hint: index === 0 ? 'start' : (index === path.length - 1 ? 'arrive' : (edgeInfo[id]?.hint || 'straight')),
      distanceFromPrev: index === 0 ? 0 : (edgeInfo[id]?.dist || 0)
    };
  });

  return {
    startNode: NODES[startNodeId],
    destinationNode: NODES[endNodeId],
    path,
    polyline,
    totalDistance,
    etaMinutes,
    steps
  };
}
