const COLLEGE_NAME = "B. K. Birla College of Arts, Science & Commerce, Kalyan";

const OFFICIAL_SOURCES = {
  home: "https://bkbck.edu.in/",
  about: "https://bkbck.edu.in/about-us/",
  admissions: "https://bkbck.edu.in/admission/general-information/",
  fees:
    "https://bkbck.edu.in/wp-content/uploads/2026/06/Fees-Structure.pdf",
  scholarships:
    "https://bkbck.edu.in/student-corner/scholarships-endowment-prizes/",
  exams: "https://bkbck.edu.in/examination/",
  results: "https://bkbck.edu.in/examination/results-degree-college/",
  academicCalendars: "https://bkbck.edu.in/iqac-naac-academic-calendars/",
  placement: "https://bkbck.edu.in/placement-cell/",
  contact: "https://bkbck.edu.in/contact-us/",
  studentPortal: "https://cimsstudentnewui.mastersofterp.in/",
  facultyPortal: "https://cims.mastersofterp.in/",
};

const COLLEGE_CONTEXT = `
College: ${COLLEGE_NAME}

Verified information from the college's official website:
- The college was established in 1972 and is affiliated with the University of Mumbai.
- The college is autonomous and its About Us page reports NAAC A++ accreditation.
- The college offers Arts, Science, Commerce, junior college, undergraduate, postgraduate, research, vocational and diploma programs. Check the official admissions page for current programs and course-specific eligibility.
- The campus is in Kalyan, Maharashtra. The official contact page lists Birla College Campus Road, Gauripada, Kalyan, Maharashtra 421301; toll-free number 1800 233 0144; landline 0251 2231293.
- Official pages provide admission information, fee structure, scholarships and endowment prizes, examination notices, results, academic calendars, placement information, and student/faculty portals.
- Current fees, deadlines, exam schedules, admissions availability, and eligibility can change. Do not guess these; direct students to the relevant official page or college contact.

Official sources:
- College home and announcements: ${OFFICIAL_SOURCES.home}
- About the college: ${OFFICIAL_SOURCES.about}
- Admissions and eligibility: ${OFFICIAL_SOURCES.admissions}
- Current fee structure: ${OFFICIAL_SOURCES.fees}
- Scholarships and prizes: ${OFFICIAL_SOURCES.scholarships}
- Examination notices: ${OFFICIAL_SOURCES.exams}
- Degree results: ${OFFICIAL_SOURCES.results}
- Academic calendars: ${OFFICIAL_SOURCES.academicCalendars}
- Training and placement: ${OFFICIAL_SOURCES.placement}
- Address and contact: ${OFFICIAL_SOURCES.contact}
- Student portal: ${OFFICIAL_SOURCES.studentPortal}
- Faculty portal: ${OFFICIAL_SOURCES.facultyPortal}
`;

module.exports = { COLLEGE_NAME, COLLEGE_CONTEXT };
