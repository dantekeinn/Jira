// Global State Management with Zustand
import { create } from 'zustand';
import { Issue, Sprint, User, Project, Epic, Release, Automation, Label, Workspace } from '../types';

interface AppState {
  // Data
  issues: Issue[];
  sprints: Sprint[];
  projects: Project[];
  users: User[];
  epics: Epic[];
  releases: Release[];
  automations: Automation[];
  labels: Label[];
  workspaces: Workspace[];
  
  // Selected
  selectedIssues: string[];
  currentProject: Project | null;
  currentUser: User | null;
  
  // Actions - Issues
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  bulkUpdateIssues: (ids: string[], updates: Partial<Issue>) => void;
  
  // Actions - Selection
  toggleIssueSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
  
  // Actions - Sprint management
  addSprint: (sprint: Omit<Sprint, 'id'>) => void;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  moveIssueToSprint: (issueId: string, sprintId: string) => void;
  startSprint: (sprintId: string) => void;
  completeSprint: (sprintId: string) => void;
  
  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setCurrentProject: (project: Project) => void;
  
  // Actions - Users
  addUser: (user: Omit<User, 'id'>) => void;
  setCurrentUser: (user: User) => void;
  
  // Actions - Epics
  addEpic: (epic: Omit<Epic, 'id'>) => void;
  updateEpic: (id: string, updates: Partial<Epic>) => void;
  
  // Actions - Releases
  addRelease: (release: Omit<Release, 'id'>) => void;
  updateRelease: (id: string, updates: Partial<Release>) => void;
  
  // Actions - Automations
  addAutomation: (automation: Omit<Automation, 'id'>) => void;
  toggleAutomation: (id: string) => void;
  deleteAutomation: (id: string) => void;
  
  // Actions - Labels
  addLabel: (label: Omit<Label, 'id'>) => void;
  
  // Actions - Workspaces
  addWorkspace: (workspace: Omit<Workspace, 'id'>) => void;
  
  // Bulk data setters (for backend integration)
  setIssues: (issues: Issue[]) => void;
  setSprints: (sprints: Sprint[]) => void;
  setProjects: (projects: Project[]) => void;
  setUsers: (users: User[]) => void;
  setEpics: (epics: Epic[]) => void;
  setReleases: (releases: Release[]) => void;
  setAutomations: (automations: Automation[]) => void;
  setLabels: (labels: Label[]) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state - empty, to be populated from backend
  issues: [],
  sprints: [],
  projects: [],
  users: [],
  epics: [],
  releases: [],
  automations: [],
  labels: [],
  workspaces: [],
  selectedIssues: [],
  currentProject: null,
  currentUser: null,
  
  // Issue Actions
  addIssue: (newIssue) => {
    const issues = get().issues;
    const project = get().currentProject;
    const projectKey = project?.key || 'PROJ';
    
    const lastIssue = issues
      .filter(i => i.key.startsWith(projectKey))
      .sort((a, b) => {
        const numA = parseInt(a.key.split('-')[1]);
        const numB = parseInt(b.key.split('-')[1]);
        return numB - numA;
      })[0];
    
    const lastNumber = lastIssue ? parseInt(lastIssue.key.split('-')[1]) : 100;
    const newNumber = lastNumber + 1;
    
    const currentUser = get().currentUser;
    
    const issue: Issue = {
      ...newIssue,
      id: `issue-${Date.now()}`,
      key: `${projectKey}-${newNumber}`,
      projectId: project?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      reporter: currentUser || newIssue.reporter,
      comments: [],
      activity: [{
        id: `act-${Date.now()}`,
        user: currentUser || newIssue.reporter,
        action: 'creó este issue',
        timestamp: new Date(),
      }],
      attachments: [],
      subtasks: [],
      relations: [],
      watchers: [],
      timeTracking: newIssue.timeTracking || {
        originalEstimate: 0,
        timeSpent: 0,
        remaining: 0,
      },
    } as Issue;
    
    set({ issues: [issue, ...issues] });
  },
  
  updateIssue: (id, updates) => {
    set({
      issues: get().issues.map(issue =>
        issue.id === id
          ? { ...issue, ...updates, updatedAt: new Date() }
          : issue
      ),
    });
  },
  
  deleteIssue: (id) => {
    set({
      issues: get().issues.filter(issue => issue.id !== id),
      selectedIssues: get().selectedIssues.filter(i => i !== id),
    });
  },
  
