import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Users, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Kindergarten { id: string; name: string; }
interface TeacherProfile { id: string; full_name: string; kindergarten_id: string | null; }

const AdminTeachers = () => {
  const { locale } = useI18n();
  const isAr = locale === "ar";
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [selectedKg, setSelectedKg] = useState<string>("");
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");

  useEffect(() => {
    supabase.from("kindergartens").select("id, name").order("name").then(({ data }) => setKindergartens((data || []) as Kindergarten[]));
  }, []);

  const loadTeachers = async () => {
    const { data } = await supabase.from("profiles").select("id, full_name, kindergarten_id").not("kindergarten_id", "is", null);
    setTeachers((data || []) as TeacherProfile[]);
  };

  useEffect(() => { loadTeachers(); }, []);

  const handleCreateTeacher = async () => {
    if (!selectedKg || !teacherName.trim() || !teacherEmail.trim() || !teacherPassword) return;
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
          kindergartenId: selectedKg,
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

  const getKgName = (id: string) => kindergartens.find((k) => k.id === id)?.name || "—";
  const filteredTeachers = selectedKg ? teachers.filter((t) => t.kindergarten_id === selectedKg) : teachers;

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{isAr ? "إدارة المعلمات" : "Manage Teachers"}</h1>
          <p className="text-sm text-muted-foreground">{isAr ? "إنشاء حسابات المعلمات وربطها بالروضات" : "Create teacher accounts and link them to kindergartens"}</p>
        </div>

        <Card>
          <CardHeader className="pb-3 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {isAr ? "إنشاء حساب معلمة" : "Create Teacher Account"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-3 sm:px-6">
            <div className="space-y-2">
              <Label className="text-xs">{isAr ? "الروضة" : "Kindergarten"}</Label>
              <Select value={selectedKg} onValueChange={setSelectedKg}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={isAr ? "اختر الروضة..." : "Select kindergarten..."} />
                </SelectTrigger>
                <SelectContent>
                  {kindergartens.map((kg) => (
                    <SelectItem key={kg.id} value={kg.id}>{kg.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">{isAr ? "اسم المعلمة" : "Teacher Name"}</Label>
              <Input
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder={isAr ? "الاسم الكامل..." : "Full name..."}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
              <Input
                type="email"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                placeholder="teacher@school.com"
                className="text-sm"
                dir="ltr"
              />
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute end-0 top-0 h-full w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {isAr ? "أعطِ المعلمة هذه البيانات لتسجيل الدخول" : "Share these credentials with the teacher to log in"}
              </p>
            </div>

            <Button
              onClick={handleCreateTeacher}
              disabled={!selectedKg || !teacherName.trim() || !teacherEmail.trim() || !teacherPassword || creating}
              className="w-full"
              size="sm"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <UserPlus className="h-4 w-4 me-2" />}
              {isAr ? "إنشاء الحساب" : "Create Account"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              {isAr ? "المعلمات المسجلات" : "Registered Teachers"}
              {filteredTeachers.length > 0 && (
                <span className="text-xs text-muted-foreground">({filteredTeachers.length})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-2">
              {filteredTeachers.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="font-medium text-sm truncate">{t.full_name}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    {t.kindergarten_id ? getKgName(t.kindergarten_id) : "—"}
                  </span>
                </div>
              ))}
              {filteredTeachers.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">{isAr ? "لا توجد معلمات بعد" : "No teachers yet"}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminTeachers;
