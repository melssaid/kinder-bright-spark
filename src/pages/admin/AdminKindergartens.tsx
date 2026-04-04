import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { Building2, Plus, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Kindergarten {
  id: string;
  name: string;
  created_at: string;
}

const AdminKindergartens = () => {
  const { user } = useAuth();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("kindergartens").select("*").order("created_at", { ascending: true });
    setKindergartens((data || []) as Kindergarten[]);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from("kindergartens").insert({ name: newName.trim(), created_by: user.id });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(locale === "ar" ? "تمت إضافة الروضة" : "Kindergarten added");
      setNewName("");
      load();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("kindergartens").delete().eq("id", id);
    toast.success(locale === "ar" ? "تم الحذف" : "Deleted");
    load();
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-sm shrink-0">
            <Building2 className="h-7 w-7 sm:h-9 sm:w-9 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{locale === "ar" ? "إدارة الروضات" : "Manage Kindergartens"}</h1>
            <p className="text-sm text-muted-foreground">{locale === "ar" ? "إضافة وإدارة الروضات المسجلة" : "Add and manage registered kindergartens"}</p>
          </div>
        </div>

        {/* Add form */}
        <Card className="border-primary/20 shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-primary">
              <Plus className="h-4 w-4" />
              {locale === "ar" ? "إضافة روضة جديدة" : "Add New Kindergarten"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={locale === "ar" ? "اسم الروضة..." : "Kindergarten name..."}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="text-sm h-10 border-primary/20 focus-visible:ring-primary/40"
              />
              <Button
                onClick={handleAdd}
                disabled={loading || !newName.trim()}
                className="shrink-0 h-10 gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{locale === "ar" ? "إضافة" : "Add"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kindergarten list */}
        <div className="grid gap-3">
          {kindergartens.map((kg, i) => (
            <Card
              key={kg.id}
              className="cursor-pointer group hover:shadow-lg hover:border-primary/30 transition-all duration-200 active:scale-[0.99]"
              onClick={() => navigate(`/admin/kindergartens/${kg.id}`)}
            >
              <CardContent className="flex items-center justify-between p-4 sm:py-5 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/15 group-hover:from-primary/25 group-hover:to-primary/10 transition-colors shrink-0">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{kg.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                      {locale === "ar" ? "تأسست" : "Est."} {new Date(kg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleDelete(kg.id); }}
                    className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 h-8 w-8 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary/70 transition-colors rtl:rotate-180" />
                </div>
              </CardContent>
            </Card>
          ))}
          {kindergartens.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary/60" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === "ar" ? "لا توجد روضات مسجلة بعد" : "No kindergartens registered yet"}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {locale === "ar" ? "أضف روضتك الأولى باستخدام النموذج أعلاه" : "Add your first kindergarten using the form above"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminKindergartens;
