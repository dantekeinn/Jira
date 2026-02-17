import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { 
  Search, 
  Filter, 
  X,
  ChevronDown,
  MoreHorizontal,
  BookmarkPlus,
  Download
} from 'lucide-react';
import { Issue, IssueStatus, Priority, IssueType } from '../../../types';
import { StatusBadge, PriorityBadge, TypeBadge } from '../common/Badges';
import { UserAvatar } from '../common/UserAvatar';
import { LabelBadge } from '../common/LabelBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';

interface IssuesListProps {
  onViewIssue: (issueKey: string) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({ onViewIssue }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IssueType | 'all'>('all');
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'status' | 'priority' | 'assignee' | 'sprint' | 'delete' | null>(null);
  const [bulkValue, setBulkValue] = useState<string>('');

  const { 
    issues, 
    selectedIssues, 
    toggleIssueSelection, 
    selectAll, 
    clearSelection,
    bulkUpdateIssues,
    deleteIssue,
    users,
    sprints
  } = useAppStore();

  // Filter issues
  let filteredIssues = issues;

  if (searchQuery) {
    filteredIssues = filteredIssues.filter(issue =>
      issue.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (statusFilter !== 'all') {
    filteredIssues = filteredIssues.filter(issue => issue.status === statusFilter);
  }

  if (priorityFilter !== 'all') {
    filteredIssues = filteredIssues.filter(issue => issue.priority === priorityFilter);
  }

  if (typeFilter !== 'all') {
    filteredIssues = filteredIssues.filter(issue => issue.type === typeFilter);
  }

  const toggleSelectAll = () => {
    if (selectedIssues.length === filteredIssues.length) {
      clearSelection();
    } else {
      selectAll(filteredIssues.map(i => i.id));
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (statusFilter !== 'all' ? 1 : 0) +
    (priorityFilter !== 'all' ? 1 : 0) +
    (typeFilter !== 'all' ? 1 : 0);

  const handleBulkAction = (action: 'status' | 'priority' | 'assignee' | 'sprint' | 'delete') => {
    setBulkActionType(action);
    if (action === 'delete') {
      if (confirm(`¿Estás seguro de eliminar ${selectedIssues.length} issues?`)) {
        selectedIssues.forEach(id => deleteIssue(id));
        toast.success(`${selectedIssues.length} issues eliminados`);
        clearSelection();
      }
    } else {
      setBulkActionDialogOpen(true);
    }
  };

  const executeBulkAction = () => {
    if (!bulkActionType || !bulkValue) return;

    const updates: Partial<Issue> = {};
    
    if (bulkActionType === 'status') {
      updates.status = bulkValue as IssueStatus;
    } else if (bulkActionType === 'priority') {
      updates.priority = bulkValue as Priority;
    } else if (bulkActionType === 'assignee') {
      updates.assignee = users.find(u => u.id === bulkValue);
    } else if (bulkActionType === 'sprint') {
      const sprint = sprints.find(s => s.id === bulkValue);
      updates.sprint = sprint?.name || null;
    }

    bulkUpdateIssues(selectedIssues, updates);
    toast.success(`${selectedIssues.length} issues actualizados`);
    clearSelection();
    setBulkActionDialogOpen(false);
    setBulkValue('');
  };

  const handleExport = () => {
    const csv = [
      ['Key', 'Title', 'Type', 'Status', 'Priority', 'Assignee', 'Sprint', 'Story Points'].join(','),
      ...filteredIssues.map(issue => [
        issue.key,
        `"${issue.title}"`,
        issue.type,
        issue.status,
        issue.priority,
        issue.assignee?.name || '',
        issue.sprint || '',
        issue.storyPoints || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Archivo exportado exitosamente');
  };

  const handleSaveFilter = () => {
    const filterConfig = {
      search: searchQuery,
      status: statusFilter,
      priority: priorityFilter,
      type: typeFilter
    };
    localStorage.setItem('savedFilter', JSON.stringify(filterConfig));
    toast.success('Filtro guardado exitosamente');
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Issues / Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredIssues.length} issues encontrados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveFilter}>
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Guardar filtro
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por key, título, descripción..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>

              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="todo">Por hacer</SelectItem>
                  <SelectItem value="inprogress">En progreso</SelectItem>
                  <SelectItem value="inreview">En revisión</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="low">Bajo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1"
                >
                  <X className="h-3 w-3" />
                  Limpiar filtros ({activeFiltersCount})
                </Button>
              )}
            </div>

            {/* JQL Query */}
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">JQL:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1">
                  {statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all' || searchQuery
                    ? `${searchQuery ? `text ~ "${searchQuery}"` : ''}${statusFilter !== 'all' ? ` AND status = "${statusFilter}"` : ''}${priorityFilter !== 'all' ? ` AND priority = "${priorityFilter}"` : ''}${typeFilter !== 'all' ? ` AND type = "${typeFilter}"` : ''} ORDER BY priority DESC`.trim().replace(/^ AND /, '')
                    : 'ORDER BY priority DESC'
                  }
                </code>
                <Button variant="outline" size="sm">
                  Advanced search (JQL)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIssues.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedIssues.length} issues seleccionados
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('assignee')}>
                  Asignar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('status')}>
                  Cambiar estado
                </Button>
                <Button variant="outline" size="sm">
                  Agregar label
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('sprint')}>
                  Mover a sprint
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('priority')}>
                  Cambiar prioridad
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIssues.length > 0 && selectedIssues.length === filteredIssues.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Key</TableHead>
              <TableHead className="min-w-[300px]">Título</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>Sprint</TableHead>
              <TableHead>Story Points</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.map((issue) => (
              <TableRow
                key={issue.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                  onViewIssue(issue.key);
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIssues.includes(issue.id)}
                    onCheckedChange={() => toggleIssueSelection(issue.id)}
                  />
                </TableCell>
                <TableCell>
                  <TypeBadge type={issue.type} />
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm font-medium text-blue-600">
                    {issue.key}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{issue.title}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={issue.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={issue.priority} showIcon={false} />
                </TableCell>
                <TableCell>
                  {issue.assignee ? (
                    <UserAvatar user={issue.assignee} size="sm" />
                  ) : (
                    <span className="text-xs text-gray-400">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {issue.labels.slice(0, 2).map((label) => (
                      <LabelBadge key={label.id} name={label.name} color={label.color} />
                    ))}
                    {issue.labels.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{issue.labels.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {issue.sprint ? (
                    <span className="text-xs text-gray-600">{issue.sprint}</span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {issue.storyPoints ? (
                    <Badge variant="outline" className="text-xs">
                      {issue.storyPoints} SP
                    </Badge>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewIssue(issue.key)}>
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Mover a sprint</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Mostrando {filteredIssues.length} de {issues.length} issues
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Anterior</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="default" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Siguiente</Button>
        </div>
      </div>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Actualizar issues seleccionados</DialogTitle>
            <DialogDescription>
              Selecciona el valor para actualizar {selectedIssues.length} issues.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {bulkActionType === 'status' && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Por hacer</SelectItem>
                  <SelectItem value="inprogress">En progreso</SelectItem>
                  <SelectItem value="inreview">En revisión</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                </SelectContent>
              </Select>
            )}
            {bulkActionType === 'priority' && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="low">Bajo</SelectItem>
                </SelectContent>
              </Select>
            )}
            {bulkActionType === 'assignee' && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Asignado" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {bulkActionType === 'sprint' && (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sprint" />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map(sprint => (
                    <SelectItem key={sprint.id} value={sprint.id}>{sprint.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBulkActionDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={executeBulkAction}
            >
              Actualizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};