import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeyRound, Copy, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Kindergarten { id: string; name: string; }
interface InviteCode { id: string; code: string; kindergarten_id: string; is_used: boolean; created_at: string; }
interface TeacherProfile { id: string; full_name: string; kindergarten_id: string | null; school_name: string | null; }

const AdminTeachers = () => {
  const { user } = useAuth();
  const { locale } = useI18n();
  const isAr = locale === "ar";
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [selectedKg, setSelectedKg] = useState<string>("");
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    supabase.from("kindergartens").select("id, name").order("name").then(({ data }) => setKindergartens((data || []) as Kindergarten[]));
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: codesData } = await supabase.from("invitation_codes").select("*").order("created_at", { ascending: false });
      setCodes((codesData || []) as InviteCode[]);
      const { data: profilesData } = await supabase.from("profiles").select("id, full_name, kindergarten_id, school_name").not("kindergarten_id", "is", null);
      setTeachers((profilesData || []) as TeacherProfile[]);
    };
    load();
  }, [generating]);

  const generateCode = async () => {
    if (!selectedKg || !user) return;
    setGenerating(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { error } = await supabase.from("invitation_codes").insert({ code, kindergarten_id: selectedKg, created_by: user.id });
    if (error) toast.error(error.message);
    else toast.success(isAr ? `تم إنشاء الكود: ${code}` : `Code generated: ${code}`);
    setGenerating(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(isAr ? "تم نسخ الكود" : "Code copied!");
  };

  const getKgName = (id: string) => kindergartens.find((k) => k.id === id)?.name || "—";
  const filteredCodes = selectedKg ? codes.filter((c) => c.kindergarten_id === selectedKg) : codes;
  const filteredTeachers = selectedKg ? teachers.filter((t) => t.kindergarten_id === selectedKg) : teachers;

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{isAr ? "المعلمات وأكواد الدعوة" : "Teachers & Invite Codes"}</h1>
          <p className="text-sm text-muted-foreground">{isAr ? "إنشاء أكواد دعوة وعرض المعلمات" : "Generate invite codes and view teachers"}</p>
        </div>

        <Card>
          <CardHeader className="pb-3 px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              {isAr ? "إنشاء كود دعوة" : "Generate Invite Code"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-3 sm:px-6">
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
            <Button onClick={generateCode} disabled={!selectedKg || generating} className="w-full" size="sm">
              <KeyRound className="h-4 w-4 me-2" />
              {isAr ? "توليد كود" : "Generate Code"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base">{isAr ? "أكواد الدعوة" : "Invitation Codes"}</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-2">
              {filteredCodes.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <code className="text-sm sm:text-lg font-mono font-bold tracking-wider">{c.code}</code>
                    <Badge variant={c.is_used ? "secondary" : "default"} className="text-[10px]">
                      {c.is_used ? (isAr ? "مستخدم" : "Used") : (isAr ? "متاح" : "Available")}
                    </Badge>
                    <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{getKgName(c.kindergarten_id)}</span>
                  </div>
                  {!c.is_used && (
                    <Button variant="ghost" size="icon" onClick={() => copyCode(c.code)} className="h-8 w-8 shrink-0">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              {filteredCodes.length === 0 && (
                <p className="text-center text-muted-foreground py-4 text-sm">{isAr ? "لا توجد أكواد بعد" : "No codes yet"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              {isAr ? "المعلمات المسجلات" : "Registered Teachers"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-2">
              {filteredTeachers.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
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
