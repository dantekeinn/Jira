import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Package, Plus, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useAppStore } from '../../../hooks/useAppStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatusBadge, TypeBadge } from '../common/Badges';
import { EmptyState } from '../common/EmptyState';

export const Releases: React.FC = () => {
  const { releases, issues } = useAppStore();

  const getIssuesByKeys = (keys: string[]) => {
    return issues.filter(issue => keys.includes(issue.key));
  };

  if (releases.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Releases / Versiones</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona versiones y lanzamientos
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva versión
          </Button>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Package}
              title="Sin releases"
              description="Crea una nueva versión para planificar y gestionar lanzamientos del proyecto."
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
          <h1 className="text-2xl font-semibold text-gray-900">Releases / Versiones</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona versiones y lanzamientos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva versión
        </Button>
      </div>

      {/* Releases List */}
      <div className="space-y-4">
        {releases.map((release) => {
          const releaseIssues = getIssuesByKeys(release.issues);
          const completedIssues = releaseIssues.filter(i => i.status === 'done').length;
          const progress = releaseIssues.length > 0 
            ? (completedIssues / releaseIssues.length) * 100 
            : 0;

          const statusConfig = {
            released: { 
              color: 'bg-green-50 border-green-200', 
              badge: 'default', 
              icon: CheckCircle2,
              iconColor: 'text-green-600'
            },
            inprogress: { 
              color: 'bg-blue-50 border-blue-200', 
              badge: 'default', 
              icon: Clock,
              iconColor: 'text-blue-600'
            },
            planned: { 
              color: 'bg-gray-50 border-gray-200', 
              badge: 'outline', 
              icon: Calendar,
              iconColor: 'text-gray-600'
            },
          };

          const config = statusConfig[release.status];
          const Icon = config.icon;

          return (
            <Card key={release.id} className={config.color}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${config.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{release.name}</CardTitle>
                        <Badge variant={config.badge as any}>
                          {release.status === 'released' ? 'Lanzado' :
                           release.status === 'inprogress' ? 'En progreso' : 'Planeado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{release.description}</p>
                      {release.releaseDate && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {release.status === 'released' ? 'Lanzado el ' : 'Fecha prevista: '}
                            {format(release.releaseDate, "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Release notes
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">
                      {completedIssues}/{releaseIssues.length} issues completados ({Math.round(progress)}%)
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Issues */}
                {releaseIssues.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Issues incluidos:</div>
                    <div className="grid gap-2">
                      {releaseIssues.slice(0, 5).map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-center justify-between p-2 bg-white border rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <TypeBadge type={issue.type} />
                            <span className="text-sm font-mono font-medium text-gray-700">
                              {issue.key}
                            </span>
                            <span className="text-sm">{issue.title}</span>
                          </div>
                          <StatusBadge status={issue.status} />
                        </div>
                      ))}
                      {releaseIssues.length > 5 && (
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Ver todos los {releaseIssues.length} issues
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
