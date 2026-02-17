import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  ArrowLeft,
  Edit,
  Share2,
  Link as LinkIcon,
  Paperclip,
  MoreHorizontal,
  Clock,
  Calendar,
  User,
  Tag,
  Package,
  GitBranch,
  Eye,
  Plus,
  Check,
  Trash2
} from 'lucide-react';
import { StatusBadge, PriorityBadge, TypeBadge } from '../common/Badges';
import { UserAvatar, AvatarGroup } from '../common/UserAvatar';
import { LabelBadge } from '../common/LabelBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';
import { IssueStatus, Priority } from '../../../types';

interface IssueDetailProps {
  issueKey: string;
  onBack: () => void;
}

export const IssueDetail: React.FC<IssueDetailProps> = ({ issueKey, onBack }) => {
  const { issues, updateIssue, users, currentUser, currentProject } = useAppStore();
  const issue = issues.find(i => i.key === issueKey);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(issue?.description || '');
  const [newComment, setNewComment] = useState('');

  if (!issue) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <p>Issue no encontrado</p>
      </div>
    );
  }

  const handleSaveDescription = () => {
    updateIssue(issue.id, { description: editedDescription });
    setIsEditing(false);
    toast.success('Descripción actualizada');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const commentAuthor = currentUser || { id: 'unknown', name: 'Usuario', email: '', avatar: '', role: 'viewer' as const };
    
    const comment = {
      id: `comment-${Date.now()}`,
      author: commentAuthor,
      content: newComment,
      createdAt: new Date(),
    };
    
    updateIssue(issue.id, { 
      comments: [...issue.comments, comment] 
    });
    
    setNewComment('');
    toast.success('Comentario agregado');
  };

  const handleStatusChange = (newStatus: IssueStatus) => {
    updateIssue(issue.id, { status: newStatus });
    toast.success(`Estado cambiado a ${newStatus}`);
  };

  const handlePriorityChange = (newPriority: Priority) => {
    updateIssue(issue.id, { priority: newPriority });
    toast.success(`Prioridad cambiada a ${newPriority}`);
  };

  const handleAssigneeChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    updateIssue(issue.id, { assignee: user });
    toast.success(`Issue asignado a ${user?.name}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado al portapapeles');
  };

  const handleShare = () => {
    toast.success('Función de compartir en desarrollo');
  };

  return (
    <div className="flex h-full">
      {/* Main Content - Left */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{currentProject?.name || 'Proyecto'}</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium">{issue.key}</span>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <TypeBadge type={issue.type} />
                <h1 className="text-2xl font-semibold">
                  <span className="text-blue-600 font-mono">{issue.key}</span>{' '}
                  {issue.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copiar link
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex items-center gap-2">
              <StatusBadge status={issue.status} />
              <span className="text-gray-400">→</span>
              <Select value={issue.status} onValueChange={(value) => handleStatusChange(value as IssueStatus)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Cambiar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Por hacer</SelectItem>
                  <SelectItem value="inprogress">En progreso</SelectItem>
                  <SelectItem value="inreview">En revisión</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="comments">
                Comentarios {issue.comments.length > 0 && `(${issue.comments.length})`}
              </TabsTrigger>
              <TabsTrigger value="activity">
                Historial {issue.activity.length > 0 && `(${issue.activity.length})`}
              </TabsTrigger>
              <TabsTrigger value="attachments">
                Adjuntos {issue.attachments.length > 0 && `(${issue.attachments.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Descripción</Label>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={6}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveDescription}>
                        <Check className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedDescription(issue.description);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {issue.description}
                  </div>
                )}
              </div>

              {/* Subtasks / Checklist */}
              {issue.subtasks.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-base font-medium">Subtareas</Label>
                  <div className="space-y-2">
                    {issue.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <input type="checkbox" checked={subtask.status === 'done'} readOnly />
                        <TypeBadge type={subtask.type} />
                        <span className="text-sm font-mono">{subtask.key}</span>
                        <span className="text-sm flex-1">{subtask.title}</span>
                        <StatusBadge status={subtask.status} />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar subtarea
                  </Button>
                </div>
              )}

              {/* Relations */}
              {issue.relations.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-base font-medium">Relaciones</Label>
                  <div className="space-y-2">
                    {issue.relations.map((rel, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg text-sm">
                        <GitBranch className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {rel.type === 'blocks' && 'Bloquea a'}
                          {rel.type === 'blocked-by' && 'Bloqueado por'}
                          {rel.type === 'relates-to' && 'Se relaciona con'}
                          {rel.type === 'duplicates' && 'Duplica a'}
                        </span>
                        <span className="font-mono text-blue-600">{rel.issueKey}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Tracking */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time Tracking
                    </Label>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimación original:</span>
                      <span className="font-medium">{issue.timeTracking.originalEstimate}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiempo invertido:</span>
                      <span className="font-medium text-blue-600">{issue.timeTracking.timeSpent}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiempo restante:</span>
                      <span className="font-medium text-orange-600">{issue.timeTracking.remaining}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(issue.timeTracking.timeSpent / issue.timeTracking.originalEstimate) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 mt-6">
              {/* Comments List */}
              <div className="space-y-4">
                {issue.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <UserAvatar user={comment.author} size="md" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">
                          {format(comment.createdAt, "d 'de' MMMM, HH:mm", { locale: es })}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="space-y-2">
                <Label>Agregar comentario</Label>
                <Textarea
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddComment}>
                    Comentar
                  </Button>
                  <Button size="sm" variant="outline">Cancelar</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-3 mt-6">
              {issue.activity.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <UserAvatar user={item.user} size="sm" />
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{item.user.name}</span>{' '}
                      <span className="text-gray-600">{item.action}</span>
                      {item.details && (
                        <span className="text-gray-500"> - {item.details}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(item.timestamp, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="attachments" className="mt-6">
              <div className="text-center py-8 text-gray-500">
                <Paperclip className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No hay adjuntos</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Adjuntar archivo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sidebar - Right */}
      <div className="w-80 border-l bg-gray-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase">Estado</Label>
              <StatusBadge status={issue.status} />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase">Prioridad</Label>
              <Select value={issue.priority} onValueChange={(value) => handlePriorityChange(value as Priority)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Cambiar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Assignee */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase flex items-center gap-2">
                <User className="h-3 w-3" />
                Asignado a
              </Label>
              {issue.assignee ? (
                <UserAvatar user={issue.assignee} showName size="sm" />
              ) : (
                <Select value={issue.assignee?.id} onValueChange={(value) => handleAssigneeChange(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Reporter */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase">Reportado por</Label>
              <UserAvatar user={issue.reporter} showName size="sm" />
            </div>

            {/* Watchers */}
            {issue.watchers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  Observadores
                </Label>
                <AvatarGroup users={issue.watchers} max={5} size="sm" />
              </div>
            )}

            <Separator />

            {/* Labels */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 uppercase flex items-center gap-2">
                <Tag className="h-3 w-3" />
                Labels
              </Label>
              <div className="flex flex-wrap gap-1">
                {issue.labels.map((label) => (
                  <LabelBadge key={label.id} name={label.name} color={label.color} />
                ))}
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Component */}
            {issue.component && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase flex items-center gap-2">
                  <Package className="h-3 w-3" />
                  Componente
                </Label>
                <Badge variant="outline">{issue.component}</Badge>
              </div>
            )}

            {/* Version */}
            {issue.version && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase">Versión</Label>
                <Badge variant="outline">{issue.version}</Badge>
              </div>
            )}

            {/* Sprint */}
            {issue.sprint && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase">Sprint</Label>
                <Badge variant="secondary">{issue.sprint}</Badge>
              </div>
            )}

            {/* Story Points */}
            {issue.storyPoints && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase">Story Points</Label>
                <Badge variant="outline">{issue.storyPoints} SP</Badge>
              </div>
            )}

            <Separator />

            {/* Dates */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Creado</Label>
                <div className="text-sm">
                  {format(issue.createdAt, "d 'de' MMMM, yyyy", { locale: es })}
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Actualizado</Label>
                <div className="text-sm">
                  {format(issue.updatedAt, "d 'de' MMMM, yyyy", { locale: es })}
                </div>
              </div>
              {issue.dueDate && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Fecha límite
                  </Label>
                  <div className="text-sm font-medium text-orange-600">
                    {format(issue.dueDate, "d 'de' MMMM, yyyy", { locale: es })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};