export interface GraphNode {
  id: string;
  label: string;
  building: string;
  floor: number;
  x: number;
  y: number;
  node_type: 'location' | 'waypoint' | 'junction';
}

export interface GraphEdge {
  from: string;
  to: string;
  distance: number;
  direction_hint: 'straight' | 'left' | 'right' | 'stairs_up' | 'stairs_down';
}

export const GRAPH_NODES: Record<string, GraphNode> = {
  main_gate: { id: "main_gate", label: "Main Gate", building: "Gate Area", floor: 0, x: 120, y: 530, node_type: "location" },
  gate_inner: { id: "gate_inner", label: "Inner Gate Junction", building: "Gate Area", floor: 0, x: 230, y: 530, node_type: "waypoint" },
  central_path: { id: "central_path", label: "Central Pathway Junction", building: "Outdoors", floor: 0, x: 400, y: 530, node_type: "junction" },

  block_a_entrance: { id: "block_a_entrance", label: "Block A Entrance", building: "Block A", floor: 0, x: 230, y: 300, node_type: "waypoint" },
  block_a_gf: { id: "block_a_gf", label: "Block A Ground Floor Hall", building: "Block A", floor: 0, x: 230, y: 230, node_type: "waypoint" },
  library: { id: "library", label: "Central Library", building: "Block A", floor: 0, x: 230, y: 200, node_type: "location" },
  placement: { id: "placement", label: "Placement Cell (A-101)", building: "Block A", floor: 1, x: 260, y: 200, node_type: "location" },
  seminar: { id: "seminar", label: "Seminar Room (A-201)", building: "Block A", floor: 2, x: 230, y: 160, node_type: "location" },

  block_b_entrance: { id: "block_b_entrance", label: "Block B Entrance", building: "Block B", floor: 0, x: 430, y: 300, node_type: "waypoint" },
  stairs_b: { id: "stairs_b", label: "Block B Staircase", building: "Block B", floor: 0, x: 430, y: 250, node_type: "waypoint" },
  block_b_1f: { id: "block_b_1f", label: "Block B 1st Floor Hall", building: "Block B", floor: 1, x: 430, y: 210, node_type: "junction" },
  cse_dept: { id: "cse_dept", label: "CSE Department", building: "Block B", floor: 1, x: 430, y: 200, node_type: "location" },
  cse_lab1: { id: "cse_lab1", label: "CSE Lab 1 (B-101)", building: "Block B", floor: 1, x: 460, y: 180, node_type: "location" },
  hod_cse: { id: "hod_cse", label: "HOD CSE Cabin", building: "Block B", floor: 1, x: 400, y: 200, node_type: "location" },
  washroom_b: { id: "washroom_b", label: "Washroom Block B", building: "Block B", floor: 1, x: 470, y: 220, node_type: "location" },
  classroom_b204: { id: "classroom_b204", label: "Classroom B-204", building: "Block B", floor: 2, x: 430, y: 150, node_type: "location" },

  corridor_main: { id: "corridor_main", label: "Main Building Corridor", building: "Main Building", floor: 0, x: 400, y: 430, node_type: "junction" },
  auditorium: { id: "auditorium", label: "Main Auditorium", building: "Main Building", floor: 0, x: 400, y: 380, node_type: "location" },
  admin_office: { id: "admin_office", label: "Admin Office", building: "Main Building", floor: 1, x: 400, y: 330, node_type: "location" },
  principal_office: { id: "principal_office", label: "Principal's Office", building: "Main Building", floor: 2, x: 400, y: 310, node_type: "location" },

  block_c_entrance: { id: "block_c_entrance", label: "Block C Entrance", building: "Block C", floor: 0, x: 630, y: 300, node_type: "waypoint" },
  stairs_c: { id: "stairs_c", label: "Block C Staircase", building: "Block C", floor: 0, x: 630, y: 240, node_type: "waypoint" },
  mech_dept: { id: "mech_dept", label: "Mechanical Department", building: "Block C", floor: 0, x: 630, y: 200, node_type: "location" },
  mech_lab: { id: "mech_lab", label: "Mechanical Workshop Lab", building: "Block C", floor: 0, x: 650, y: 230, node_type: "location" },
  classroom_c103: { id: "classroom_c103", label: "Classroom C-103", building: "Block C", floor: 1, x: 630, y: 160, node_type: "location" },

  block_d_entrance: { id: "block_d_entrance", label: "Block D Entrance", building: "Block D", floor: 0, x: 650, y: 430, node_type: "waypoint" },
  elec_lab: { id: "elec_lab", label: "Electrical Lab", building: "Block D", floor: 0, x: 650, y: 380, node_type: "location" },

  canteen: { id: "canteen", label: "Campus Canteen", building: "Amenities", floor: 0, x: 230, y: 380, node_type: "location" },
  medical_room: { id: "medical_room", label: "Medical Centre", building: "Amenities", floor: 0, x: 180, y: 380, node_type: "location" },
  hostel: { id: "hostel", label: "Hostel Block", building: "Hostel", floor: 0, x: 120, y: 200, node_type: "location" },
  sports: { id: "sports", label: "Sports Ground", building: "Outdoors", floor: 0, x: 630, y: 480, node_type: "location" }
};

