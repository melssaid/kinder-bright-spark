import { useState } from "react";
import logo from "@/assets/kinder-bh-logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";

const AuthPage = () => {
  const { signIn } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAr = locale === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || t("auth.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="auth-logo-bounce rounded-full bg-white/80 dark:bg-white/10 p-4 shadow-xl ring-4 ring-primary/20">
            <img src={logo} alt="Kinder BH" className="h-32 w-32 sm:h-40 sm:w-40 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Kinder BH
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{t("auth.subtitle")}</p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("auth.login")}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setLocale(locale === "en" ? "ar" : "en")}>
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("auth.email")}</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="teacher@school.com" required dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>{t("auth.password")}</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} dir="ltr" />
              </div>
              <Button type="submit" className="w-full shadow-md" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                {t("auth.login")}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {isAr ? "تواصل مع إدارة الروضة للحصول على بيانات الدخول" : "Contact your kindergarten admin for login credentials"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
