import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getIssues,
  advanceIssueStatus,
  submitResolutionWithNote,
  getCurrentUser,
} from '../utils/db';
import type { Issue } from '../utils/db';

const TIMER_KEY = 'civx_tech_timers';
const RUNNING_KEY = 'civx_tech_timer_running';

interface StoredTimer { remaining: number; savedAt: number }

const defaultSeconds = (task: Issue) => (task.priority === 'Critical' ? 3600 : 7200);

const readStoredTimers = (): Record<string, StoredTimer> => {
  try {
    return JSON.parse(localStorage.getItem(TIMER_KEY) || '{}');
  } catch {
    return {};
  }
};

const readRunning = (): boolean => localStorage.getItem(RUNNING_KEY) !== 'false';

/**
 * SLA countdowns are persisted so that moving between the technician pages
 * (Command Center → My Tasks → Priority Queue) no longer resets the clock —
 * something that only mattered once the portal became multiple routes.
 */
const hydrateTimers = (tasks: Issue[], running: boolean): Record<string, number> => {
  const stored = readStoredTimers();
  const now = Date.now();
  const next: Record<string, number> = {};

  tasks.forEach(task => {
    const entry = stored[task.id];
    if (!entry) {
      next[task.id] = defaultSeconds(task);
      return;
    }
    const elapsed = running ? Math.floor((now - entry.savedAt) / 1000) : 0;
    next[task.id] = Math.max(0, entry.remaining - elapsed);
  });

  return next;
};

const persistTimers = (timers: Record<string, number>) => {
  const savedAt = Date.now();
  const payload: Record<string, StoredTimer> = {};
  Object.entries(timers).forEach(([id, remaining]) => { payload[id] = { remaining, savedAt }; });
  try {
    localStorage.setItem(TIMER_KEY, JSON.stringify(payload));
  } catch {
    /* non-critical */
  }
};

export const formatSla = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const slaTone = (seconds: number): string =>
  seconds < 1800 ? 'bg-[#FDE7EF] text-[#B23A48]'
    : seconds < 7200 ? 'bg-[#FFF4E6] text-[#C08A3E]'
      : 'bg-[#E8F1FC] text-[#0B3C73]';

export const isOpenTask = (task: Issue) => task.status !== 'Resolved' && task.status !== 'Verified';
export const isDoneTask = (task: Issue) => task.status === 'Resolved' || task.status === 'Verified';

export const useTechnicianTasks = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [tasks, setTasks] = useState<Issue[]>([]);
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [isTimerRunning, setTimerRunning] = useState<boolean>(readRunning);

  const reload = useCallback(() => {
    const mine = getIssues().filter(i => i.staff === currentUser.name);
    setTasks(mine);
    setTimers(hydrateTimers(mine, readRunning()));
  }, [currentUser.name]);

  useEffect(() => { reload(); }, [reload]);

  // Tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const iv = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev };
        for (const id in next) if (next[id] > 0) next[id] -= 1;
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isTimerRunning]);

  // Persist on every change so a route switch keeps the clock honest.
  useEffect(() => {
    if (Object.keys(timers).length > 0) persistTimers(timers);
  }, [timers]);

  const setIsTimerRunning = useCallback((value: boolean) => {
    localStorage.setItem(RUNNING_KEY, String(value));
    setTimerRunning(value);
  }, []);

  const advanceStage = useCallback((taskId: string, currentStatus: Issue['status']) => {
    let nextStatus: Issue['status'] = 'Assigned';
    if (currentStatus === 'Assigned') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Uploaded';

    advanceIssueStatus(taskId, nextStatus);
    reload();
  }, [reload]);

  const submitResolution = useCallback((taskId: string, note: string, evidence: string[]) => {
    submitResolutionWithNote(taskId, note || 'Work completed successfully.', evidence);
    reload();
  }, [reload]);

  const openTasks = useMemo(() => tasks.filter(isOpenTask), [tasks]);
  const doneTasks = useMemo(() => tasks.filter(isDoneTask), [tasks]);
  const criticalTasks = useMemo(() => openTasks.filter(t => t.priority === 'Critical'), [openTasks]);

  return {
    currentUser,
    tasks,
    openTasks,
    doneTasks,
    criticalTasks,
    timers,
    isTimerRunning,
    setIsTimerRunning,
    reload,
    advanceStage,
    submitResolution,
  };
};

/** Keeps a selection pinned to the freshest copy of the task in `list`. */
export const useTaskSelection = (list: Issue[]) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (list.length === 0) { setSelectedId(null); return; }
    if (!selectedId || !list.some(t => t.id === selectedId)) setSelectedId(list[0].id);
  }, [list, selectedId]);

  const selected = list.find(t => t.id === selectedId) ?? null;
  return { selected, selectedId, setSelectedId };
};
