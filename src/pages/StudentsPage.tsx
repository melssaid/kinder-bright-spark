import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useI18n } from "@/i18n";
import { getStudents, DbStudent } from "@/lib/database";
import { PageHeader } from "@/components/common/PageHeader";
import { StudentManager } from "@/components/students/StudentManager";
import { useNavigate } from "react-router-dom";

const StudentsPage = () => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const isAr = locale === "ar";
  const [students, setStudents] = useState<DbStudent[]>([]);

  const refreshStudents = () => {
    getStudents().then(setStudents);
  };

  useEffect(() => { refreshStudents(); }, []);

  const handleSelectStudent = (student: DbStudent | null) => {
    if (student) {
      navigate(`/students/${student.id}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title={t("students.title")}
          description={isAr ? "أضف طلابك واضغط على أي طالب لفتح ملفه الشامل" : "Add students and tap any student to open their full profile"}
          tooltip={isAr ? "يمكنك إضافة حتى 30 طالباً" : "You can add up to 30 students"}
        />
        <StudentManager
          students={students}
          onStudentsChange={refreshStudents}
          selectedStudent={null}
          onSelectStudent={handleSelectStudent}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;
