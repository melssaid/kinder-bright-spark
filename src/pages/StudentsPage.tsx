import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentManager } from "@/components/students/StudentManager";
import { StudentProfileView } from "@/components/students/StudentProfileView";
import { useI18n } from "@/i18n";
import { getStudents, DbStudent } from "@/lib/database";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Brain, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const StudentsPage = () => {
  const { t, locale } = useI18n();
  const isAr = locale === "ar";
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<DbStudent | null>(null);
  const [viewProfile, setViewProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const refreshStudents = () => {
    getStudents().then((s) => {
      setStudents(s);
      setShowWelcome(s.length === 0);
    });
  };
  useEffect(() => { refreshStudents(); }, []);

  const handleSelectStudent = (student: DbStudent | null) => {
    setSelectedStudent(student);
    if (student) setViewProfile(true);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        {viewProfile && selectedStudent ? (
          <StudentProfileView student={selectedStudent} onBack={() => setViewProfile(false)} />
        ) : (
          <>
            {showWelcome && students.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
                  <CardContent className="p-8 text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="text-7xl"
                    >
                      🎓
                    </motion.div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {isAr ? "مرحباً بك في كيندر BH!" : "Welcome to Kinder BH!"}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                      {isAr
                        ? "نظام متابعة تطور الأطفال في الروضة — تقييمات تطورية، تحليل بالذكاء الاصطناعي، وتقارير شاملة للأهل والمعلمات"
                        : "Child development tracking — developmental assessments, AI analysis, and comprehensive reports for parents & teachers"}
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                      {[
                        { icon: <Users className="h-6 w-6" />, label: isAr ? "إدارة الطلاب" : "Manage Students", emoji: "👫" },
                        { icon: <Brain className="h-6 w-6" />, label: isAr ? "تحليل AI" : "AI Analysis", emoji: "🧠" },
                        { icon: <BarChart3 className="h-6 w-6" />, label: isAr ? "تقارير شاملة" : "Full Reports", emoji: "📊" },
                      ].map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/40"
                        >
                          <span className="text-2xl">{f.emoji}</span>
                          <span className="text-xs font-medium text-muted-foreground">{f.label}</span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isAr
                        ? "👇 ابدأ بإضافة طلاب يدوياً أو أضف بيانات تجريبية لاستكشاف التطبيق"
                        : "👇 Start by adding students manually or load demo data to explore"}
                    </p>
                  </CardContent>
                </Card>
                <StudentManager students={students} onStudentsChange={refreshStudents} selectedStudent={selectedStudent} onSelectStudent={handleSelectStudent} />
              </motion.div>
            ) : (
              <>
                <PageHeader
                  title={t("students.title")}
                  description={t("auth.cloudNotice")}
                  tooltip={isAr ? "يمكنك إضافة حتى 30 طالباً وإدارة معلوماتهم الأساسية" : "You can add up to 30 students and manage their basic information"}
                />
                <StudentManager students={students} onStudentsChange={refreshStudents} selectedStudent={selectedStudent} onSelectStudent={handleSelectStudent} />
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
