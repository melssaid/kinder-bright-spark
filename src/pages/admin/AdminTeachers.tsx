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

interface Kindergarten {
  id: string;
  name: string;
}

interface InviteCode {
  id: string;
  code: string;
  kindergarten_id: string;
  is_used: boolean;
  created_at: string;
}

interface TeacherProfile {
  id: string;
  full_name: string;
  kindergarten_id: string | null;
  school_name: string | null;
}

const AdminTeachers = () => {
  const { user } = useAuth();
  const { locale } = useI18n();
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [selectedKg, setSelectedKg] = useState<string>("");
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("kindergartens").select("id, name").order("name");
      setKindergartens((data || []) as Kindergarten[]);
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      // Load all codes
      const { data: codesData } = await supabase.from("invitation_codes").select("*").order("created_at", { ascending: false });
      setCodes((codesData || []) as InviteCode[]);

      // Load teacher profiles (those with kindergarten_id)
      const { data: profilesData } = await supabase.from("profiles").select("id, full_name, kindergarten_id, school_name").not("kindergarten_id", "is", null);
      setTeachers((profilesData || []) as TeacherProfile[]);
    };
    load();
  }, [generating]);

  const generateCode = async () => {
    if (!selectedKg || !user) return;
    setGenerating(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { error } = await supabase.from("invitation_codes").insert({
      code,
      kindergarten_id: selectedKg,
      created_by: user.id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(locale === "ar" ? `تم إنشاء الكود: ${code}` : `Code generated: ${code}`);
    }
    setGenerating(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(locale === "ar" ? "تم نسخ الكود" : "Code copied!");
  };

  const getKgName = (id: string) => kindergartens.find((k) => k.id === id)?.name || "—";

  const filteredCodes = selectedKg ? codes.filter((c) => c.kindergarten_id === selectedKg) : codes;
  const filteredTeachers = selectedKg ? teachers.filter((t) => t.kindergarten_id === selectedKg) : teachers;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{locale === "ar" ? "إدارة المعلمات وأكواد الدعوة" : "Teachers & Invitation Codes"}</h1>
          <p className="text-muted-foreground">{locale === "ar" ? "إنشاء أكواد دعوة وعرض المعلمات المسجلات" : "Generate invite codes and view registered teachers"}</p>
        </div>

        {/* Generate Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              {locale === "ar" ? "إنشاء كود دعوة جديد" : "Generate New Invite Code"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedKg} onValueChange={setSelectedKg}>
              <SelectTrigger>
                <SelectValue placeholder={locale === "ar" ? "اختر الروضة..." : "Select kindergarten..."} />
              </SelectTrigger>
              <SelectContent>
                {kindergartens.map((kg) => (
                  <SelectItem key={kg.id} value={kg.id}>{kg.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={generateCode} disabled={!selectedKg || generating} className="w-full">
              <KeyRound className="h-4 w-4 mr-2" />
              {locale === "ar" ? "توليد كود دعوة" : "Generate Invite Code"}
            </Button>
          </CardContent>
        </Card>

        {/* Codes List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{locale === "ar" ? "أكواد الدعوة" : "Invitation Codes"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredCodes.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <code className="text-lg font-mono font-bold tracking-wider">{c.code}</code>
                    <Badge variant={c.is_used ? "secondary" : "default"}>
                      {c.is_used
                        ? (locale === "ar" ? "مستخدم" : "Used")
                        : (locale === "ar" ? "متاح" : "Available")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{getKgName(c.kindergarten_id)}</span>
                  </div>
                  {!c.is_used && (
                    <Button variant="ghost" size="icon" onClick={() => copyCode(c.code)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {filteredCodes.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  {locale === "ar" ? "لا توجد أكواد بعد" : "No codes yet"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Teachers List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              {locale === "ar" ? "المعلمات المسجلات" : "Registered Teachers"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTeachers.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{t.full_name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {t.kindergarten_id ? getKgName(t.kindergarten_id) : "—"}
                  </span>
                </div>
              ))}
              {filteredTeachers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  {locale === "ar" ? "لا توجد معلمات مسجلات بعد" : "No teachers registered yet"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminTeachers;
