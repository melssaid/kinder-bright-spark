import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, GraduationCap, KeyRound, ClipboardList, CalendarCheck, TrendingUp } from "lucide-react";
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
  const [stats, setStats] = useState({ kindergartens: 0, teachers: 0, students: 0, codes: 0, surveys: 0, attendance: 0 });
  const [kgDetails, setKgDetails] = useState<KgDetail[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ date: string; surveys: number; attendance: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      // Parallel stats queries
      const [kgRes, teacherRes, studentRes, codeRes, surveyRes, attendanceRes] = await Promise.all([
        supabase.from("kindergartens").select("id, name"),
        supabase.from("user_roles").select("id, user_id", { count: "exact" }).eq("role", "teacher"),
        supabase.from("students").select("id, kindergarten_id", { count: "exact" }),
        supabase.from("invitation_codes").select("id", { count: "exact", head: true }).eq("is_used", false),
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
        codes: codeRes.count || 0,
        surveys: surveyRes.count || 0,
        attendance: attendanceRes.count || 0,
      });

      // Get teacher-to-kindergarten mapping via profiles
      const { data: profiles } = await supabase.from("profiles").select("id, kindergarten_id").not("kindergarten_id", "is", null);
      const teacherKgMap: Record<string, string> = {};
      (profiles || []).forEach((p: any) => { if (p.kindergarten_id) teacherKgMap[p.id] = p.kindergarten_id; });

      // Build per-kindergarten details
      const details: KgDetail[] = kindergartens.map((kg) => {
        const studentCount = students.filter((s) => s.kindergarten_id === kg.id).length;
        const teacherCount = Object.values(teacherKgMap).filter((kid) => kid === kg.id).length;
        const surveyCount = surveys.filter((s) => teacherKgMap[s.teacher_id] === kg.id).length;
        return { id: kg.id, name: kg.name, studentCount, teacherCount, surveyCount };
      });
      setKgDetails(details);

      // Build recent 7 days activity
      const last7: { date: string; surveys: number; attendance: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const daySurveys = surveys.filter((s) => s.date && s.date.startsWith(dateStr)).length;
        const dayAttendance = ((attendanceRes.data || []) as { id: string; date: string }[]).filter((a) => a.date === dateStr).length;
        last7.push({
          date: d.toLocaleDateString(isAr ? "ar-SA" : "en-US", { weekday: "short", day: "numeric" }),
          surveys: daySurveys,
          attendance: dayAttendance,
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
    { icon: CalendarCheck, label: isAr ? "سجلات الحضور" : "Attendance Records", value: stats.attendance, color: "text-warning" },
    { icon: KeyRound, label: isAr ? "أكواد متاحة" : "Available Codes", value: stats.codes, color: "text-muted-foreground" },
  ];

  const pieData = kgDetails.map((kg) => ({ name: kg.name, value: kg.studentCount })).filter((d) => d.value > 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{isAr ? "لوحة تحكم الأدمن" : "Admin Dashboard"}</h1>
          <p className="text-muted-foreground">{isAr ? "نظرة شاملة على جميع الروضات والنشاط" : "Overview of all kindergartens and activity"}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {summaryCards.map((c) => (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold">{c.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students per Kindergarten Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {isAr ? "الطلاب والتقييمات لكل روضة" : "Students & Assessments per Kindergarten"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kgDetails.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={kgDetails} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                      labelStyle={{ fontWeight: 700 }}
                    />
                    <Bar dataKey="studentCount" name={isAr ? "طلاب" : "Students"} fill="hsl(199, 89%, 48%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="teacherCount" name={isAr ? "معلمات" : "Teachers"} fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="surveyCount" name={isAr ? "تقييمات" : "Assessments"} fill="hsl(43, 96%, 56%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  {isAr ? "أضف روضات وطلاب لعرض البيانات" : "Add kindergartens and students to see data"}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" />
                {isAr ? "توزيع الطلاب على الروضات" : "Student Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  {isAr ? "لا توجد بيانات بعد" : "No data yet"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              {isAr ? "النشاط خلال آخر 7 أيام" : "Activity — Last 7 Days"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={recentActivity} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                />
                <Bar dataKey="surveys" name={isAr ? "تقييمات" : "Assessments"} fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name={isAr ? "حضور" : "Attendance"} fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Per-Kindergarten Detail Table */}
        {kgDetails.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{isAr ? "تفاصيل الروضات" : "Kindergarten Details"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-start py-2 px-3 font-semibold">{isAr ? "الروضة" : "Kindergarten"}</th>
                      <th className="text-center py-2 px-3 font-semibold">{isAr ? "المعلمات" : "Teachers"}</th>
                      <th className="text-center py-2 px-3 font-semibold">{isAr ? "الطلاب" : "Students"}</th>
                      <th className="text-center py-2 px-3 font-semibold">{isAr ? "التقييمات" : "Assessments"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kgDetails.map((kg) => (
                      <tr key={kg.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-3 font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          {kg.name}
                        </td>
                        <td className="py-3 px-3 text-center">{kg.teacherCount}</td>
                        <td className="py-3 px-3 text-center">{kg.studentCount}</td>
                        <td className="py-3 px-3 text-center">{kg.surveyCount}</td>
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
