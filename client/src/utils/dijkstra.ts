import { GRAPH_NODES, GRAPH_EDGES } from '../data/graph';
import { DIRECTION_TEMPLATES, type AppLanguage } from '../data/directionTemplates';

export interface RouteStep {
  nodeId: string;
  label: string;
  building: string;
  floor: number;
  x: number;
  y: number;
  instruction: string;
  distanceFromPrev: number;
  direction_hint: 'straight' | 'left' | 'right' | 'stairs_up' | 'stairs_down' | 'start' | 'arrive';
}

export interface RouteResult {
  path: string[];
  totalDistance: number;
  etaMinutes: number;
  steps: RouteStep[];
  polylineCoordinates: Array<[number, number]>;
}

export function computeDijkstraRoute(
  startNodeId: string,
  endNodeId: string,
  lang: AppLanguage = 'hl'
): RouteResult | null {
  if (!GRAPH_NODES[startNodeId] || !GRAPH_NODES[endNodeId]) {
    return null;
  }

  // Build adjacency list
  const adj: Record<string, Array<{ node: string; dist: number; hint: any }>> = {};

  for (const nodeKey in GRAPH_NODES) {
    adj[nodeKey] = [];
  }

  for (const edge of GRAPH_EDGES) {
    if (adj[edge.from] && adj[edge.to]) {
      adj[edge.from].push({ node: edge.to, dist: edge.distance, hint: edge.direction_hint });
      adj[edge.to].push({ node: edge.from, dist: edge.distance, hint: getOppositeHint(edge.direction_hint) });
    }
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, { node: string; dist: number; hint: any } | null> = {};
  const visited = new Set<string>();
  const queue: Array<{ node: string; dist: number }> = [];

  for (const nodeKey in GRAPH_NODES) {
    distances[nodeKey] = Infinity;
    previous[nodeKey] = null;
  }

  distances[startNodeId] = 0;
  queue.push({ node: startNodeId, dist: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift()!;

    if (visited.has(current.node)) continue;
    visited.add(current.node);

    if (current.node === endNodeId) break;

    for (const neighbor of adj[current.node] || []) {
      if (visited.has(neighbor.node)) continue;

      const alt = distances[current.node] + neighbor.dist;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = { node: current.node, dist: neighbor.dist, hint: neighbor.hint };
        queue.push({ node: neighbor.node, dist: alt });
      }
    }
  }

  if (distances[endNodeId] === Infinity) {
    return null;
  }

  // Reconstruct path
  const path: string[] = [];
  const edgeHints: Record<string, { hint: any; dist: number }> = {};
  let currNode: string | null = endNodeId;

  while (currNode) {
    path.unshift(currNode);
    const pInfo: { node: string; dist: number; hint: any } | null = previous[currNode];
    if (pInfo) {
      edgeHints[currNode] = { hint: pInfo.hint, dist: pInfo.dist };
      currNode = pInfo.node;
    } else {
      currNode = null;
    }
  }

  // Generate steps and polyline
  const templates = DIRECTION_TEMPLATES[lang] || DIRECTION_TEMPLATES.hl;
  const steps: RouteStep[] = [];
  const polylineCoordinates: Array<[number, number]> = [];

  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const nodeObj = GRAPH_NODES[nodeId];
    polylineCoordinates.push([nodeObj.x, nodeObj.y]);

    let hint: any = 'straight';
    let dist = 0;
    let instruction = '';

    if (i === 0) {
      hint = 'start';
      instruction = templates.start.replace('{label}', nodeObj.label);
    } else if (i === path.length - 1) {
      hint = 'arrive';
      dist = edgeHints[nodeId]?.dist || 0;
      instruction = templates.arrive.replace('{label}', nodeObj.label);
    } else {
      hint = edgeHints[nodeId]?.hint || 'straight';
      dist = edgeHints[nodeId]?.dist || 0;
      const tpl = templates[hint as keyof typeof templates] || templates.straight;
      instruction = tpl.replace('{label}', nodeObj.label);
    }

    steps.push({
      nodeId,
      label: nodeObj.label,
      building: nodeObj.building,
      floor: nodeObj.floor,
      x: nodeObj.x,
      y: nodeObj.y,
      instruction,
      distanceFromPrev: dist,
      direction_hint: hint
    });
  }

  const totalDistance = distances[endNodeId];
  const etaMinutes = Math.max(1, Math.ceil(totalDistance / 75)); // 75m / min avg walking speed

  return {
    path,
    totalDistance,
    etaMinutes,
    steps,
    polylineCoordinates
  };
}

function getOppositeHint(hint: string): string {
  switch (hint) {
    case 'left': return 'right';
    case 'right': return 'left';
    case 'stairs_up': return 'stairs_down';
    case 'stairs_down': return 'stairs_up';
    default: return 'straight';
  }
}
