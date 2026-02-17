import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  MoreVertical, 
  Plus, 
  Settings,
  Circle,
  Clock,
  GitBranch,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { Issue, IssueStatus } from '../../../types';
import { PriorityBadge, TypeBadge } from '../common/Badges';
import { UserAvatar } from '../common/UserAvatar';
import { LabelBadge } from '../common/LabelBadge';
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';

interface KanbanBoardProps {
  onViewIssue: (issueKey: string) => void;
}

interface Column {
  id: IssueStatus;
  title: string;
  icon: React.ElementType;
  color: string;
  wipLimit?: number;
}

const columns: Column[] = [
  { id: 'todo', title: 'Por hacer', icon: Circle, color: '#94a3b8', wipLimit: 10 },
  { id: 'inprogress', title: 'En progreso', icon: Clock, color: '#3b82f6', wipLimit: 5 },
  { id: 'inreview', title: 'En revisión', icon: GitBranch, color: '#8b5cf6', wipLimit: 3 },
  { id: 'blocked', title: 'Bloqueado', icon: Ban, color: '#ef4444' },
  { id: 'done', title: 'Completado', icon: CheckCircle2, color: '#10b981' },
];

interface IssueCardProps {
  issue: Issue;
  onViewIssue: (issueKey: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onViewIssue }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'issue',
    item: { id: issue.id, currentStatus: issue.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onViewIssue(issue.key)}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <TypeBadge type={issue.type} showIcon />
            <span className="text-xs font-mono text-gray-600">{issue.key}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>

        {/* Title */}
        <p className="text-sm font-medium line-clamp-2">{issue.title}</p>

        {/* Labels */}
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.labels.slice(0, 2).map((label) => (
              <LabelBadge key={label.id} name={label.name} color={label.color} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <PriorityBadge priority={issue.priority} showIcon={false} />
          <div className="flex items-center gap-2">
            {issue.storyPoints && (
              <Badge variant="outline" className="text-xs">
                {issue.storyPoints} SP
              </Badge>
            )}
            {issue.assignee && <UserAvatar user={issue.assignee} size="sm" />}
          </div>
        </div>
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  column: Column;
  issues: Issue[];
  onDrop: (issueId: string, newStatus: IssueStatus) => void;
  onViewIssue: (issueKey: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, issues, onDrop, onViewIssue }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'issue',
    drop: (item: { id: string; currentStatus: IssueStatus }) => {
      if (item.currentStatus !== column.id) {
        onDrop(item.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const Icon = column.icon;
  const isOverLimit = column.wipLimit && issues.length >= column.wipLimit;

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-80 ${isOver ? 'opacity-80' : ''}`}
    >
      <Card className={`h-full ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color: column.color }} />
              <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {issues.length}
              </Badge>
              {column.wipLimit && (
                <Badge 
                  variant={isOverLimit ? 'destructive' : 'outline'} 
                  className="text-xs"
                >
                  Límite: {column.wipLimit}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onViewIssue={onViewIssue} />
          ))}
          {issues.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Sin issues
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onViewIssue }) => {
  const { issues, updateIssue, sprints, currentProject } = useAppStore();
  const [swimlaneMode, setSwimlaneMode] = useState<'none' | 'epic' | 'assignee'>('none');

  const handleDrop = (issueId: string, newStatus: IssueStatus) => {
    updateIssue(issueId, { status: newStatus });
    toast.success('Issue actualizado');
  };

  const getIssuesByStatus = (status: IssueStatus) => {
    return issues.filter((issue) => issue.status === status);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tablero Kanban</h1>
              <p className="text-sm text-gray-500 mt-1">
                {sprints.find(s => s.status === 'active')?.name || currentProject?.name || 'Sin sprint activo'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Swimlanes: {swimlaneMode === 'none' ? 'Ninguno' : swimlaneMode === 'epic' ? 'Por Epic' : 'Por Assignee'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4 h-full">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                issues={getIssuesByStatus(column.id)}
                onDrop={handleDrop}
                onViewIssue={onViewIssue}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};