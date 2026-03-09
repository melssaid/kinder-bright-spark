import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t, dir } = useI18n();

  return (
    <SidebarProvider>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              {t("lang.switch")}
            </Button>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
