import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { Loader2, Globe, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && (!fullName || !inviteCode)) {
      toast.error(locale === "ar" ? "يرجى إدخال جميع الحقول وكود الدعوة" : "Please fill all fields including invite code");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // First validate invite code exists and is unused
        const { data: codeData, error: codeError } = await supabase
          .from("invitation_codes")
          .select("id, kindergarten_id, is_used")
          .eq("code", inviteCode.toUpperCase().trim())
          .single();

        if (codeError || !codeData) {
          throw new Error(locale === "ar" ? "كود الدعوة غير صالح" : "Invalid invitation code");
        }
        if (codeData.is_used) {
          throw new Error(locale === "ar" ? "كود الدعوة مستخدم بالفعل" : "Invitation code already used");
        }

        // Sign up the user
        const { error } = await signUp(email, password, fullName, "");
        if (error) throw error;

        // After signup, redeem the invite code via the DB function
        // We need to wait for the auth state to settle then redeem
        // Store invite code in localStorage to redeem after auth settles
        localStorage.setItem("pending_invite_code", inviteCode.toUpperCase().trim());
        
        toast.success(locale === "ar" ? "تم إنشاء الحساب! جارٍ الربط بالروضة..." : "Account created! Linking to kindergarten...");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message || t("auth.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🌈 Kinder BH</h1>
          <p className="text-muted-foreground text-sm">{t("auth.subtitle")}</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{isSignUp ? t("auth.signup") : t("auth.login")}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setLocale(locale === "en" ? "ar" : "en")}>
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label>{t("auth.fullName")}</Label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t("auth.fullNamePlaceholder")} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      {locale === "ar" ? "كود الدعوة" : "Invitation Code"}
                    </Label>
                    <Input
                      value={inviteCode}
                      onChange={e => setInviteCode(e.target.value.toUpperCase())}
                      placeholder={locale === "ar" ? "أدخل الكود من الإدارة..." : "Enter code from admin..."}
                      required
                      className="font-mono tracking-wider text-center text-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      {locale === "ar" ? "احصلي على كود الدعوة من إدارة الروضة" : "Get your invite code from the kindergarten admin"}
                    </p>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>{t("auth.email")}</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="teacher@school.com" required />
              </div>
              <div className="space-y-2">
                <Label>{t("auth.password")}</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                {isSignUp ? t("auth.signup") : t("auth.login")}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button variant="link" className="text-sm" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? t("auth.hasAccount") : t("auth.noAccount")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
