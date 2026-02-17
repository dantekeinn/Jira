import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { UserAvatar, AvatarGroup } from '../common/UserAvatar';
import { FolderKanban, Plus, Star, Settings, Users } from 'lucide-react';
import { useAppStore } from '../../../hooks/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface ProjectsProps {
  onSelectProject: (projectId: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const { projects, issues, addProject, setCurrentProject, currentUser } = useAppStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const getProjectStats = (projectId: string) => {
    const projectIssues = issues.filter(i => i.projectId === projectId);
    const totalIssues = projectIssues.length;
    const completedIssues = projectIssues.filter(i => i.status === 'done').length;
    const inProgressIssues = projectIssues.filter(i => i.status === 'inprogress').length;
    const progress = totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0;

    return { totalIssues, completedIssues, inProgressIssues, progress };
  };

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
    toast.success(
      favorites.includes(projectId)
        ? 'Proyecto eliminado de favoritos'
        : 'Proyecto agregado a favoritos'
    );
  };

  const handleSelectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      onSelectProject(projectId);
      toast.success(`Proyecto "${project.name}" seleccionado`);
    }
  };

  const handleCreateProject = () => {
    if (!projectName.trim() || !projectKey.trim()) {
      toast.error('El nombre y key del proyecto son requeridos');
      return;
    }

    // Validate key format
    if (!/^[A-Z]{2,5}$/.test(projectKey)) {
      toast.error('El key debe tener entre 2 y 5 letras mayúsculas');
      return;
    }

    // Check if key already exists
    if (projects.some(p => p.key === projectKey)) {
      toast.error('Ya existe un proyecto con ese key');
      return;
    }

    const lead = currentUser || { id: 'default', name: 'Admin', email: 'admin@app.com', avatar: '', role: 'admin' as const };

    addProject({
      key: projectKey,
      name: projectName,
      description: projectDescription,
      lead: lead,
      members: [lead],
    });

    toast.success('Proyecto creado exitosamente');
    setProjectName('');
    setProjectKey('');
    setProjectDescription('');
    setCreateDialogOpen(false);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Proyectos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona y visualiza todos tus proyectos ({projects.length})
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo proyecto
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const stats = getProjectStats(project.id);
            const isFavorite = favorites.includes(project.id);

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {project.key}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle 
                            className="text-lg cursor-pointer hover:text-blue-600"
                            onClick={() => handleSelectProject(project.id)}
                          >
                            {project.name}
                          </CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => toggleFavorite(project.id)}
                          >
                            <Star 
                              className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                            />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalIssues}</div>
                      <div className="text-xs text-gray-500">Total issues</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.inProgressIssues}</div>
                      <div className="text-xs text-gray-500">En progreso</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.completedIssues}</div>
                      <div className="text-xs text-gray-500">Completados</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progreso general</span>
                      <span className="font-medium">{Math.round(stats.progress)}%</span>
                    </div>
                    <Progress value={stats.progress} className="h-2" />
                  </div>

                  {/* Team & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <AvatarGroup users={project.members} max={4} size="sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectProject(project.id)}
                      >
                        <FolderKanban className="h-4 w-4 mr-2" />
                        Abrir
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <FolderKanban className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="font-medium mb-1">Crear nuevo proyecto</h3>
            <p className="text-sm text-gray-500 mb-4">
              Organiza tu trabajo en proyectos separados
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo proyecto
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo proyecto</DialogTitle>
            <DialogDescription>
              Define la información básica del proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del proyecto *</Label>
              <Input
                id="name"
                placeholder="Ej: Sistema de Gestión"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Key del proyecto *</Label>
              <Input
                id="key"
                placeholder="Ej: SGE (2-5 letras mayúsculas)"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                maxLength={5}
              />
              <p className="text-xs text-gray-500">
                El key se usará como prefijo para los issues (ej: {projectKey || 'KEY'}-101)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el propósito del proyecto..."
                rows={3}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProject}>
              Crear proyecto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};