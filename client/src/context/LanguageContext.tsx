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
    appName: "RAAH AI",
    tagline: "Find your way. In your language.",
    heroSubtitle: "RAAH AI helps students find classrooms, labs, departments and campus facilities using simple multilingual search and step-by-step directions.",
    searchPlaceholder: "Where do you want to go? e.g. 'Where is CSE Lab?' or 'Library kaha hai?'...",
    askBtn: "Find Route",
    navMap: "Navigation",
    chatAssistant: "AI Assistant",
    explore: "Explore Directory",
    admin: "Campus Admin",
    startPoint: "Start Location",
    destination: "Destination",
    distance: "Distance",
    eta: "Est. Walking Time",
    steps: "Step-by-Step Directions",
    tryAsking: "Popular campus searches:",
    ambiguousPrompt: "Which location do you mean?",
    showRoute: "Show Route",
    reNavigate: "Change Destination",
    noRouteFound: "Could not calculate a walking route to this destination.",
    adminTitle: "Campus Location Admin",
    adminPinLabel: "Enter Admin PIN (Default: 1234)",
    loginBtn: "Authenticate Admin",
    classroomChangeNote: "Live Classroom Assignment Update"
  },
  hi: {
    appName: "RAAH AI",
    tagline: "अपना रास्ता खोजें। अपनी भाषा में।",
    heroSubtitle: "RAAH AI छात्रों को सरल बहुभाषी खोज और चरण-दर-चरण दिशाओं के साथ कक्षाएं, लैब, विभाग और परिसर सुविधाएं खोजने में मदद करता है।",
    searchPlaceholder: "आप कहां जाना चाहते हैं? जैसे 'लाइब्रेरी कहां है?' या 'CSE lab kidhar hai?'...",
    askBtn: "मार्ग खोजें",
    navMap: "नेविगेशन",
    chatAssistant: "एआई सहायक",
    explore: "परिसर निर्देशिका",
    admin: "कैंपस एडमिन",
    startPoint: "प्रारंभिक स्थान",
    destination: "गंतव्य",
    distance: "दूरी",
    eta: "अनुमानित पैदल समय",
    steps: "चरण-दर-चरण निर्देश",
    tryAsking: "लोकप्रिय परिसर खोजें:",
    ambiguousPrompt: "आप किस स्थान की तलाश कर रहे हैं?",
    showRoute: "मार्ग देखें",
    reNavigate: "गंतव्य बदलें",
    noRouteFound: "इस स्थान का मार्ग उपलब्ध नहीं है।",
    adminTitle: "कैंपस डेटा प्रबंधन",
    adminPinLabel: "एडमिन पिन दर्ज करें (डिफ़ॉल्ट: 1234)",
    loginBtn: "लॉगिन करें",
    classroomChangeNote: "कक्षा स्थान लाइव अपडेट"
  },
  hl: {
    appName: "RAAH AI",
    tagline: "Apna rasta khojein. Apni language mein.",
    heroSubtitle: "RAAH AI helps students find classrooms, labs, departments and campus facilities using simple multilingual search & step-by-step directions.",
    searchPlaceholder: "Kahan jana hai? e.g. 'CSE dept kaha hai?' ya 'Library jana hai'...",
    askBtn: "Find Route",
    navMap: "Navigation",
    chatAssistant: "AI Assistant",
    explore: "Explore",
    admin: "Admin",
    startPoint: "Start Location",
    destination: "Destination",
    distance: "Distance",
    eta: "Walking Time",
    steps: "Step-by-Step Directions",
    tryAsking: "Popular quick searches:",
    ambiguousPrompt: "Aap kaun sa place search kar rahe hain?",
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
    return (localStorage.getItem('raah_lang') as AppLanguage) || 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('raah_lang', lang);
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
