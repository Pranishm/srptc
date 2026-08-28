import { supabase } from './supabaseClient';

export interface UserProfile {
  email: string;
  name: string;
  role: 'student' | 'staff' | 'technician' | 'admin';
  dept?: string;
  initials: string;
}

export interface Issue {
  id: string;
  title: string;
  category: string;
  location: string;
  room: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Unassigned' | 'Assigned' | 'In Progress' | 'Uploaded' | 'Resolved' | 'Verified';
  staff: string;
  sla: string;
  reportedBy: string;
  createdAt: string;
  description: string;
  isLabFault: boolean;
  labName?: string;
  pcNumber?: string;
  techNote?: string;
  techReplyAt?: string;
  rating?: number;
  ratingFeedback?: string;
  notified?: boolean;
  evidence?: string[];
  resolutionEvidence?: string[];
}

export interface Technician {
  name: string;
  dept: string;
  available: boolean;
  tasks: number;
  workload: number;
  bg: string;
}

export const USERS_REGISTRY: Record<string, UserProfile & { password: string; pin?: string }> = {
  'sujan.student@civix360.edu': { email: 'sujan.student@civix360.edu', password: 'password123', name: 'Sujan Rao', role: 'student', dept: 'CSE', initials: 'SR' },
  'priya.staff@civix360.edu': { email: 'priya.staff@civix360.edu', password: 'password123', name: 'Priya Sharma', role: 'staff', dept: 'Faculty · ECE', initials: 'PS' },
  'arun.tech@civix360.edu': { email: 'arun.tech@civix360.edu', password: 'password123', name: 'Arun Kumar', role: 'technician', dept: 'Staff · Electrical', initials: 'AK' },
  'admin@civix360.demo': { email: 'admin@civix360.demo', password: 'password123', pin: '123456', name: 'Chief Admin', role: 'admin', dept: 'Administrator', initials: 'CA' },
  // ... omitting others for brevity, relying on auth in future
};

// --- SYNCHRONOUS FALLBACK FOR LOCAL APP ---
// We keep synchronous getters to prevent breaking the massive React component tree,
// but they now sync with Supabase in the background if configured.

const DEFAULT_ISSUES: Issue[] = [
  { id: 'CF-2047', title: 'Water Leakage', category: 'Plumbing', location: 'Hostel Block B', room: 'Ground Washroom', priority: 'Critical', status: 'In Progress', staff: 'Arun Kumar', sla: '00h 45m', reportedBy: 'Sujan Rao (Student)', createdAt: new Date().toISOString(), description: 'Pipe leak in the ground floor toilet.', isLabFault: false },
  { id: 'CF-2048', title: 'Broken Streetlight', category: 'Electrical', location: 'Main Parking', room: 'Parking lot A', priority: 'High', status: 'Unassigned', staff: '—', sla: '03h 20m', reportedBy: 'Sujan Rao (Student)', createdAt: new Date().toISOString(), description: 'The main parking lot light is flickering and sparking.', isLabFault: false },
  { id: 'CF-2046', title: 'Wi-Fi Down', category: 'IT Support', location: 'Block C', room: '2nd Floor', priority: 'High', status: 'Assigned', staff: 'Suresh Patel', sla: '02h 10m', reportedBy: 'Priya Sharma (Staff)', createdAt: new Date().toISOString(), description: 'Access point is not transmitting signals.', isLabFault: true, labName: 'CSE Lab 2', pcNumber: 'AP-04' },
  { id: 'CF-2045', title: 'Projector Broken', category: 'AV Support', location: 'Block A', room: 'Room 302', priority: 'Medium', status: 'Unassigned', staff: '—', sla: '04h 00m', reportedBy: 'Harish Kumar (Staff)', createdAt: new Date().toISOString(), description: 'Projector turns off after 5 mins of usage.', isLabFault: false }
];

