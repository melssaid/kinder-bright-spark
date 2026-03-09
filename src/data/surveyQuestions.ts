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

// Based on best early childhood frameworks: ASQ-3, DRDP, HighScope COR Advantage
export const surveyCategories: SurveyCategory[] = [
  {
    id: "cognitive",
    titleKey: "survey.cognitive",
    icon: "🧠",
    questions: [
      { id: "cog1", textEn: "Can the child sort objects by color, shape, or size?", textAr: "هل يستطيع الطفل تصنيف الأشياء حسب اللون أو الشكل أو الحجم؟", type: "scale" },
      { id: "cog2", textEn: "Does the child understand cause and effect (e.g., if I push, it falls)?", textAr: "هل يفهم الطفل السبب والنتيجة (مثلاً: إذا دفعته يسقط)؟", type: "scale" },
      { id: "cog3", textEn: "Can the child count objects up to 10 correctly?", textAr: "هل يستطيع الطفل عدّ الأشياء حتى 10 بشكل صحيح؟", type: "scale" },
      { id: "cog4", textEn: "Does the child solve simple puzzles (4-8 pieces)?", textAr: "هل يستطيع الطفل حل ألغاز بسيطة (4-8 قطع)؟", type: "scale" },
      { id: "cog5", textEn: "Can the child follow 2-3 step instructions?", textAr: "هل يستطيع الطفل اتباع تعليمات من 2-3 خطوات؟", type: "scale" },
    ],
  },
  {
    id: "language",
    titleKey: "survey.language",
    icon: "💬",
    questions: [
      { id: "lan1", textEn: "Does the child speak in sentences of 4+ words?", textAr: "هل يتحدث الطفل بجمل من 4 كلمات أو أكثر؟", type: "scale" },
      { id: "lan2", textEn: "Can the child tell a simple story or describe an event?", textAr: "هل يستطيع الطفل سرد قصة بسيطة أو وصف حدث؟", type: "scale" },
      { id: "lan3", textEn: "Does the child understand questions (who, what, where)?", textAr: "هل يفهم الطفل أسئلة (مَن، ماذا، أين)؟", type: "scale" },
      { id: "lan4", textEn: "How clear is the child's speech to unfamiliar adults?", textAr: "ما مدى وضوح كلام الطفل للبالغين غير المألوفين؟", type: "scale" },
      { id: "lan5", textEn: "Does the child show interest in books and stories?", textAr: "هل يُظهر الطفل اهتماماً بالكتب والقصص؟", type: "scale" },
    ],
  },
  {
    id: "social_emotional",
    titleKey: "survey.social_emotional",
    icon: "❤️",
    questions: [
      { id: "se1", textEn: "Does the child play cooperatively with other children?", textAr: "هل يلعب الطفل بشكل تعاوني مع الأطفال الآخرين؟", type: "scale" },
      { id: "se2", textEn: "Can the child identify and name their feelings?", textAr: "هل يستطيع الطفل تحديد وتسمية مشاعره؟", type: "scale" },
      { id: "se3", textEn: "Does the child show empathy when others are upset?", textAr: "هل يُظهر الطفل تعاطفاً عندما يكون الآخرون منزعجين؟", type: "scale" },
      { id: "se4", textEn: "Can the child wait for their turn and share?", textAr: "هل يستطيع الطفل انتظار دوره والمشاركة؟", type: "scale" },
      { id: "se5", textEn: "How well does the child manage frustration and anger?", textAr: "ما مدى قدرة الطفل على إدارة الإحباط والغضب؟", type: "scale" },
      { id: "se6", textEn: "Does the child separate from caregiver without excessive distress?", textAr: "هل ينفصل الطفل عن مقدم الرعاية دون ضيق شديد؟", type: "scale" },
    ],
  },
  {
    id: "gross_motor",
    titleKey: "survey.gross_motor",
    icon: "🏃",
    questions: [
      { id: "gm1", textEn: "Can the child run, jump, and climb with coordination?", textAr: "هل يستطيع الطفل الجري والقفز والتسلق بتناسق؟", type: "scale" },
      { id: "gm2", textEn: "Can the child kick and throw a ball?", textAr: "هل يستطيع الطفل ركل ورمي الكرة؟", type: "scale" },
      { id: "gm3", textEn: "Does the child maintain balance (standing on one foot, walking on a line)?", textAr: "هل يحافظ الطفل على التوازن (الوقوف على قدم واحدة، المشي على خط)؟", type: "scale" },
      { id: "gm4", textEn: "Can the child pedal a tricycle or ride-on toy?", textAr: "هل يستطيع الطفل قيادة دراجة ثلاثية العجلات؟", type: "scale" },
    ],
  },
  {
    id: "fine_motor",
    titleKey: "survey.fine_motor",
    icon: "✂️",
    questions: [
      { id: "fm1", textEn: "Can the child hold a pencil/crayon with proper grip?", textAr: "هل يستطيع الطفل مسك القلم/الطباشير بالمسكة الصحيحة؟", type: "scale" },
      { id: "fm2", textEn: "Can the child cut with scissors along a line?", textAr: "هل يستطيع الطفل القص بالمقص على طول خط؟", type: "scale" },
      { id: "fm3", textEn: "Can the child draw recognizable shapes (circle, square)?", textAr: "هل يستطيع الطفل رسم أشكال مميزة (دائرة، مربع)؟", type: "scale" },
      { id: "fm4", textEn: "Can the child button/unbutton clothing and use zippers?", textAr: "هل يستطيع الطفل فتح/إغلاق الأزرار واستخدام السحّاب؟", type: "scale" },
      { id: "fm5", textEn: "Can the child string beads or do simple lacing?", textAr: "هل يستطيع الطفل تنظيم الخرز أو التشبيك البسيط؟", type: "scale" },
    ],
  },
  {
    id: "self_care",
    titleKey: "survey.self_care",
    icon: "🧽",
    questions: [
      { id: "sc1", textEn: "Can the child eat independently using utensils?", textAr: "هل يستطيع الطفل الأكل بشكل مستقل باستخدام أدوات الطعام؟", type: "scale" },
      { id: "sc2", textEn: "Can the child use the toilet independently?", textAr: "هل يستطيع الطفل استخدام الحمام بشكل مستقل؟", type: "scale" },
      { id: "sc3", textEn: "Can the child wash and dry hands independently?", textAr: "هل يستطيع الطفل غسل وتجفيف يديه بشكل مستقل؟", type: "scale" },
      { id: "sc4", textEn: "Does the child attempt to dress/undress independently?", textAr: "هل يحاول الطفل ارتداء/خلع ملابسه بشكل مستقل؟", type: "scale" },
    ],
  },
  {
    id: "attention",
    titleKey: "survey.attention",
    icon: "🎯",
    questions: [
      { id: "att1", textEn: "Can the child focus on a teacher-directed activity for 10+ minutes?", textAr: "هل يستطيع الطفل التركيز على نشاط موجّه لأكثر من 10 دقائق؟", type: "scale" },
      { id: "att2", textEn: "Can the child sit appropriately during circle/group time?", textAr: "هل يستطيع الطفل الجلوس بشكل مناسب أثناء وقت الحلقة؟", type: "scale" },
      { id: "att3", textEn: "Does the child complete tasks before moving to the next activity?", textAr: "هل يُكمل الطفل المهام قبل الانتقال للنشاط التالي؟", type: "scale" },
      { id: "att4", textEn: "How easily is the child distracted by noises or other children?", textAr: "ما مدى سهولة تشتت الطفل بالأصوات أو الأطفال الآخرين؟", type: "scale" },
    ],
  },
  {
    id: "creativity",
    titleKey: "survey.creativity",
    icon: "🎨",
    questions: [
      { id: "cr1", textEn: "Does the child engage in imaginative/pretend play?", textAr: "هل يشارك الطفل في اللعب التخيلي/التمثيلي؟", type: "scale" },
      { id: "cr2", textEn: "Does the child enjoy drawing, painting, or crafting?", textAr: "هل يستمتع الطفل بالرسم أو التلوين أو الأعمال اليدوية؟", type: "scale" },
      { id: "cr3", textEn: "Does the child respond to music (singing, dancing, rhythm)?", textAr: "هل يستجيب الطفل للموسيقى (الغناء، الرقص، الإيقاع)؟", type: "scale" },
      { id: "cr4", textEn: "Does the child try new approaches when something doesn't work?", textAr: "هل يجرب الطفل طرقاً جديدة عندما لا ينجح شيء ما؟", type: "scale" },
    ],
  },
  {
    id: "behavior",
    titleKey: "survey.behavior",
    icon: "📋",
    questions: [
      { id: "beh1", textEn: "Does the child follow classroom rules and routines?", textAr: "هل يلتزم الطفل بقواعد الفصل والروتين اليومي؟", type: "scale" },
      { id: "beh2", textEn: "Does the child respond positively to adult guidance and redirection?", textAr: "هل يستجيب الطفل إيجابياً لتوجيه البالغين؟", type: "scale" },
      { id: "beh3", textEn: "Does the child handle transitions between activities smoothly?", textAr: "هل ينتقل الطفل بين الأنشطة بسلاسة؟", type: "scale" },
      { id: "beh4", textEn: "Does the child resolve conflicts with words rather than physical actions?", textAr: "هل يحل الطفل النزاعات بالكلام بدلاً من الأفعال الجسدية؟", type: "scale" },
    ],
  },
  {
    id: "daily_mood",
    titleKey: "survey.daily_mood",
    icon: "😊",
    questions: [
      { id: "dm1", textEn: "What is the child's overall mood today?", textAr: "ما مزاج الطفل العام اليوم؟", type: "choice", options: [
        { en: "Very Happy", ar: "سعيد جداً", value: 5 },
        { en: "Happy", ar: "سعيد", value: 4 },
        { en: "Neutral", ar: "محايد", value: 3 },
        { en: "Upset", ar: "منزعج", value: 2 },
        { en: "Very Upset", ar: "منزعج جداً", value: 1 },
      ]},
      { id: "dm2", textEn: "How was the child's energy level today?", textAr: "كيف كان مستوى طاقة الطفل اليوم؟", type: "choice", options: [
        { en: "Very Active", ar: "نشيط جداً", value: 5 },
        { en: "Active", ar: "نشيط", value: 4 },
        { en: "Normal", ar: "عادي", value: 3 },
        { en: "Low Energy", ar: "طاقة منخفضة", value: 2 },
        { en: "Very Tired", ar: "متعب جداً", value: 1 },
      ]},
      { id: "dm3", textEn: "Did the child eat well today?", textAr: "هل أكل الطفل جيداً اليوم؟", type: "scale" },
      { id: "dm4", textEn: "Did the child drink enough water today?", textAr: "هل شرب الطفل كمية كافية من الماء اليوم؟", type: "scale" },
    ],
  },
];

