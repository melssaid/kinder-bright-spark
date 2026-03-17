import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Send, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { surveyCategories } from "@/data/surveyQuestions";
import { DbStudent } from "@/lib/database";
import { addSurvey, updateSurveyAnalysis } from "@/lib/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface SurveyFormProps {
  student: DbStudent;
  onComplete: () => void;
}

export function SurveyForm({ student, onComplete }: SurveyFormProps) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const totalQuestions = surveyCategories.reduce((sum, c) => sum + c.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const category = surveyCategories[currentCategory];
  const isLastCategory = currentCategory === surveyCategories.length - 1;
  const canProceed = category.questions.every(q => answers[q.id] !== undefined);

  const handleAnswer = (questionId: string, value: number | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isLastCategory) handleSubmit();
    else setCurrentCategory(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setAnalyzing(true);
    const survey = await addSurvey({ student_id: student.id, teacher_id: user.id, answers });
    if (!survey) { setAnalyzing(false); toast.error("Error saving survey"); return; }

    try {
      const { data, error } = await supabase.functions.invoke("analyze-behavior", {
        body: { studentName: student.name, studentAge: student.age, surveyData: answers, locale },
      });
      if (error) throw error;
      if (data?.error) {
        if (data.error.includes("Rate limit")) toast.error(locale === "ar" ? "تم تجاوز حد الطلبات" : "Rate limit exceeded");
        else if (data.error.includes("Payment")) toast.error(locale === "ar" ? "يرجى إضافة رصيد" : "Please add credits");
        else throw new Error(data.error);
      }
      if (data?.analysis) {
        await updateSurveyAnalysis(survey.id, data.analysis);
      }
      setCompleted(true);
      toast.success(locale === "ar" ? "تم التحليل بنجاح!" : "Analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error(locale === "ar" ? "حدث خطأ في التحليل" : "Analysis error occurred");
    } finally {
      setAnalyzing(false);
    }
  };

  if (completed) {
    return (
      <>
        <Confetti recycle={false} numberOfPieces={500} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-success/30">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
              <CheckCircle className="h-16 w-16 text-success" />
              <h3 className="text-xl font-bold">{t("survey.complete")}</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {locale === "ar" ? "تم تحليل الاستقصاء بنجاح! يمكنك الآن عرض التقرير التفصيلي." : "Survey analyzed successfully! You can now view the detailed report."}
              </p>
              <Button onClick={onComplete}>{t("analysis.viewResults")}</Button>
            </CardContent>
          </Card>
        </motion.div>
      </>
    );
  }

  if (analyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h3 className="text-lg font-semibold">{t("survey.analyzing")}</h3>
            <p className="text-sm text-muted-foreground">
              {locale === "ar" ? "يقوم الذكاء الاصطناعي بتحليل الإجابات..." : "AI is analyzing the responses..."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{answeredQuestions}/{totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {surveyCategories.map((cat, i) => {
          const catAnswered = cat.questions.every(q => answers[q.id] !== undefined);
          return (
            <Button key={cat.id} variant={i === currentCategory ? "default" : catAnswered ? "secondary" : "outline"} size="sm" className="shrink-0 text-xs gap-1" onClick={() => setCurrentCategory(i)}>
              <span>{cat.icon}</span>
              {t(cat.titleKey)}
              {catAnswered && <CheckCircle className="h-3 w-3" />}
            </Button>
          );
        })}
      </div>

      <motion.div
        key={currentCategory}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-xl">{category.icon}</span>
              {t(category.titleKey)}
              <Badge variant="secondary" className="text-[10px] ms-auto">{currentCategory + 1}/{surveyCategories.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {category.questions.map(question => (
              <div key={question.id} className="space-y-3">
                <p className="text-sm font-medium">{locale === "ar" ? question.textAr : question.textEn}</p>
                {question.type === "scale" ? (
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map(val => (
                      <Button key={val} variant={answers[question.id] === val ? "default" : "outline"} size="sm" onClick={() => handleAnswer(question.id, val)} className="flex-1 min-w-[60px]">
                        <div className="text-center">
                          <div className="text-xs">{val}</div>
                          <div className="text-[9px]">{t(`survey.scale.${val}`)}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <RadioGroup value={String(answers[question.id] ?? "")} onValueChange={v => handleAnswer(question.id, parseInt(v))}>
                    <div className="flex flex-wrap gap-2">
                      {question.options?.map(opt => (
                        <div key={opt.value} className="flex items-center gap-1.5">
                          <RadioGroupItem value={String(opt.value)} id={`${question.id}-${opt.value}`} />
                          <Label htmlFor={`${question.id}-${opt.value}`} className="text-sm cursor-pointer">{locale === "ar" ? opt.ar : opt.en}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentCategory(prev => prev - 1)} disabled={currentCategory === 0}>
          {locale === "ar" ? "السابق" : "Previous"}
        </Button>
        <Button onClick={handleNext} disabled={!canProceed} className="gap-2">
          {isLastCategory ? (<><Send className="h-4 w-4" /> {t("survey.submit")}</>) : (locale === "ar" ? "التالي" : "Next")}
        </Button>
      </div>
    </div>
  );
}
