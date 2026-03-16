import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";
import { useRole } from "@/hooks/useRole";
import { UserPlus, Users, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface TeacherProfile {
  id: string;
  full_name: string;
  kindergarten_id: string | null;
}

const KgAdminTeachers = () => {
  const { locale } = useI18n();
  const isAr = locale === "ar";
  const { kindergartenId, kindergartenName } = useRole();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");

  const loadTeachers = async () => {
    if (!kindergartenId) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, kindergarten_id")
      .eq("kindergarten_id", kindergartenId);
    setTeachers((data || []) as TeacherProfile[]);
  };

  useEffect(() => { loadTeachers(); }, [kindergartenId]);

  const handleCreate = async () => {
    if (!kindergartenId || !teacherName.trim() || !teacherEmail.trim() || !teacherPassword) return;
    if (teacherPassword.length < 6) {
      toast.error(isAr ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-teacher", {
        body: {
          email: teacherEmail.trim().toLowerCase(),
          password: teacherPassword,
          fullName: teacherName.trim(),
          kindergartenId,
          role: "teacher",
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(isAr ? `تم إنشاء حساب المعلمة: ${teacherName}` : `Teacher account created: ${teacherName}`);
      setTeacherName("");
      setTeacherEmail("");
      setTeacherPassword("");
      loadTeachers();
    } catch (err: any) {
      toast.error(err.message || (isAr ? "حدث خطأ" : "An error occurred"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{isAr ? "معلمات الروضة" : "Kindergarten Teachers"}</h1>
          <p className="text-sm text-muted-foreground">
            {kindergartenName || (isAr ? "روضتي" : "My Kindergarten")}
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {isAr ? "إضافة معلمة جديدة" : "Add New Teacher"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-3 sm:px-6">
            <div className="space-y-2">
              <Label className="text-xs">{isAr ? "الاسم" : "Full Name"}</Label>
              <Input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder={isAr ? "الاسم الكامل..." : "Full name..."} className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
              <Input type="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} placeholder="teacher@school.com" className="text-sm" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">{isAr ? "كلمة المرور المؤقتة" : "Temporary Password"}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-sm pe-10"
                  dir="ltr"
                  minLength={6}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute end-0 top-0 h-full w-10" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleCreate} disabled={!teacherName.trim() || !teacherEmail.trim() || !teacherPassword || creating} className="w-full" size="sm">
              {creating ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <UserPlus className="h-4 w-4 me-2" />}
              {isAr ? "إنشاء الحساب" : "Create Account"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              {isAr ? "المعلمات" : "Teachers"}
              {teachers.length > 0 && <Badge variant="secondary" className="text-[10px]">{teachers.length}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-2">
              {teachers.map((t) => (
                <div key={t.id} className="flex items-center gap-2 p-2 sm:p-3 rounded-lg border">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-sm truncate">{t.full_name}</span>
                </div>
              ))}
              {teachers.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">{isAr ? "لا توجد معلمات بعد" : "No teachers yet"}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KgAdminTeachers;
