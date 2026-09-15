import { CAMPUS_LOCATIONS, type LocationItem } from '../data/locations';

export interface MatchResult {
  matchedLocation: LocationItem | null;
  ambiguousOptions: string[] | null;
  responseText: string;
  confidence: number;
}

// 1. Cross-Language Comprehensive Synonym & Concept Map
const SYNONYM_MAP: Record<string, string> = {
  // Library & Reading
  'pustakalaya': 'library',
  'reading': 'library',
  'study': 'library',
  'kitab': 'library',
  'books': 'library',
  'book': 'library',
  'kalam': 'library',
  'apj': 'library',
  'lib': 'library',

  // CSE & Computing
  'cs': 'cse_dept',
  'computer': 'cse_dept',
  'software': 'cse_dept',
  'coding': 'cse_dept',
  'programming': 'cse_dept',
  'cse': 'cse_dept',

  // AI & Data Science
  'ai': 'aids_dept',
  'ds': 'aids_dept',
  'aids': 'aids_dept',
  'ml': 'aids_dept',
  'robotics': 'aids_dept',
  'machine': 'aids_dept',

  // Mechanical
  'mech': 'mech_dept',
  'mechanical': 'mech_dept',
  'cad': 'mech_dept',
  'thermal': 'mech_dept',

  // Auditorium
  'audi': 'auditorium',
  'auditorium': 'auditorium',
  'hall': 'auditorium',
  'seminar': 'auditorium',
  'fest': 'auditorium',
  'event': 'auditorium',
  'convocation': 'auditorium',
  'visvesvaraya': 'auditorium',

  // Food & Canteen
  'khana': 'canteen',
  'food': 'canteen',
  'cafeteria': 'canteen',
  'chai': 'canteen',
  'kachori': 'canteen',
  'tea': 'canteen',
  'coffee': 'canteen',
  'breakfast': 'canteen',
  'lunch': 'canteen',
  'snacks': 'canteen',
  'mess': 'canteen',

  // Admin & Office
  'admin': 'admin_office',
  'office': 'admin_office',
  'fee': 'admin_office',
  'fees': 'admin_office',
  'counter': 'admin_office',
  'accounts': 'admin_office',
  'registrar': 'admin_office',
  'scholarship': 'admin_office',
  'chalan': 'admin_office',

  // Labs
  'cse lab': 'cse_lab1',
  'programming lab': 'cse_lab1',
  'a102': 'cse_lab1',
  'ai lab': 'ai_lab',
  'iot lab': 'ai_lab',
  'a204': 'ai_lab',
  'workshop': 'mech_lab',
  'mechanical lab': 'mech_lab',
  'c001': 'mech_lab',
  'electrical lab': 'elec_lab',
  'ee lab': 'elec_lab',
  'machines lab': 'elec_lab',
  'e101': 'elec_lab',

  // Classrooms
  'a101': 'classroom_a101',
  'lt101': 'classroom_a101',
  'b202': 'classroom_b202',
  'lt202': 'classroom_b202',
  'dbms': 'classroom_a101',

  // Hostels
  'tagore': 'tagore_hostel',
  'boys hostel': 'tagore_hostel',
  'boy hostel': 'tagore_hostel',
  'gargi': 'gargi_hostel',
  'girls hostel': 'gargi_hostel',
  'girl hostel': 'gargi_hostel',

  // Placement
  'placement': 'placement',
  'tnp': 'placement',
  'job': 'placement',
  'interview': 'placement',
  'career': 'placement',

  // Medical
  'medical': 'medical_room',
  'dispensary': 'medical_room',
  'doctor': 'medical_room',
  'clinic': 'medical_room',
  'first aid': 'medical_room',
  'bimar': 'medical_room',
  'dawa': 'medical_room',

  // Sports
  'sports': 'sports',
  'cricket': 'sports',
  'ground': 'sports',
  'football': 'sports',
  'volleyball': 'sports',

  // Principal / Director
  'principal': 'principal_office',
  'director': 'principal_office',
  'head': 'principal_office',

  // Main Gate
  'gate': 'main_gate',
  'entry': 'main_gate',
  'pali road': 'main_gate'
};

