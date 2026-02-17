# Guía de Uso - Quartz

## 🚀 Inicio rápido

### 1. Login
Al abrir la aplicación verás la pantalla de login con opciones para:
- Login con email/contraseña
- Login con Google
- Login con GitHub

**Para el demo**: Cualquier credencial funciona, simplemente haz click en "Iniciar sesión"

### 2. Workspace
Después del login, selecciona el workspace "Quartz Technologies" para acceder al proyecto principal.

---

## 📍 Navegación Principal

### Sidebar (izquierda)
Contiene todas las secciones de la aplicación:

**Gestión de Trabajo**
- 📊 **Dashboard**: Vista ejecutiva con KPIs y gráficos
- 📁 **Proyectos**: Lista de todos los proyectos
- 📝 **Backlog**: Issues sin asignar a sprint
- 🏃 **Sprints**: Gestión de sprints ágiles
- 📋 **Tablero**: Vista Kanban con drag & drop
- 🎫 **Issues / Tickets**: Lista completa con filtros

**Planificación**
- 🗺️ **Roadmap**: Timeline de épicas y releases
- 📦 **Releases**: Gestión de versiones

**Herramientas**
- ⚡ **Automatizaciones**: Reglas de workflow
- 📈 **Reportes**: Métricas y analíticas
- ⚙️ **Configuración**: Settings del proyecto

### Topbar (superior)
- 🔍 **Buscador global**: Busca issues, proyectos (Ctrl+K)
- ➕ **Crear**: Nuevo issue rápido
- 🔔 **Notificaciones**: Alertas y menciones
- 👤 **Perfil**: Configuración personal

---

## 🎯 Funcionalidades Clave

### A) Gestión de Issues

#### Ver lista de issues
1. Click en "Issues / Tickets" en sidebar
2. Usa los filtros para refinar:
   - Estado (To Do, In Progress, etc.)
   - Prioridad (Low, Medium, High, Critical)
   - Tipo (Bug, Task, Story, etc.)
3. Busca por texto en tiempo real
4. Selecciona múltiples issues con checkboxes
5. Aplica acciones masivas

#### Crear nuevo issue
1. Click en botón "Crear" (topbar)
2. Selecciona proyecto y tipo
3. Completa:
   - Título (requerido)
   - Descripción
   - Prioridad
   - Asignado
4. Click "Crear issue"

#### Ver detalle de issue
1. Click en cualquier issue de la lista
2. Verás:
   - **Detalles**: Descripción, subtareas, relaciones
   - **Comentarios**: Conversación del equipo
   - **Historial**: Todos los cambios
   - **Adjuntos**: Archivos relacionados
3. Sidebar derecha con propiedades editables

#### Editar issue
- Todos los campos en el panel derecho son editables
- Click para cambiar: estado, prioridad, asignado, labels, etc.
- Agrega comentarios en la tab correspondiente

### B) Tablero Kanban

#### Usar el board
1. Click en "Tablero" en sidebar
2. Verás columnas por estado:
   - Por hacer (límite: 10)
   - En progreso (límite: 5)
   - En revisión (límite: 3)
   - Bloqueado
   - Completado

#### Mover issues
- **Drag & drop**: Arrastra cards entre columnas
- Los límites WIP se muestran en rojo al superarse
- Click en card para ver quick view

### C) Backlog & Sprints

#### Planificar sprint
1. Ve a "Backlog" en sidebar
2. Sidebar izquierdo muestra Epics con progreso
3. Backlog principal muestra issues sin sprint
4. Arrastra issues desde backlog a sprint
5. Story points se suman automáticamente
6. Click "Iniciar sprint" cuando esté listo

#### Gestionar sprint activo
- Sprint activo se muestra con badge azul "Activo"
- Ve el progreso con story points completados
- Burndown chart disponible en Reportes

### D) Dashboard Ejecutivo

#### KPIs principales
- **Issues Abiertos**: Total sin completar
- **En Progreso**: Trabajo activo
- **Vencidos**: Requieren atención urgente
- **Completados (7d)**: Últimos 7 días

#### Gráficos
- **Cumulative Flow**: Distribución por estado en el tiempo
- **Burndown**: Progreso del sprint vs ideal
- **Distribución por Prioridad**: Pie chart

#### Acciones rápidas
- **Issues Bloqueados**: Lista con acceso directo
- **Mis Issues**: Asignados a mí
- Click en cualquier issue para ver detalle

### E) Reportes

#### Tipos de reportes
1. **Velocity Chart**: Story points por sprint (comprometido vs completado)
2. **Burndown Chart**: Sprint actual, progreso vs línea ideal
3. **Burnup Chart**: Trabajo completado vs scope total
4. **Control Chart**: Cycle time por issue individual
5. **Cumulative Flow**: Áreas apiladas por estado

#### Filtrar reportes
- Selector de sprint en topbar
- Rango de fechas personalizado
- Click "Descargar" para exportar (placeholder)

### F) Roadmap

#### Ver timeline
- Visualiza Epics en timeline temporal
- Cada Epic muestra:
  - Nombre y color
  - Fechas inicio/fin
  - Número de issues
  - Progreso (%)
- Releases marcados como hitos

#### Navegación
- Filtros por trimestre
- Zoom in/out para ajustar vista
- Click en Epic para ver detalles

### G) Automatizaciones

