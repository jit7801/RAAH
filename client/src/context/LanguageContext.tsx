import React, { createContext, useContext, useState } from 'react';
import type { AppLanguage } from '../data/directionTemplates';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const UI_STRINGS: Record<AppLanguage, Record<string, string>> = {
  en: {
    appName: "DISHA AI",
    tagline: "Find your way. In your language.",
    heroSubtitle: "Multilingual AI Receptionist & Campus Navigation Assistant",
    searchPlaceholder: "Ask direction: 'Where is CSE Lab?' or 'Library kaha hai?'...",
    askBtn: "Find Route",
    navMap: "Interactive Map",
    chatAssistant: "AI Receptionist",
    explore: "Browse Directory",
    admin: "Admin Portal",
    startPoint: "Starting Point",
    destination: "Destination",
    distance: "Distance",
    eta: "Est. Walking Time",
    steps: "Step-by-Step Directions",
    tryAsking: "Try asking naturally:",
    ambiguousPrompt: "Which location are you looking for?",
    showRoute: "Show Route on Map",
    reNavigate: "Change Destination",
    noRouteFound: "Could not find a walkable route to this destination.",
    adminTitle: "Campus Data Management",
    adminPinLabel: "Enter Admin PIN (Default: 1234)",
    loginBtn: "Authenticate Admin",
    classroomChangeNote: "Room Location Note"
  },
  hi: {
    appName: "दिशा AI",
    tagline: "अपना रास्ता खोजें। अपनी भाषा में।",
    heroSubtitle: "बहुभाषी एआई कैंपस नेविगेशन सहायक",
    searchPlaceholder: "पूछें: 'लाइब्रेरी कहां है?' या 'CSE lab kidhar hai?'...",
    askBtn: "मार्ग खोजें",
    navMap: "डिजिटल मैप",
    chatAssistant: "एआई रिसेप्शनिस्ट",
    explore: "स्थान सूची",
    admin: "एडमिन पोर्टल",
    startPoint: "प्रारंभिक स्थान",
    destination: "गंतव्य",
    distance: "दूरी",
    eta: "अनुमानित पैदल समय",
    steps: "चरण-दर-चरण निर्देश",
    tryAsking: "इन उदाहरणों से शुरुआत करें:",
    ambiguousPrompt: "आप किस स्थान की तलाश कर रहे हैं?",
    showRoute: "मैप पर मार्ग देखें",
    reNavigate: "गंतव्य बदलें",
    noRouteFound: "इस स्थान का मार्ग उपलब्ध नहीं है।",
    adminTitle: "कैंपस डेटा प्रबंधन",
    adminPinLabel: "एडमिन पिन दर्ज करें (डिफ़ॉल्ट: 1234)",
    loginBtn: "लॉगिन करें",
    classroomChangeNote: "कक्षा स्थान अपडेट"
  },
  hl: {
    appName: "DISHA AI",
    tagline: "Apna rasta khojein. Apni language mein.",
    heroSubtitle: "AI Receptionist + Campus Map + Navigation Assistant",
    searchPlaceholder: "Puchhiye: 'CSE dept kaha hai?' ya 'Library jana hai'...",
    askBtn: "Find Route",
    navMap: "Campus Map",
    chatAssistant: "AI Assistant",
    explore: "Browse Places",
    admin: "Admin",
    startPoint: "Start Location",
    destination: "Destination",
    distance: "Distance",
    eta: "Walking Time",
    steps: "Step-by-Step Directions",
    tryAsking: "Ye ask karke try kijiye:",
    ambiguousPrompt: "Aap kaun se place par jana chahte hain?",
    showRoute: "Show Route",
    reNavigate: "New Route",
    noRouteFound: "Is destination ka path nahi mila.",
    adminTitle: "Campus Data Admin",
    adminPinLabel: "Admin PIN enter karein (Default: 1234)",
    loginBtn: "Login Admin",
    classroomChangeNote: "Classroom Room Change Update"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('disha_lang') as AppLanguage) || 'hl';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('disha_lang', lang);
  };

  const t = (key: string): string => {
    return UI_STRINGS[language]?.[key] || UI_STRINGS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
