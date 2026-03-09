import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentManager } from "@/components/students/StudentManager";
import { useI18n } from "@/i18n";
import { getStudents, DbStudent } from "@/lib/database";

const StudentsPage = () => {
  const { t } = useI18n();
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<DbStudent | null>(null);

  const refreshStudents = () => { getStudents().then(setStudents); };
  useEffect(() => { refreshStudents(); }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("students.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("auth.cloudNotice")}</p>
        </div>
        <StudentManager students={students} onStudentsChange={refreshStudents} selectedStudent={selectedStudent} onSelectStudent={setSelectedStudent} />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
