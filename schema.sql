-- Create Users table (Optional, but good for linking auth to profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'staff', 'technician', 'admin')),
  dept TEXT,
  initials TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Technicians table
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  dept TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  tasks INTEGER DEFAULT 0,
  workload INTEGER DEFAULT 0,
  bg TEXT DEFAULT 'bg-[#E8F5E9]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Issues table
CREATE TABLE public.issues (
  id TEXT PRIMARY KEY, -- e.g. 'CF-2047'
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  room TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT NOT NULL CHECK (status IN ('Unassigned', 'Assigned', 'In Progress', 'Uploaded', 'Resolved', 'Verified')),
  staff TEXT DEFAULT '—',
  sla TEXT DEFAULT '04h 00m',
  reported_by TEXT NOT NULL,
  description TEXT NOT NULL,
  is_lab_fault BOOLEAN DEFAULT false,
  lab_name TEXT,
  pc_number TEXT,
  tech_note TEXT,
  tech_reply_at TEXT,
  rating INTEGER,
  rating_feedback TEXT,
  notified BOOLEAN DEFAULT false,
  evidence JSONB,
  resolution_evidence JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- For demo purposes, we will allow open read/write access. 
-- In production, these should be restricted using auth.uid()
CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.technicians FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.technicians FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.technicians FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.issues FOR UPDATE USING (true);

-- Insert Initial Technicians Data
INSERT INTO public.technicians (name, dept, available, tasks, workload, bg) VALUES
('Arun Kumar', 'Electrical', true, 4, 80, 'bg-[#E8F5E9]'),
('Suresh Patel', 'IT', true, 2, 40, 'bg-[#EDE7FB]'),
('Vikram Singh', 'Networks', true, 0, 0, 'bg-[#E7F1FD]'),
('Mahesh Joshi', 'Plumbing', true, 0, 0, 'bg-[#FFF4E6]'),
('Anil Deshmukh', 'General Maint', true, 0, 0, 'bg-[#FDE7EF]');

-- Insert Initial Issues Data
INSERT INTO public.issues (id, title, category, location, room, priority, status, staff, sla, reported_by, description, is_lab_fault, created_at) VALUES
('CF-2047', 'Water Leakage', 'Plumbing', 'Hostel Block B', 'Ground Washroom', 'Critical', 'In Progress', 'Arun Kumar', '00h 45m', 'Sujan Rao (Student)', 'Pipe leak in the ground floor toilet.', false, NOW()),
('CF-2048', 'Broken Streetlight', 'Electrical', 'Main Parking', 'Parking lot A', 'High', 'Unassigned', '—', '03h 20m', 'Sujan Rao (Student)', 'The main parking lot light is flickering and sparking.', false, NOW()),
('CF-2046', 'Wi-Fi Down', 'IT Support', 'Block C', '2nd Floor', 'High', 'Assigned', 'Suresh Patel', '02h 10m', 'Priya Sharma (Staff)', 'Access point is not transmitting signals.', true, NOW()),
('CF-2045', 'Projector Broken', 'AV Support', 'Block A', 'Room 302', 'Medium', 'Unassigned', '—', '04h 00m', 'Harish Kumar (Staff)', 'Projector turns off after 5 mins of usage.', false, NOW());
