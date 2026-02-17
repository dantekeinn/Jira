import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, AlertCircle, Clock, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { StatusBadge, PriorityBadge, TypeBadge } from '../common/Badges';
import { UserAvatar } from '../common/UserAvatar';
import { useAppStore } from '../../../hooks/useAppStore';
import { EmptyState } from '../common/EmptyState';

interface DashboardProps {
  onViewIssue: (issueKey: string) => void;
  onNavigate?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewIssue, onNavigate }) => {
  const { issues, currentProject } = useAppStore();
  
  const openIssues = issues.filter(i => i.status !== 'done').length;
  const inProgressIssues = issues.filter(i => i.status === 'inprogress').length;
  const overdueIssues = issues.filter(i => 
    i.dueDate && i.dueDate < new Date() && i.status !== 'done'
  ).length;
  const completedThisWeek = issues.filter(i => {
    if (i.status !== 'done') return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return i.updatedAt > weekAgo;
  }).length;

  // Priority Distribution (dynamic from data)
  const priorityData = [
    { name: 'Crítico', value: issues.filter(i => i.priority === 'critical').length, color: '#ef4444' },
    { name: 'Alto', value: issues.filter(i => i.priority === 'high').length, color: '#f97316' },
    { name: 'Medio', value: issues.filter(i => i.priority === 'medium').length, color: '#eab308' },
    { name: 'Bajo', value: issues.filter(i => i.priority === 'low').length, color: '#84cc16' },
  ].filter(d => d.value > 0);

  // My Issues
  const myIssues = issues.slice(0, 5);

  // Blocked Issues
  const blockedIssues = issues.filter(i => i.status === 'blocked');

  const projectLabel = currentProject?.name || 'Proyecto';

  if (issues.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Vista ejecutiva - {projectLabel}</p>
        </div>

        {/* KPI Cards - show zeros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Issues Abiertos</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Progreso</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Vencidos</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completados (7d)</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">0</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={LayoutDashboard}
              title="Sin datos aún"
              description="Crea issues, sprints y proyectos para ver métricas y gráficos en el dashboard."
              actionLabel="Ir a proyectos"
              onAction={() => onNavigate?.('projects')}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Vista ejecutiva - {projectLabel}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Issues Abiertos</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Progreso</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vencidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{overdueIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completados (7d)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution */}
        {priorityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribución por Prioridad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Blocked Issues */}
        <Card className={priorityData.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Issues Bloqueados</CardTitle>
            <Badge variant="destructive">{blockedIssues.length}</Badge>
          </CardHeader>
          <CardContent>
            {blockedIssues.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No hay issues bloqueados
              </div>
            ) : (
              <div className="space-y-3">
                {blockedIssues.map((issue) => (
                  <div 
                    key={issue.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onViewIssue(issue.key)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <TypeBadge type={issue.type} showIcon />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{issue.key}</span>
                          <span className="text-sm text-gray-900">{issue.title}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <PriorityBadge priority={issue.priority} />
                      {issue.assignee && <UserAvatar user={issue.assignee} size="sm" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Issues */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Mis Issues</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onNavigate?.('issues')}>Ver todos</Button>
        </CardHeader>
        <CardContent>
          {myIssues.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No tienes issues asignados
            </div>
          ) : (
            <div className="space-y-2">
              {myIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewIssue(issue.key)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <TypeBadge type={issue.type} showIcon />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{issue.key}</span>
                        <span className="text-sm text-gray-900">{issue.title}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
