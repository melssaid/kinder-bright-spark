import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentManager } from "@/components/students/StudentManager";
import { useI18n } from "@/i18n";
import { getStudents, DbStudent } from "@/lib/database";
import { PageHeader } from "@/components/common/PageHeader";

const StudentsPage = () => {
  const { t, locale } = useI18n();
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<DbStudent | null>(null);

  const refreshStudents = () => { getStudents().then(setStudents); };
  useEffect(() => { refreshStudents(); }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        <PageHeader 
          title={t("students.title")} 
          description={t("auth.cloudNotice")}
          tooltip={locale === "ar" ? "يمكنك إضافة حتى 30 طالباً وإدارة معلوماتهم الأساسية" : "You can add up to 30 students and manage their basic information"}
        />
        <StudentManager students={students} onStudentsChange={refreshStudents} selectedStudent={selectedStudent} onSelectStudent={setSelectedStudent} />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
