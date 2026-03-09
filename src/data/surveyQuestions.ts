import { Locale } from "@/i18n";

export interface SurveyCategory {
  id: string;
  titleKey: string;
  icon: string;
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  textEn: string;
  textAr: string;
  type: "scale" | "choice";
  options?: { en: string; ar: string; value: number }[];
}

export const surveyCategories: SurveyCategory[] = [
  {
    id: "attention",
    titleKey: "survey.attention",
    icon: "🧠",
    questions: [
      { id: "att1", textEn: "Can the child maintain focus on a task for 10+ minutes?", textAr: "هل يستطيع الطفل الحفاظ على تركيزه في مهمة لأكثر من 10 دقائق؟", type: "scale" },
      { id: "att2", textEn: "Does the child follow multi-step instructions?", textAr: "هل يتبع الطفل تعليمات متعددة الخطوات؟", type: "scale" },
      { id: "att3", textEn: "How often does the child get distracted during activities?", textAr: "كم مرة يتشتت الطفل أثناء الأنشطة؟", type: "scale" },
      { id: "att4", textEn: "Can the child sit still during circle time?", textAr: "هل يستطيع الطفل الجلوس بهدوء أثناء وقت الحلقة؟", type: "scale" },
    ],
  },
  {
    id: "mood",
    titleKey: "survey.mood",
    icon: "😊",
    questions: [
      { id: "mood1", textEn: "What is the child's predominant mood today?", textAr: "ما المزاج السائد للطفل اليوم؟", type: "choice", options: [
        { en: "Happy", ar: "سعيد", value: 5 }, { en: "Calm", ar: "هادئ", value: 4 }, { en: "Neutral", ar: "محايد", value: 3 }, { en: "Frustrated", ar: "محبط", value: 2 }, { en: "Anxious", ar: "قلق", value: 1 },
      ]},
      { id: "mood2", textEn: "Does the child express emotions appropriately?", textAr: "هل يعبر الطفل عن مشاعره بشكل مناسب؟", type: "scale" },
      { id: "mood3", textEn: "How quickly does the child recover from frustration?", textAr: "كم يستغرق الطفل للتعافي من الإحباط؟", type: "scale" },
    ],
  },
  {
    id: "social",
    titleKey: "survey.social",
    icon: "👫",
    questions: [
      { id: "soc1", textEn: "Does the child initiate play with peers?", textAr: "هل يبادر الطفل باللعب مع أقرانه؟", type: "scale" },
      { id: "soc2", textEn: "Can the child share toys and materials?", textAr: "هل يستطيع الطفل مشاركة الألعاب والمواد؟", type: "scale" },
      { id: "soc3", textEn: "Does the child respond to peers' emotions?", textAr: "هل يستجيب الطفل لمشاعر أقرانه؟", type: "scale" },
      { id: "soc4", textEn: "How well does the child cooperate in group activities?", textAr: "ما مدى تعاون الطفل في الأنشطة الجماعية؟", type: "scale" },
    ],
  },
  {
    id: "learning",
    titleKey: "survey.learning",
    icon: "📚",
    questions: [
      { id: "lrn1", textEn: "Which learning style does the child prefer?", textAr: "ما أسلوب التعلم المفضل للطفل؟", type: "choice", options: [
        { en: "Visual", ar: "بصري", value: 1 }, { en: "Auditory", ar: "سمعي", value: 2 }, { en: "Kinesthetic", ar: "حركي", value: 3 }, { en: "Social", ar: "اجتماعي", value: 4 },
      ]},
      { id: "lrn2", textEn: "Does the child show curiosity and ask questions?", textAr: "هل يُظهر الطفل فضولاً ويطرح أسئلة؟", type: "scale" },
      { id: "lrn3", textEn: "Can the child complete age-appropriate tasks independently?", textAr: "هل يستطيع الطفل إكمال المهام المناسبة لعمره بشكل مستقل؟", type: "scale" },
    ],
  },
  {
    id: "emotional",
    titleKey: "survey.emotional",
    icon: "❤️",
    questions: [
      { id: "emo1", textEn: "How does the child handle anger?", textAr: "كيف يتعامل الطفل مع الغضب؟", type: "scale" },
      { id: "emo2", textEn: "Can the child wait for their turn?", textAr: "هل يستطيع الطفل انتظار دوره؟", type: "scale" },
      { id: "emo3", textEn: "Does the child show empathy toward others?", textAr: "هل يُظهر الطفل تعاطفاً مع الآخرين؟", type: "scale" },
      { id: "emo4", textEn: "How well does the child manage transitions?", textAr: "ما مدى تأقلم الطفل مع التغييرات والانتقالات؟", type: "scale" },
    ],
  },
  {
    id: "speech",
    titleKey: "survey.speech",
    icon: "💬",
    questions: [
      { id: "spe1", textEn: "How clear is the child's speech?", textAr: "ما مدى وضوح نطق الطفل؟", type: "scale" },
      { id: "spe2", textEn: "Can the child form complete sentences?", textAr: "هل يستطيع الطفل تكوين جمل كاملة؟", type: "scale" },
      { id: "spe3", textEn: "Does the child understand spoken instructions easily?", textAr: "هل يفهم الطفل التعليمات الشفهية بسهولة؟", type: "scale" },
      { id: "spe4", textEn: "How is the child's vocabulary compared to peers?", textAr: "كيف حجم مفردات الطفل مقارنة بأقرانه؟", type: "scale" },
    ],
  },
  {
    id: "motor",
    titleKey: "survey.motor",
    icon: "🏃",
    questions: [
      { id: "mot1", textEn: "How are the child's fine motor skills (drawing, cutting)?", textAr: "كيف المهارات الحركية الدقيقة للطفل (الرسم، القص)؟", type: "scale" },
      { id: "mot2", textEn: "How are the child's gross motor skills (running, jumping)?", textAr: "كيف المهارات الحركية الكبرى للطفل (الجري، القفز)؟", type: "scale" },
      { id: "mot3", textEn: "Can the child hold a pencil correctly?", textAr: "هل يستطيع الطفل مسك القلم بشكل صحيح؟", type: "scale" },
    ],
  },
  {
    id: "talent",
    titleKey: "survey.talent",
    icon: "⭐",
    questions: [
      { id: "tal1", textEn: "Does the child show artistic abilities (drawing, music)?", textAr: "هل يُظهر الطفل قدرات فنية (رسم، موسيقى)؟", type: "scale" },
      { id: "tal2", textEn: "Does the child show logical thinking (puzzles, patterns)?", textAr: "هل يُظهر الطفل تفكيراً منطقياً (ألغاز، أنماط)؟", type: "scale" },
      { id: "tal3", textEn: "Does the child show leadership qualities?", textAr: "هل يُظهر الطفل صفات قيادية؟", type: "scale" },
      { id: "tal4", textEn: "Does the child show exceptional memory?", textAr: "هل يُظهر الطفل ذاكرة استثنائية؟", type: "scale" },
    ],
  },
  {
    id: "behavior",
    titleKey: "survey.behavior",
    icon: "📋",
    questions: [
      { id: "beh1", textEn: "Does the child follow classroom rules?", textAr: "هل يلتزم الطفل بقواعد الفصل؟", type: "scale" },
      { id: "beh2", textEn: "How does the child respond to redirection?", textAr: "كيف يستجيب الطفل للتوجيه؟", type: "scale" },
      { id: "beh3", textEn: "Does the child show self-control?", textAr: "هل يُظهر الطفل ضبط النفس؟", type: "scale" },
    ],
  },
  {
    id: "nutrition",
    titleKey: "survey.nutrition",
    icon: "🍎",
    questions: [
      { id: "nut1", textEn: "Does the child eat a balanced meal?", textAr: "هل يتناول الطفل وجبة متوازنة؟", type: "scale" },
      { id: "nut2", textEn: "Does the child drink enough water?", textAr: "هل يشرب الطفل كمية كافية من الماء؟", type: "scale" },
      { id: "nut3", textEn: "Does the child show energy throughout the day?", textAr: "هل يُظهر الطفل طاقة طوال اليوم؟", type: "scale" },
    ],
  },
];

