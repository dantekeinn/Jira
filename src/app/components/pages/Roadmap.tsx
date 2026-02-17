import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, Filter, ZoomIn, ZoomOut, Map } from 'lucide-react';
import { useAppStore } from '../../../hooks/useAppStore';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { EmptyState } from '../common/EmptyState';

export const Roadmap: React.FC = () => {
  const { epics, releases } = useAppStore();
  const today = new Date();

  const hasData = epics.length > 0 || releases.length > 0;

  if (!hasData) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Roadmap</h1>
            <p className="text-sm text-gray-500 mt-1">
              Planificación de Epics y Releases
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Map}
              title="Sin datos en el roadmap"
              description="Crea Epics y Releases para visualizar la planificación del proyecto en el roadmap."
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
          <h1 className="text-2xl font-semibold text-gray-900">Roadmap</h1>
          <p className="text-sm text-gray-500 mt-1">
            Planificación de Epics y Releases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </Button>
        </div>
      </div>

      {/* Timeline Header */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex gap-4 overflow-x-auto">
          {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((month) => (
            <div key={month} className="flex-1 min-w-[120px] text-center">
              <div className="text-sm font-medium text-gray-700">{month}</div>
              <div className="text-xs text-gray-500">{today.getFullYear()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Epics Timeline */}
      {epics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Epics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {epics.map((epic, idx) => {
              if (!epic.startDate || !epic.endDate) return null;
              
              const duration = differenceInDays(epic.endDate, epic.startDate);
              const elapsed = differenceInDays(today, epic.startDate);
              const progress = Math.max(0, Math.min(100, (elapsed / duration) * 100));

              return (
                <div key={epic.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: epic.color }}
                      />
                      <span className="font-medium text-sm">{epic.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {epic.issues.length} issues
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(epic.startDate, "d MMM", { locale: es })} -{' '}
                      {format(epic.endDate, "d MMM", { locale: es })} ({duration} días)
                    </span>
                  </div>
                  <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute h-full rounded-lg flex items-center px-3"
                      style={{
                        backgroundColor: `${epic.color}40`,
                        border: `2px solid ${epic.color}`,
                        width: `${Math.max(10, (duration / 180) * 100)}%`,
                        left: `${Math.max(0, (differenceInDays(epic.startDate, new Date(today.getFullYear(), 0, 1)) / 180) * 100)}%`
                      }}
                    >
                      <span className="text-xs font-medium" style={{ color: epic.color }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Releases Timeline */}
      {releases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Releases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {releases.map((release) => {
              if (!release.releaseDate) return null;
              
              const daysUntilRelease = differenceInDays(release.releaseDate, today);
              const statusColor = 
                release.status === 'released' ? '#10b981' :
                release.status === 'inprogress' ? '#3b82f6' : '#94a3b8';

              return (
                <div key={release.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{release.name}</span>
                      <Badge 
                        variant="outline"
                        style={{ borderColor: statusColor, color: statusColor }}
                      >
                        {release.status === 'released' ? 'Released' : 
                         release.status === 'inprogress' ? 'En progreso' : 'Planeado'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {release.issues.length} issues
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(release.releaseDate, "d MMM yyyy", { locale: es })}
                      {daysUntilRelease > 0 && ` (en ${daysUntilRelease} días)`}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full rounded-full"
                      style={{
                        backgroundColor: statusColor,
                        width: '10px',
                        left: `${Math.max(0, (differenceInDays(release.releaseDate, new Date(today.getFullYear(), 0, 1)) / 180) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dependencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 text-center py-8">
            Las dependencias entre epics se visualizarán aquí
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
