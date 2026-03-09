import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Brain, TrendingUp, Heart, MessageSquare, Zap, Star, ClipboardList, Calendar, ArrowLeft, Sparkles, PlayCircle } from "lucide-react";
import { useI18n } from "@/i18n";
import { DbStudent, DbSurvey, getStudentSurveys, getAttendanceStats } from "@/lib/database";
import { surveyCategories } from "@/data/surveyQuestions";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface StudentProfileViewProps {
  student: DbStudent;
  onBack: () => void;
}

const COLORS = [
  "hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))",
  "hsl(var(--info))", "hsl(var(--destructive))", "hsl(258, 58%, 70%)", "hsl(152, 60%, 60%)",
  "hsl(30, 80%, 60%)", "hsl(200, 70%, 55%)", "hsl(340, 65%, 60%)"
];

const categoryMeta: Record<string, { emoji: string; titleAr: string; titleEn: string; descAr: string; descEn: string }> = {
  attention: {
    emoji: "🎯",
    titleAr: "رادار الانتباه وفرط الحركة",
    titleEn: "ADHD & Attention Radar",
    descAr: "يحلل نمط تركيز الطفل واستجابته للأنشطة ويقيّم احتمالية تشتت الانتباه مع توصيات مبكرة للمعلمة والأهل",
    descEn: "Analyzes focus patterns and activity responses, assessing attention deficit probability with early recommendations",
  },
  mood: {
    emoji: "😊",
    titleAr: "مقياس المزاج اليومي",
    titleEn: "Daily Mood Meter",
    descAr: "يعتمد على تعابير الطفل وسرعة تفاعله مع الأنشطة الجماعية ويقدم درجة مزاج يومية وتنبيهات عند تغيرات حادة قد تشير لضغط نفسي",
    descEn: "Based on expressions and interaction speed, provides daily mood score with alerts for sharp changes indicating stress",
  },
  social: {
    emoji: "👫",
    titleAr: "محلل التفاعل الاجتماعي",
    titleEn: "Social Interaction Analyzer",
    descAr: "يراقب من يلعب مع من ومدة التفاعل ومن يُهمّش غالباً ويولد خريطة علاقات تساعد المعلمة على دمج الأطفال المنعزلين",
    descEn: "Monitors play patterns, interaction duration, and identifies isolated children with social mapping for integration",
  },
  learning: {
    emoji: "📚",
    titleAr: "بروفايل الشخصية التعليمية",
    titleEn: "Learning Profile",
    descAr: "يصنف الطفل إلى أنماط تعلم (حسي حركي، بصري، سمعي، اجتماعي) ويقترح للمعلمة طرق الشرح المناسبة لكل طفل",
    descEn: "Classifies learning styles (kinesthetic, visual, auditory, social) and suggests appropriate teaching methods",
  },
  emotional: {
    emoji: "❤️",
    titleAr: "مدرب المهارات العاطفية",
    titleEn: "Emotional Skills Coach",
    descAr: "يقيّم استجابات الطفل لسيناريوهات المشاعر (غضب، حزن، مشاركة) ويقترح أنشطة خاصة لتعزيز الذكاء العاطفي",
    descEn: "Evaluates emotional responses (anger, sadness, sharing) and suggests activities to boost emotional intelligence",
  },
  speech: {
    emoji: "💬",
    titleAr: "مستشار اللغة والنطق",
    titleEn: "Speech & Language Advisor",
    descAr: "يحلل مخارج الحروف وعدد الكلمات وطول الجملة ويقارنها بعمره ويعطي توصيات لتمارين منزلية أو علاج نطق",
    descEn: "Analyzes pronunciation, vocabulary size, sentence length compared to age with home exercise recommendations",
  },
  motor: {
    emoji: "🏃",
    titleAr: "التطور النمائي الحركي",
    titleEn: "Motor Development",
    descAr: "يجمع سلوك الطفل الحركي اليومي (لعب، جري، رسم) وينتج ملف نمو حيّ مع مؤشرات للتأخر أو التميز الحركي",
    descEn: "Tracks daily motor behavior (play, running, drawing) producing a live growth profile with delay/excellence indicators",
  },
  talent: {
    emoji: "⭐",
    titleAr: "مكتشف الموهبة المبكرة",
    titleEn: "Early Talent Discovery",
    descAr: "يحلل أنماط أداء الطفل في الرسم والبناء والألعاب اللغوية ليكشف مؤشرات مبكرة لمواهب فنية أو رياضية أو منطقية",
    descEn: "Analyzes performance in drawing, building, language games to detect early artistic, athletic, or logical talents",
  },
  behavior: {
    emoji: "💌",
    titleAr: "مترجم السلوك للأهل",
    titleEn: "Parent Behavior Translator",
    descAr: "يحوّل ملاحظات المعلمة إلى رسالة مفهومة لولي الأمر تشرح السلوك بلطف وتقدم خطة منزلية للتعامل معه",
    descEn: "Converts teacher notes into parent-friendly messages with gentle explanations and home action plans",
  },
  nutrition: {
    emoji: "🍎",
    titleAr: "مساعد التغذية الذكي",
    titleEn: "Smart Nutrition Assistant",
    descAr: "يتابع تغذية الطفل ويقارنها باحتياجه العمري ويقترح صناديق غذاء مخصصة وتحفيزات لتجربة أطعمة جديدة",
    descEn: "Tracks nutrition vs age needs, suggests customized lunchboxes and motivations for trying new healthy foods",
  },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-success/10 border-success/30";
  if (score >= 50) return "bg-warning/10 border-warning/30";
  return "bg-destructive/10 border-destructive/30";
}

