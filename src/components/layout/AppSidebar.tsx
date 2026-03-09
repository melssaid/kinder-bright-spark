import { LayoutDashboard, ClipboardList, History, Users, CalendarCheck, Settings, Shield, Building2, KeyRound } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useRole } from "@/hooks/useRole";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t, locale } = useI18n();
  const { isAdmin } = useRole();
  const isActive = (path: string) => location.pathname === path;

  const teacherItems = [
    { title: t("nav.dashboard"), url: "/", icon: LayoutDashboard, tourId: "dashboard" },
    { title: t("nav.students"), url: "/students", icon: Users, tourId: "students" },
    { title: t("nav.attendance"), url: "/attendance", icon: CalendarCheck, tourId: "attendance" },
    { title: t("nav.survey"), url: "/survey", icon: ClipboardList, tourId: "survey" },
    { title: t("nav.history"), url: "/history", icon: History, tourId: "history" },
    { title: locale === "ar" ? "الإعدادات" : "Settings", url: "/settings", icon: Settings, tourId: "settings" },
  ];

  const adminItems = [
    { title: locale === "ar" ? "لوحة الأدمن" : "Admin Panel", url: "/admin", icon: Shield, tourId: "admin" },
    { title: locale === "ar" ? "الروضات" : "Kindergartens", url: "/admin/kindergartens", icon: Building2, tourId: "admin-kg" },
    { title: locale === "ar" ? "المعلمات والأكواد" : "Teachers & Codes", url: "/admin/teachers", icon: KeyRound, tourId: "admin-teachers" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌈</span>
          {!collapsed && (
            <div>
              <h2 className="text-base font-bold text-sidebar-foreground font-[Quicksand]">{t("app.title")}</h2>
              <p className="text-xs text-muted-foreground">{t("app.subtitle")}</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teacherItems.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} data-tour={item.tourId}>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>{locale === "ar" ? "إدارة النظام" : "Administration"}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map(item => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} data-tour={item.tourId}>
                      <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-[9px] text-muted-foreground text-center leading-tight">{t("storage.notice")}</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
