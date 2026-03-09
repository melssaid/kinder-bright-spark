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
import { Brain, TrendingUp, Heart, MessageSquare, Zap, Star, ClipboardList, Calendar, ArrowLeft, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
import { DbStudent, DbSurvey, DbAttendance, getStudentSurveys, getStudentAttendance, getAttendanceStats } from "@/lib/database";
import { surveyCategories } from "@/data/surveyQuestions";
import { motion } from "framer-motion";

interface StudentProfileViewProps {
  student: DbStudent;
  onBack: () => void;
}

const COLORS = [
  "hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))",
  "hsl(var(--info))", "hsl(var(--destructive))", "hsl(258, 58%, 70%)", "hsl(152, 60%, 60%)"
];

const categoryMeta: Record<string, { emoji: string; descAr: string; descEn: string }> = {
  attention: { emoji: "🧠", descAr: "قدرة الطفل على التركيز والانتباه أثناء الأنشطة", descEn: "Child's ability to focus and pay attention during activities" },
  mood: { emoji: "😊", descAr: "الحالة المزاجية العامة والتعبير عن المشاعر", descEn: "General mood and emotional expression" },
  social: { emoji: "👫", descAr: "التفاعل مع الأقران والمشاركة في الأنشطة الجماعية", descEn: "Interaction with peers and participation in group activities" },
  learning: { emoji: "📚", descAr: "أسلوب التعلم المفضل والفضول المعرفي", descEn: "Preferred learning style and intellectual curiosity" },
  emotional: { emoji: "❤️", descAr: "القدرة على إدارة المشاعر والتعاطف مع الآخرين", descEn: "Ability to manage emotions and empathize with others" },
  speech: { emoji: "💬", descAr: "وضوح النطق وتكوين الجمل والمفردات", descEn: "Speech clarity, sentence formation, and vocabulary" },
  motor: { emoji: "🏃", descAr: "المهارات الحركية الدقيقة والكبرى", descEn: "Fine and gross motor skills development" },
  talent: { emoji: "⭐", descAr: "المواهب الخاصة والقدرات الاستثنائية", descEn: "Special talents and exceptional abilities" },
  behavior: { emoji: "📋", descAr: "الالتزام بالقواعد وضبط النفس", descEn: "Rule following and self-control" },
  nutrition: { emoji: "🍎", descAr: "التغذية الصحية ومستوى الطاقة", descEn: "Healthy nutrition and energy levels" },
};

export function StudentProfileView({ student, onBack }: StudentProfileViewProps) {
  const { locale } = useI18n();
  const isAr = locale === "ar";
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

  // Build category scores from latest survey answers
  const categoryScores = surveyCategories.map(cat => {
    const catQuestions = cat.questions;
    const answers = latestSurvey?.answers || {};
    const answered = catQuestions.filter(q => answers[q.id] !== undefined);
    const sum = answered.reduce((s, q) => {
      const v = answers[q.id];
      return s + (typeof v === "number" ? v : 3);
    }, 0);
    const avg = answered.length > 0 ? Math.round((sum / answered.length) * 20) : 0;
    const meta = categoryMeta[cat.id] || { emoji: "📊", descAr: "", descEn: "" };
    return {
      id: cat.id,
      name: isAr ? (meta.descAr.split(" ").slice(0, 3).join(" ")) : cat.titleKey.split(".")[1],
      fullName: isAr ? surveyCategories.find(c => c.id === cat.id)?.titleKey : cat.titleKey,
      emoji: meta.emoji,
      desc: isAr ? meta.descAr : meta.descEn,
      score: analysis?.scores?.[cat.id] ?? avg,
    };
  });

  const radarData = categoryScores.filter(c => c.score > 0).map(c => ({
    subject: `${c.emoji} ${isAr ? c.name : c.id.charAt(0).toUpperCase() + c.id.slice(1)}`,
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
    .map((s, i) => ({
      date: new Date(s.date).toLocaleDateString(isAr ? "ar-SA" : "en-US", { month: "short", day: "numeric" }),
      score: Object.values((s.analysis as any)?.scores || {}).reduce((a: number, b: any) => a + (typeof b === "number" ? b : 0), 0) / 7,
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
            <div className="flex items-center gap-2 mt-0.5">
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">{isAr ? "📊 نظرة عامة" : "📊 Overview"}</TabsTrigger>
          <TabsTrigger value="categories">{isAr ? "📋 البنود" : "📋 Categories"}</TabsTrigger>
          <TabsTrigger value="analysis">{isAr ? "🧠 التحليل" : "🧠 Analysis"}</TabsTrigger>
          <TabsTrigger value="attendance">{isAr ? "📅 الحضور" : "📅 Attendance"}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
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
                  <CardDescription className="text-xs">{isAr ? "متابعة تقدم الطالب عبر التقييمات" : "Track student progress across assessments"}</CardDescription>
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
                <CardDescription className="text-xs">{isAr ? "مقارنة الدرجات في جميع مجالات التقييم" : "Compare scores across all assessment areas"}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryScores.filter(c => c.score > 0)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey={c => `${c.emoji} ${c.id}`} tick={{ fontSize: 11 }} width={100} />
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

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-3">
          {surveyCategories.map(cat => {
            const meta = categoryMeta[cat.id];
            const score = categoryScores.find(c => c.id === cat.id)?.score || 0;
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{meta?.emoji || "📊"}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm">
                            {isAr ? (surveyCategories.find(c => c.id === cat.id)?.icon + " ") : ""}{cat.titleKey.split(".")[1].charAt(0).toUpperCase() + cat.titleKey.split(".")[1].slice(1)}
                          </h3>
                          <Badge variant={score >= 80 ? "default" : score >= 50 ? "secondary" : "destructive"} className="text-xs">
                            {score}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{meta ? (isAr ? meta.descAr : meta.descEn) : ""}</p>
                        <Progress value={score} className="h-2" />
                        <div className="mt-2 space-y-1">
                          {cat.questions.map(q => {
                            const answer = latestSurvey?.answers?.[q.id];
                            return (
                              <div key={q.id} className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground truncate max-w-[70%]">{isAr ? q.textAr : q.textEn}</span>
                                <span className="font-medium">
                                  {answer !== undefined ? (typeof answer === "number" ? `${answer}/5` : String(answer)) : (isAr ? "—" : "—")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
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
                    <p className="text-sm leading-relaxed">{isAr ? analysis.summary.ar || analysis.summary : analysis.summary.en || analysis.summary}</p>
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
                      {isAr ? "📝 توصيات المعلمة" : "📝 Teacher Recommendations"}
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
                <p className="text-sm text-muted-foreground">{isAr ? "أكملي استقصاءً لهذا الطالب للحصول على تحليل مفصل بالذكاء الاصطناعي" : "Complete a survey for this student to get an AI-powered analysis"}</p>
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
                <CardDescription className="text-xs">{isAr ? "ملخص سجل الحضور والغياب" : "Summary of attendance records"}</CardDescription>
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
            <CardDescription className="text-xs">{isAr ? "جميع التقييمات السابقة لهذا الطالب" : "All previous assessments for this student"}</CardDescription>
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
