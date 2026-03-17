import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useRole } from "@/hooks/useRole";
import { LayoutDashboard, Users, FileText, Settings, Shield, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const { locale, dir } = useI18n();
  const { isAdmin, isKgAdmin } = useRole();
  const location = useLocation();

  const tabs = [
    { to: "/", icon: LayoutDashboard, label: locale === "ar" ? "الرئيسية" : "Home", end: true },
    { to: "/students", icon: Users, label: locale === "ar" ? "الطلاب" : "Students" },
    { to: "/reports", icon: FileText, label: locale === "ar" ? "التقارير" : "Reports" },
    ...(isAdmin ? [{ to: "/admin", icon: Shield, label: locale === "ar" ? "أدمن" : "Admin" }] :
        isKgAdmin ? [{ to: "/kg-admin", icon: Building2, label: locale === "ar" ? "روضتي" : "My KG" }] : []),
    { to: "/settings", icon: Settings, label: locale === "ar" ? "الإعدادات" : "Settings" },
  ];

  const isActive = (path: string, end?: boolean) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t safe-area-bottom" dir={dir}>
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg transition-colors min-w-0 relative",
              isActive(tab.to, tab.end)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <tab.icon className={cn("h-5 w-5", isActive(tab.to, tab.end) && "scale-110")} />
            <span className="text-[10px] font-medium leading-tight truncate">{tab.label}</span>
            {isActive(tab.to, tab.end) && (
              <div className="absolute bottom-1 w-6 h-0.5 rounded-full bg-primary" />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
