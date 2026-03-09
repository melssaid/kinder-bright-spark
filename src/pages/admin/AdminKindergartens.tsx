import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { Building2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Kindergarten {
  id: string;
  name: string;
  created_at: string;
}

const AdminKindergartens = () => {
  const { user } = useAuth();
  const { locale } = useI18n();
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
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{locale === "ar" ? "إدارة الروضات" : "Manage Kindergartens"}</h1>
          <p className="text-muted-foreground">{locale === "ar" ? "إضافة وإدارة الروضات المسجلة" : "Add and manage registered kindergartens"}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {locale === "ar" ? "إضافة روضة جديدة" : "Add New Kindergarten"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={locale === "ar" ? "اسم الروضة..." : "Kindergarten name..."}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button onClick={handleAdd} disabled={loading || !newName.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                {locale === "ar" ? "إضافة" : "Add"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {kindergartens.map((kg) => (
            <Card key={kg.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{kg.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(kg.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(kg.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {kindergartens.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {locale === "ar" ? "لا توجد روضات مسجلة بعد" : "No kindergartens registered yet"}
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminKindergartens;
