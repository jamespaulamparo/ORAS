export interface MeetingSession {
  id?: number;
  day_of_week: number; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
  start_time: string;  // "09:00:00" or "09:00"
  end_time: string;    // "10:30:00" or "10:30"
  room?: string;
  meeting_type?: string; // Lecture, Lab, Recitation, etc.
}

export interface Offering {
  id: number;
  course: number;
  course_code: string;
  course_title: string;
  course_units?: number | string | null;
  course_color?: string;
  section_code?: string;
  instructor?: string;
  default_room?: string;
  source: string;
  is_excluded: boolean;
  meeting_sessions: MeetingSession[];
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  workspace: number;
  course_code: string;
  course_title: string;
  units?: number | string | null;
  color_key?: string;
  notes?: string;
  offerings: Offering[];
  created_at: string;
  updated_at: string;
}

export interface ScheduleSelection {
  id: number;
  schedule: number;
  offering: Offering;
}

export interface Schedule {
  id: number;
  workspace: number;
  name: string;
  status: 'draft' | 'saved' | 'preferred';
  is_preferred: boolean;
  selections: ScheduleSelection[];
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: number;
  name: string;
  academic_year_label?: string;
  semester_label?: string;
  courses: Course[];
  schedules: Schedule[];
  created_at: string;
  updated_at: string;
}

export interface ConflictInfo {
  offering_a_id: number;
  offering_b_id: number;
  course_a: string;
  course_b: string;
  day_of_week: number;
  day_name: string;
  overlap_start: string;
  overlap_end: string;
  message: string;
}

export interface ConflictCheckResult {
  has_conflicts: boolean;
  conflict_count: number;
  conflicts: ConflictInfo[];
}
