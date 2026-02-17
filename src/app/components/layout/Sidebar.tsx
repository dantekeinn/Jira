import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  LayoutGrid, 
  CircleDot,
  Map,
  Package,
  Zap,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useAppStore } from '../../../hooks/useAppStore';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange,
  collapsed = false,
  onToggleCollapse
}) => {
  const { currentProject } = useAppStore();

  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Proyectos', icon: FolderKanban },
    { id: 'backlog', label: 'Backlog', icon: ListTodo },
    { id: 'sprints', label: 'Sprints', icon: LayoutGrid },
    { id: 'kanban', label: 'Tablero', icon: LayoutGrid },
    { id: 'issues', label: 'Issues / Tickets', icon: CircleDot },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'releases', label: 'Releases', icon: Package },
  ];

  const bottomItems = [
    { id: 'automations', label: 'Automatizaciones', icon: Zap },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const projectName = currentProject?.name || 'Proyecto';
  const projectKey = currentProject?.key || '—';
  const projectInitial = projectName.charAt(0).toUpperCase() || 'P';

  return (
    <div 
      className={`flex flex-col h-screen bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              {projectInitial}
            </div>
            <div>
              <div className="font-semibold text-sm">{projectName}</div>
              <div className="text-xs text-gray-500">{projectKey}</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto">
            {projectInitial}
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 ${collapsed ? 'px-3' : ''} ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
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
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 ${collapsed ? 'px-3' : ''} ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
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

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={onToggleCollapse}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
