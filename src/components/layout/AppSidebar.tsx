import { LayoutDashboard, Heart, MessageSquare, Apple } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t } = useI18n();
  const isActive = (path: string) => location.pathname === path;

  const items = [
    { title: t("nav.dashboard"), url: "/", icon: LayoutDashboard },
    { title: t("nav.emotionalCoach"), url: "/emotional-coach", icon: Heart },
    { title: t("nav.behaviorTranslator"), url: "/behavior-translator", icon: MessageSquare },
    { title: t("nav.nutrition"), url: "/nutrition", icon: Apple },
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
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
