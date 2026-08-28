import { motion } from 'framer-motion';
import { Droplet, Zap, Wifi, Wrench, Camera } from 'lucide-react';
import clsx from 'clsx';
import type { Issue } from '../../utils/db';
import { formatSla, slaTone } from '../../hooks/useTechnicianTasks';

export const getTaskIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('plumb')) return Droplet;
  if (cat.includes('elect')) return Zap;
  if (cat.includes('wifi') || cat.includes('netw')) return Wifi;
  return Wrench;
};

const statusTone = (status: Issue['status']) =>
  status === 'Assigned' ? 'bg-[#C08A3E]'
    : status === 'In Progress' ? 'bg-[#0B3C73]'
      : status === 'Uploaded' ? 'bg-[#6B4FBB]'
        : 'bg-[#3F7A5B]';

interface TaskCardProps {
  task: Issue;
  seconds: number;
  active: boolean;
  onSelect: (task: Issue) => void;
}

/** Queue row shared by every technician page so the queue looks identical. */
export const TaskCard = ({ task, seconds, active, onSelect }: TaskCardProps) => {
  const Icon = getTaskIcon(task.category);
  const evidenceCount = (task.evidence?.length ?? 0) + (task.resolutionEvidence?.length ?? 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(task)}
      className={clsx(
        'glass-card rounded-[28px] p-5 cursor-pointer flex flex-col gap-3 shadow-sm transition-all duration-300',
        active ? 'ring-2 ring-[#0B3C73] scale-[1.01]' : 'hover:scale-[1.005] hover:pl-7'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold',
            task.priority === 'Critical' ? 'bg-[#FDE7EF]' : 'bg-[#E7F1FD]'
          )}>
            <Icon className={clsx('w-6 h-6', task.priority === 'Critical' ? 'text-[#B23A48]' : 'text-[#0B3C73]')} />
          </div>
          <div className="min-w-0">
            <h3 className="font-sans font-bold text-[16px] text-[#191919] truncate">{task.title}</h3>
            <p className="text-[13px] text-[#191919]/50 font-bold mt-0.5 truncate">{task.location} · {task.room}</p>
            {evidenceCount > 0 && (
              <p className="text-[11px] font-bold text-[#0B3C73]/70 mt-1 flex items-center gap-1">
                <Camera className="w-3 h-3" /> {evidenceCount} photo{evidenceCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end justify-center gap-1.5 shrink-0">
          <span className={clsx('font-mono font-bold text-[12px] px-3 py-1 rounded-full', slaTone(seconds))}>
            {formatSla(seconds)}
          </span>
          <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold text-white', statusTone(task.status))}>
            {task.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
