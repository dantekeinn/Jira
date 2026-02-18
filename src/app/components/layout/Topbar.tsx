import React from 'react';
import { Search, Plus, Bell, ChevronDown, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { UserAvatar } from '../common/UserAvatar';
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  // Topbar minimal (sin botón global "Crear")
  const { workspaces, currentUser } = useAppStore();

  const notifications: { id: string; text: string; time: string; unread: boolean }[] = [];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-4 gap-4">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar issues, proyectos... (Ctrl+K)"
            className="pl-10 pr-4 w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No hay notificaciones
              </div>
            ) : (
              notifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start py-3">
                  <div className="flex items-start gap-2 w-full">
                    {notif.unread && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm ${notif.unread ? 'font-medium' : ''}`}>
                        {notif.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-blue-600">
              Ver todas las notificaciones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Workspace Switcher */}
        {workspaces.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <span className="text-lg">{workspaces[0]?.logo || '🏢'}</span>
                <span className="hidden md:inline text-sm">{workspaces[0]?.name || 'Workspace'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Cambiar workspace</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((ws) => (
                <DropdownMenuItem key={ws.id}>
                  <span className="mr-2">{ws.logo}</span>
                  {ws.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Crear workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {currentUser ? (
                <UserAvatar user={currentUser} size="sm" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs text-white/70">
                  ?
                </div>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{currentUser?.name || 'Usuario'}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email || 'Sin sesión'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info('Perfil en desarrollo')}>Mi perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info('Configuración en desarrollo')}>Configuración</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info('Atajos: Ctrl+K para buscar')}>
              Atajos de teclado
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                if (confirm('¿Estás seguro de cerrar sesión?')) {
                  toast.success('Sesión cerrada exitosamente');
                }
              }}
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
