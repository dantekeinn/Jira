import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Settings as SettingsIcon,
  GitBranch,
  Tag,
  Package,
  Users,
  Bell,
  Plug,
  Shield
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { currentProject, updateProject } = useAppStore();

  const [notifications, setNotifications] = useState({
    issueAssigned: true,
    issueCommented: true,
    statusChanged: true,
    mentioned: true,
  });

  const [projectName, setProjectName] = useState(currentProject?.name || '');
  const [projectDescription, setProjectDescription] = useState(currentProject?.description || '');

  const roles = [
    { role: 'Admin', create: true, edit: true, delete: true, assign: true, transition: true },
    { role: 'Developer', create: true, edit: true, delete: false, assign: true, transition: true },
    { role: 'Designer', create: true, edit: true, delete: false, assign: false, transition: false },
    { role: 'Viewer', create: false, edit: false, delete: false, assign: false, transition: false },
  ];

  const integrations = [
    { name: 'GitHub', logo: '🐙', connected: false, description: 'Sincroniza commits y PRs' },
    { name: 'GitLab', logo: '🦊', connected: false, description: 'Vincular merge requests' },
    { name: 'Slack', logo: '💬', connected: false, description: 'Notificaciones en tiempo real' },
    { name: 'Teams', logo: '👥', connected: false, description: 'Notificaciones Microsoft Teams' },
    { name: 'Email', logo: '📧', connected: false, description: 'Notificaciones por email' },
  ];

  const handleSaveGeneral = () => {
    if (currentProject) {
      updateProject(currentProject.id, { name: projectName, description: projectDescription });
      toast.success('Configuración guardada');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configuración del Proyecto</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona workflows, permisos e integraciones
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="workflows">
            <GitBranch className="h-4 w-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="types">
            <Tag className="h-4 w-4 mr-2" />
            Tipos
          </TabsTrigger>
          <TabsTrigger value="components">
            <Package className="h-4 w-4 mr-2" />
            Componentes
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="h-4 w-4 mr-2" />
            Permisos
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="h-4 w-4 mr-2" />
            Integraciones
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estados del Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    <span className="font-medium">Por hacer</span>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="font-medium">En progreso</span>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="font-medium">En revisión</span>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="font-medium">Bloqueado</span>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-medium">Completado</span>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
                <Button variant="outline" className="w-full">
                  + Agregar estado
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transiciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Define las transiciones permitidas entre estados y agrega validadores o condiciones.
              </div>
              <Button variant="outline" className="mt-4">
                Configurar transiciones
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Types Tab */}
        <TabsContent value="types" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tipos de Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Bug', 'Task', 'Story', 'Epic', 'Incident', 'Request'].map((type) => (
                  <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{type}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Editar campos</Button>
                      <Button variant="ghost" size="sm">Eliminar</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  + Agregar tipo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Componentes del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-500 py-4 text-center">
                  No hay componentes configurados. Agrega componentes para organizar los issues.
                </div>
                <Button variant="outline" className="w-full">
                  + Agregar componente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Matriz de Permisos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rol</TableHead>
                    <TableHead>Crear</TableHead>
                    <TableHead>Editar</TableHead>
                    <TableHead>Eliminar</TableHead>
                    <TableHead>Asignar</TableHead>
                    <TableHead>Transicionar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.role}>
                      <TableCell className="font-medium">{role.role}</TableCell>
                      <TableCell>
                        <Switch checked={role.create} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={role.edit} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={role.delete} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={role.assign} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={role.transition} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{integration.logo}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{integration.name}</span>
                          {integration.connected && (
                            <Badge variant="default" className="bg-green-600">Conectado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    <Button variant={integration.connected ? 'outline' : 'default'}>
                      {integration.connected ? 'Configurar' : 'Conectar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferencias de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Issue asignado a mí</Label>
                  <p className="text-sm text-gray-500">Recibir notificación cuando me asignen un issue</p>
                </div>
                <Switch 
                  checked={notifications.issueAssigned}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, issueAssigned: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Comentarios en mis issues</Label>
                  <p className="text-sm text-gray-500">Notificar cuando alguien comenta en un issue que creé</p>
                </div>
                <Switch 
                  checked={notifications.issueCommented}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, issueCommented: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Cambios de estado</Label>
                  <p className="text-sm text-gray-500">Notificar cuando cambia el estado de issues que observo</p>
                </div>
                <Switch 
                  checked={notifications.statusChanged}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, statusChanged: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Menciones</Label>
                  <p className="text-sm text-gray-500">Notificar cuando alguien me menciona en un comentario</p>
                </div>
                <Switch 
                  checked={notifications.mentioned}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, mentioned: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del proyecto</Label>
                <Input 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Nombre del proyecto"
                />
              </div>
              <div className="space-y-2">
                <Label>Key del proyecto</Label>
                <Input value={currentProject?.key || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input 
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Descripción del proyecto"
                />
              </div>
              <Button onClick={handleSaveGeneral}>Guardar cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
