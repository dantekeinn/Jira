import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';
import { Priority, IssueType } from '../../../types';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<IssueType>('task');
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createPriority, setCreatePriority] = useState<Priority>('medium');
  const [createAssignee, setCreateAssignee] = useState<string>('');
  const [createProject, setCreateProject] = useState<string>('');
  
  const { addIssue, projects, users, workspaces, currentUser } = useAppStore();

  const notifications: { id: string; text: string; time: string; unread: boolean }[] = [];
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleCreateIssue = () => {
    if (!createTitle.trim()) {
      toast.error('El título es requerido');
      return;
    }

    const assignee = createAssignee ? users.find(u => u.id === createAssignee) : undefined;

    addIssue({
      title: createTitle,
      description: createDescription,
      type: createType,
      priority: createPriority,
      status: 'todo' as const,
      labels: [],
      assignee,
      storyPoints: null,
      sprint: null,
      epicKey: null,
      dueDate: null,
    });
    
    toast.success(`Issue creado exitosamente`);
    
    // Reset form
    setCreateTitle('');
    setCreateDescription('');
    setCreateType('task');
    setCreatePriority('medium');
    setCreateAssignee('');
    setCreateDialogOpen(false);
  };

  return (
    <>
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 gap-4">
        {/* Left Section */}
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar issues, proyectos... (Ctrl+K)"
              className="pl-10 pr-4 w-full bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Create Button */}
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Crear</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">
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
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
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
                  <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">?</div>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{currentUser?.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email || 'Sin sesión'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info('Perfil en desarrollo')}>
                Mi perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Configuración en desarrollo')}>
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Atajos: Ctrl+K para buscar, Ctrl+N para crear issue')}>
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

      {/* Create Issue Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo issue</DialogTitle>
            <DialogDescription>
              Completa la información para crear un nuevo issue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {projects.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="project">Proyecto *</Label>
                <Select defaultValue={projects[0]?.id} onValueChange={setCreateProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.key})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={createType} onValueChange={setCreateType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" placeholder="Ej: Implementar autenticación OAuth2" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description" 
                placeholder="Describe el issue en detalle..."
                rows={4}
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select defaultValue="medium" onValueChange={setCreatePriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Bajo</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Asignado a</Label>
                <Select value={createAssignee} onValueChange={setCreateAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateIssue}>
              Crear issue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
