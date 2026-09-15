import React, { createContext, useContext, useState } from 'react';
import { computeDijkstraRoute, type RouteResult } from '../utils/dijkstra';
import { CAMPUS_LOCATIONS, type LocationItem } from '../data/locations';
import { useLanguage } from './LanguageContext';

interface NavigationContextType {
  startNodeId: string;
  setStartNodeId: (id: string) => void;
  destinationNodeId: string | null;
  setDestinationNodeId: (id: string | null) => void;
  currentRoute: RouteResult | null;
  activeDestination: LocationItem | null;
  ambiguousOptions: string[] | null;
  setAmbiguousOptions: (opts: string[] | null) => void;
  aiResponseText: string | null;
  setAiResponseText: (text: string | null) => void;
  processQueryText: (query: string) => Promise<void>;
  resetNavigation: () => void;
  isLoading: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [startNodeId, setStartNodeId] = useState<string>('main_gate');
  const [destinationNodeId, setDestinationNodeIdState] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [ambiguousOptions, setAmbiguousOptions] = useState<string[] | null>(null);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeDestination = destinationNodeId
    ? CAMPUS_LOCATIONS.find(l => l.node_id === destinationNodeId || l.id === destinationNodeId) || null
    : null;

  const setDestinationNodeId = (destId: string | null) => {
    setDestinationNodeIdState(destId);
    setAmbiguousOptions(null);
    if (destId) {
      const route = computeDijkstraRoute(startNodeId, destId, language);
      setCurrentRoute(route);
    } else {
      setCurrentRoute(null);
    }
  };

  const processQueryText = async (userQuery: string) => {
    setIsLoading(true);
    setAmbiguousOptions(null);

    try {
      const res = await fetch('http://localhost:5001/api/v1/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery, startNode: startNodeId })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();

        if (data.nlu.intent === 'ambiguous' && data.nlu.ambiguous_options) {
          setAiResponseText(data.nlu.response_text);
          setAmbiguousOptions(data.nlu.ambiguous_options);
          setDestinationNodeIdState(null);
          setCurrentRoute(null);
        } else if (data.nlu.destination_node_id) {
          setAiResponseText(data.nlu.response_text);
          setDestinationNodeIdState(data.nlu.destination_node_id);
          const route = computeDijkstraRoute(startNodeId, data.nlu.destination_node_id, language);
          setCurrentRoute(route);
        } else {
          performClientFallbackQuery(userQuery);
        }
      } else {
        performClientFallbackQuery(userQuery);
      }
    } catch (e) {
      performClientFallbackQuery(userQuery);
    } finally {
      setIsLoading(false);
    }
  };

  const performClientFallbackQuery = (query: string) => {
    const cleanQuery = query.toLowerCase().replace(/[.,?!।]/g, '').trim();

    if (cleanQuery === 'lab' || cleanQuery.includes('lab kaha') || cleanQuery === 'लैब') {
      setAmbiguousOptions(["CSE Lab 1", "Mechanical Workshop Lab", "Electrical Lab"]);
      setAiResponseText("Multiple labs found on campus. Which lab are you looking for?");
      return;
    }

    if (cleanQuery === 'hostel' || cleanQuery.includes('hostel kaha') || cleanQuery === 'हॉस्टल') {
      setAmbiguousOptions(["Tagore Boys Hostel", "Gargi Girls Hostel"]);
      setAiResponseText("Multiple hostels found on campus. Which hostel are you looking for?");
      return;
    }

    if (cleanQuery.includes('dbms') || cleanQuery.includes('cs301')) {
      const targetNode = 'classroom_a101';
      setAiResponseText("Today's DBMS class is in Classroom A-101 (Main Academic Block, Floor 1). Route generated below!");
      setDestinationNodeIdState(targetNode);
      setCurrentRoute(computeDijkstraRoute(startNodeId, targetNode, language));
      return;
    }

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

    let bestMatch: { location: typeof CAMPUS_LOCATIONS[0]; score: number } | null = null;

    for (const loc of CAMPUS_LOCATIONS) {
      let score = 0;
      const nameLower = loc.name.toLowerCase();
      const buildingLower = loc.building.toLowerCase();
      const nodeLower = loc.node_id.toLowerCase();
      const aliasesLower = loc.aliases.map(a => a.toLowerCase());

      if (aliasesLower.some(alias => cleanQuery.includes(alias) || alias.includes(cleanQuery) || normalized.includes(alias))) {
        score += 80;
      }

      if (nameLower.includes(cleanQuery) || cleanQuery.includes(nameLower)) {
        score += 90;
      }

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
      setAiResponseText(`${loc.name} (${loc.building}, Floor ${loc.floor}) found! Route highlighted below.`);
      setDestinationNodeIdState(loc.node_id);
      setCurrentRoute(computeDijkstraRoute(startNodeId, loc.node_id, language));
      return;
    }

    setAiResponseText("Could not match that exact location. Try searching for Library, CSE Dept, Auditorium, or Canteen.");
  };

  const resetNavigation = () => {
    setDestinationNodeIdState(null);
    setCurrentRoute(null);
    setAmbiguousOptions(null);
    setAiResponseText(null);
  };

  return (
    <NavigationContext.Provider
      value={{
        startNodeId,
        setStartNodeId,
        destinationNodeId,
        setDestinationNodeId,
        currentRoute,
        activeDestination,
        ambiguousOptions,
        setAmbiguousOptions,
        aiResponseText,
        setAiResponseText,
        processQueryText,
        resetNavigation,
        isLoading
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};
