import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalysisView } from "@/components/analysis/AnalysisView";
import { useI18n } from "@/i18n";
import { getStudents, getSurveys, Student, SurveyResponse, getStudentSurveys } from "@/lib/storage";
import { History, ChevronLeft } from "lucide-react";

const HistoryPage = () => {
  const { t, locale } = useI18n();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyResponse | null>(null);
  const [studentSurveys, setStudentSurveys] = useState<SurveyResponse[]>([]);

  useEffect(() => { setStudents(getStudents()); }, []);

  useEffect(() => {
    if (selectedStudent) {
      const surveys = getStudentSurveys(selectedStudent.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setStudentSurveys(surveys);
      setSelectedSurvey(null);
    }
  }, [selectedStudent]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <History className="h-7 w-7 text-primary" />
            {t("analysis.history")}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{t("students.select")}:</span>
          <Select value={selectedStudent?.id || ""} onValueChange={id => { setSelectedStudent(students.find(s => s.id === id) || null); setSelectedSurvey(null); }}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder={t("students.select")} />
            </SelectTrigger>
            <SelectContent>
              {students.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {s.gender === "male" ? "👦" : "👧"} {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSurvey && selectedStudent ? (
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedSurvey(null)} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> {locale === "ar" ? "العودة للقائمة" : "Back to list"}
            </Button>
            <AnalysisView student={selectedStudent} survey={selectedSurvey} />
          </div>
        ) : selectedStudent ? (
          studentSurveys.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">{t("survey.noSurveys")}</CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {studentSurveys.map(survey => (
                <Card key={survey.id} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setSelectedSurvey(survey)}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{new Date(survey.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                      {survey.analysis && (
                        <Badge variant={survey.analysis.indicators.type === "gifted" ? "default" : "secondary"} className="text-[10px] mt-1">
                          {t(`indicators.${survey.analysis.indicators.type}`)}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">{t("analysis.viewResults")}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {locale === "ar" ? "اختر طالباً لعرض سجل الاستقصاءات" : "Select a student to view survey history"}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
