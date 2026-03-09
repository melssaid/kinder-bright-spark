import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Save, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";

const SettingsPage = () => {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setSchoolName(data.school_name || "");
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, school_name: schoolName }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(locale === "ar" ? "خطأ في حفظ البيانات" : "Error saving profile");
    } else {
      toast.success(locale === "ar" ? "تم حفظ البيانات بنجاح ✅" : "Profile saved successfully ✅");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(locale === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error(locale === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      toast.error(locale === "ar" ? "خطأ في تغيير كلمة المرور" : "Error changing password");
    } else {
      toast.success(locale === "ar" ? "تم تغيير كلمة المرور بنجاح 🔒" : "Password changed successfully 🔒");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        <PageHeader
          title={locale === "ar" ? "⚙️ الإعدادات" : "⚙️ Settings"}
          description={locale === "ar" ? "إدارة معلوماتك الشخصية وأمان حسابك" : "Manage your personal information and account security"}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {locale === "ar" ? "المعلومات الشخصية" : "Personal Information"}
            </CardTitle>
            <CardDescription>
              {locale === "ar" ? "عدّلي اسمك واسم المدرسة" : "Update your name and school"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={locale === "ar" ? "مثال: سارة أحمد" : "e.g. Sarah Ahmad"} />
            </div>
            <div className="space-y-2">
              <Label>{locale === "ar" ? "اسم المدرسة / الروضة" : "School / Kindergarten"}</Label>
              <Input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder={locale === "ar" ? "مثال: روضة النور" : "e.g. Al-Noor Kindergarten"} />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-warning" />
              {locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}
            </CardTitle>
            <CardDescription>
              {locale === "ar" ? "حافظي على أمان حسابك" : "Keep your account secure"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === "ar" ? "كلمة المرور الجديدة" : "New Password"}</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <Button onClick={handleChangePassword} disabled={changingPassword || !newPassword} variant="outline" className="w-full">
              {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
