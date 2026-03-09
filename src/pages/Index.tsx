import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Users, ClipboardList, TrendingUp, Brain } from "lucide-react";
import { useI18n } from "@/i18n";
import { getStudents, getSurveys, DbStudent, DbSurvey } from "@/lib/database";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { motion } from "framer-motion";

const Index = () => {
  const { t, locale } = useI18n();
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [surveys, setSurveys] = useState<DbSurvey[]>([]);

  useEffect(() => {
    getStudents().then(setStudents);
    getSurveys().then(setSurveys);
  }, []);

  const analyzedSurveys = surveys.filter(s => s.analysis);
  const latestByStudent = students.map(st => {
    const studentSurveys = analyzedSurveys.filter(s => s.student_id === st.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { student: st, latest: studentSurveys[0] || null };
  }).filter(x => x.latest);

  const avgScores = latestByStudent.length > 0 ? {
    attention: Math.round(latestByStudent.reduce((s, x) => s + (x.latest?.analysis?.scores.attention || 0), 0) / latestByStudent.length),
    social: Math.round(latestByStudent.reduce((s, x) => s + (x.latest?.analysis?.scores.social || 0), 0) / latestByStudent.length),
    emotional: Math.round(latestByStudent.reduce((s, x) => s + (x.latest?.analysis?.scores.emotional || 0), 0) / latestByStudent.length),
    speech: Math.round(latestByStudent.reduce((s, x) => s + (x.latest?.analysis?.scores.speech || 0), 0) / latestByStudent.length),
    motor: Math.round(latestByStudent.reduce((s, x) => s + (x.latest?.analysis?.scores.motor || 0), 0) / latestByStudent.length),
    cognitive: Math.round(latestByStudent.reduce((s, x) => s + (x.latest?.analysis?.scores.cognitive || 0), 0) / latestByStudent.length),
    creativity: Math.round(latestByStudent.reduce((s, x) => s + (x.latest?.analysis?.scores.creativity || 0), 0) / latestByStudent.length),
  } : null;

  const radarData = avgScores ? [
    { subject: locale === "ar" ? "الانتباه" : "Attention", value: avgScores.attention },
    { subject: locale === "ar" ? "اجتماعي" : "Social", value: avgScores.social },
    { subject: locale === "ar" ? "عاطفي" : "Emotional", value: avgScores.emotional },
    { subject: locale === "ar" ? "نطق" : "Speech", value: avgScores.speech },
    { subject: locale === "ar" ? "حركي" : "Motor", value: avgScores.motor },
    { subject: locale === "ar" ? "إدراكي" : "Cognitive", value: avgScores.cognitive },
    { subject: locale === "ar" ? "إبداع" : "Creativity", value: avgScores.creativity },
  ] : [];

  const studentBarData = latestByStudent.map(x => ({
    name: x.student.name.split(" ")[0],
    attention: x.latest?.analysis?.scores.attention || 0,
    social: x.latest?.analysis?.scores.social || 0,
    emotional: x.latest?.analysis?.scores.emotional || 0,
  }));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <PageHeader 
          title={t("dashboard.title")} 
          description={t("dashboard.subtitle")}
          tooltip={locale === "ar" ? "ملخص شامل لإحصاءات الفصل وتقدم الطلاب" : "Comprehensive overview of class statistics and student progress"}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-xs text-muted-foreground">{t("students.title")}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-info" />
                <div>
                  <p className="text-2xl font-bold">{surveys.length}</p>
                  <p className="text-xs text-muted-foreground">{locale === "ar" ? "استقصاء" : "Surveys"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <Brain className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{analyzedSurveys.length}</p>
                  <p className="text-xs text-muted-foreground">{locale === "ar" ? "تحليلات" : "Analyses"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="pt-4 pb-3 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{latestByStudent.filter(x => x.latest?.analysis?.indicators.type === "gifted").length}</p>
                  <p className="text-xs text-muted-foreground">{locale === "ar" ? "موهوبين" : "Gifted"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {latestByStudent.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{locale === "ar" ? "متوسط درجات الفصل" : "Class Average Scores"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{locale === "ar" ? "مقارنة الطلاب" : "Student Comparison"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={studentBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="attention" fill="hsl(var(--chart-focus))" name={locale === "ar" ? "الانتباه" : "Attention"} />
                    <Bar dataKey="social" fill="hsl(var(--chart-play))" name={locale === "ar" ? "اجتماعي" : "Social"} />
                    <Bar dataKey="emotional" fill="hsl(var(--chart-learning))" name={locale === "ar" ? "عاطفي" : "Emotional"} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{locale === "ar" ? "نظرة عامة على الطلاب" : "Student Overview"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {latestByStudent.map(({ student, latest }) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg border bg-muted/20">
                      <span className="text-xl">{student.gender === "male" ? "👦" : "👧"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={latest?.analysis?.indicators.type === "gifted" ? "default" : latest?.analysis?.indicators.type === "delayed" ? "destructive" : "secondary"} className="text-[10px]">
                            {t(`indicators.${latest?.analysis?.indicators.type || "typical"}`)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{new Date(latest!.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center space-y-2">
              <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">{locale === "ar" ? "ابدأ بإضافة طلاب وملء الاستقصاءات لعرض البيانات هنا" : "Start by adding students and filling surveys to see data here"}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
