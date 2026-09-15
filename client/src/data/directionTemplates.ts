export type AppLanguage = 'en' | 'hi' | 'hl';

export interface DirectionPhrase {
  straight: string;
  left: string;
  right: string;
  stairs_up: string;
  stairs_down: string;
  arrive: string;
  start: string;
}

export const DIRECTION_TEMPLATES: Record<AppLanguage, DirectionPhrase> = {
  en: {
    start: "Start at {label}",
    straight: "Walk straight towards {label}",
    left: "Turn left towards {label}",
    right: "Turn right towards {label}",
    stairs_up: "Take the stairs up to {label}",
    stairs_down: "Take the stairs down to {label}",
    arrive: "You have arrived at {label}"
  },
  hi: {
    start: "{label} से शुरू करें",
    straight: "{label} की तरफ सीधा चलें",
    left: "{label} की तरफ बाएं (left) मुड़ें",
    right: "{label} की तरफ दाएं (right) मुड़ें",
    stairs_up: "सीढ़ियां ऊपर चढ़कर {label} पहुंचे",
    stairs_down: "सीढ़ियां नीचे उतरकर {label} पहुंचे",
    arrive: "आप {label} पहुंच चुके हैं"
  },
  hl: {
    start: "{label} se start kijiye",
    straight: "{label} ki taraf straight jaiye",
    left: "{label} ke liye left turn lijiye",
    right: "{label} ke liye right turn lijiye",
    stairs_up: "Stairs se upar jaiye {label} ke liye",
    stairs_down: "Stairs se neeche aaiye {label} ke liye",
    arrive: "Aap {label} pahunch gaye hain!"
  }
};
