import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useI18n } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Globe, LogOut } from "lucide-react";
import { AppTour } from "@/components/onboarding/AppTour";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t, dir } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <SidebarProvider>
      <AppTour />
      <div className="min-h-screen flex w-full" dir={dir}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-3 justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <span className="text-lg">🌈</span>
                <h1 className="text-lg font-bold text-foreground font-[Quicksand] hidden sm:block">{t("app.title")}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <span className="text-xs text-muted-foreground hidden md:block">
                  {user.user_metadata?.full_name || user.email}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={() => setLocale(locale === "en" ? "ar" : "en")} className="gap-2">
                <Globe className="h-4 w-4" />
                {t("lang.switch")}
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
