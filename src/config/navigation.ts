import {
  Target, MapPin, FileText, Sparkles, Activity, User, Building2, BarChart3, Bell,
  LayoutDashboard, Wrench, ShieldAlert, CheckCircle2, Users,
} from 'lucide-react';

export interface PortalPage {
  id: string;
  path: string;
  /** i18n dictionary key — falls back to `label` when missing. */
  labelKey: string;
  label: string;
  icon: React.ElementType;
}

/**
 * The admin console used to be one page with six client-side tabs. Each entry
 * below is now a real route so the browser URL, back button and deep links all
 * work — while every page keeps the identical shell (see PortalShell).
 */
export const ADMIN_PAGES: PortalPage[] = [
  { id: 'command',     path: '/app/admin',             labelKey: 'commandCenter',      label: 'Command Center', icon: Target },
  { id: 'campus',      path: '/app/admin/campus',      labelKey: 'liveCampus',         label: 'Live Campus',    icon: MapPin },
  { id: 'issues',      path: '/app/admin/issues',      labelKey: 'issueDispatch',      label: 'Issues',         icon: FileText },
  { id: 'ai',          path: '/app/admin/ai',          labelKey: 'aiPrediction',       label: 'AI Prediction',  icon: Sparkles },
  { id: 'feedback',    path: '/app/admin/feedback',    labelKey: 'feedbackAnalytics',  label: 'Feedback',       icon: Activity },
  { id: 'staff',       path: '/app/admin/staff',       labelKey: 'staffRoster',        label: 'Staff Roster',   icon: User },
  { id: 'departments', path: '/app/admin/departments', labelKey: 'departments',        label: 'Departments',    icon: Building2 },
  { id: 'analytics',   path: '/app/admin/analytics',   labelKey: 'analytics',          label: 'Analytics',      icon: BarChart3 },
  { id: 'alerts',      path: '/app/admin/alerts',      labelKey: 'alertsCenter',       label: 'Alerts',         icon: Bell },
];

/** Legacy `/app/admin?tab=x` deep links map onto the new routes. */
export const ADMIN_TAB_REDIRECTS: Record<string, string> = {
  command: '/app/admin',
  campus: '/app/admin/campus',
  issues: '/app/admin/issues',
  ai: '/app/admin/ai',
  feedback: '/app/admin/feedback',
  staff: '/app/admin/staff',
};

/**
 * Technician portal. Previously every sidebar link pointed at the same page
 * with a `?filter=` query, which made the whole portal feel like one screen.
 */
export const TECH_PAGES: PortalPage[] = [
  { id: 'command',     path: '/app/technician',             labelKey: 'commandCenter',  label: 'Command Center', icon: LayoutDashboard },
  { id: 'tasks',       path: '/app/technician/tasks',       labelKey: 'myTasks',        label: 'My Tasks',       icon: Wrench },
  { id: 'priority',    path: '/app/technician/priority',    labelKey: 'priorityQueue',  label: 'Priority Queue', icon: ShieldAlert },
  { id: 'completed',   path: '/app/technician/completed',   labelKey: 'completedWork',  label: 'Completed',      icon: CheckCircle2 },
  { id: 'team',        path: '/app/technician/team',        labelKey: 'team',           label: 'Team',           icon: Users },
  { id: 'performance', path: '/app/technician/performance', labelKey: 'performance',    label: 'Performance',    icon: BarChart3 },
];

/** Legacy `/app/technician?filter=x` deep links map onto the new routes. */
export const TECH_FILTER_REDIRECTS: Record<string, string> = {
  All: '/app/technician',
  'In Progress': '/app/technician/tasks',
  Critical: '/app/technician/priority',
  Completed: '/app/technician/completed',
};
