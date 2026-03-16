import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, GraduationCap, ClipboardList, CalendarCheck, TrendingUp } from "lucide-react";
import { useI18n } from "@/i18n";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

interface KgDetail {
  id: string;
  name: string;
  studentCount: number;
  teacherCount: number;
  surveyCount: number;
}

const CHART_COLORS = [
  "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)", "hsl(43, 96%, 56%)",
  "hsl(330, 81%, 60%)", "hsl(262, 52%, 56%)", "hsl(17, 76%, 56%)",
  "hsl(175, 60%, 45%)", "hsl(350, 65%, 55%)",
];

const AdminDashboard = () => {
  const { locale } = useI18n();
  const isAr = locale === "ar";
  const [stats, setStats] = useState({ kindergartens: 0, teachers: 0, students: 0, surveys: 0, attendance: 0 });
  const [kgDetails, setKgDetails] = useState<KgDetail[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ date: string; surveys: number; attendance: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const [kgRes, teacherRes, studentRes, surveyRes, attendanceRes] = await Promise.all([
        supabase.from("kindergartens").select("id, name"),
        supabase.from("user_roles").select("id, user_id", { count: "exact" }).eq("role", "teacher"),
        supabase.from("students").select("id, kindergarten_id", { count: "exact" }),
        supabase.from("surveys").select("id, teacher_id, date", { count: "exact" }),
        supabase.from("attendance").select("id, date", { count: "exact" }),
      ]);

      const kindergartens = (kgRes.data || []) as { id: string; name: string }[];
      const students = (studentRes.data || []) as { id: string; kindergarten_id: string | null }[];
      const surveys = (surveyRes.data || []) as { id: string; teacher_id: string; date: string | null }[];

      setStats({
        kindergartens: kindergartens.length,
        teachers: teacherRes.count || 0,
        students: studentRes.count || 0,
        surveys: surveyRes.count || 0,
        attendance: attendanceRes.count || 0,
      });

      const { data: profiles } = await supabase.from("profiles").select("id, kindergarten_id").not("kindergarten_id", "is", null);
      const teacherKgMap: Record<string, string> = {};
      (profiles || []).forEach((p: any) => { if (p.kindergarten_id) teacherKgMap[p.id] = p.kindergarten_id; });

      const details: KgDetail[] = kindergartens.map((kg) => ({
        id: kg.id,
        name: kg.name,
        studentCount: students.filter((s) => s.kindergarten_id === kg.id).length,
        teacherCount: Object.values(teacherKgMap).filter((kid) => kid === kg.id).length,
        surveyCount: surveys.filter((s) => teacherKgMap[s.teacher_id] === kg.id).length,
      }));
      setKgDetails(details);

      const last7: { date: string; surveys: number; attendance: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        last7.push({
          date: d.toLocaleDateString(isAr ? "ar-SA" : "en-US", { weekday: "short", day: "numeric" }),
          surveys: surveys.filter((s) => s.date && s.date.startsWith(dateStr)).length,
          attendance: ((attendanceRes.data || []) as { id: string; date: string }[]).filter((a) => a.date === dateStr).length,
        });
      }
      setRecentActivity(last7);
    };
    load();
  }, []);

  const summaryCards = [
    { icon: Building2, label: isAr ? "الروضات" : "Kindergartens", value: stats.kindergartens, color: "text-primary" },
    { icon: Users, label: isAr ? "المعلمات" : "Teachers", value: stats.teachers, color: "text-success" },
    { icon: GraduationCap, label: isAr ? "الطلاب" : "Students", value: stats.students, color: "text-accent" },
    { icon: ClipboardList, label: isAr ? "التقييمات" : "Assessments", value: stats.surveys, color: "text-secondary-foreground" },
    { icon: CalendarCheck, label: isAr ? "الحضور" : "Attendance", value: stats.attendance, color: "text-warning" },
    { icon: KeyRound, label: isAr ? "أكواد" : "Codes", value: stats.codes, color: "text-muted-foreground" },
  ];

  const pieData = kgDetails.map((kg) => ({ name: kg.name, value: kg.studentCount })).filter((d) => d.value > 0);

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{isAr ? "لوحة تحكم الأدمن" : "Admin Dashboard"}</h1>
          <p className="text-sm text-muted-foreground">{isAr ? "نظرة شاملة على جميع الروضات" : "Overview of all kindergartens"}</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {summaryCards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-3 sm:p-4 flex flex-col items-center sm:flex-row sm:items-start gap-1 sm:gap-2">
                <c.icon className={`h-5 w-5 sm:h-4 sm:w-4 ${c.color} shrink-0`} />
                <div className="text-center sm:text-start">
                  <p className="text-lg sm:text-2xl font-bold leading-none">{c.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-tight">{c.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {isAr ? "إحصائيات الروضات" : "Kindergarten Stats"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              {kgDetails.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={kgDetails} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                    <Bar dataKey="studentCount" name={isAr ? "طلاب" : "Students"} fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="teacherCount" name={isAr ? "معلمات" : "Teachers"} fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="surveyCount" name={isAr ? "تقييمات" : "Assessments"} fill="hsl(43, 96%, 56%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                  {isAr ? "أضف روضات لعرض البيانات" : "Add kindergartens to see data"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 px-3 sm:px-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" />
                {isAr ? "توزيع الطلاب" : "Student Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-1 sm:px-6">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                  {isAr ? "لا توجد بيانات بعد" : "No data yet"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              {isAr ? "النشاط — آخر 7 أيام" : "Activity — Last 7 Days"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-1 sm:px-6">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={recentActivity} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Bar dataKey="surveys" name={isAr ? "تقييمات" : "Assessments"} fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name={isAr ? "حضور" : "Attendance"} fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {kgDetails.length > 0 && (
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle className="text-sm sm:text-base">{isAr ? "تفاصيل الروضات" : "Kindergarten Details"}</CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-start py-2 px-3 font-semibold text-xs sm:text-sm">{isAr ? "الروضة" : "Kindergarten"}</th>
                      <th className="text-center py-2 px-2 font-semibold text-xs sm:text-sm">{isAr ? "معلمات" : "Teachers"}</th>
                      <th className="text-center py-2 px-2 font-semibold text-xs sm:text-sm">{isAr ? "طلاب" : "Students"}</th>
                      <th className="text-center py-2 px-2 font-semibold text-xs sm:text-sm">{isAr ? "تقييمات" : "Assessments"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kgDetails.map((kg) => (
                      <tr key={kg.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">{kg.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center text-xs sm:text-sm">{kg.teacherCount}</td>
                        <td className="py-2.5 px-2 text-center text-xs sm:text-sm">{kg.studentCount}</td>
                        <td className="py-2.5 px-2 text-center text-xs sm:text-sm">{kg.surveyCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
