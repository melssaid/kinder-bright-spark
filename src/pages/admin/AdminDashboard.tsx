import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, GraduationCap, KeyRound } from "lucide-react";
import { useI18n } from "@/i18n";

const AdminDashboard = () => {
  const { locale } = useI18n();
  const [stats, setStats] = useState({ kindergartens: 0, teachers: 0, students: 0, codes: 0 });

  useEffect(() => {
    const load = async () => {
      const [kg, profiles, students, codes] = await Promise.all([
        supabase.from("kindergartens").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "teacher"),
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("invitation_codes").select("id", { count: "exact", head: true }).eq("is_used", false),
      ]);
      setStats({
        kindergartens: kg.count || 0,
        teachers: profiles.count || 0,
        students: students.count || 0,
        codes: codes.count || 0,
      });
    };
    load();
  }, []);

  const cards = [
    { icon: Building2, label: locale === "ar" ? "الروضات" : "Kindergartens", value: stats.kindergartens, color: "text-blue-500" },
    { icon: Users, label: locale === "ar" ? "المعلمات" : "Teachers", value: stats.teachers, color: "text-green-500" },
    { icon: GraduationCap, label: locale === "ar" ? "الطلاب" : "Students", value: stats.students, color: "text-purple-500" },
    { icon: KeyRound, label: locale === "ar" ? "أكواد متاحة" : "Available Codes", value: stats.codes, color: "text-orange-500" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{locale === "ar" ? "لوحة تحكم الأدمن" : "Admin Dashboard"}</h1>
          <p className="text-muted-foreground">{locale === "ar" ? "إدارة الروضات والمعلمات" : "Manage kindergartens and teachers"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{c.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
