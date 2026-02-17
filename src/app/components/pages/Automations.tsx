import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Plus, 
  Zap, 
  Play, 
  Pause,
  Trash2,
  Edit,
  Copy,
  FileText
} from 'lucide-react';
import { Automation } from '../../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Separator } from '../ui/separator';
import { useAppStore } from '../../../hooks/useAppStore';
import { toast } from 'sonner';

export const Automations: React.FC = () => {
  const { automations, toggleAutomation, deleteAutomation, addAutomation, currentProject } = useAppStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');

  const handleToggleAutomation = (id: string) => {
    toggleAutomation(id);
    const auto = automations.find(a => a.id === id);
    toast.success(auto?.enabled ? 'Automatización desactivada' : 'Automatización activada');
  };

  const handleDeleteAutomation = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta automatización?')) {
      deleteAutomation(id);
      toast.success('Automatización eliminada');
    }
  };

  const handleDuplicateAutomation = (id: string) => {
    const auto = automations.find(a => a.id === id);
    if (auto) {
      addAutomation({
        name: `${auto.name} (copia)`,
        trigger: auto.trigger,
        conditions: auto.conditions,
        actions: auto.actions,
        enabled: false,
        projectId: currentProject?.id || '',
      });
      toast.success('Automatización duplicada');
    }
  };

  const handleCreateAutomation = () => {
    if (!ruleName.trim()) {
      toast.error('El nombre de la regla es requerido');
      return;
    }

    addAutomation({
      name: ruleName,
      trigger: { type: 'issue-created' },
      conditions: [],
      actions: [],
      enabled: false,
      projectId: currentProject?.id || '',
    });

    toast.success('Automatización creada exitosamente');
    setRuleName('');
    setCreateDialogOpen(false);
  };

  const getTriggerLabel = (type: string) => {
    const labels: Record<string, string> = {
      'issue-created': 'Issue creado',
      'status-changed': 'Estado cambiado',
      'comment-added': 'Comentario agregado',
      'scheduled': 'Programado',
    };
    return labels[type] || type;
  };

  const getActionLabel = (type: string) => {
    const labels: Record<string, string> = {
      'assign': 'Asignar',
      'transition': 'Transicionar',
      'notify': 'Notificar',
      'add-comment': 'Agregar comentario',
      'create-subtask': 'Crear subtarea',
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Automatizaciones</h1>
          <p className="text-sm text-gray-500 mt-1">
            Crea reglas para automatizar flujos de trabajo
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva regla
        </Button>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id} className={automation.enabled ? 'border-blue-200' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 ${automation.enabled ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{automation.name}</CardTitle>
                      <Badge variant={automation.enabled ? 'default' : 'outline'}>
                        {automation.enabled ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    
                    {/* Rule Flow */}
                    <div className="mt-3 space-y-2">
                      {/* Trigger */}
                      <div className="flex items-start gap-2">
                        <div className="text-xs font-medium text-gray-500 uppercase w-20">
                          Trigger:
                        </div>
                        <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                          {getTriggerLabel(automation.trigger.type)}
                        </Badge>
                      </div>

                      {/* Conditions */}
                      {automation.conditions.length > 0 && (
                        <div className="flex items-start gap-2">
                          <div className="text-xs font-medium text-gray-500 uppercase w-20">
                            If:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {automation.conditions.map((cond, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="bg-blue-50 border-blue-200 text-blue-700"
                              >
                                {cond.field} {cond.operator} {cond.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-start gap-2">
                        <div className="text-xs font-medium text-gray-500 uppercase w-20">
                          Then:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {automation.actions.map((action, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="bg-green-50 border-green-200 text-green-700"
                            >
                              {getActionLabel(action.type)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={() => handleToggleAutomation(automation.id)}
                  />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicateAutomation(automation.id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteAutomation(automation.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Empty State if no automations */}
      {automations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Zap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay automatizaciones</h3>
            <p className="text-sm text-gray-500 mb-4">
              Crea tu primera regla para automatizar flujos de trabajo
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear regla
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Automation Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crear nueva automatización</DialogTitle>
            <DialogDescription>
              Define el trigger, condiciones y acciones para tu regla
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label>Nombre de la regla *</Label>
              <Input placeholder="Ej: Auto-asignar bugs críticos" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
            </div>

            <Separator />

            {/* Trigger */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">1. Trigger (¿Cuándo?)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue-created">Issue creado</SelectItem>
                  <SelectItem value="status-changed">Estado cambiado</SelectItem>
                  <SelectItem value="comment-added">Comentario agregado</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Conditions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">2. Condiciones (¿Si...?)</Label>
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Agregar condición
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Campo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type">Tipo</SelectItem>
                    <SelectItem value="priority">Prioridad</SelectItem>
                    <SelectItem value="status">Estado</SelectItem>
                    <SelectItem value="assignee">Asignado</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Operador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">es igual a</SelectItem>
                    <SelectItem value="not-equals">no es igual a</SelectItem>
                    <SelectItem value="contains">contiene</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Valor" />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">3. Acciones (¿Entonces...?)</Label>
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Agregar acción
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assign">Asignar</SelectItem>
                    <SelectItem value="transition">Transicionar</SelectItem>
                    <SelectItem value="notify">Notificar</SelectItem>
                    <SelectItem value="add-comment">Agregar comentario</SelectItem>
                    <SelectItem value="create-subtask">Crear subtarea</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Configuración" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAutomation}>
              Crear regla
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};