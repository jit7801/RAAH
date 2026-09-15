import { GoogleGenerativeAI } from '@google/generative-ai';
import { INITIAL_LOCATIONS, INITIAL_CLASSROOMS } from '../data/initialLocations';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface NLUAnalysisResult {
  intent: 'navigate' | 'query_info' | 'ambiguous' | 'unknown';
  destination_name: string | null;
  destination_node_id: string | null;
  course_query: string | null;
  language: 'hindi' | 'english' | 'hinglish';
  ambiguous_options?: string[];
  response_text: string;
  confidence: number;
}

export async function processUserQuery(userQuery: string): Promise<NLUAnalysisResult> {
  const queryLower = userQuery.toLowerCase().trim();

  // 1. Direct heuristic fallback for common demo queries (guarantees fast & offline-proof demo)
  const localMatch = performHeuristicNLU(queryLower);
  if (localMatch && (!genAI || localMatch.confidence >= 0.85)) {
    return localMatch;
  }

  // 2. LLM Call via Gemini 1.5 Flash if API key is present
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are RAAH AI, an intelligent multilingual campus navigation assistant.
Your task is to analyze a user query and extract navigation details.

Available campus locations:
${JSON.stringify(INITIAL_LOCATIONS.map(l => ({ name: l.name, node_id: l.node_id, aliases: l.aliases, building: l.building, room: l.room_number })))}

Active classroom assignments:
${JSON.stringify(INITIAL_CLASSROOMS.map(c => ({ course: c.course_name, code: c.course_code, room: c.room_number, location_id: c.location_id })))}

User query: "${userQuery}"

Respond strictly with valid JSON only, using this schema:
{
  "intent": "navigate" | "query_info" | "ambiguous" | "unknown",
  "destination_name": "<exact matched location name or null>",
  "destination_node_id": "<exact node_id or null>",
  "course_query": "<course name if user asked about class location, else null>",
  "language": "hindi" | "english" | "hinglish",
  "ambiguous_options": ["<location name 1>", "<location name 2>"],
  "response_text": "<Polite, accurate response to user in their language>",
  "confidence": 0.95
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed: NLUAnalysisResult = JSON.parse(cleanedJson);
      return parsed;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local NLU engine:", err);
    }
  }

  // 3. Fallback engine if Gemini fails or key missing
  return localMatch || {
    intent: 'unknown',
    destination_name: null,
    destination_node_id: null,
    course_query: null,
    language: 'hinglish',
    response_text: "Kshama kijiye, mujhe yeh location nahi mil saki. Kripya building, lab, ya department name search karein.",
    confidence: 0.2
  };
}