// Add translations for survey categories
export const surveyTranslations: Record<string, Record<string, string>> = {
  "survey.attention": { en: "Attention & Focus", ar: "الانتباه والتركيز" },
  "survey.mood": { en: "Daily Mood", ar: "المزاج اليومي" },
  "survey.social": { en: "Social Interaction", ar: "التفاعل الاجتماعي" },
  "survey.learning": { en: "Learning Style", ar: "أسلوب التعلم" },
  "survey.emotional": { en: "Emotional Skills", ar: "المهارات العاطفية" },
  "survey.speech": { en: "Speech & Language", ar: "النطق واللغة" },
  "survey.motor": { en: "Motor Skills", ar: "المهارات الحركية" },
  "survey.talent": { en: "Talents & Gifts", ar: "المواهب والقدرات" },
  "survey.behavior": { en: "Behavior", ar: "السلوك" },
  "survey.nutrition": { en: "Nutrition & Health", ar: "التغذية والصحة" },
  "survey.fillSurvey": { en: "Fill Survey", ar: "ملء الاستقصاء" },
  "survey.scale.1": { en: "Rarely", ar: "نادراً" },
  "survey.scale.2": { en: "Sometimes", ar: "أحياناً" },
  "survey.scale.3": { en: "Often", ar: "غالباً" },
  "survey.scale.4": { en: "Usually", ar: "عادةً" },
  "survey.scale.5": { en: "Always", ar: "دائماً" },
  "survey.submit": { en: "Submit & Analyze with AI", ar: "إرسال وتحليل بالذكاء الاصطناعي" },
  "survey.analyzing": { en: "Analyzing with AI...", ar: "جاري التحليل بالذكاء الاصطناعي..." },
  "survey.complete": { en: "Survey Complete", ar: "اكتمل الاستقصاء" },
  "survey.selectCategory": { en: "Select a category to begin", ar: "اختر فئة للبدء" },
  "survey.noSurveys": { en: "No surveys yet", ar: "لا توجد استقصاءات بعد" },

  // Student management
  "students.title": { en: "Students", ar: "الطلاب" },
  "students.add": { en: "Add Student", ar: "إضافة طالب" },
  "students.name": { en: "Student Name", ar: "اسم الطالب/ة" },
  "students.age": { en: "Age", ar: "العمر" },
  "students.gender": { en: "Gender", ar: "الجنس" },
  "students.male": { en: "Male", ar: "ذكر" },
  "students.female": { en: "Female", ar: "أنثى" },
  "students.max": { en: "Maximum 30 students reached", ar: "تم الوصول للحد الأقصى 30 طالب" },
  "students.count": { en: "students", ar: "طالب/ة" },
  "students.select": { en: "Select a student", ar: "اختر طالب/ة" },
  "students.remove": { en: "Remove", ar: "حذف" },
  "students.noStudents": { en: "No students added yet", ar: "لم تتم إضافة طلاب بعد" },

  // Analysis
  "analysis.title": { en: "AI Analysis Results", ar: "نتائج تحليل الذكاء الاصطناعي" },
  "analysis.summary": { en: "Summary", ar: "الملخص" },
  "analysis.strengths": { en: "Strengths", ar: "نقاط القوة" },
  "analysis.improvements": { en: "Areas for Improvement", ar: "مجالات التحسين" },
  "analysis.recommendations": { en: "Teacher Recommendations", ar: "توصيات المعلم" },
  "analysis.parentMessage": { en: "Parent Message", ar: "رسالة للأهل" },
  "analysis.actionPlan": { en: "3-Day Action Plan", ar: "خطة 3 أيام" },
  "analysis.indicators": { en: "Early Indicators", ar: "مؤشرات مبكرة" },
  "analysis.scores": { en: "Development Scores", ar: "درجات النمو" },
  "analysis.share": { en: "Share via WhatsApp", ar: "مشاركة عبر الواتساب" },
  "analysis.exportPdf": { en: "Export as PDF", ar: "تصدير كـ PDF" },
  "analysis.history": { en: "Survey History", ar: "سجل الاستقصاءات" },
  "analysis.viewResults": { en: "View Results", ar: "عرض النتائج" },

  // Storage notice
  "storage.notice": { en: "⚠️ All data is stored locally on this device. Clearing browser data will remove all records.", ar: "⚠️ جميع البيانات مخزنة محلياً على هذا الجهاز. مسح بيانات المتصفح سيحذف جميع السجلات." },

  // Indicators
  "indicators.gifted": { en: "Gifted", ar: "موهوب" },
  "indicators.typical": { en: "Typical", ar: "طبيعي" },
  "indicators.delayed": { en: "Needs Support", ar: "يحتاج دعم" },
  "indicators.mixed": { en: "Mixed", ar: "مختلط" },
};
