export const PROGRAMS = [
  { id: 1, code: "BSIT", name: "Bachelor of Science in Information Technology", type: "Bachelor's", duration: "4 years", units: 176, status: "Active", description: "A program that equips students with the knowledge and skills in software development, networking, and IT management.", dateAdded: "2024-08-01" },
  { id: 2, code: "BSCS", name: "Bachelor of Science in Computer Science", type: "Bachelor's", duration: "4 years", units: 180, status: "Active", description: "Focuses on theoretical foundations of computation and practical software engineering skills.", dateAdded: "2024-08-03" },
  { id: 3, code: "BSIS", name: "Bachelor of Science in Information Systems", type: "Bachelor's", duration: "4 years", units: 172, status: "Active", description: "Bridges business and technology, focusing on information systems design and management.", dateAdded: "2024-09-10" },
  { id: 4, code: "DICT", name: "Diploma in Information and Communications Technology", type: "Diploma", duration: "2 years", units: 92, status: "Active", description: "A two-year program providing practical skills in ICT for immediate employment.", dateAdded: "2024-09-15" },
  { id: 5, code: "BSECE", name: "Bachelor of Science in Electronics Engineering", type: "Bachelor's", duration: "5 years", units: 196, status: "Under Review", description: "Covers electronics, communications, and control systems engineering principles.", dateAdded: "2024-10-01" },
  { id: 6, code: "BSME", name: "Bachelor of Science in Mechanical Engineering", type: "Bachelor's", duration: "5 years", units: 198, status: "Phased Out", description: "Formerly offered program focusing on mechanical systems and thermodynamics.", dateAdded: "2023-06-01" },
];

export const SUBJECTS = [
  { id: 1, code: "IT101", title: "Introduction to Computing", units: 3, semester: "1st Semester", term: "Per Semester", programId: 1, description: "Overview of computing concepts, history, and modern applications.", prerequisites: [], corequisites: [], yearLevel: 1 },
  { id: 2, code: "IT102", title: "Computer Programming 1", units: 3, semester: "1st Semester", term: "Per Semester", programId: 1, description: "Fundamentals of programming using Python or C language.", prerequisites: [], corequisites: ["IT101"], yearLevel: 1 },
  { id: 3, code: "IT103", title: "Computer Programming 2", units: 3, semester: "2nd Semester", term: "Per Semester", programId: 1, description: "Advanced programming concepts including OOP.", prerequisites: ["IT102"], corequisites: [], yearLevel: 1 },
  { id: 4, code: "IT201", title: "Data Structures and Algorithms", units: 3, semester: "1st Semester", term: "Per Semester", programId: 1, description: "Study of data structures like trees, graphs, and sorting algorithms.", prerequisites: ["IT103"], corequisites: [], yearLevel: 2 },
  { id: 5, code: "IT202", title: "Database Management Systems", units: 3, semester: "1st Semester", term: "Per Semester", programId: 1, description: "Relational databases, SQL, normalization, and database design.", prerequisites: ["IT103"], corequisites: [], yearLevel: 2 },
  { id: 6, code: "IT203", title: "Web Development 1", units: 3, semester: "2nd Semester", term: "Per Semester", programId: 1, description: "HTML, CSS, and JavaScript fundamentals for web development.", prerequisites: ["IT102"], corequisites: [], yearLevel: 2 },
  { id: 7, code: "IT301", title: "Software Engineering", units: 3, semester: "1st Semester", term: "Per Semester", programId: 1, description: "SDLC, software design patterns, and project management.", prerequisites: ["IT201", "IT202"], corequisites: [], yearLevel: 3 },
  { id: 8, code: "IT302", title: "Networking Fundamentals", units: 3, semester: "1st Semester", term: "Per Semester", programId: 1, description: "TCP/IP, network topologies, and protocols.", prerequisites: [], corequisites: [], yearLevel: 3 },
  { id: 9, code: "IT303", title: "Web Development 2", units: 3, semester: "2nd Semester", term: "Per Semester", programId: 1, description: "Advanced web frameworks and backend development.", prerequisites: ["IT203"], corequisites: [], yearLevel: 3 },
  { id: 10, code: "IT401", title: "Capstone Project 1", units: 3, semester: "1st Semester", term: "Per Semester", programId: 1, description: "Initial phase of the capstone project including proposal and design.", prerequisites: ["IT301", "IT303"], corequisites: [], yearLevel: 4 },
  { id: 11, code: "IT402", title: "Capstone Project 2", units: 3, semester: "2nd Semester", term: "Per Semester", programId: 1, description: "Final implementation and defense of the capstone project.", prerequisites: ["IT401"], corequisites: [], yearLevel: 4 },
  { id: 12, code: "CS101", title: "Discrete Mathematics", units: 3, semester: "1st Semester", term: "Per Semester", programId: 2, description: "Logic, sets, relations, functions, and combinatorics.", prerequisites: [], corequisites: [], yearLevel: 1 },
  { id: 13, code: "CS102", title: "Introduction to Programming", units: 3, semester: "1st Semester", term: "Per Semester", programId: 2, description: "Fundamental programming concepts in C++.", prerequisites: [], corequisites: [], yearLevel: 1 },
  { id: 14, code: "CS201", title: "Algorithm Design", units: 3, semester: "1st Semester", term: "Per Semester", programId: 2, description: "Advanced algorithm design and complexity analysis.", prerequisites: ["CS102", "CS101"], corequisites: [], yearLevel: 2 },
  { id: 15, code: "CS301", title: "Operating Systems", units: 3, semester: "1st Semester", term: "Per Semester", programId: 2, description: "Process management, memory management, and file systems.", prerequisites: ["CS201"], corequisites: [], yearLevel: 3 },
  { id: 16, code: "IS101", title: "Fundamentals of IS", units: 3, semester: "Both", term: "Both", programId: 3, description: "Overview of information systems in organizations.", prerequisites: [], corequisites: [], yearLevel: 1 },
  { id: 17, code: "IS201", title: "Systems Analysis & Design", units: 3, semester: "1st Semester", term: "Per Semester", programId: 3, description: "Methods for analyzing and designing information systems.", prerequisites: ["IS101"], corequisites: [], yearLevel: 2 },
  { id: 18, code: "DICT101", title: "ICT Fundamentals", units: 3, semester: "1st Term", term: "Per Term", programId: 4, description: "Basic ICT concepts and digital literacy.", prerequisites: [], corequisites: [], yearLevel: 1 },
  { id: 19, code: "DICT102", title: "Computer Maintenance", units: 3, semester: "2nd Term", term: "Per Term", programId: 4, description: "Hardware troubleshooting and maintenance.", prerequisites: ["DICT101"], corequisites: [], yearLevel: 1 },
  { id: 20, code: "IT204", title: "Human Computer Interaction", units: 3, semester: "2nd Semester", term: "Per Semester", programId: 1, description: "UI/UX principles and usability engineering.", prerequisites: ["IT203"], corequisites: [], yearLevel: 2 },
];

export const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export function getProgramById(id) {
  return PROGRAMS.find(p => p.id === id);
}

export function getSubjectsByProgram(pId, year) {
  return SUBJECTS.filter(s => s.programId === pId && (!year || s.yearLevel === year));
}

export function getStatusClass(status) {
  if (status === "Active") return "active";
  if (status === "Phased Out") return "phased-out";
  return "under-review";
}

export function getTermClass(term) {
  if (term === "Per Semester") return "semester";
  if (term === "Per Term") return "term";
  return "both";
}