// 2. Levenshtein Edit Distance Helper
export function editDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// 3. Hyper-Robust 5-Layer Location Matcher Engine
export function matchCampusLocation(userQuery: string): MatchResult {
  const rawClean = userQuery
    .toLowerCase()
    .replace(/[.,?!।;:()\-/"'\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!rawClean) {
    return {
      matchedLocation: null,
      ambiguousOptions: null,
      responseText: "Please enter a classroom, lab, or department to navigate.",
      confidence: 0
    };
  }

  // Check Ambiguous Lab
  if (rawClean === 'lab' || rawClean === 'labs' || rawClean.includes('lab kaha') || rawClean === 'लैब') {
    return {
      matchedLocation: null,
      ambiguousOptions: ["CSE Lab 1", "Mechanical Workshop Lab", "Electrical Lab"],
      responseText: "Which lab are you looking for? (CSE Lab, Mechanical Workshop, or Electrical Lab)",
      confidence: 0.95
    };
  }

  // Check Ambiguous Hostel
  if (rawClean === 'hostel' || rawClean === 'hostels' || rawClean.includes('hostel kaha') || rawClean === 'हॉस्टल') {
    return {
      matchedLocation: null,
      ambiguousOptions: ["Tagore Boys Hostel", "Gargi Girls Hostel"],
      responseText: "Which hostel are you looking for? (Tagore Boys Hostel or Gargi Girls Hostel)",
      confidence: 0.95
    };
  }

  // Normalize Devanagari Script & Phonetics into Standard English Tokens
  const normalized = rawClean
    .replace(/सीएसई|कंप्यूटर/g, ' cse computer ')
    .replace(/कलाम/g, ' kalam ')
    .replace(/लाइब्रेरी|पुस्तकालय/g, ' library ')
    .replace(/कैंटीन|कंटीन|खाना|कैफे/g, ' canteen ')
    .replace(/ऑडिटोरियम|विश्वेश्वरैया|ऑडी/g, ' auditorium ')
    .replace(/मैकेनिकल|मेकैनिकल/g, ' mechanical ')
    .replace(/इलेक्ट्रिकल/g, ' electrical ')
    .replace(/एडमिन|कार्यालय|प्रशासन|फीस/g, ' admin ')
    .replace(/हॉस्टल|टैगोर|गार्गी/g, ' hostel tagore gargi ')
    .replace(/लैब|वर्कशॉप/g, ' lab workshop ')
    .replace(/ब्लॉक/g, ' block ')
    .replace(/डिपार्टमेंट|विभाग/g, ' department ')
    .replace(/स्पोर्ट्स|मैदान|क्रिकेट/g, ' sports cricket ')
    .replace(/गेट|द्वार|मुख्य/g, ' gate main ')
    .replace(/मेडिकल|डिस्पेंसरी|डॉक्टर/g, ' medical dispensary ')
    .replace(/प्लेसमेंट/g, ' placement ')
    .replace(/\s+/g, ' ')
    .trim();

  // Check Synonym Map
  for (const [key, mappedNodeId] of Object.entries(SYNONYM_MAP)) {
    if (rawClean.includes(key) || normalized.includes(key)) {
      const loc = CAMPUS_LOCATIONS.find(l => l.node_id === mappedNodeId || l.id === mappedNodeId);
      if (loc) {
        return {
          matchedLocation: loc,
          ambiguousOptions: null,
          responseText: `${loc.name} (${loc.building}, Floor ${loc.floor}) found! Route generated below.`,
          confidence: 0.98
        };
      }
    }
  }

  // Scoring Engine across CAMPUS_LOCATIONS
  let bestCandidate: { location: LocationItem; score: number } | null = null;
  const tokens = normalized.split(/\s+/).filter(t => t.length > 1);

  for (const loc of CAMPUS_LOCATIONS) {
    let score = 0;
    const nameLower = loc.name.toLowerCase();
    const officialLower = loc.official_name.toLowerCase();
    const buildingLower = loc.building.toLowerCase();
    const roomLower = (loc.room_number || '').toLowerCase();
    const nodeLower = loc.node_id.toLowerCase();
    const aliasesLower = loc.aliases.map(a => a.toLowerCase());

    // 1. Direct substring match
    if (rawClean.includes(nameLower) || nameLower.includes(rawClean)) score += 100;
    if (rawClean.includes(officialLower) || officialLower.includes(rawClean)) score += 95;
    if (roomLower && (rawClean.includes(roomLower) || roomLower.includes(rawClean))) score += 90;

    // 2. Alias substring match
    for (const alias of aliasesLower) {
      if (rawClean.includes(alias) || alias.includes(rawClean) || normalized.includes(alias)) {
        score += 85;
      }
    }

    // 3. Token Overlap Score
    for (const tok of tokens) {
      if (tok.length <= 1) continue;
      if (nodeLower.includes(tok)) score += 35;
      if (nameLower.includes(tok)) score += 30;
      if (buildingLower.includes(tok)) score += 25;
      if (aliasesLower.some(a => a.includes(tok))) score += 30;
    }

    // 4. Fuzzy Levenshtein Distance Check on Tokens vs Aliases
    for (const tok of tokens) {
      if (tok.length < 3) continue;
      for (const alias of aliasesLower) {
        const dist = editDistance(tok, alias);
        if (dist <= 2) {
          score += (30 - dist * 8);
        }
      }
    }

    if (score > (bestCandidate?.score || 0)) {
      bestCandidate = { location: loc, score };
    }
  }

  if (bestCandidate && bestCandidate.score >= 20) {
    const loc = bestCandidate.location;
    return {
      matchedLocation: loc,
      ambiguousOptions: null,
      responseText: `${loc.name} (${loc.building}, Floor ${loc.floor}) found! Route generated below.`,
      confidence: Math.min(0.99, bestCandidate.score / 100)
    };
  }

  return {
    matchedLocation: null,
    ambiguousOptions: null,
    responseText: "Could not find that exact campus location. Try searching for Library, CSE Dept, Auditorium, Canteen, or Hostel.",
    confidence: 0.1
  };
}
