import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { surveyTranslations } from "@/data/surveyQuestions";

export type Locale = "en" | "ar";

type Translations = Record<string, Record<Locale, string>>;

const translations: Translations = {
  "app.title": { en: "KinderTrack", ar: "كيندرتراك" },
  "app.subtitle": { en: "Development Dashboard", ar: "لوحة متابعة النمو" },
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.survey": { en: "New Survey", ar: "استقصاء جديد" },
  "nav.history": { en: "History & Reports", ar: "السجل والتقارير" },
  "nav.students": { en: "Students", ar: "الطلاب" },
  "nav.navigation": { en: "Navigation", ar: "التنقل" },
  "dashboard.title": { en: "Teacher Dashboard", ar: "لوحة المعلم" },
  "dashboard.subtitle": { en: "Track development, behavior, and wellbeing", ar: "تتبع النمو والسلوك والرفاهية" },
  "lang.switch": { en: "العربية", ar: "English" },
};

// Merge survey translations
Object.entries(surveyTranslations).forEach(([key, val]) => {
  translations[key] = val as Record<Locale, string>;
});

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const t = useCallback((key: string) => translations[key]?.[locale] ?? key, [locale]);
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
