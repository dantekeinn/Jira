import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../../hooks/useAppStore';

interface WorkspaceSelectorProps {
  onSelectWorkspace: (workspaceId: string) => void;
}

export const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ 
  onSelectWorkspace 
}) => {
  const { workspaces } = useAppStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-white">Q</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Selecciona un workspace</h1>
          <p className="text-gray-600">Elige el workspace en el que deseas trabajar</p>
        </div>

        <div className="grid gap-4 mb-6">
          {workspaces.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay workspaces disponibles. Crea uno para comenzar.
            </div>
          ) : (
            workspaces.map((workspace) => (
              <Card 
                key={workspace.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectWorkspace(workspace.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{workspace.logo || '🏢'}</div>
                      <div>
                        <CardTitle className="text-lg">{workspace.name}</CardTitle>
                        <p className="text-sm text-gray-500">@{workspace.slug}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Plus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              ¿Necesitas un nuevo workspace?
            </p>
            <Button variant="outline">
              Crear workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
