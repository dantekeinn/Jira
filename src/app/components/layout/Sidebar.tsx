import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  LayoutGrid,
  CircleDot,
  Map,
  Package,
  Zap,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function BrandMark({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-md border border-border bg-muted flex items-center justify-center">
        <span className="font-mono text-[11px] leading-none text-foreground">
          {"</>"}
        </span>
      </div>

      {!collapsed && (
        <span className="text-sm font-semibold tracking-[0.18em] text-foreground">
          QUARTZ
        </span>
      )}
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  collapsed = false,
  onToggleCollapse,
}) => {
  const mainItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Proyectos", icon: FolderKanban },
    { id: "sprints", label: "Sprints", icon: LayoutGrid },
    { id: "kanban", label: "Tablero", icon: LayoutGrid },
    { id: "issues", label: "Issues / Tickets", icon: CircleDot },
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "releases", label: "Releases", icon: Package },
  ];

  const bottomItems = [
    { id: "automations", label: "Automatizaciones", icon: Zap },
    { id: "reports", label: "Reportes", icon: BarChart3 },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        <BrandMark collapsed={collapsed} />

        <Button
          variant="ghost"
          size="sm"
          className="text-foreground/70 hover:text-foreground hover:bg-sidebar-accent"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  collapsed ? "px-3" : ""
                } ${
                  isActive
                    ? "bg-sidebar-accent text-foreground"
                    : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                }`}
                onClick={() => onViewChange(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  collapsed ? "px-3" : ""
                } ${
                  isActive
                    ? "bg-sidebar-accent text-foreground"
                    : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                }`}
                onClick={() => onViewChange(item.id)}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
