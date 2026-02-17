import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { Projects } from './components/pages/Projects';
import { IssuesList } from './components/pages/IssuesList';
import { IssueDetail } from './components/pages/IssueDetail';
import { KanbanBoard } from './components/pages/KanbanBoard';
import { BacklogSprints } from './components/pages/BacklogSprints';
import { Roadmap } from './components/pages/Roadmap';
import { Releases } from './components/pages/Releases';
import { Reports } from './components/pages/Reports';
import { Automations } from './components/pages/Automations';
import { Settings } from './components/pages/Settings';
import { useAppStore } from '../hooks/useAppStore';
import { Toaster } from './components/ui/sonner';

type View = 
  | 'login'
  | 'dashboard' 
  | 'projects' 
  | 'backlog' 
  | 'sprints' 
  | 'kanban' 
  | 'issues' 
  | 'issue-detail'
  | 'roadmap' 
  | 'releases' 
  | 'automations' 
  | 'reports' 
  | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { currentUser } = useAppStore();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
    setSelectedIssueKey(null);
  };

  const handleViewIssue = (issueKey: string) => {
    setSelectedIssueKey(issueKey);
    setCurrentView('issue-detail');
  };

  const handleBackFromIssue = () => {
    setCurrentView('issues');
    setSelectedIssueKey(null);
  };

  // Login screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Main app layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-hidden">
          {currentView === 'dashboard' && (
            <Dashboard onViewIssue={handleViewIssue} onNavigate={handleViewChange} />
          )}
          
          {currentView === 'projects' && (
            <Projects onSelectProject={() => setCurrentView('dashboard')} />
          )}
          
          {currentView === 'issues' && (
            <IssuesList onViewIssue={handleViewIssue} />
          )}
          
          {currentView === 'issue-detail' && selectedIssueKey && (
            <IssueDetail 
              issueKey={selectedIssueKey} 
              onBack={handleBackFromIssue}
            />
          )}
          
          {currentView === 'kanban' && (
            <KanbanBoard onViewIssue={handleViewIssue} />
          )}
          
          {(currentView === 'backlog' || currentView === 'sprints') && (
            <BacklogSprints onViewIssue={handleViewIssue} />
          )}
          
          {currentView === 'roadmap' && <Roadmap />}
          
          {currentView === 'releases' && <Releases />}
          
          {currentView === 'reports' && <Reports />}
          
          {currentView === 'automations' && <Automations />}
          
          {currentView === 'settings' && <Settings />}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
