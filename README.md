# Quartz - Sistema de Gestión de Proyectos

Aplicación web SaaS completa para gestión de proyectos y tickets, inspirada en Jira, con diseño corporativo y minimalista.

## 🎯 Características principales

### Gestión de Issues
- **Tipos de issues**: Bug, Task, Story, Epic, Incident, Request
- **Estados configurables**: To Do, In Progress, In Review, Blocked, Done
- **Prioridades**: Low, Medium, High, Critical
- **Campos completos**: Asignado, Reporter, Watchers, Labels, Componentes, Versiones, Sprint
- **Time tracking**: Estimación, tiempo invertido, tiempo restante
- **Subtareas y relaciones**: Blocks, Blocked by, Relates to, Duplicates
- **Comentarios y actividad**: Historial completo de cambios

### Vistas principales

#### 1. Dashboard
- KPIs ejecutivos (issues abiertos, en progreso, vencidos, completados)
- Cumulative Flow Diagram
- Burndown Chart
- Distribución por prioridad
- Lista de issues bloqueados
- Mis issues asignados

#### 2. Lista de Issues
- Tabla con columnas configurables
- Filtros avanzados por estado, prioridad, tipo, assignee
- Búsqueda en tiempo real
- Query JQL (Jira Query Language)
- Acciones masivas (asignar, cambiar estado, labels, sprint, prioridad)
- Guardar filtros personalizados
- Exportación

#### 3. Detalle de Issue
- Vista split: contenido (izq) + propiedades (der)
- Tabs: Detalles, Comentarios, Historial, Adjuntos
- Edición inline de campos
- Time tracking visual
- Gestión de subtareas
- Relaciones entre issues

#### 4. Tablero Kanban
- Columnas por estado con WIP limits
- Drag & drop funcional
- Tarjetas con información clave
- Filtros por epic, assignee
- Panel lateral de quick view

#### 5. Backlog & Sprints
- Sidebar de Epics con progreso
- Sprints activos y planeados
- Planning: arrastrar issues a sprint
- Story points totales por sprint
- Burndown por sprint
- Objetivos de sprint

#### 6. Roadmap
- Timeline visual de Epics
- Releases con fechas
- Dependencias entre items
- Filtros por proyecto, equipo, estado

#### 7. Releases / Versiones
- Lista de versiones (Planned, In Progress, Released)
- Issues asociados por versión
- Progreso de completitud
- Release notes

#### 8. Reportes
- **Velocity Chart**: Story points por sprint
- **Burndown Chart**: Progreso vs ideal
- **Burnup Chart**: Trabajo completado vs scope
- **Control Chart**: Cycle time por issue
- **Cumulative Flow**: Distribución por estado
- Filtros por sprint, fecha, equipo
- Exportación de reportes

#### 9. Automatizaciones
- Builder visual tipo "If/Then"
- **Triggers**: Issue created, Status changed, Comment added, Scheduled
- **Conditions**: Campo, operador, valor
- **Actions**: Assign, Transition, Notify, Add comment, Create subtask
- Enable/disable por regla
- Logs y testing

#### 10. Configuración
- **Workflows**: Estados, transiciones, validadores
- **Tipos de issues**: Crear/editar tipos y campos custom
- **Componentes**: Gestión de componentes del proyecto
- **Permisos**: Matriz de roles (Admin, Developer, Designer, Viewer)
- **Integraciones**: GitHub, GitLab, Slack, Teams, Email
- **Notificaciones**: Preferencias personalizables

## 🎨 Diseño

### Estilo visual
- **Look & feel**: Tech corporativo, limpio, minimalista
- **Tipografía**: Sans-serif moderna con jerarquías claras
- **Colores**: Esquema claro con azul como acento
- **Layout**: Grid system 8px, bordes suaves, sombras sutiles
- **Accesibilidad**: Contraste correcto, estados hover/focus

### Componentes reutilizables
- Badges (Status, Priority, Type, Labels)
- Avatars y Avatar Groups
- Buttons (Primary, Secondary, Ghost, Destructive)
- Inputs, Selects, Date pickers
- Tables con paginación
- Cards, Modals, Drawers
- Tabs, Progress bars
- Empty states
- Skeleton loaders
- Toast notifications

## 🛠️ Stack tecnológico

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Iconografía
- **Recharts** - Gráficos y visualizaciones
- **React DnD** - Drag & drop (Kanban)
- **Motion** - Animaciones
- **date-fns** - Manejo de fechas
- **Radix UI** - Componentes accesibles

## 📊 Datos mock

### Proyectos
- **Quartz Core (QC)**: Sistema de gestión empresarial
- **Veylo Fit (VF)**: Aplicación de fitness y bienestar

### Issues de ejemplo
- QC-101: Implementar login con OAuth2
- QC-102: Sistema de roles y permisos
- QC-103: BUG: Session timeout no redirige a login
- QC-104: Implementar 2FA
- QC-105: Auditoría de acceso
- QC-201: Dashboard ejecutivo con KPIs
- QC-202: Reportes exportables (PDF/CSV)
- VF-205: Rediseño de onboarding de usuarios
- VF-206: BUG: Avatar no se carga en perfil
- VF-207: Optimización de performance en lista

### Usuarios
- María González (Admin)
- Carlos Ramírez (Developer)
- Ana Torres (Designer)
- Roberto Silva (Developer)
- Laura Méndez (Developer)

## 🚀 Funcionalidades destacadas

### Navegación
- Sidebar colapsable con secciones
- Topbar con buscador global, notificaciones, workspace switcher
- Navegación fluida entre vistas sin recarga

### Interactividad
- Drag & drop en Kanban
- Filtros en tiempo real
- Edición inline de campos
- Acciones masivas
- Tooltips y hover states

### Responsive
- Desktop first (1440px)
- Tablet (1024px) con sidebar colapsable
- Mobile (390px) para vistas clave

## 📝 Flujos principales

1. **Crear issue**: Botón "Crear" → Seleccionar tipo → Completar formulario → Ver detalle
2. **Cambiar estado**: Desde issue detail o arrastrar en Kanban
3. **Planificar sprint**: Backlog → Arrastrar issues a sprint → Iniciar sprint
4. **Ver métricas**: Dashboard o Reportes con gráficos interactivos
5. **Configurar automatización**: Crear regla → Definir trigger/condiciones/acciones → Activar

## 🎯 Principios de diseño

- **Productividad**: Acciones rápidas, atajos de teclado, bulk operations
- **Legibilidad**: Tipografía clara, jerarquías bien definidas, espaciado generoso
- **Consistencia**: Design system coherente, patrones reutilizables
- **Escalabilidad**: Componentes modulares, fácil de extender
- **Accesibilidad**: Contraste WCAG AA, navegación por teclado, ARIA labels

---

**Diseñado para equipos que necesitan una herramienta enterprise de gestión de proyectos con la potencia de Jira pero con un diseño moderno y minimalista.**
