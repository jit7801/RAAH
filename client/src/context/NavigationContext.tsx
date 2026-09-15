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
        setAiResponseText(data.nlu.response_text);

        if (data.nlu.intent === 'ambiguous' && data.nlu.ambiguous_options) {
          setAmbiguousOptions(data.nlu.ambiguous_options);
          setDestinationNodeIdState(null);
          setCurrentRoute(null);
        } else if (data.nlu.destination_node_id) {
          setDestinationNodeIdState(data.nlu.destination_node_id);
          const route = computeDijkstraRoute(startNodeId, data.nlu.destination_node_id, language);
          setCurrentRoute(route);
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
    const qClean = query.toLowerCase().replace(/[.,?!।]/g, '').trim();

    if (qClean === 'lab' || qClean.includes('lab kaha') || qClean.includes('लैब')) {
      setAmbiguousOptions(["CSE Lab 1", "Mechanical Workshop Lab", "Electrical Lab"]);
      setAiResponseText("Multiple labs found on campus. Which lab are you looking for?");
      return;
    }

    if (qClean.includes('dbms') || qClean.includes('cs301')) {
      const targetNode = 'classroom_a101';
      setAiResponseText("Today's DBMS class is in Classroom A-101 (Main Academic Block, Floor 1). Route generated below!");
      setDestinationNodeIdState(targetNode);
      setCurrentRoute(computeDijkstraRoute(startNodeId, targetNode, language));
      return;
    }

    for (const loc of CAMPUS_LOCATIONS) {
      const matchesName = loc.name.toLowerCase().includes(qClean) || qClean.includes(loc.name.toLowerCase());
      const matchesOfficial = loc.official_name.toLowerCase().includes(qClean);
      const matchesHindi = loc.name_hindi && loc.name_hindi.includes(qClean);
      const matchesAlias = loc.aliases.some(a => qClean.includes(a.toLowerCase()) || a.toLowerCase().includes(qClean));

      if (matchesName || matchesOfficial || matchesHindi || matchesAlias) {
        setAiResponseText(`${loc.name} (${loc.building}, Floor ${loc.floor}) found! Route highlighted below.`);
        setDestinationNodeIdState(loc.node_id);
        setCurrentRoute(computeDijkstraRoute(startNodeId, loc.node_id, language));
        return;
      }
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