const DEFAULT_TECHNICIANS: Technician[] = [
  { name: 'Arun Kumar', dept: 'Electrical', available: true, tasks: 4, workload: 80, bg: 'bg-[#E8F5E9]' },
  { name: 'Suresh Patel', dept: 'IT', available: true, tasks: 2, workload: 40, bg: 'bg-[#EDE7FB]' },
  { name: 'Vikram Singh', dept: 'Networks', available: true, tasks: 0, workload: 0, bg: 'bg-[#E7F1FD]' },
  { name: 'Mahesh Joshi', dept: 'Plumbing', available: true, tasks: 0, workload: 0, bg: 'bg-[#FFF4E6]' },
  { name: 'Anil Deshmukh', dept: 'General Maint', available: true, tasks: 0, workload: 0, bg: 'bg-[#FDE7EF]' },
];

let localIssuesCache: Issue[] = [];
let localTechsCache: Technician[] = [];

// Initialize caches from localStorage or use defaults
const initLocalCache = () => {
  const iData = localStorage.getItem('civx_issues');
  if (iData) {
    localIssuesCache = JSON.parse(iData);
  } else {
    localIssuesCache = DEFAULT_ISSUES;
    localStorage.setItem('civx_issues', JSON.stringify(DEFAULT_ISSUES));
  }
  
  const tData = localStorage.getItem('civx_technicians');
  if (tData) {
    localTechsCache = JSON.parse(tData);
  } else {
    localTechsCache = DEFAULT_TECHNICIANS;
    localStorage.setItem('civx_technicians', JSON.stringify(DEFAULT_TECHNICIANS));
  }
};
initLocalCache();

const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};

// --- GETTERS (Return from Cache instantly) ---

export const getIssues = (): Issue[] => {
  return localIssuesCache;
};

export const getTechnicians = (): Technician[] => {
  return localTechsCache;
};

export const getCurrentUser = (): UserProfile => {
  const data = localStorage.getItem('civx_current_user');
  if (!data) return USERS_REGISTRY['sujan.student@civix360.edu'];
  return JSON.parse(data);
};

export const setCurrentUser = (profile: UserProfile): void => {
  localStorage.setItem('civx_current_user', JSON.stringify(profile));
};

// --- SETTERS & MUTATIONS (Update Cache + Supabase) ---

export const saveIssues = async (issues: Issue[]): Promise<void> => {
  localIssuesCache = issues;
  localStorage.setItem('civx_issues', JSON.stringify(issues));

  if (isSupabaseConfigured()) {
    // Upsert all to Supabase (in a real app, you'd only upsert the changed ones)
    for (const issue of issues) {
      await supabase.from('issues').upsert({
        id: issue.id,
        title: issue.title,
        category: issue.category,
        location: issue.location,
        room: issue.room,
        priority: issue.priority,
        status: issue.status,
        staff: issue.staff,
        sla: issue.sla,
        reported_by: issue.reportedBy,
        description: issue.description,
        is_lab_fault: issue.isLabFault,
        lab_name: issue.labName,
        pc_number: issue.pcNumber,
        tech_note: issue.techNote,
        tech_reply_at: issue.techReplyAt,
        rating: issue.rating,
        rating_feedback: issue.ratingFeedback,
        notified: issue.notified,
        evidence: issue.evidence,
        resolution_evidence: issue.resolutionEvidence
      });
    }
  }
};

export const saveTechnicians = async (techs: Technician[]): Promise<void> => {
  localTechsCache = techs;
  localStorage.setItem('civx_technicians', JSON.stringify(techs));

  if (isSupabaseConfigured()) {
    for (const tech of techs) {
      await supabase.from('technicians').upsert({
        name: tech.name,
        dept: tech.dept,
        available: tech.available,
        tasks: tech.tasks,
        workload: tech.workload,
        bg: tech.bg
      });
    }
  }
};