function getScoreTip(score: number, isAr: boolean): string {
  if (score >= 80) return isAr ? "✅ أداء ممتاز — استمري في التعزيز" : "✅ Excellent — keep reinforcing";
  if (score >= 60) return isAr ? "👍 جيد — مع بعض التحسينات البسيطة" : "👍 Good — with minor improvements";
  if (score >= 50) return isAr ? "⚠️ يحتاج انتباه — خصصي أنشطة إضافية" : "⚠️ Needs attention — add extra activities";
  return isAr ? "🔴 يحتاج دعم عاجل — تواصلي مع المختص" : "🔴 Needs urgent support — consult a specialist";
}

export function StudentProfileView({ student, onBack }: StudentProfileViewProps) {
  const { locale } = useI18n();
  const isAr = locale === "ar";
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<DbSurvey[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentSurveys(student.id),
      getAttendanceStats(student.id),
    ]).then(([s, a]) => {
      setSurveys(s);
      setAttendanceStats(a);
      setLoading(false);
    });
  }, [student.id]);

  const latestSurvey = surveys.find(s => s.analysis);
  const analysis = latestSurvey?.analysis as any;

  const categoryScores = surveyCategories.map(cat => {
    const catQuestions = cat.questions;
    const answers = latestSurvey?.answers || {};
    const answered = catQuestions.filter(q => answers[q.id] !== undefined);
    const sum = answered.reduce((s, q) => {
      const v = answers[q.id];
      return s + (typeof v === "number" ? v : 3);
    }, 0);
    const avg = answered.length > 0 ? Math.round((sum / answered.length) * 20) : 0;
    const meta = categoryMeta[cat.id];
    return {
      id: cat.id,
      emoji: meta?.emoji || "📊",
      titleAr: meta?.titleAr || cat.id,
      titleEn: meta?.titleEn || cat.id,
      descAr: meta?.descAr || "",
      descEn: meta?.descEn || "",
      score: analysis?.scores?.[cat.id] ?? avg,
    };
  });

  const radarData = categoryScores.filter(c => c.score > 0).map(c => ({
    subject: `${c.emoji} ${isAr ? c.titleAr.split(" ")[0] : c.titleEn.split(" ")[0]}`,
    value: c.score,
  }));

  const attendancePieData = attendanceStats ? [
    { name: isAr ? "حاضر" : "Present", value: attendanceStats.present, color: "hsl(var(--success))" },
    { name: isAr ? "غائب" : "Absent", value: attendanceStats.absent, color: "hsl(var(--destructive))" },
    { name: isAr ? "متأخر" : "Late", value: attendanceStats.late, color: "hsl(var(--warning))" },
    { name: isAr ? "معذور" : "Excused", value: attendanceStats.excused, color: "hsl(var(--info))" },
  ].filter(d => d.value > 0) : [];

  const surveyTimeline = surveys
    .filter(s => s.analysis)
    .slice(0, 10)
    .reverse()
    .map((s) => ({
      date: new Date(s.date).toLocaleDateString(isAr ? "ar-SA" : "en-US", { month: "short", day: "numeric" }),
      score: Math.round(((Object.values((s.analysis as any)?.scores || {}) as number[]).reduce((a, b) => a + (typeof b === "number" ? b : 0), 0)) / Math.max(Object.keys((s.analysis as any)?.scores || {}).length, 1)),
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center text-3xl shadow-sm">
            {student.gender === "male" ? "👦" : "👧"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <Badge variant="secondary" className="text-xs">{isAr ? `العمر: ${student.age}` : `Age: ${student.age}`}</Badge>
              <Badge variant="outline" className="text-xs">{student.gender === "male" ? (isAr ? "ذكر" : "Male") : (isAr ? "أنثى" : "Female")}</Badge>
              {analysis?.indicators?.type && (
                <Badge variant={analysis.indicators.type === "gifted" ? "default" : analysis.indicators.type === "delayed" ? "destructive" : "secondary"} className="text-xs">
                  {analysis.indicators.type === "gifted" ? "🌟" : analysis.indicators.type === "delayed" ? "⚠️" : "✅"}{" "}
                  {isAr ? (analysis.indicators.type === "gifted" ? "موهوب" : analysis.indicators.type === "delayed" ? "يحتاج دعم" : "طبيعي") : analysis.indicators.type}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button size="sm" className="gap-2" onClick={() => navigate("/survey")}>
          <PlayCircle className="h-4 w-4" />
          {isAr ? "تقييم جديد" : "New Assessment"}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <ClipboardList className="h-6 w-6 mx-auto text-info mb-1" />
            <p className="text-2xl font-bold">{surveys.length}</p>
            <p className="text-[10px] text-muted-foreground">{isAr ? "استقصاء" : "Surveys"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Calendar className="h-6 w-6 mx-auto text-success mb-1" />
            <p className="text-2xl font-bold">{attendanceStats?.rate || 0}%</p>
            <p className="text-[10px] text-muted-foreground">{isAr ? "نسبة الحضور" : "Attendance"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Brain className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{surveys.filter(s => s.analysis).length}</p>
            <p className="text-[10px] text-muted-foreground">{isAr ? "تحليلات" : "Analyses"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Sparkles className="h-6 w-6 mx-auto text-warning mb-1" />
            <p className="text-2xl font-bold">{analysis ? Math.round((Object.values(analysis.scores || {}) as number[]).reduce((a, b) => a + (typeof b === "number" ? b : 0), 0) / Math.max(Object.keys(analysis.scores || {}).length, 1)) : 0}%</p>
            <p className="text-[10px] text-muted-foreground">{isAr ? "المعدل العام" : "Overall"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="categories">{isAr ? "📋 البنود" : "📋 Categories"}</TabsTrigger>
          <TabsTrigger value="overview">{isAr ? "📊 الرسوم" : "📊 Charts"}</TabsTrigger>
          <TabsTrigger value="analysis">{isAr ? "🧠 التحليل" : "🧠 Analysis"}</TabsTrigger>
          <TabsTrigger value="attendance">{isAr ? "📅 الحضور" : "📅 Attendance"}</TabsTrigger>
        </TabsList>

        {/* Categories Tab — Primary View */}
        <TabsContent value="categories" className="space-y-3">
          {categoryScores.length > 0 && categoryScores.some(c => c.score > 0) ? (
            categoryScores.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`overflow-hidden border ${getScoreBg(cat.score)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl mt-1">{cat.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-sm">
                            {isAr ? cat.titleAr : cat.titleEn}
                          </h3>
                          <Badge
                            variant={cat.score >= 80 ? "default" : cat.score >= 50 ? "secondary" : "destructive"}
                            className="text-xs font-bold"
                          >
                            {cat.score}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {isAr ? cat.descAr : cat.descEn}
                        </p>
                        <Progress value={cat.score} className="h-2.5 mb-2" />
                        <p className={`text-xs font-medium ${getScoreColor(cat.score)}`}>
                          {getScoreTip(cat.score, isAr)}
                        </p>

                        {/* Show questions & answers */}
                        {latestSurvey && (
                          <div className="mt-3 pt-2 border-t border-border/50 space-y-1.5">
                            {surveyCategories.find(c => c.id === cat.id)?.questions.map(q => {
                              const answer = latestSurvey.answers?.[q.id];
                              return (
                                <div key={q.id} className="flex items-center justify-between text-[11px]">
                                  <span className="text-muted-foreground truncate max-w-[70%]">{isAr ? q.textAr : q.textEn}</span>
                                  <span className="font-semibold">
                                    {answer !== undefined ? (typeof answer === "number" ? `${answer}/5` : String(answer)) : "—"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="font-semibold mb-1">{isAr ? "لا توجد بيانات بعد" : "No data yet"}</h3>
                <p className="text-sm text-muted-foreground mb-4">{isAr ? "أكملي تقييماً لعرض البنود" : "Complete an assessment to view categories"}</p>
                <Button size="sm" onClick={() => navigate("/survey")} className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  {isAr ? "ابدأ التقييم" : "Start Assessment"}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {radarData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {isAr ? "مخطط المهارات" : "Skills Radar"}
                  </CardTitle>
                  <CardDescription className="text-xs">{isAr ? "نظرة شاملة على جميع مجالات النمو" : "Comprehensive view of all development areas"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {surveyTimeline.length > 1 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    {isAr ? "تطور الدرجات عبر الزمن" : "Score Progress Over Time"}
                  </CardTitle>
                  <CardDescription className="text-xs">{isAr ? "متابعة تقدم الطالب" : "Track student progress"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={surveyTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Category Bar Chart */}
          {categoryScores.some(c => c.score > 0) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{isAr ? "📊 درجات البنود" : "📊 Category Scores"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryScores.filter(c => c.score > 0)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey={c => `${c.emoji} ${isAr ? c.titleAr.split(" ")[0] : c.titleEn.split(" ")[0]}`} tick={{ fontSize: 11 }} width={110} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {categoryScores.filter(c => c.score > 0).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          {analysis ? (
            <>
              {analysis.summary && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      {isAr ? "🧠 ملخص التحليل" : "🧠 Analysis Summary"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{typeof analysis.summary === "string" ? analysis.summary : (isAr ? analysis.summary.ar : analysis.summary.en)}</p>
                  </CardContent>
                </Card>
              )}

              {analysis.indicators?.details && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4 flex items-start gap-3">
                    <span className="text-3xl">{analysis.indicators.type === "gifted" ? "🌟" : analysis.indicators.type === "delayed" ? "⚠️" : "✅"}</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{isAr ? "🔍 المؤشرات المبكرة" : "🔍 Early Indicators"}</h4>
                      <p className="text-sm text-muted-foreground">{typeof analysis.indicators.details === "string" ? analysis.indicators.details : (isAr ? analysis.indicators.details.ar : analysis.indicators.details.en)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.strengths && (
                  <Card className="border-success/30 bg-success/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Star className="h-4 w-4 text-success" />
                        {isAr ? "💪 نقاط القوة" : "💪 Strengths"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5">
                        {(Array.isArray(analysis.strengths) ? analysis.strengths : (isAr ? analysis.strengths.ar : analysis.strengths.en) || []).map((s: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-success mt-0.5">✅</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {analysis.improvements && (
                  <Card className="border-warning/30 bg-warning/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4 text-warning" />
                        {isAr ? "🎯 مجالات التحسين" : "🎯 Areas to Improve"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5">
                        {(Array.isArray(analysis.improvements) ? analysis.improvements : (isAr ? analysis.improvements.ar : analysis.improvements.en) || []).map((s: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-warning mt-0.5">🔸</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {analysis.recommendations && (
                <Card className="border-info/30 bg-info/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-info" />
                      {isAr ? "📝 توصيات المعلمة" : "📝 Recommendations"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {(Array.isArray(analysis.recommendations) ? analysis.recommendations : (isAr ? analysis.recommendations.ar : analysis.recommendations.en) || []).map((s: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-info mt-0.5">💡</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.actionPlan && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      {isAr ? "📅 خطة 3 أيام" : "📅 3-Day Action Plan"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(Array.isArray(analysis.actionPlan) ? analysis.actionPlan : (isAr ? analysis.actionPlan.ar : analysis.actionPlan.en) || []).map((s: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">{i + 1}</Badge>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.parentMessage && (
                <Card className="border-accent/50 bg-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4 text-accent-foreground" />
                      {isAr ? "💌 رسالة للأهل" : "💌 Parent Message"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed italic">
                      {typeof analysis.parentMessage === "string" ? analysis.parentMessage : (isAr ? analysis.parentMessage.ar : analysis.parentMessage.en)}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="font-semibold mb-1">{isAr ? "لا توجد تحليلات بعد" : "No analysis yet"}</h3>
                <p className="text-sm text-muted-foreground mb-4">{isAr ? "أكملي استقصاءً للحصول على تحليل بالذكاء الاصطناعي" : "Complete a survey for AI analysis"}</p>
                <Button size="sm" onClick={() => navigate("/survey")} className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  {isAr ? "ابدأ التقييم" : "Start Assessment"}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{isAr ? "📊 إحصائيات الحضور" : "📊 Attendance Stats"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{isAr ? "إجمالي الأيام" : "Total Days"}</span>
                  <span className="font-bold">{attendanceStats?.total || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">✅ {isAr ? "حاضر" : "Present"}</span>
                  <span className="font-bold text-success">{attendanceStats?.present || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">❌ {isAr ? "غائب" : "Absent"}</span>
                  <span className="font-bold text-destructive">{attendanceStats?.absent || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">⏰ {isAr ? "متأخر" : "Late"}</span>
                  <span className="font-bold text-warning">{attendanceStats?.late || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">📋 {isAr ? "معذور" : "Excused"}</span>
                  <span className="font-bold text-info">{attendanceStats?.excused || 0}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{isAr ? "نسبة الحضور" : "Rate"}</span>
                    <span>{attendanceStats?.rate || 0}%</span>
                  </div>
                  <Progress value={attendanceStats?.rate || 0} className="h-2 mt-1" />
                </div>
              </CardContent>
            </Card>

            {attendancePieData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{isAr ? "📈 توزيع الحضور" : "📈 Distribution"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={attendancePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {attendancePieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Survey History */}
      {surveys.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-info" />
              {isAr ? "📜 سجل الاستقصاءات" : "📜 Survey History"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {surveys.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.analysis ? "✅" : "⏳"}</span>
                    <div>
                      <p className="text-sm font-medium">{new Date(s.date).toLocaleDateString(isAr ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                      <p className="text-[10px] text-muted-foreground">{Object.keys(s.answers).length} {isAr ? "إجابة" : "answers"}</p>
                    </div>
                  </div>
                  {s.analysis && (
                    <Badge variant={(s.analysis as any)?.indicators?.type === "gifted" ? "default" : "secondary"} className="text-xs">
                      {(s.analysis as any)?.indicators?.type === "gifted" ? "🌟" : "✅"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
