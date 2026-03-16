import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useI18n } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, Building2 } from "lucide-react";
import { AppTour } from "@/components/onboarding/AppTour";
import { Badge } from "@/components/ui/badge";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t, dir } = useI18n();
  const { user, signOut } = useAuth();
  const { kindergartenName, isAdmin } = useRole();

  return (
    <SidebarProvider>
      <AppTour />
      <div className="min-h-screen flex w-full" dir={dir}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 sm:h-14 flex items-center border-b bg-card px-2 sm:px-4 gap-2 sm:gap-3 justify-between sticky top-0 z-10" dir={dir}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <SidebarTrigger />
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="text-base sm:text-lg">🌈</span>
                <h1 className="text-sm sm:text-lg font-bold text-foreground font-[Quicksand] truncate hidden xs:block sm:block">{t("app.title")}</h1>
              </div>
              {kindergartenName && (
                <Badge variant="outline" className="hidden lg:flex items-center gap-1 text-[10px] sm:text-xs">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{kindergartenName}</span>
                </Badge>
              )}
              {isAdmin && (
                <Badge variant="secondary" className="hidden md:flex text-[10px]">
                  {locale === "ar" ? "أدمن" : "Admin"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setLocale(locale === "en" ? "ar" : "en")} className="gap-1 sm:gap-2 h-8 px-2 sm:px-3 text-xs sm:text-sm">
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("lang.switch")}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 text-destructive h-8 px-2">
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
