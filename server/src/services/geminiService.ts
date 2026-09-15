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
You are DISHA AI, an intelligent multilingual campus navigation assistant.
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

function performHeuristicNLU(query: string): NLUAnalysisResult | null {
  // Check ambiguous lab query
  if (query === 'lab' || query === 'lab kaha hai' || query === 'lab kidhar hai' || query === 'where is lab') {
    return {
      intent: 'ambiguous',
      destination_name: null,
      destination_node_id: null,
      course_query: null,
      language: query.includes('where') ? 'english' : 'hinglish',
      ambiguous_options: ["CSE Lab 1", "Mechanical Workshop Lab", "Electrical Lab"],
      response_text: "Aap kaun sa lab dhundh rahe hain?",
      confidence: 0.95
    };
  }

  // Check course/classroom queries (Field research case)
  if (query.includes('dbms') || query.includes('cs301')) {
    const dbmsClass = INITIAL_CLASSROOMS.find(c => c.course_code === 'CS301');
    const loc = INITIAL_LOCATIONS.find(l => l.room_number === 'C-103' || l.id === dbmsClass?.location_id);
    return {
      intent: 'navigate',
      destination_name: loc?.name || "Classroom C-103",
      destination_node_id: loc?.node_id || "classroom_c103",
      course_query: "DBMS",
      language: 'hinglish',
      response_text: "Aaj ki DBMS class C-103 (Block C, 1st Floor) mein hai. Let me show you the route!",
      confidence: 0.95
    };
  }

  // Match location by aliases or name
  for (const loc of INITIAL_LOCATIONS) {
    for (const alias of loc.aliases) {
      if (query.includes(alias.toLowerCase())) {
        const lang: 'hindi' | 'english' | 'hinglish' =
          query.includes('where') ? 'english' : (query.includes('kaha') || query.includes('kidhar') ? 'hinglish' : 'hindi');

        return {
          intent: 'navigate',
          destination_name: loc.name,
          destination_node_id: loc.node_id,
          course_query: null,
          language: lang,
          response_text: `${loc.name} ${loc.building} mein floor ${loc.floor} par hai. Route generated below!`,
          confidence: 0.9
        };
      }
    }
  }

  return null;
}
