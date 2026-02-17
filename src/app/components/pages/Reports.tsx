import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap,
  Calendar,
  Download
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Cell,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAppStore } from '../../../hooks/useAppStore';
import { EmptyState } from '../common/EmptyState';

export const Reports: React.FC = () => {
  const { issues, sprints } = useAppStore();

  // Dynamic: Status distribution
  const statusDistribution = [
    { name: 'Por hacer', value: issues.filter(i => i.status === 'todo').length, color: '#94a3b8' },
    { name: 'En progreso', value: issues.filter(i => i.status === 'inprogress').length, color: '#3b82f6' },
    { name: 'En revisión', value: issues.filter(i => i.status === 'inreview').length, color: '#8b5cf6' },
    { name: 'Bloqueado', value: issues.filter(i => i.status === 'blocked').length, color: '#ef4444' },
    { name: 'Completado', value: issues.filter(i => i.status === 'done').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  // Dynamic: Type distribution
  const typeDistribution = [
    { name: 'Bug', value: issues.filter(i => i.type === 'bug').length, color: '#ef4444' },
    { name: 'Task', value: issues.filter(i => i.type === 'task').length, color: '#3b82f6' },
    { name: 'Story', value: issues.filter(i => i.type === 'story').length, color: '#10b981' },
    { name: 'Epic', value: issues.filter(i => i.type === 'epic').length, color: '#8b5cf6' },
    { name: 'Incident', value: issues.filter(i => i.type === 'incident').length, color: '#f59e0b' },
    { name: 'Request', value: issues.filter(i => i.type === 'request').length, color: '#06b6d4' },
  ].filter(d => d.value > 0);

  // Dynamic: Priority distribution
  const priorityDistribution = [
    { name: 'Crítico', value: issues.filter(i => i.priority === 'critical').length, color: '#ef4444' },
    { name: 'Alto', value: issues.filter(i => i.priority === 'high').length, color: '#f97316' },
    { name: 'Medio', value: issues.filter(i => i.priority === 'medium').length, color: '#eab308' },
    { name: 'Bajo', value: issues.filter(i => i.priority === 'low').length, color: '#84cc16' },
  ].filter(d => d.value > 0);

  // Dynamic: Sprint velocity from actual sprints
  const velocityData = sprints
    .filter(s => s.status !== 'planned')
    .map(s => {
      const sprintIssues = issues.filter(i => i.sprint === s.name);
      const committed = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
      const completed = sprintIssues
        .filter(i => i.status === 'done')
        .reduce((sum, i) => sum + (i.storyPoints || 0), 0);
      return { sprint: s.name, committed, completed };
    });

  const hasData = issues.length > 0;

  if (!hasData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
            <p className="text-sm text-gray-500 mt-1">
              Analiza métricas y rendimiento del equipo
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={BarChart3}
              title="Sin datos para reportes"
              description="Los reportes se generarán automáticamente cuando haya issues, sprints y actividad en el proyecto."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Analiza métricas y rendimiento del equipo
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sprints.length > 0 && (
            <Select defaultValue={sprints[0]?.id}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
                <SelectItem value="all">Todos los sprints</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Rango de fechas
          </Button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Chart */}
        {velocityData.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Velocity Chart
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Story points por sprint
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="committed" fill="#94a3b8" name="Comprometido" />
                  <Bar dataKey="completed" fill="#3b82f6" name="Completado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Status Distribution */}
        {statusDistribution.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  Distribución por Estado
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Issues por estado actual
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Type Distribution */}
        {typeDistribution.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  Distribución por Tipo
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Issues por tipo
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Cantidad">
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Priority Distribution */}
        {priorityDistribution.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  Distribución por Prioridad
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Issues por nivel de prioridad
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Summary Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Resumen General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{issues.length}</div>
                <div className="text-sm text-gray-500">Total issues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {issues.filter(i => i.status === 'inprogress').length}
                </div>
                <div className="text-sm text-gray-500">En progreso</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {issues.filter(i => i.status === 'done').length}
                </div>
                <div className="text-sm text-gray-500">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Story Points totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
