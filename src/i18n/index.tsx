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
  "nav.attendance": { en: "Attendance", ar: "الحضور والغياب" },
  "attendance.title": { en: "Attendance", ar: "الحضور والغياب" },
  "attendance.subtitle": { en: "Track daily student attendance", ar: "تتبع حضور وغياب الطلاب يومياً" },
  "attendance.daily": { en: "Daily Record", ar: "السجل اليومي" },
  "attendance.stats": { en: "Statistics", ar: "الإحصائيات" },
  "attendance.dailyRecord": { en: "Daily Attendance", ar: "الحضور اليومي" },
  "attendance.student": { en: "Student", ar: "الطالب" },
  "attendance.status": { en: "Status", ar: "الحالة" },
  "attendance.markAll": { en: "All Present", ar: "حضور الجميع" },
  "attendance.noStudents": { en: "Add students first from the Students page", ar: "أضف طلاباً أولاً من صفحة الطلاب" },
  "attendance.totalStudents": { en: "Total Students", ar: "إجمالي الطلاب" },
  "attendance.avgRate": { en: "Avg. Attendance", ar: "متوسط الحضور" },
  "attendance.totalRecords": { en: "Total Records", ar: "إجمالي السجلات" },
  "attendance.lowAttendance": { en: "Low Attendance", ar: "حضور منخفض" },
  "attendance.chartTitle": { en: "Attendance Rate by Student", ar: "نسبة الحضور حسب الطالب" },
  "attendance.studentDetails": { en: "Student Details", ar: "تفاصيل الطلاب" },
  
  // Tour translations
  "tour.welcome": { 
    en: "Welcome to KinderTrack! Let me show you around the app 🌈", 
    ar: "مرحباً بك في كيندرتراك! دعني أريك جولة سريعة في التطبيق 🌈" 
  },
  "tour.students": { 
    en: "Here you can add and manage your students (up to 30 students)", 
    ar: "هنا يمكنك إضافة وإدارة طلابك (حتى 30 طالباً)" 
  },
  "tour.survey": { 
    en: "Fill behavioral surveys to track student development using AI analysis", 
    ar: "املأ الاستقصاءات السلوكية لتتبع تطور الطلاب بتحليل الذكاء الاصطناعي" 
  },
  "tour.attendance": { 
    en: "Track daily attendance with present, absent, late, and excused statuses", 
    ar: "سجّل الحضور اليومي بحالات حاضر، غائب، متأخر، ومعذور" 
  },
  "tour.history": { 
    en: "View detailed analysis reports and track student progress over time", 
    ar: "اطّلع على تقارير التحليل التفصيلية وتتبع تقدم الطلاب عبر الزمن" 
  },
  "tour.dashboard": { 
    en: "Your main dashboard shows class statistics and recent activity", 
    ar: "لوحة التحكم الرئيسية تعرض إحصاءات الفصل والنشاط الأخير" 
  },
  
  // Empty state translations
  "empty.students.title": { en: "No Students Yet", ar: "لا يوجد طلاب بعد" },
  "empty.students.description": { 
    en: "Start by adding your first student to begin tracking their development", 
    ar: "ابدأ بإضافة أول طالب لك لتتبع تطوره" 
  },
  "empty.students.action": { en: "Add Your First Student", ar: "أضف أول طالب" },
  
  "empty.surveys.title": { en: "Select a Student", ar: "اختر طالباً" },
  "empty.surveys.description": { 
    en: "Choose a student from the list above to fill their behavioral survey", 
    ar: "اختر طالباً من القائمة أعلاه لملء استقصاءه السلوكي" 
  },
  
  "empty.history.title": { en: "No Analysis Available", ar: "لا توجد تحليلات" },
  "empty.history.description": { 
    en: "Complete surveys to see AI-powered analysis and development reports", 
    ar: "أكمل الاستقصاءات لرؤية التحليلات المدعومة بالذكاء الاصطناعي" 
  },
  
  // Auth
  "auth.login": { en: "Sign In", ar: "تسجيل الدخول" },
  "auth.signup": { en: "Create Account", ar: "إنشاء حساب" },
  "auth.email": { en: "Email", ar: "البريد الإلكتروني" },
  "auth.password": { en: "Password", ar: "كلمة المرور" },
  "auth.fullName": { en: "Full Name", ar: "الاسم الكامل" },
  "auth.fullNamePlaceholder": { en: "e.g. Sarah Ahmad", ar: "مثال: سارة أحمد" },
  "auth.schoolName": { en: "School Name (optional)", ar: "اسم المدرسة (اختياري)" },
  "auth.schoolNamePlaceholder": { en: "e.g. Al-Noor Kindergarten", ar: "مثال: روضة النور" },
  "auth.subtitle": { en: "Child Development Tracking System", ar: "نظام تتبع نمو الأطفال" },
  "auth.hasAccount": { en: "Already have an account? Sign in", ar: "لديك حساب؟ سجل دخولك" },
  "auth.noAccount": { en: "Don't have an account? Sign up", ar: "ليس لديك حساب؟ أنشئ واحداً" },
  "auth.signupSuccess": { en: "Account created! Welcome.", ar: "تم إنشاء الحساب! أهلاً بك." },
  "auth.error": { en: "Authentication error", ar: "خطأ في المصادقة" },
  "auth.cloudNotice": { en: "☁️ Data is securely stored in the cloud", ar: "☁️ البيانات مخزنة بأمان في السحابة" },
  "storage.notice": { en: "☁️ Cloud-synced data", ar: "☁️ بيانات مزامنة سحابياً" },
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