#### Crear regla de automatización
1. Click "Nueva regla"
2. **Trigger** (¿Cuándo?):
   - Issue creado
   - Estado cambiado
   - Comentario agregado
   - Programado
3. **Condiciones** (¿Si...?):
   - Campo = Valor
   - Múltiples condiciones con AND
4. **Acciones** (¿Entonces...?):
   - Asignar a usuario
   - Transicionar a estado
   - Enviar notificación
   - Agregar comentario
   - Crear subtarea

#### Ejemplo: Auto-asignar bugs críticos
```
TRIGGER: Issue creado
IF: tipo = bug AND prioridad = critical
THEN: 
  - Asignar a María González (Lead)
  - Notificar a equipo
  - Agregar label "urgent"
```

#### Gestionar reglas
- Toggle para activar/desactivar
- Ver logs de ejecución
- Editar o duplicar reglas existentes

### H) Configuración

#### Workflows
- **Estados**: Crear/editar estados del workflow
- **Transiciones**: Definir flujos permitidos
- **Validadores**: Condiciones para transiciones

#### Tipos de Issues
- Gestiona Bug, Task, Story, Epic, etc.
- Campos custom por tipo
- Pantallas de creación/edición

#### Permisos
- Matriz de roles:
  - Admin: Todos los permisos
  - Developer: Crear, editar, asignar
  - Designer: Crear, editar (sin eliminar)
  - Viewer: Solo lectura

#### Integraciones
Conecta con:
- 🐙 GitHub (commits y PRs)
- 🦊 GitLab (merge requests)
- 💬 Slack (notificaciones)
- 👥 Teams (notificaciones)
- 📧 Email (alertas)

#### Notificaciones
Configura cuándo recibir alertas:
- Issue asignado
- Comentarios
- Cambios de estado
- Menciones (@usuario)

---

## 💡 Tips y Atajos

### Navegación rápida
- **Sidebar colapsable**: Click en botón inferior para más espacio
- **Breadcrumbs**: Siempre visible el path actual
- **Volver**: Botón en detalles para regresar a lista

### Filtros inteligentes
- **Combina filtros**: Estado + Prioridad + Tipo
- **Búsqueda**: Busca en título, key, descripción
- **JQL**: Para usuarios avanzados (ejemplo mostrado)
- **Guardar filtros**: Guarda combinaciones frecuentes

### Acciones masivas
1. Selecciona múltiples issues con checkbox
2. Barra azul aparece con opciones:
   - Asignar a...
   - Cambiar estado
   - Agregar label
   - Mover a sprint
   - Cambiar prioridad

### Kanban eficiente
- **Límites WIP**: Respeta los límites por columna
- **Quick view**: Click en card para panel lateral
- **Drag rápido**: Arrastra directamente sin abrir

### Story points
- Asigna en detalle de issue
- Se suman automáticamente en sprint
- Visualiza en Velocity chart

---

## 📊 Datos de Ejemplo

### Proyectos
- **Quartz Core (QC)**: 7 issues, Sprint 12 activo
- **Veylo Fit (VF)**: 3 issues, Sprint 8 activo

### Issues destacados
- **QC-101**: OAuth2 implementation (In Progress)
- **QC-102**: Roles system (Blocked)
- **QC-103**: Session timeout bug (Critical)
- **VF-205**: Onboarding redesign (In Progress)

### Usuarios
- María González (Admin) - Lead
- Carlos Ramírez (Developer)
- Ana Torres (Designer)
- Roberto Silva (Developer)
- Laura Méndez (Developer)

---

## 🎨 Personalización

### Colores y temas
Los colores corporativos están definidos:
- **Acento**: Azul (#3b82f6)
- **Success**: Verde (#10b981)
- **Warning**: Naranja (#f59e0b)
- **Error**: Rojo (#ef4444)

### Vistas personalizables
- Columnas de tabla (próximamente)
- Filtros guardados
- Orden de cards en Kanban

---

## 🆘 Troubleshooting

### Issue no aparece en lista
- Verifica filtros activos
- Click "Limpiar filtros" si hay filtros aplicados
- Busca por key directamente (ej: QC-101)

### No puedo arrastrar en Kanban
- Asegúrate de arrastrar desde el body de la card
- Verifica que el navegador soporte drag & drop
- Intenta recargar la página

### Gráficos no cargan
- Los gráficos usan datos mock
- Recarga la página si no aparecen
- Verifica que el sprint seleccionado tenga datos

---

## 📱 Responsive

### Desktop (recomendado)
- Experiencia completa
- Todas las funcionalidades
- Pantalla mínima: 1024px

### Tablet
- Sidebar colapsable
- Vistas adaptadas
- Funcionalidad completa

### Mobile
- Vistas principales disponibles
- Navegación simplificada
- Optimizado para touch

---

## 🚀 Próximos Pasos

1. **Explora el Dashboard**: Ve los KPIs y gráficos
2. **Revisa los Issues**: Familiarízate con los datos
3. **Prueba el Kanban**: Arrastra algunas cards
4. **Planifica un Sprint**: Mueve issues al sprint
5. **Crea una Automatización**: Configura tu primera regla
6. **Revisa Reportes**: Analiza las métricas
7. **Configura Permisos**: Ajusta roles y accesos

---

**¿Necesitas ayuda?** Todas las funcionalidades son autoexplicativas con tooltips y estados visuales claros. ¡Explora y descubre!
