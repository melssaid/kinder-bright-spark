import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "en" | "ar";

type Translations = Record<string, Record<Locale, string>>;

const translations: Translations = {
  // App
  "app.title": { en: "KinderTrack", ar: "كيندرتراك" },
  "app.subtitle": { en: "Development Dashboard", ar: "لوحة متابعة النمو" },

  // Navigation
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.emotionalCoach": { en: "Emotional Coach", ar: "المدرب العاطفي" },
  "nav.behaviorTranslator": { en: "Behavior Translator", ar: "مترجم السلوك" },
  "nav.nutrition": { en: "Nutrition", ar: "التغذية" },
  "nav.navigation": { en: "Navigation", ar: "التنقل" },

  // Dashboard
  "dashboard.title": { en: "Teacher Dashboard", ar: "لوحة المعلم" },
  "dashboard.subtitle": { en: "Track development, behavior, and wellbeing", ar: "تتبع النمو والسلوك والرفاهية" },
  "dashboard.age": { en: "Age", ar: "العمر" },
  "dashboard.years": { en: "years", ar: "سنوات" },

  // Developmental Tracker
  "dev.title": { en: "Developmental Tracker", ar: "متتبع النمو" },
  "dev.focus": { en: "Focus", ar: "التركيز" },
  "dev.play": { en: "Play", ar: "اللعب" },
  "dev.learning": { en: "Learning", ar: "التعلم" },

  // Attention Radar
  "attention.title": { en: "ADHD & Attention Radar", ar: "رادار الانتباه وفرط الحركة" },

  // Mood
  "mood.title": { en: "Daily Mood Scale", ar: "مقياس المزاج اليومي" },
  "mood.shiftDetected": { en: "Shift Detected", ar: "تم رصد تغيّر" },
  "mood.happy": { en: "Happy", ar: "سعيد" },
  "mood.focused": { en: "Focused", ar: "مركّز" },
  "mood.frustrated": { en: "Frustrated", ar: "محبط" },
  "mood.calm": { en: "Calm", ar: "هادئ" },
  "mood.anxious": { en: "Anxious", ar: "قلق" },

  // Learning Style
  "learning.title": { en: "Learning Style Profile", ar: "ملف أسلوب التعلم" },
  "learning.visual": { en: "Visual", ar: "بصري" },
  "learning.auditory": { en: "Auditory", ar: "سمعي" },
  "learning.kinesthetic": { en: "Kinesthetic", ar: "حركي" },
  "learning.social": { en: "Social", ar: "اجتماعي" },

  // Social
  "social.title": { en: "Social Interactions", ar: "التفاعلات الاجتماعية" },
  "social.interactions": { en: "interactions this week", ar: "تفاعلات هذا الأسبوع" },
  "social.strong": { en: "Strong", ar: "قوي" },
  "social.moderate": { en: "Moderate", ar: "متوسط" },
  "social.developing": { en: "Developing", ar: "نامٍ" },

  // Speech
  "speech.title": { en: "Speech & Language", ar: "النطق واللغة" },
  "speech.vocabulary": { en: "Vocabulary Size", ar: "حجم المفردات" },
  "speech.sentence": { en: "Avg Sentence Length", ar: "متوسط طول الجملة" },
  "speech.words": { en: "words", ar: "كلمات" },
  "speech.exceeding": { en: "Exceeding age benchmarks — consider enrichment activities!", ar: "يتجاوز معايير العمر — فكّر في أنشطة إثرائية!" },
  "speech.below": { en: "Below benchmarks — consider speech support consultation.", ar: "أقل من المعايير — فكّر في استشارة دعم النطق." },
  "speech.developing": { en: "Developing well with room for targeted growth.", ar: "يتطور بشكل جيد مع مجال للنمو المستهدف." },

  // Talent
  "talent.title": { en: "Early Talent Discoverer", ar: "مكتشف المواهب المبكرة" },

  // Nutrition
  "nutrition.title": { en: "Nutrition Tracker", ar: "متتبع التغذية" },
  "nutrition.dailyCalories": { en: "Daily Calories", ar: "السعرات اليومية" },
  "nutrition.protein": { en: "Protein", ar: "بروتين" },
  "nutrition.carbs": { en: "Carbs", ar: "كربوهيدرات" },
  "nutrition.vitamins": { en: "Vitamins", ar: "فيتامينات" },
  "nutrition.calories": { en: "Calories", ar: "سعرات" },
  "nutrition.todayMeals": { en: "Today's Meals", ar: "وجبات اليوم" },
  "nutrition.aiSuggestions": { en: "AI Suggested Meals", ar: "وجبات مقترحة بالذكاء الاصطناعي" },
  "nutrition.suggestionsNote": { en: "Suggestions are based on nutritional gaps and age-appropriate dietary guidelines.", ar: "الاقتراحات مبنية على الفجوات الغذائية وإرشادات النظام الغذائي المناسبة للعمر." },
  "nutrition.fullTitle": { en: "Smart Nutrition Assistant", ar: "مساعد التغذية الذكي" },
  "nutrition.fullSubtitle": { en: "Lunchbox tracker & AI meal suggestions", ar: "متتبع صندوق الغداء واقتراحات الوجبات" },

  // Emotional Coach
  "emotional.title": { en: "Emotional Skills Coach", ar: "مدرب المهارات العاطفية" },
  "emotional.subtitle": { en: "Interactive scenario assessments", ar: "تقييمات سيناريوهات تفاعلية" },
  "emotional.response": { en: "Child's Response:", ar: "استجابة الطفل:" },
  "emotional.tip": { en: "Teacher Tip:", ar: "نصيحة المعلم:" },
  "emotional.excellent": { en: "Excellent", ar: "ممتاز" },
  "emotional.good": { en: "Good", ar: "جيد" },
  "emotional.needsPractice": { en: "Needs Practice", ar: "يحتاج تدريب" },

  // Behavior Translator
  "behavior.title": { en: "Behavior Translator", ar: "مترجم السلوك" },
  "behavior.subtitle": { en: "Convert teacher notes into empathetic parent messages", ar: "تحويل ملاحظات المعلم إلى رسائل تعاطفية للأهل" },
  "behavior.teacherNotes": { en: "Teacher's Raw Notes", ar: "ملاحظات المعلم الأولية" },
  "behavior.parentMessage": { en: "Parent-Friendly Message", ar: "رسالة مناسبة للأهل" },
  "behavior.translate": { en: "Translate for Parents", ar: "ترجم للأهل" },
  "behavior.clickTranslate": { en: 'Click "Translate" to generate parent message', ar: 'اضغط "ترجم" لتوليد رسالة للأهل' },
  "behavior.actionPlan": { en: "3-Day Home Action Plan", ar: "خطة منزلية لـ 3 أيام" },
  "behavior.placeholder": { en: "Enter your observations...", ar: "أدخل ملاحظاتك..." },

  // Priority
  "priority.high": { en: "High", ar: "عالي" },
  "priority.medium": { en: "Medium", ar: "متوسط" },
  "priority.low": { en: "Low", ar: "منخفض" },

  // Language
  "lang.switch": { en: "العربية", ar: "English" },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (key: string) => translations[key]?.[locale] ?? key,
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
