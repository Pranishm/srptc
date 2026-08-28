import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Wrench } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';

const DEPARTMENTS = [
  { id: 'cse', name: 'Computer Science & Eng (CSE)', head: 'Dr. HK Sharma', activeFaults: 5, health: 98, staffCount: 14, iconColor: 'bg-[#E8F1FC] text-[#0B3C73]' },
  { id: 'ece', name: 'Electronics & Comm (ECE)', head: 'Dr. PS Sharma', activeFaults: 18, health: 82, staffCount: 12, iconColor: 'bg-[#FDE7EF] text-[#B23A48]' },
  { id: 'me', name: 'Mechanical Engineering (ME)', head: 'Dr. AS Shah', activeFaults: 8, health: 91, staffCount: 10, iconColor: 'bg-[#FFF4E6] text-[#C08A3E]' },
  { id: 'civil', name: 'Civil Engineering', head: 'Dr. DP Patel', activeFaults: 3, health: 96, staffCount: 8, iconColor: 'bg-[#E8F5E9] text-[#3F7A5B]' },
  { id: 'physics', name: 'Physics & General Science', head: 'Dr. SR Rao', activeFaults: 2, health: 99, staffCount: 6, iconColor: 'bg-[#F3E8FF] text-[#6B4FBB]' },
  { id: 'facilities', name: 'Campus Facilities & Power', head: 'Er. Rajesh Nair', activeFaults: 11, health: 88, staffCount: 18, iconColor: 'bg-[#E8F1FC] text-[#0B3C73]' },
];

export default function AdminDepartments() {
  const [deps] = useState(DEPARTMENTS);

  return (
    <PortalShell title="Department Console & Health Roster" subtitle="Academic departments, lab infrastructure status, & dedicated maintenance crews" pages={ADMIN_PAGES}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {deps.map((dept, i) => (
          <motion.div
            key={dept.id}
            variants={shellStagger(i + 1)}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4 }}
            className="glass-card rounded-[32px] p-6 flex flex-col justify-between h-64 border border-white hover:shadow-xl transition-all cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center font-bold', dept.iconColor)}>
                  <Building2 className="w-6 h-6" />
                </div>
                <span className={clsx(
                  'px-3 py-1 rounded-full text-[11px] font-extrabold',
                  dept.health > 90 ? 'bg-[#E8F5E9] text-[#3F7A5B]' : 'bg-[#FDE7EF] text-[#B23A48]'
                )}>
                  {dept.health}% Health
                </span>
              </div>

              <h3 className="font-serif text-[20px] font-bold text-[#191919] leading-tight">{dept.name}</h3>
              <p className="text-[13px] font-bold text-[#191919]/40 mt-1">Head: {dept.head}</p>
            </div>

            <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[13px] font-bold text-[#191919]/60">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0B3C73]" /> {dept.staffCount} Staff
              </span>
              <span className="flex items-center gap-1.5 text-[#B23A48]">
                <Wrench className="w-4 h-4" /> {dept.activeFaults} Active Faults
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </PortalShell>
  );
}
