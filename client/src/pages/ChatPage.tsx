import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { Send, Mic, MapPin, Bot, User, Sparkles } from 'lucide-react';
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
      text: "Namaste! Main DISHA AI campus receptionist hoon. Aapko canteen, CSE lab, library, auditorium, ya kisi classroom ka rasta puchna hai?",
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

    // Call AI NLU endpoint
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
        // Fallback response
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
          text: "Today's DBMS class is assigned to Classroom C-103 (Block C, 1st Floor). Note: Room was recently updated by Admin.",
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
          text: "Campus mein multiple labs hain. Aap kaun sa lab dhundh rahe hain?",
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
            text: `${loc.name} ${loc.building} ground/1st floor par स्थित hai. Main aapke liye interactive route show kar sakta hoon!`,
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
        text: "Kshama kijiye, mujhe is location ka exact path nahi mila. Kripya 'Library', 'CSE Dept', 'Auditorium', ya 'Canteen' ask karein.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleShowRoute = (nodeId: string) => {
    setDestinationNodeId(nodeId);
    navigate(`/navigate?dest=${nodeId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 page-enter">
      {/* Header */}
      <div className="glass-card p-4 flex items-center justify-between border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">DISHA AI Receptionist</h2>
            <p className="text-xs text-slate-400">Multilingual Voice & Text Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="glass-card p-4 md:p-6 min-h-[460px] max-h-[520px] overflow-y-auto space-y-4 scrollbar-hide border border-white/10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-brand-600/30 text-brand-300 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-md ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {/* Show Route Button if destination extracted */}
              {msg.destinationNodeId && (
                <button
                  onClick={() => handleShowRoute(msg.destinationNodeId!)}
                  className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Show Route on Campus Map</span>
                </button>
              )}

              {/* Ambiguous options chips */}
              {msg.ambiguousOptions && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {msg.ambiguousOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(opt)}
                      className="px-2.5 py-1 rounded-md bg-surface-800 hover:bg-brand-600/40 border border-white/10 text-xs text-brand-300 font-medium transition-colors"
                    >
                      📍 {opt}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[9px] text-slate-400 mt-1.5 text-right">{msg.timestamp}</p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="glass-card p-2 flex items-center gap-2 border border-white/10">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask DISHA: 'CSE lab kidhar hai?' or 'Where is Auditorium?'..."
          className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={startListening}
          className={`p-2.5 rounded-xl transition-colors ${
            isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSend()}
          className="btn-primary py-2 px-4 rounded-xl text-xs font-semibold shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
