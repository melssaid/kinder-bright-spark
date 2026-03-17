import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { addSurvey } from "@/lib/database";
import { DbStudent } from "@/lib/database";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

interface DailyCheckInProps {
  student: DbStudent;
  onComplete: () => void;
}

const dailyQuestions = [
  {
    id: "mood",
    titleAr: "مزاج الطفل اليوم",
    titleEn: "Child's mood today",
    options: [
      { emoji: "😄", labelAr: "سعيد جداً", labelEn: "Very Happy", value: 5 },
      { emoji: "🙂", labelAr: "سعيد", labelEn: "Happy", value: 4 },
      { emoji: "😐", labelAr: "عادي", labelEn: "Neutral", value: 3 },
      { emoji: "😟", labelAr: "حزين", labelEn: "Sad", value: 2 },
      { emoji: "😢", labelAr: "منزعج جداً", labelEn: "Very Upset", value: 1 },
    ],
  },
  {
    id: "energy",
    titleAr: "مستوى الطاقة والنشاط",
    titleEn: "Energy & activity level",
    options: [
      { emoji: "⚡", labelAr: "نشيط جداً", labelEn: "Very Active", value: 5 },
      { emoji: "🏃", labelAr: "نشيط", labelEn: "Active", value: 4 },
      { emoji: "🚶", labelAr: "عادي", labelEn: "Normal", value: 3 },
      { emoji: "🧘", labelAr: "هادئ", labelEn: "Calm", value: 2 },
      { emoji: "😴", labelAr: "متعب", labelEn: "Tired", value: 1 },
    ],
  },
  {
    id: "social",
    titleAr: "التفاعل مع الأقران",
    titleEn: "Interaction with peers",
    options: [
      { emoji: "🤝", labelAr: "تعاوني جداً", labelEn: "Very Cooperative", value: 5 },
      { emoji: "👫", labelAr: "تفاعل جيد", labelEn: "Good Interaction", value: 4 },
      { emoji: "🧒", labelAr: "تفاعل عادي", labelEn: "Normal", value: 3 },
      { emoji: "🤫", labelAr: "منعزل قليلاً", labelEn: "Slightly Isolated", value: 2 },
      { emoji: "😶", labelAr: "منعزل", labelEn: "Isolated", value: 1 },
    ],
  },
];

export function DailyCheckIn({ student, onComplete }: DailyCheckInProps) {
  const { locale } = useI18n();
  const { user } = useAuth();
  const isAr = locale === "ar";
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const allAnswered = dailyQuestions.every(q => answers[q.id] !== undefined);

  const handleSave = async () => {
    if (!user || !allAnswered) return;
    setSaving(true);
    const surveyAnswers: Record<string, number | string> = {};
    dailyQuestions.forEach(q => {
      surveyAnswers[`daily_${q.id}`] = answers[q.id];
    });
    surveyAnswers["_type"] = "daily";
    
    const result = await addSurvey({ student_id: student.id, teacher_id: user.id, answers: surveyAnswers });
    setSaving(false);
    if (result) {
      setSaved(true);
      toast.success(isAr ? "تم حفظ التقييم اليومي ✅" : "Daily check-in saved ✅");
      setTimeout(onComplete, 1500);
    } else {
      toast.error(isAr ? "خطأ في الحفظ" : "Error saving");
    }
  };

  if (saved) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className="border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
            <CheckCircle className="h-14 w-14 text-primary" />
            <h3 className="text-lg font-bold">{isAr ? "تم حفظ التقييم اليومي! ✅" : "Daily Check-in Saved! ✅"}</h3>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="text-center space-y-1">
        <h3 className="text-base font-bold">{isAr ? "📋 التقييم اليومي السريع" : "📋 Quick Daily Check-in"}</h3>
        <p className="text-xs text-muted-foreground">{isAr ? "اختاري الإيموجي المناسب لحالة الطفل اليوم" : "Select the emoji that matches the child's state today"}</p>
      </div>

      {dailyQuestions.map((question, qi) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: qi * 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{isAr ? question.titleAr : question.titleEn}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-1">
                {question.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers(prev => ({ ...prev, [question.id]: opt.value }))}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2 flex-1 min-h-[72px] transition-all duration-200 touch-manipulation active:scale-95 border-2 ${
                      answers[question.id] === opt.value
                        ? "bg-primary/10 border-primary shadow-sm scale-[1.05]"
                        : "bg-muted/30 border-transparent hover:border-primary/20"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-[9px] leading-tight text-center text-muted-foreground">
                      {isAr ? opt.labelAr : opt.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <Button
        onClick={handleSave}
        disabled={!allAnswered || saving}
        className="w-full h-12 gap-2 text-sm font-semibold"
      >
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
        {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ التقييم اليومي" : "Save Daily Check-in")}
      </Button>
    </div>
  );
}
