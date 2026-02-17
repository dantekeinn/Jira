export type IssueType = 'bug' | 'task' | 'story' | 'epic' | 'incident' | 'request';
export type IssueStatus = 'todo' | 'inprogress' | 'inreview' | 'blocked' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'admin' | 'developer' | 'designer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface ActivityItem {
  id: string;
  user: User;
  action: string;
  timestamp: Date;
  details?: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  assignee?: User;
  reporter: User;
  watchers: User[];
  labels: Label[];
  component?: string;
  version?: string;
  sprint?: string;
  storyPoints?: number;
  timeTracking: {
    originalEstimate: number; // en horas
    timeSpent: number;
    remaining: number;
  };
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  comments: Comment[];
  activity: ActivityItem[];
  subtasks: Issue[];
  relations: {
    type: 'blocks' | 'blocked-by' | 'relates-to' | 'duplicates';
    issueKey: string;
  }[];
  attachments: string[];
  projectId: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  lead: User;
  members: User[];
  createdAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed';
  issues: string[]; // issue IDs
  projectId: string;
}

export interface Epic {
  id: string;
  key: string;
  name: string;
  description: string;
  color: string;
  status: IssueStatus;
  startDate?: Date;
  endDate?: Date;
  issues: string[]; // issue keys
  projectId: string;
}

export interface Release {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'planned' | 'inprogress' | 'released';
  releaseDate?: Date;
  issues: string[]; // issue keys
  projectId: string;
}

export interface Automation {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    type: 'issue-created' | 'status-changed' | 'comment-added' | 'scheduled';
    config: any;
  };
  conditions: {
    field: string;
    operator: string;
    value: any;
  }[];
  actions: {
    type: 'assign' | 'transition' | 'notify' | 'add-comment' | 'create-subtask';
    config: any;
  }[];
  projectId: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  query: string;
  userId: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}
