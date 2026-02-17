import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ChevronRight, 
  ChevronDown,
  Plus,
  PlayCircle,
  Calendar,
  Target,
  MoreVertical,
  CheckCircle2,
  Edit
} from 'lucide-react';
import { Issue, Sprint, Epic } from '../../../types';
import { StatusBadge, PriorityBadge, TypeBadge } from '../common/Badges';
import { UserAvatar } from '../common/UserAvatar';
import { LabelBadge } from '../common/LabelBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
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
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';

interface BacklogSprintsProps {
  onViewIssue: (issueKey: string) => void;
}

export const BacklogSprints: React.FC<BacklogSprintsProps> = ({ onViewIssue }) => {
  const { issues, sprints, epics, addSprint, startSprint, addEpic, currentProject } = useAppStore();
  const [expandedSprints, setExpandedSprints] = useState<string[]>(['1', 'backlog']);
  const [expandedEpics, setExpandedEpics] = useState<string[]>(['1']);
  const [createSprintDialogOpen, setCreateSprintDialogOpen] = useState(false);
  const [createEpicDialogOpen, setCreateEpicDialogOpen] = useState(false);
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [epicName, setEpicName] = useState('');

  const toggleSprint = (sprintId: string) => {
    setExpandedSprints(prev =>
      prev.includes(sprintId)
        ? prev.filter(id => id !== sprintId)
        : [...prev, sprintId]
    );
  };

  const toggleEpic = (epicId: string) => {
    setExpandedEpics(prev =>
      prev.includes(epicId)
        ? prev.filter(id => id !== epicId)
        : [...prev, epicId]
    );
  };

  const getIssuesByKeys = (keys: string[]) => {
    return issues.filter(issue => keys.includes(issue.key));
  };

  const backlogIssues = issues.filter(issue => !issue.sprint);

  const handleStartSprint = (sprintId: string) => {
    startSprint(sprintId);
    toast.success('Sprint iniciado exitosamente');
  };

  const handleCreateSprint = () => {
    if (!sprintName.trim()) {
      toast.error('El nombre del sprint es requerido');
      return;
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 2 weeks

    addSprint({
      name: sprintName,
      goal: sprintGoal,
      startDate: now,
      endDate: endDate,
      status: 'planned',
      issues: [],
      projectId: currentProject?.id || '',
    });

    toast.success('Sprint creado exitosamente');
    setSprintName('');
    setSprintGoal('');
    setCreateSprintDialogOpen(false);
  };

  const handleCreateEpic = () => {
    if (!epicName.trim()) {
      toast.error('El nombre del epic es requerido');
      return;
    }

    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    addEpic({
      name: epicName,
      color: color,
      issues: [],
      projectId: currentProject?.id || '',
    });

    toast.success('Epic creado exitosamente');
    setEpicName('');
    setCreateEpicDialogOpen(false);
  };

  return (
    <>
      <div className="h-full flex">
        {/* Epics Sidebar */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4 border-b bg-white">
            <h3 className="font-semibold text-sm">Epics</h3>
          </div>
          <div className="p-2 space-y-1">
            {epics.map((epic) => {
              const epicIssues = getIssuesByKeys(epic.issues);
              const completedIssues = epicIssues.filter(i => i.status === 'done').length;
              const progress = epicIssues.length > 0 ? (completedIssues / epicIssues.length) * 100 : 0;

              return (
                <Collapsible
                  key={epic.id}
                  open={expandedEpics.includes(epic.id)}
                  onOpenChange={() => toggleEpic(epic.id)}
                >
                  <div className="space-y-2">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 text-left"
                      >
                        {expandedEpics.includes(epic.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: epic.color }}
                        />
                        <span className="text-xs flex-1 truncate">{epic.name}</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 space-y-1">
                      <div className="text-xs text-gray-500">
                        {completedIssues}/{epicIssues.length} completados
                      </div>
                      <Progress value={progress} className="h-1" />
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={() => setCreateEpicDialogOpen(true)}
            >
              <Plus className="h-3 w-3" />
              <span className="text-xs">Crear Epic</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Backlog & Sprints</h1>
                <p className="text-sm text-gray-500 mt-1">Planifica y gestiona sprints</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planificar sprint
                </Button>
                <Button size="sm" onClick={() => setCreateSprintDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear sprint
                </Button>
              </div>
            </div>

            {/* Active Sprints */}
            {sprints
              .filter(sprint => sprint.status === 'active')
              .map((sprint) => {
                const sprintIssues = getIssuesByKeys(sprint.issues);
                const totalPoints = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
                const completedPoints = sprintIssues
                  .filter(i => i.status === 'done')
                  .reduce((sum, i) => sum + (i.storyPoints || 0), 0);
                const progress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

                return (
                  <Card key={sprint.id} className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSprint(sprint.id)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedSprints.includes(sprint.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="h-4 w-4 text-blue-600" />
                              <CardTitle className="text-base">{sprint.name}</CardTitle>
                              <Badge variant="default" className="bg-blue-600">
                                Activo
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {format(sprint.startDate, "d MMM", { locale: es })} -{' '}
                              {format(sprint.endDate, "d MMM yyyy", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {completedPoints}/{totalPoints} SP
                            </div>
                            <div className="text-xs text-gray-500">Story Points</div>
                          </div>
                          <div className="w-32">
                            <Progress value={progress} className="h-2" />
                            <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {sprint.goal && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-700 bg-white p-3 rounded">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Objetivo:</span>
                          <span>{sprint.goal}</span>
                        </div>
                      )}
                    </CardHeader>

                    {expandedSprints.includes(sprint.id) && (
                      <CardContent>
                        <div className="space-y-2">
                          {sprintIssues.map((issue) => (
                            <div
                              key={issue.id}
                              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm cursor-pointer transition-shadow"
                              onClick={() => onViewIssue(issue.key)}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <TypeBadge type={issue.type} />
                                <span className="text-sm font-mono font-medium text-gray-700">
                                  {issue.key}
                                </span>
                                <span className="text-sm flex-1">{issue.title}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {issue.labels.slice(0, 2).map((label) => (
                                  <LabelBadge key={label.id} name={label.name} color={label.color} />
                                ))}
                                <StatusBadge status={issue.status} />
                                <PriorityBadge priority={issue.priority} showIcon={false} />
                                {issue.storyPoints && (
                                  <Badge variant="outline" className="text-xs">
                                    {issue.storyPoints} SP
                                  </Badge>
                                )}
                                {issue.assignee && <UserAvatar user={issue.assignee} size="sm" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}

            {/* Planned Sprints */}
            {sprints
              .filter(sprint => sprint.status === 'planned')
              .map((sprint) => {
                const sprintIssues = getIssuesByKeys(sprint.issues);
                const totalPoints = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);

                return (
                  <Card key={sprint.id} className="border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSprint(sprint.id)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedSprints.includes(sprint.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{sprint.name}</CardTitle>
                              <Badge variant="outline">Planeado</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {format(sprint.startDate, "d MMM", { locale: es })} -{' '}
                              {format(sprint.endDate, "d MMM yyyy", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{totalPoints} SP</div>
                            <div className="text-xs text-gray-500">{sprintIssues.length} issues</div>
                          </div>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleStartSprint(sprint.id)}
                          >
                            Iniciar sprint
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}

            {/* Backlog */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSprint('backlog')}
                      className="h-8 w-8 p-0"
                    >
                      {expandedSprints.includes('backlog') ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <CardTitle className="text-base">Backlog</CardTitle>
                    <Badge variant="secondary">{backlogIssues.length} issues</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear issue
                  </Button>
                </div>
              </CardHeader>

              {expandedSprints.includes('backlog') && (
                <CardContent>
                  <div className="space-y-2">
                    {backlogIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => onViewIssue(issue.key)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <TypeBadge type={issue.type} />
                          <span className="text-sm font-mono font-medium text-gray-700">
                            {issue.key}
                          </span>
                          <span className="text-sm flex-1">{issue.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {issue.labels.slice(0, 2).map((label) => (
                            <LabelBadge key={label.id} name={label.name} color={label.color} />
                          ))}
                          <StatusBadge status={issue.status} />
                          <PriorityBadge priority={issue.priority} showIcon={false} />
                          {issue.storyPoints && (
                            <Badge variant="outline" className="text-xs">
                              {issue.storyPoints} SP
                            </Badge>
                          )}
                          {issue.assignee && <UserAvatar user={issue.assignee} size="sm" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Create Sprint Dialog */}
      <Dialog open={createSprintDialogOpen} onOpenChange={setCreateSprintDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo sprint</DialogTitle>
            <DialogDescription>
              Define el nombre y objetivo del sprint
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sprint-name">Nombre del sprint *</Label>
              <Input
                id="sprint-name"
                placeholder="Ej: Sprint 13 - Optimizaciones"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprint-goal">Objetivo del sprint</Label>
              <Textarea
                id="sprint-goal"
                placeholder="¿Qué queremos lograr en este sprint?"
                rows={3}
                value={sprintGoal}
                onChange={(e) => setSprintGoal(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateSprintDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSprint}>
              Crear sprint
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Epic Dialog */}
      <Dialog open={createEpicDialogOpen} onOpenChange={setCreateEpicDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo epic</DialogTitle>
            <DialogDescription>
              Define el nombre del epic
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="epic-name">Nombre del epic *</Label>
              <Input
                id="epic-name"
                placeholder="Ej: Mejoras de rendimiento"
                value={epicName}
                onChange={(e) => setEpicName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateEpicDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateEpic}>
              Crear epic
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};