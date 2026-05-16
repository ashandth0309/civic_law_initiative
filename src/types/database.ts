export interface Workshop {
  id: string;
  city: string;
  date: string;
  venue: string;
  capacity: number;
  created_at: string;
}

export interface Applicant {
  id: string;
  applicant_id: string;
  full_name: string;
  nic_passport: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  university: string;
  faculty: string;
  year: string;
  role: string;
  province: string;
  district: string;
  preferred_workshop_city: string;
  essay: string;
  cv_url: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'checked_in';
  qr_code: string;
  created_at: string;
}

export interface PreSurvey {
  id: string;
  applicant_id: string;
  workshop_id: string;
  civic_knowledge: number;
  rule_of_law: number;
  policy_awareness: number;
  leadership_confidence: number;
  created_at: string;
}

export interface PostSurvey {
  id: string;
  applicant_id: string;
  workshop_id: string;
  civic_knowledge: number;
  rule_of_law: number;
  policy_awareness: number;
  leadership_confidence: number;
  feedback: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  applicant_id: string;
  workshop_id: string;
  status: 'present' | 'absent';
  check_in: string | null;
  check_out: string | null;
  created_at: string;
}

export interface MediaItem {
  id: string;
  workshop_id: string | null;
  type: 'photo' | 'report' | 'recommendation' | 'facilitator_notes';
  url: string;
  caption: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  committee: string;
  sort_order: number;
  photo_url: string;
  created_at: string;
}

export interface Kpi {
  id: string;
  key: string;
  value: number;
  label: string;
  updated_at: string;
}
