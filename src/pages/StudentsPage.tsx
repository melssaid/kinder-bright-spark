import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentManager } from "@/components/students/StudentManager";
import { useI18n } from "@/i18n";
import { getStudents, Student } from "@/lib/storage";

const StudentsPage = () => {
  const { t } = useI18n();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const refreshStudents = () => setStudents(getStudents());
  useEffect(() => { refreshStudents(); }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t("students.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("storage.notice")}</p>
        </div>
        <StudentManager students={students} onStudentsChange={refreshStudents} selectedStudent={selectedStudent} onSelectStudent={setSelectedStudent} />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
