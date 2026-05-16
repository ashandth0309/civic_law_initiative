export const MISSION =
  "To strengthen civic engagement and rule-of-law awareness in Sri Lanka by creating inclusive, multi-regional dialogue spaces where youth and legal professionals can meaningfully participate in shaping democratic governance.";

export const VISION =
  "A Sri Lanka where every citizen, regardless of region or background, has the knowledge, confidence, and opportunity to engage with the legal system and contribute to a just, accountable, and transparent society.";

export const OBJECTIVES = [
  {
    num: "I",
    title: "Structured Dialogue Spaces",
    body: "Create structured dialogue spaces for youth and legal professionals to identify civic challenges and solutions.",
  },
  {
    num: "II",
    title: "Civic Awareness & Democratic Participation",
    body: "Promote civic awareness, democratic participation, and responsible legal engagement through interactive learning experiences.",
  },
  {
    num: "III",
    title: "Actionable National Recommendations",
    body: "Generate actionable insights and national recommendations through a culminating forum in Colombo.",
  },
];

export const LOCATIONS = [
  { name: "Kandy", region: "Regional Workshop", province: "Central Province", date: "May 9, 2026" },
  { name: "Matara", region: "Regional Workshop", province: "Southern Province", date: "May 23, 2026" },
  { name: "Jaffna", region: "Post-Conflict Region", province: "Northern Province", date: "June 6, 2026" },
  { name: "Colombo", region: "National Hub", province: "Western Province", date: "June 18, 2026" },
  { name: "Batticaloa", region: "Post-Conflict Region", province: "Eastern Province", date: "July 18, 2026" },
];

export const TIMELINE_ITEMS = [
  { month: "May 2026", city: "Kandy", detail: "Inaugural regional workshop — Central Province." },
  { month: "May 2026", city: "Matara", detail: "Regional workshop — Southern Province." },
  { month: "June 2026", city: "Jaffna", detail: "Workshop in post-conflict Northern region." },
  { month: "June 2026", city: "Colombo", detail: "National Hub workshop — Western Province." },
  { month: "July 2026", city: "Batticaloa", detail: "Final regional workshop — Eastern Province." },
];

export const KPI_DEFAULTS = [
  { key: "workshops_completed", label: "Workshops Completed" },
  { key: "total_participants", label: "Total Participants" },
  { key: "female_participation", label: "Female Participation %" },
  { key: "knowledge_improvement", label: "Knowledge Improvement %" },
  { key: "policy_briefs", label: "Policy Briefs Produced" },
  { key: "outreach_beneficiaries", label: "Outreach Beneficiaries" },
];

export const MONITORING_TOOLS = [
  { icon: "ClipboardList", label: "Attendance Records" },
  { icon: "BarChart2", label: "Pre/Post Surveys" },
  { icon: "MessageSquare", label: "Feedback Forms" },
  { icon: "FileText", label: "Facilitator Reports" },
  { icon: "BookOpen", label: "Forum Documentation" },
];

export const PARTNERS = [
  {
    name: "SUSI Rule of Law Alumni",
    role: "Lead Organizer",
    type: "Implementation & Coordination",
    desc: "A network of Sri Lankan alumni of the Study of the U.S. Institutes (SUSI) program, driving implementation and coordination across all program sites.",
  },
  {
    name: "American Spaces Network",
    role: "Venue & Outreach",
    type: "Logistics & Community Reach",
    desc: "Coordinates with the American Spaces network across Sri Lanka to support outreach and logistical arrangements for regional workshops.",
  },
];

export const PROVINCES = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
];

export const WORKSHOP_CITIES = ["Kandy", "Matara", "Jaffna", "Colombo", "Batticaloa"];

export const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export const ROLE_OPTIONS = ["Student", "Lawyer", "Civil Society", "Academic", "Other"];
