// Fixed website content. Edit text here; trainees and events can also be managed in the staff console.

export const SITE_NAME = "Counseling@UM";

export const NAV = [
  { href: "/services", label: "Our Services" },
  { href: "/team", label: "Our Team" },
  { href: "/events", label: "Events" },
  { href: "/faq", label: "FAQ" },
];

export const HOURS = "Open Monday to Sunday, 8.30 am – 6.00 pm";
export const ADDRESS = "Counseling Lab, Level 03, Menara Pendidikan, UM";

export const SERVICES = [
  {
    name: "Individual counseling / therapy",
    icon: "user",
    description:
      "One-to-one sessions with a trainee counselor to talk through what is on your mind, such as stress, anxiety, low mood, relationships or life changes, at your own pace.",
  },
  {
    name: "Group counseling / therapy",
    icon: "users",
    description:
      "Small, guided groups where people facing similar challenges share experiences, learn coping skills and support one another.",
  },
  {
    name: "Family counseling / therapy",
    icon: "home",
    description:
      "Sessions for families or couples to improve communication, work through conflict and find better ways to support each other.",
  },
  {
    name: "Psychological assessment",
    icon: "clipboard",
    description:
      "Standardised questionnaires and tools to better understand your emotions, personality, strengths or concerns, followed by feedback on what the results mean for you.",
  },
];

export const HOTLINES = [
  { label: "Emergency", short: "Emergency", number: "999", tel: "999", note: "Police · Ambulance · Fire" },
  { label: "UMMC Emergency", short: "UMMC Emergency", number: "03-7949 4422", tel: "+60379494422", note: "24 hours · Lembah Pantai" },
  { label: "Befrienders KL", short: "Befrienders KL (24/7)", number: "03-7627 2929", tel: "+60376272929", note: "24/7 emotional support" },
  { label: "Talian HEAL", short: "Talian HEAL", number: "15555", tel: "15555", note: "Mental health support line" },
];

export const SUPERVISOR = {
  name: "[Name]",
  role: "Clinical Supervisor · Registered Counselor",
  photo: "/assets/supervisor.jpg",
  bio: "Our clinical supervisor oversees every case, meeting with trainees regularly to review their work and make sure each client receives safe, ethical, quality care.",
};

// Shown until the database is connected. After that, trainees come from the staff console.
export const FALLBACK_TRAINEES = Array.from({ length: 11 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `[Trainee ${i + 1}]`,
  interests: "[e.g. anxiety, relationships, young adults]",
  approach: "[e.g. Person-centred, CBT, Solution-focused]",
  languages: "[e.g. English, Bahasa Melayu]",
  bio: "[A short, warm introduction in 2–3 sentences: who they are, what draws them to counseling, and what clients can expect when working with them.]",
  photo: `/assets/trainees/trainee-${i + 1}.jpg`,
  whatsapp: "60XXXXXXXXX",
  telegram: "username",
  email: "trainee@example.com",
  order: i + 1,
  active: true,
}));

// Shown until the database is connected. After that, events come from the staff console.
export const FALLBACK_EVENTS = [
  {
    id: "e1",
    title: "[Event title, e.g. Managing Exam Stress Workshop]",
    date: "2026-11-14", startTime: "10:00", endTime: "12:00",
    location: "Counseling Lab, Level 03, Menara Pendidikan",
    description: "[Short description: what the event is about, who it is for, and what people will take away.]",
    link: "", image: "", published: true,
  },
  {
    id: "e2",
    title: "[Event title, e.g. World Mental Health Day Talk]",
    date: "2026-12-05", startTime: "14:30", endTime: "16:00",
    location: "Faculty of Education, UM",
    description: "[Short description of the event.]",
    link: "", image: "", published: true,
  },
];

export const FAQS = [
  ["Who can use the service?", "Anyone. Our service is open to UM students and staff as well as members of the public."],
  ["How much does it cost?", "Nothing. All counseling sessions and assessments are free."],
  ["Who will I be seeing?", "A trainee counselor who is completing their professional training. Every trainee is supervised by our registered clinical supervisor, and your trainee will explain how supervision works at your first session."],
  ["Is what I share confidential?", "Yes. Everything you share is kept confidential in line with the Code of Ethics of the Malaysia Board of Counsellors. Your trainee may discuss your sessions with their supervisor to make sure you receive good care. The only exception to confidentiality is a serious risk of harm to you or someone else."],
  ["Will my family, lecturers or employer find out?", "No. We don't share your attendance or anything you discuss without your written consent."],
  ["How do I get started?", "REGISTER_LINK"],
  ["Can I just walk in?", "Please register first, so a trainee counselor can arrange a time and be ready to see you."],
  ["Can I choose my counselor?", "Yes, if you like. The registration form lets you pick a preferred trainee counselor, and we will do our best to arrange it depending on availability. If you have no preference, we will match you with someone suitable."],
  ["Do I need a referral?", "No — anyone can register directly. UM faculties and departments may also refer students."],
  ["Can I have sessions online?", "No. All sessions are held face to face at our Counseling Lab, Level 03, Menara Pendidikan."],
  ["Do you provide crisis support?", "CRISIS_LINK"],
];
