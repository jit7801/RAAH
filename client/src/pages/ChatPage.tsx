import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { Send, Mic, MapPin, Navigation, User, Sparkles } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/locations';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  destinationNodeId?: string;
  ambiguousOptions?: string[];
  timestamp: string;
}

export const ChatPage: React.FC = () => {
  const { setDestinationNodeId } = useNavigation();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Namaste! I am your RAAH AI campus navigation assistant. Which classroom, lab, department, or canteen are you looking for today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const { isListening, startListening } = useVoiceInput((transcript) => {
    setInputText(transcript);
    handleSend(transcript);
  });

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const res = await fetch('http://localhost:5001/api/v1/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.nlu.response_text,
          destinationNodeId: data.nlu.destination_node_id,
          ambiguousOptions: data.nlu.ambiguous_options,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        generateFallbackResponse(query);
      }
    } catch (e) {
      generateFallbackResponse(query);
    }
  };

  const generateFallbackResponse = (query: string) => {
    const qLower = query.toLowerCase();

    if (qLower.includes('dbms')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: "Today's DBMS class is assigned to Classroom C-103 (Block C, 1st Floor). Note: Room was updated live by Admin.",
          destinationNodeId: 'classroom_c103',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    if (qLower === 'lab' || qLower.includes('lab kaha')) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: "Multiple labs are available on campus. Which lab are you looking for?",
          ambiguousOptions: ["CSE Lab 1", "Mechanical Workshop Lab", "Electrical Lab"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    for (const loc of CAMPUS_LOCATIONS) {
      if (loc.aliases.some(a => qLower.includes(a.toLowerCase()))) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            text: `${loc.name} is located in ${loc.building} (Floor ${loc.floor}). I can show you the interactive map route!`,
            destinationNodeId: loc.node_id,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }
    }

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: "Could not find that exact location. Try asking for 'Library', 'CSE Dept', 'Auditorium', or 'Canteen'.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleShowRoute = (nodeId: string) => {
    setDestinationNodeId(nodeId);
    navigate(`/navigate?dest=${nodeId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12 page-enter">
      {/* Assistant Header */}
      <div className="surface-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-800 text-white flex items-center justify-center font-bold">
            <Navigation className="w-4 h-4 transform -rotate-45" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-display">RAAH AI Navigation Assistant</h2>
            <p className="text-xs text-slate-500">Ask directions in English, Hindi, or Hinglish</p>
          </div>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="surface-card p-4 md:p-6 min-h-[440px] max-h-[500px] overflow-y-auto space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`max-w-md ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {/* Show Route Button */}
              {msg.destinationNodeId && (
                <button
                  onClick={() => handleShowRoute(msg.destinationNodeId!)}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Show Route on Map</span>
                </button>
              )}

              {/* Ambiguous selection options */}
              {msg.ambiguousOptions && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {msg.ambiguousOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(opt)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-200/60 border border-slate-200 text-xs text-slate-800 font-medium transition-colors cursor-pointer"
                    >
                      📍 {opt}
                    </button>
                  ))}
                </div>
              )}

              <p className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                {msg.timestamp}
              </p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="surface-card p-2 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask RAAH AI: 'CSE lab kidhar hai?' or 'Where is Auditorium?'..."
          className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={startListening}
          className={`p-2 rounded-lg transition-colors ${
            isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSend()}
          className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
