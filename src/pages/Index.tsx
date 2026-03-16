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
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <PageHeader 
          title={t("dashboard.title")} 
          description={t("dashboard.subtitle")}
          tooltip={locale === "ar" ? "ملخص شامل لإحصاءات الفصل" : "Comprehensive class statistics overview"}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {[
            { icon: Users, value: students.length, label: t("students.title"), color: "text-primary" },
            { icon: ClipboardList, value: surveys.length, label: locale === "ar" ? "استقصاء" : "Surveys", color: "text-info" },
            { icon: Brain, value: analyzedSurveys.length, label: locale === "ar" ? "تحليلات" : "Analyses", color: "text-success" },
            { icon: TrendingUp, value: latestByStudent.filter(x => x.latest?.analysis?.indicators.type === "gifted").length, label: locale === "ar" ? "موهوبين" : "Gifted", color: "text-warning" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (i + 1) }}>
              <Card>
                <CardContent className="p-3 sm:pt-4 sm:pb-3 flex items-center gap-2 sm:gap-3">
                  <item.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${item.color} shrink-0`} />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold leading-none">{item.value}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {latestByStudent.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm sm:text-base">{locale === "ar" ? "متوسط درجات الفصل" : "Class Average Scores"}</CardTitle>
              </CardHeader>
              <CardContent className="px-1 sm:px-6">
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm sm:text-base">{locale === "ar" ? "مقارنة الطلاب" : "Student Comparison"}</CardTitle>
              </CardHeader>
              <CardContent className="px-1 sm:px-6">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={studentBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
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
              <CardHeader className="pb-2 px-3 sm:px-6">
                <CardTitle className="text-sm sm:text-base">{locale === "ar" ? "نظرة عامة على الطلاب" : "Student Overview"}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="space-y-2">
                  {latestByStudent.map(({ student, latest }) => (
                    <div key={student.id} className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg border bg-muted/20">
                      <span className="text-lg sm:text-xl">{student.gender === "male" ? "👦" : "👧"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{student.name}</p>
                        <Badge variant={latest?.analysis?.indicators.type === "gifted" ? "default" : latest?.analysis?.indicators.type === "delayed" ? "destructive" : "secondary"} className="text-[10px] mt-0.5">
                          {t(`indicators.${latest?.analysis?.indicators.type || "typical"}`)}
                        </Badge>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{new Date(latest!.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState 
            icon={ClipboardList}
            title={t("empty.history.title")}
            description={t("empty.history.description")}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