function performHeuristicNLU(userQuery: string): NLUAnalysisResult | null {
  const cleanQuery = userQuery
    .toLowerCase()
    .replace(/[.,?!।]/g, '')
    .trim();

  // 1. Direct ambiguous lab check
  if (cleanQuery === 'lab' || cleanQuery === 'lab kaha' || cleanQuery.includes('lab kaha') || cleanQuery === 'लैब' || cleanQuery === 'where is lab') {
    return {
      intent: 'ambiguous',
      destination_name: null,
      destination_node_id: null,
      course_query: null,
      language: 'hinglish',
      ambiguous_options: ["CSE Lab 1", "Mechanical Workshop Lab", "Electrical Lab"],
      response_text: "Aap kaun sa lab dhundh rahe हैं? (CSE Lab, Mechanical Workshop, ya Electrical Lab)",
      confidence: 0.95
    };
  }

  // 2. Direct ambiguous hostel check
  if (cleanQuery === 'hostel' || cleanQuery === 'hostel kaha' || cleanQuery === 'हॉस्टल') {
    return {
      intent: 'ambiguous',
      destination_name: null,
      destination_node_id: null,
      course_query: null,
      language: 'hinglish',
      ambiguous_options: ["Tagore Boys Hostel", "Gargi Girls Hostel"],
      response_text: "Aap kaun sa hostel dhundh rahe hain? (Tagore Boys Hostel ya Gargi Girls Hostel)",
      confidence: 0.95
    };
  }

  // 3. Dynamic course / classroom lookup (e.g. DBMS, CS301, OS)
  if (cleanQuery.includes('dbms') || cleanQuery.includes('cs301')) {
    const targetNode = 'classroom_a101';
    const loc = INITIAL_LOCATIONS.find(l => l.node_id === targetNode);
    return {
      intent: 'navigate',
      destination_name: loc?.name || "Classroom A-101",
      destination_node_id: targetNode,
      course_query: "DBMS",
      language: 'hinglish',
      response_text: "Today's DBMS class is in Classroom A-101 (Main Academic Block, Floor 1). Route generated below!",
      confidence: 0.98
    };
  }

  // 4. Token Normalization (Devanagari to Phonetic English + Stopwords filter)
  let normalized = cleanQuery
    .replace(/सीएसई|कंप्यूटर/g, 'cse computer')
    .replace(/कलाम/g, 'kalam')
    .replace(/लाइब्रेरी|पुस्तकालय/g, 'library')
    .replace(/कैंटीन|कंटीन|खाना|कैफे/g, 'canteen')
    .replace(/ऑडिटोरियम|विश्वेश्वरैया|ऑडी/g, 'auditorium')
    .replace(/मैकेनिकल|मेकैनिकल/g, 'mechanical')
    .replace(/इलेक्ट्रिकल/g, 'electrical')
    .replace(/एडमिन|कार्यालय|प्रशासन|फीस/g, 'admin')
    .replace(/हॉस्टल|टैगोर|गार्गी/g, 'hostel tagore gargi')
    .replace(/लैब|वर्कशॉप/g, 'lab workshop')
    .replace(/ब्लॉक/g, 'block')
    .replace(/डिपार्टमेंट|विभाग/g, 'department')
    .replace(/स्पोर्ट्स|मैदान|क्रिकेट/g, 'sports cricket')
    .replace(/गेट|द्वार|मुख्य/g, 'gate main')
    .replace(/मेडिकल|डिस्पेंसरी|डॉक्टर/g, 'medical dispensary');

  let bestMatch: { location: typeof INITIAL_LOCATIONS[0]; score: number } | null = null;

  for (const loc of INITIAL_LOCATIONS) {
    let score = 0;
    const nameLower = loc.name.toLowerCase();
    const buildingLower = loc.building.toLowerCase();
    const nodeLower = loc.node_id.toLowerCase();
    const aliasesLower = loc.aliases.map(a => a.toLowerCase());

    // Check direct substring matches on aliases or names
    if (aliasesLower.some(alias => cleanQuery.includes(alias) || alias.includes(cleanQuery) || normalized.includes(alias))) {
      score += 80;
    }

    if (nameLower.includes(cleanQuery) || cleanQuery.includes(nameLower)) {
      score += 90;
    }

    // Token intersection check
    const queryTokens = normalized.split(/\s+/).filter(t => t.length > 1);
    for (const token of queryTokens) {
      if (nodeLower.includes(token)) score += 35;
      if (nameLower.includes(token)) score += 30;
      if (buildingLower.includes(token)) score += 25;
      if (aliasesLower.some(a => a.includes(token))) score += 30;
    }

    if (score > (bestMatch?.score || 0)) {
      bestMatch = { location: loc, score };
    }
  }

  if (bestMatch && bestMatch.score >= 25) {
    const loc = bestMatch.location;
    return {
      intent: 'navigate',
      destination_name: loc.name,
      destination_node_id: loc.node_id,
      course_query: null,
      language: 'hinglish',
      response_text: `${loc.name} (${loc.building}, Floor ${loc.floor}) found! Route generated below.`,
      confidence: 0.95
    };
  }

  return null;
}
