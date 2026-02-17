import React from 'react';
import { Priority, IssueStatus, IssueType } from '../../../types';
import { Badge } from '../ui/badge';
import { AlertCircle, ArrowUp, Minus, ChevronDown, CheckCircle2, Circle, Clock, GitBranch, AlertTriangle, Ban } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const config = {
    critical: { label: 'Crítico', color: 'destructive', icon: AlertCircle },
    high: { label: 'Alto', color: 'default', icon: ArrowUp },
    medium: { label: 'Medio', color: 'secondary', icon: Minus },
    low: { label: 'Bajo', color: 'outline', icon: ChevronDown },
  };

  const { label, color, icon: Icon } = config[priority];

  return (
    <Badge variant={color as any} className="gap-1">
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

interface StatusBadgeProps {
  status: IssueStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const config = {
    todo: { label: 'Por hacer', color: 'outline', icon: Circle, className: 'text-gray-600' },
    inprogress: { label: 'En progreso', color: 'default', icon: Clock, className: 'text-blue-600 bg-blue-50 border-blue-200' },
    inreview: { label: 'En revisión', color: 'secondary', icon: GitBranch, className: 'text-purple-600 bg-purple-50 border-purple-200' },
    blocked: { label: 'Bloqueado', color: 'destructive', icon: Ban, className: 'text-red-600 bg-red-50 border-red-200' },
    done: { label: 'Completado', color: 'default', icon: CheckCircle2, className: 'text-green-600 bg-green-50 border-green-200' },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge className={`gap-1 ${className}`}>
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

interface TypeBadgeProps {
  type: IssueType;
  showIcon?: boolean;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, showIcon = true }) => {
  const config = {
    bug: { label: 'Bug', color: 'destructive', icon: AlertCircle },
    task: { label: 'Task', color: 'default', icon: CheckCircle2 },
    story: { label: 'Story', color: 'secondary', icon: Circle },
    epic: { label: 'Epic', color: 'outline', icon: GitBranch },
    incident: { label: 'Incident', color: 'destructive', icon: AlertTriangle },
    request: { label: 'Request', color: 'outline', icon: Circle },
  };

  const { label, color, icon: Icon } = config[type];

  return (
    <Badge variant={color as any} className="gap-1">
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};