export const GRAPH_EDGES: GraphEdge[] = [
  { from: "main_gate", to: "gate_inner", distance: 40, direction_hint: "straight" },
  { from: "gate_inner", to: "central_path", distance: 80, direction_hint: "straight" },
  { from: "gate_inner", to: "hostel", distance: 150, direction_hint: "left" },
  { from: "gate_inner", to: "medical_room", distance: 100, direction_hint: "right" },

  { from: "central_path", to: "block_a_entrance", distance: 70, direction_hint: "left" },
  { from: "central_path", to: "corridor_main", distance: 50, direction_hint: "straight" },
  { from: "central_path", to: "block_b_entrance", distance: 90, direction_hint: "right" },
  { from: "central_path", to: "canteen", distance: 60, direction_hint: "left" },
  { from: "central_path", to: "sports", distance: 160, direction_hint: "right" },

  { from: "block_a_entrance", to: "block_a_gf", distance: 30, direction_hint: "straight" },
  { from: "block_a_gf", to: "library", distance: 20, direction_hint: "straight" },
  { from: "block_a_gf", to: "placement", distance: 35, direction_hint: "stairs_up" },
  { from: "block_a_gf", to: "seminar", distance: 50, direction_hint: "stairs_up" },

  { from: "corridor_main", to: "auditorium", distance: 30, direction_hint: "straight" },
  { from: "corridor_main", to: "admin_office", distance: 45, direction_hint: "stairs_up" },
  { from: "admin_office", to: "principal_office", distance: 30, direction_hint: "stairs_up" },

  { from: "block_b_entrance", to: "stairs_b", distance: 30, direction_hint: "straight" },
  { from: "stairs_b", to: "block_b_1f", distance: 25, direction_hint: "stairs_up" },
  { from: "block_b_1f", to: "cse_dept", distance: 20, direction_hint: "straight" },
  { from: "block_b_1f", to: "cse_lab1", distance: 35, direction_hint: "right" },
  { from: "block_b_1f", to: "hod_cse", distance: 25, direction_hint: "left" },
  { from: "block_b_1f", to: "washroom_b", distance: 30, direction_hint: "right" },
  { from: "block_b_1f", to: "classroom_b204", distance: 50, direction_hint: "stairs_up" },

  { from: "block_b_entrance", to: "block_c_entrance", distance: 100, direction_hint: "right" },
  { from: "block_c_entrance", to: "stairs_c", distance: 30, direction_hint: "straight" },
  { from: "stairs_c", to: "mech_dept", distance: 25, direction_hint: "straight" },
  { from: "stairs_c", to: "mech_lab", distance: 40, direction_hint: "right" },
  { from: "stairs_c", to: "classroom_c103", distance: 45, direction_hint: "stairs_up" },

  { from: "block_c_entrance", to: "block_d_entrance", distance: 80, direction_hint: "right" },
  { from: "block_d_entrance", to: "elec_lab", distance: 30, direction_hint: "straight" },

  { from: "canteen", to: "medical_room", distance: 40, direction_hint: "left" }
];
