import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, ClipboardList, History, CalendarCheck, Settings,
  Shield, Building2, KeyRound, Globe, LogOut, Menu, X
} from "lucide-react";
import logo from "@/assets/kinder-bh-logo.png";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function TopNavbar() {
  const { locale, setLocale, t, dir } = useI18n();
  const { user, signOut } = useAuth();
  const { kindergartenName, isAdmin } = useRole();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard"), end: true },
    { to: "/students", icon: Users, label: t("nav.students") },
    { to: "/survey", icon: ClipboardList, label: locale === "ar" ? "استقصاء" : "Survey" },
    { to: "/attendance", icon: CalendarCheck, label: t("attendance.title") },
    { to: "/history", icon: History, label: locale === "ar" ? "السجل" : "History" },
  ];

  const adminLinks = [
    { to: "/admin", icon: Shield, label: locale === "ar" ? "لوحة الأدمن" : "Admin" },
    { to: "/admin/kindergartens", icon: Building2, label: locale === "ar" ? "الروضات" : "Kindergartens" },
    { to: "/admin/teachers", icon: KeyRound, label: locale === "ar" ? "المعلمات" : "Teachers" },
  ];

  const isActive = (path: string, end?: boolean) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b" dir={dir}>
      <div className="flex items-center justify-between px-3 sm:px-6 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Kinder BH" className="h-8 w-8 sm:h-9 sm:w-9 object-contain" />
          <h1 className="text-base sm:text-lg font-bold text-foreground font-[Quicksand] hidden sm:block">Kinder BH</h1>
          {kindergartenName && (
            <Badge variant="outline" className="hidden lg:flex items-center gap-1 text-[10px]">
              <Building2 className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{kindergartenName}</span>
            </Badge>
          )}
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isActive(link.to, link.end)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          ))}
          {isAdmin && (
            <>
              <div className="w-px h-6 bg-border mx-1" />
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    isActive(link.to)
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setLocale(locale === "en" ? "ar" : "en")} className="h-8 w-8 p-0">
            <Globe className="h-4 w-4" />
          </Button>
          <NavLink to="/settings">
            <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0", isActive("/settings") && "text-primary")}>
              <Settings className="h-4 w-4" />
            </Button>
          </NavLink>
          <Button variant="ghost" size="sm" onClick={signOut} className="h-8 w-8 p-0 text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