export const createIssue = (issue: Partial<Issue>): Issue => {
  const newIssue: Issue = {
    id: `CF-${Math.floor(1000 + Math.random() * 9000)}`,
    title: issue.title || 'Untitled Issue',
    category: issue.category || 'General',
    location: issue.location || 'Campus',
    room: issue.room || 'General Area',
    priority: issue.priority || 'Medium',
    status: 'Unassigned',
    staff: '—',
    sla: '04h 00m',
    reportedBy: issue.reportedBy || 'Unknown User',
    createdAt: new Date().toISOString(),
    description: issue.description || '',
    isLabFault: !!issue.isLabFault,
    labName: issue.labName,
    pcNumber: issue.pcNumber,
    evidence: issue.evidence && issue.evidence.length > 0 ? issue.evidence : undefined
  };

  const current = getIssues();
  current.unshift(newIssue);
  saveIssues(current); // fire and forget sync
  return newIssue;
};

export const assignIssue = (issueId: string, technicianName: string): void => {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index !== -1) {
    issues[index].staff = technicianName;
    issues[index].status = 'Assigned';
    saveIssues(issues);

    const techs = getTechnicians();
    const tIndex = techs.findIndex(t => t.name === technicianName);
    if (tIndex !== -1) {
      techs[tIndex].tasks += 1;
      techs[tIndex].workload = Math.min(100, techs[tIndex].workload + 10);
      saveTechnicians(techs);
    }
  }
};

export const advanceIssueStatus = (issueId: string, status: Issue['status']): void => {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index !== -1) {
    issues[index].status = status;
    saveIssues(issues);
  }
};

export const submitResolutionWithNote = (
  issueId: string,
  note: string,
  resolutionEvidence: string[] = []
): void => {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index !== -1) {
    issues[index].status = 'Resolved';
    issues[index].techNote = note;
    issues[index].techReplyAt = new Date().toLocaleTimeString();
    issues[index].notified = true;
    if (resolutionEvidence.length > 0) issues[index].resolutionEvidence = resolutionEvidence;
    saveIssues(issues);
  }
};

export const saveResolutionEvidence = (issueId: string, images: string[]): void => {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index !== -1) {
    issues[index].resolutionEvidence = images.length > 0 ? images : undefined;
    saveIssues(issues);
  }
};

export const submitStudentRating = (issueId: string, rating: number, feedback: string): void => {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index !== -1) {
    issues[index].rating = rating;
    issues[index].ratingFeedback = feedback;
    issues[index].status = 'Verified';
    saveIssues(issues);
  }
};

// --- SYNC FUNCTION ---
// Call this once at app boot to hydrate local cache from Supabase
export const syncFromSupabase = async (): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  
  const { data: issuesData } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
  if (issuesData && issuesData.length > 0) {
    localIssuesCache = issuesData.map(i => ({
      id: i.id,
      title: i.title,
      category: i.category,
      location: i.location,
      room: i.room,
      priority: i.priority,
      status: i.status,
      staff: i.staff,
      sla: i.sla,
      reportedBy: i.reported_by,
      description: i.description,
      isLabFault: i.is_lab_fault,
      labName: i.lab_name,
      pcNumber: i.pc_number,
      techNote: i.tech_note,
      techReplyAt: i.tech_reply_at,
      rating: i.rating,
      ratingFeedback: i.rating_feedback,
      notified: i.notified,
      evidence: i.evidence,
      resolutionEvidence: i.resolution_evidence,
      createdAt: i.created_at
    }));
    localStorage.setItem('civx_issues', JSON.stringify(localIssuesCache));
  }

  const { data: techData } = await supabase.from('technicians').select('*');
  if (techData && techData.length > 0) {
    localTechsCache = techData.map(t => ({
      name: t.name,
      dept: t.dept,
      available: t.available,
      tasks: t.tasks,
      workload: t.workload,
      bg: t.bg
    }));
    localStorage.setItem('civx_technicians', JSON.stringify(localTechsCache));
  }
};