// Add translations for survey categories
export const surveyTranslations: Record<string, Record<string, string>> = {
  "survey.cognitive": { en: "Cognitive Development", ar: "التطور المعرفي" },
  "survey.language": { en: "Language & Communication", ar: "اللغة والتواصل" },
  "survey.social_emotional": { en: "Social-Emotional Development", ar: "التطور الاجتماعي العاطفي" },
  "survey.gross_motor": { en: "Gross Motor Skills", ar: "المهارات الحركية الكبرى" },
  "survey.fine_motor": { en: "Fine Motor Skills", ar: "المهارات الحركية الدقيقة" },
  "survey.self_care": { en: "Self-Care & Independence", ar: "الرعاية الذاتية والاستقلالية" },
  "survey.attention": { en: "Attention & Focus", ar: "الانتباه والتركيز" },
  "survey.creativity": { en: "Creativity & Expression", ar: "الإبداع والتعبير" },
  "survey.behavior": { en: "Behavior & Self-Regulation", ar: "السلوك وضبط النفس" },
  "survey.daily_mood": { en: "Daily Wellbeing", ar: "الرفاهية اليومية" },
  
  "survey.fillSurvey": { en: "Fill Survey", ar: "ملء الاستقصاء" },
  "survey.scale.1": { en: "Not Yet", ar: "لم يتقنها بعد" },
  "survey.scale.2": { en: "Emerging", ar: "بداية الاكتساب" },
  "survey.scale.3": { en: "Developing", ar: "في طور النمو" },
  "survey.scale.4": { en: "Proficient", ar: "متقن" },
  "survey.scale.5": { en: "Advanced", ar: "متقدم" },
  "survey.submit": { en: "Submit & Analyze with AI", ar: "إرسال وتحليل بالذكاء الاصطناعي" },
  "survey.analyzing": { en: "Analyzing with AI...", ar: "جاري التحليل بالذكاء الاصطناعي..." },
  "survey.complete": { en: "Survey Complete", ar: "اكتمل الاستقصاء" },
  "survey.selectCategory": { en: "Select a domain to begin", ar: "اختر مجالاً للبدء" },
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
  "analysis.improvements": { en: "Areas for Growth", ar: "مجالات النمو" },
  "analysis.recommendations": { en: "Teacher Recommendations", ar: "توصيات المعلمة" },
  "analysis.parentMessage": { en: "Parent Message", ar: "رسالة للأهل" },
  "analysis.actionPlan": { en: "Development Plan", ar: "خطة التطوير" },
  "analysis.indicators": { en: "Development Level", ar: "مستوى التطور" },
  "analysis.scores": { en: "Domain Scores", ar: "درجات المجالات" },
  "analysis.share": { en: "Share via WhatsApp", ar: "مشاركة عبر الواتساب" },
  "analysis.exportPdf": { en: "Export as PDF", ar: "تصدير كـ PDF" },
  "analysis.history": { en: "Survey History", ar: "سجل الاستقصاءات" },
  "analysis.viewResults": { en: "View Results", ar: "عرض النتائج" },

  // Storage notice
  "storage.notice": { en: "☁️ Cloud-synced data", ar: "☁️ بيانات مزامنة سحابياً" },

  // Indicators
  "indicators.gifted": { en: "Advanced", ar: "متقدم" },
  "indicators.typical": { en: "On Track", ar: "ضمن المسار" },
  "indicators.delayed": { en: "Needs Support", ar: "يحتاج دعم" },
  "indicators.mixed": { en: "Mixed", ar: "متفاوت" },
};