  bulkUpdateIssues: (ids, updates) => {
    set({
      issues: get().issues.map(issue =>
        ids.includes(issue.id)
          ? { ...issue, ...updates, updatedAt: new Date() }
          : issue
      ),
    });
  },
  
  // Selection Actions
  toggleIssueSelection: (id) => {
    const selected = get().selectedIssues;
    set({
      selectedIssues: selected.includes(id)
        ? selected.filter(i => i !== id)
        : [...selected, id],
    });
  },
  
  clearSelection: () => {
    set({ selectedIssues: [] });
  },
  
  selectAll: (ids) => {
    set({ selectedIssues: ids });
  },
  
  // Sprint Actions
  addSprint: (newSprint) => {
    const sprint: Sprint = {
      ...newSprint,
      id: `sprint-${Date.now()}`,
    };
    set({ sprints: [...get().sprints, sprint] });
  },
  
  updateSprint: (id, updates) => {
    set({
      sprints: get().sprints.map(sprint =>
        sprint.id === id ? { ...sprint, ...updates } : sprint
      ),
    });
  },
  
  moveIssueToSprint: (issueId, sprintId) => {
    const sprint = get().sprints.find(s => s.id === sprintId);
    if (!sprint) return;
    
    get().updateIssue(issueId, { sprint: sprint.name });
    
    set({
      sprints: get().sprints.map(s =>
        s.id === sprintId
          ? { ...s, issues: [...s.issues, get().issues.find(i => i.id === issueId)?.key || ''] }
          : s
      ),
    });
  },
  
  startSprint: (sprintId) => {
    get().updateSprint(sprintId, { status: 'active' as const });
  },
  
  completeSprint: (sprintId) => {
    get().updateSprint(sprintId, { status: 'completed' as const });
  },
  
  // Project Actions
  addProject: (newProject) => {
    const project: Project = {
      ...newProject,
      id: `project-${Date.now()}`,
      createdAt: new Date(),
    };
    set({ projects: [...get().projects, project] });
  },
  
  updateProject: (id, updates) => {
    set({
      projects: get().projects.map(project =>
        project.id === id ? { ...project, ...updates } : project
      ),
    });
  },
  
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
  
  // User Actions
  addUser: (newUser) => {
    const user: User = {
      ...newUser,
      id: `user-${Date.now()}`,
    };
    set({ users: [...get().users, user] });
  },
  
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
  
  // Epic Actions
  addEpic: (newEpic) => {
    const epic: Epic = {
      ...newEpic,
      id: `epic-${Date.now()}`,
    };
    set({ epics: [...get().epics, epic] });
  },
  
  updateEpic: (id, updates) => {
    set({
      epics: get().epics.map(epic =>
        epic.id === id ? { ...epic, ...updates } : epic
      ),
    });
  },
  
  // Release Actions
  addRelease: (newRelease) => {
    const release: Release = {
      ...newRelease,
      id: `release-${Date.now()}`,
    };
    set({ releases: [...get().releases, release] });
  },
  
  updateRelease: (id, updates) => {
    set({
      releases: get().releases.map(release =>
        release.id === id ? { ...release, ...updates } : release
      ),
    });
  },
  
  // Automation Actions
  addAutomation: (newAutomation) => {
    const automation: Automation = {
      ...newAutomation,
      id: `auto-${Date.now()}`,
    };
    set({ automations: [...get().automations, automation] });
  },
  
  toggleAutomation: (id) => {
    set({
      automations: get().automations.map(auto =>
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      ),
    });
  },
  
  deleteAutomation: (id) => {
    set({
      automations: get().automations.filter(auto => auto.id !== id),
    });
  },
  
  // Label Actions
  addLabel: (newLabel) => {
    const label: Label = {
      ...newLabel,
      id: `label-${Date.now()}`,
    };
    set({ labels: [...get().labels, label] });
  },
  
  // Workspace Actions
  addWorkspace: (newWorkspace) => {
    const workspace: Workspace = {
      ...newWorkspace,
      id: `ws-${Date.now()}`,
    };
    set({ workspaces: [...get().workspaces, workspace] });
  },
  
  // Bulk data setters (for backend integration)
  setIssues: (issues) => set({ issues }),
  setSprints: (sprints) => set({ sprints }),
  setProjects: (projects) => set({ projects }),
  setUsers: (users) => set({ users }),
  setEpics: (epics) => set({ epics }),
  setReleases: (releases) => set({ releases }),
  setAutomations: (automations) => set({ automations }),
  setLabels: (labels) => set({ labels }),
  setWorkspaces: (workspaces) => set({ workspaces }),
}));
