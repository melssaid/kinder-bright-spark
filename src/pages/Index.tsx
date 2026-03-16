import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, ClipboardList, TrendingUp, Brain, ChevronRight, Plus, Info, Sparkles, CalendarCheck } from "lucide-react";
import { useI18n } from "@/i18n";
import { getStudents, getSurveys, DbStudent, DbSurvey } from "@/lib/database";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const isAr = locale === "ar";
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [surveys, setSurveys] = useState<DbSurvey[]>([]);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    getStudents().then(setStudents);
    getSurveys().then(setSurveys);
  }, []);

  useEffect(() => {
    const hintSeen = localStorage.getItem("kinder_hint_seen");
    if (!hintSeen) setShowHint(true);
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem("kinder_hint_seen", "true");
  };

  const analyzedSurveys = surveys.filter(s => s.analysis);

  // Build student status map
  const studentStatusMap = students.map(st => {
    const studentSurveys = surveys.filter(s => s.student_id === st.id);
    const analyzedStudentSurveys = studentSurveys.filter(s => s.analysis);
    const latest = analyzedStudentSurveys.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
    
    let status: "new" | "needs_survey" | "analyzed" = "new";
    if (latest) status = "analyzed";
    else if (studentSurveys.length > 0) status = "analyzed";
    else status = "needs_survey";

    return { student: st, latest, status, surveyCount: studentSurveys.length };
  });

  const needsSurvey = studentStatusMap.filter(x => x.status === "needs_survey").length;
  const analyzed = studentStatusMap.filter(x => x.latest).length;
  const totalProgress = students.length > 0 ? Math.round((analyzed / students.length) * 100) : 0;

  const getStatusBadge = (status: "new" | "needs_survey" | "analyzed", latest: any) => {
    if (status === "analyzed" && latest?.analysis) {
      const type = latest.analysis.indicators?.type;
      return (
        <Badge variant={type === "gifted" ? "default" : type === "delayed" ? "destructive" : "secondary"} className="text-[10px]">
          {t(`indicators.${type || "typical"}`)}
        </Badge>
      );
    }
    if (status === "needs_survey") {
      return <Badge variant="outline" className="text-[10px] border-warning text-warning">{isAr ? "يحتاج تقييم" : "Needs Survey"}</Badge>;
    }
    return <Badge variant="outline" className="text-[10px]">{isAr ? "جديد" : "New"}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 max-w-5xl mx-auto">
        
        {/* First-use guidance hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative bg-primary/5 border border-primary/20 rounded-xl p-3 sm:p-4"
            >
              <button onClick={dismissHint} className="absolute top-2 end-2 text-muted-foreground hover:text-foreground text-xs">✕</button>
              <div className="flex items-start gap-3">
                <div className="text-2xl sm:text-3xl shrink-0">💡</div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {isAr ? "كيف يعمل التطبيق؟" : "How does it work?"}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-full">
                      <span className="text-primary font-bold">1</span> {isAr ? "أضف الطلاب" : "Add Students"}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-full">
                      <span className="text-primary font-bold">2</span> {isAr ? "املأ الاستقصاء" : "Fill Survey"}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-full">
                      <span className="text-primary font-bold">3</span> {isAr ? "احصل على تحليل AI" : "Get AI Analysis"}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-full">
                      <span className="text-primary font-bold">4</span> {isAr ? "شارك التقرير" : "Share Report"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">{isAr ? "لوحة المتابعة" : "Dashboard"}</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-[200px]">
                  {isAr ? "هنا ترين حالة كل طالب والإجراءات المطلوبة" : "See each student's status and required actions"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {students.length > 0 && (
            <div className="flex items-center gap-3">
              <Progress value={totalProgress} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground shrink-0">{totalProgress}% {isAr ? "مكتمل" : "complete"}</span>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Users, value: students.length, label: isAr ? "طلاب" : "Students", color: "text-primary", action: () => navigate("/students") },
            { icon: ClipboardList, value: surveys.length, label: isAr ? "استقصاء" : "Surveys", color: "text-info", action: () => navigate("/survey") },
            { icon: Brain, value: analyzedSurveys.length, label: isAr ? "تحليلات" : "Analyses", color: "text-success", action: () => navigate("/history") },
            { icon: TrendingUp, value: needsSurvey, label: isAr ? "بانتظار" : "Pending", color: "text-warning", action: () => navigate("/survey") },
          ].map((item, i) => (
            <Card key={i} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={item.action}>
              <CardContent className="p-2.5 sm:p-3 flex flex-col items-center text-center">
                <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color} mb-1`} />
                <p className="text-lg sm:text-xl font-bold leading-none">{item.value}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student cards - smart hub */}
        {students.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-dashed border-2">
              <CardContent className="p-6 sm:p-10 text-center space-y-4">
                <div className="text-5xl sm:text-6xl">🎓</div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {isAr ? "ابدأ بإضافة الطلاب" : "Start by Adding Students"}
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {isAr ? "أضف طلابك لبدء تقييم سلوكهم وتطورهم باستخدام الذكاء الاصطناعي" : "Add your students to start assessing their behavior and development with AI"}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={() => navigate("/students")} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {isAr ? "إضافة طلاب" : "Add Students"}
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/students")} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {isAr ? "بيانات تجريبية" : "Demo Data"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {isAr ? "الطلاب" : "Students"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/students")} className="text-xs gap-1 h-7">
                {isAr ? "عرض الكل" : "View All"}
                <ChevronRight className="h-3 w-3 rtl:rotate-180" />
              </Button>
            </div>

            <div className="grid gap-2">
              {studentStatusMap.map(({ student, latest, status, surveyCount }, i) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="text-2xl sm:text-3xl shrink-0">
                          {student.gender === "male" ? "👦" : "👧"}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold truncate">{student.name}</p>
                            {getStatusBadge(status, latest)}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground">
                            <span>{isAr ? `${student.age} سنوات` : `${student.age} yrs`}</span>
                            <span>•</span>
                            <span>{surveyCount} {isAr ? "تقييم" : "surveys"}</span>
                            {latest && (
                              <>
                                <span>•</span>
                                <span>{new Date(latest.date).toLocaleDateString(isAr ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {status === "needs_survey" || !latest ? (
                            <Button
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); navigate("/survey"); }}
                              className="h-8 text-xs gap-1"
                            >
                              <ClipboardList className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">{isAr ? "تقييم" : "Assess"}</span>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); navigate("/history"); }}
                              className="h-8 text-xs gap-1"
                            >
                              <Brain className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">{isAr ? "التحليل" : "Analysis"}</span>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Score preview for analyzed students */}
                      {latest?.analysis?.scores && (
                        <div className="mt-2 pt-2 border-t flex gap-1 overflow-x-auto">
                          {Object.entries(latest.analysis.scores as Record<string, number>).slice(0, 5).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-full shrink-0">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: val >= 70 ? "hsl(var(--success))" : val >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))" }}
                              />
                              <span className="text-[9px] text-muted-foreground">{val}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        {students.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-1.5"
              onClick={() => navigate("/survey")}
            >
              <ClipboardList className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">{isAr ? "تقييم جديد" : "New Assessment"}</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-1.5"
              onClick={() => navigate("/attendance")}
            >
              <CalendarCheck className="h-5 w-5 text-success" />
              <span className="text-xs font-medium">{isAr ? "تسجيل الحضور" : "Record Attendance"}</span>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
