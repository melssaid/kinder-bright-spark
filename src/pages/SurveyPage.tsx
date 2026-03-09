import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { useI18n } from "@/i18n";
import { getStudents, DbStudent } from "@/lib/database";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users } from "lucide-react";

const SurveyPage = () => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<DbStudent | null>(null);

  useEffect(() => { getStudents().then(setStudents); }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-primary" />
            {t("nav.survey")}
          </h1>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-2">
              <Users className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">{t("students.noStudents")}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{t("students.select")}:</span>
              <Select value={selectedStudent?.id || ""} onValueChange={id => setSelectedStudent(students.find(s => s.id === id) || null)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder={t("students.select")} />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.gender === "male" ? "👦" : "👧"} {s.name} ({t("students.age")}: {s.age})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStudent ? (
              <SurveyForm student={selectedStudent} onComplete={() => navigate("/history")} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  {t("survey.selectCategory")}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SurveyPage;
