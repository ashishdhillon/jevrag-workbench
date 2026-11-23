/**
 * Academic Regulations & Residential Life Handbook (2025–2026)
 * Apex Institute of Technology
 * 
 * Specially engineered ~25-chunk dense policy document with:
 * - Edge cases and clear exceptions
 * - Specific false premise traps (e.g., late assignment submission is strictly grade-based, NO monetary fine)
 * - Missing info traps (mentions off-campus symposiums & kettles, but specifies NO meal per diem amount or kettle fine)
 * - Dense multi-criteria policies (internship approvals with specific GPA, semester, and dean signoffs)
 */

export interface SampleDocChunk {
  id: string;
  section: string;
  title: string;
  text: string;
}

export const SAMPLE_HANDBOOK_NAME = "Apex_Tech_Academic_and_Hostel_Handbook_2025-26.pdf";

export const SAMPLE_CHUNKS: SampleDocChunk[] = [
  {
    id: "chunk-01",
    section: "1.1",
    title: "Academic Honor Code and Grading Scales",
    text: `Apex Institute of Technology operates under a unified 10-point Cumulative Grade Point Average (CGPA) system. Grades awarded range from 'S' (10 points - Exceptional) down to 'F' (0 points - Fail). Academic integrity is enforced through the Institute Honor Council. Any student found guilty of plagiarism in project reports or sessional examinations faces mandatory course failure ('F' grade) and suspension for a minimum of one academic semester upon ratification by the Academic Council.`
  },
  {
    id: "chunk-02",
    section: "1.2",
    title: "Course Registration and Add/Drop Windows",
    text: `Students must complete course registration on the ERP portal no later than 5:00 PM on Friday of the first instructional week. The subsequent add/drop window remains open until the end of the second week of classes. Dropping a core course requires express written approval from the Faculty Academic Advisor. Any course dropped after the second instructional week will reflect on the permanent academic transcript as a 'W' (Withdrawn) mark, which does not compute into CGPA but counts towards maximum allowable attempts.`
  },
  {
    id: "chunk-03",
    section: "1.3",
    title: "Coursework Deadlines and Submission Penalties",
    text: `All laboratory assignments, design portfolios, and continuous evaluation assignments must be submitted via the designated LMS by 11:59 PM on the declared due date. Under no circumstances are monetary fines or cash penalties levied for late coursework submissions. Instead, late submissions incur a strict academic deduction of 5% of the earned assignment marks for every 24 hours of delay, up to a maximum delay of 72 hours (3 calendar days). Submissions uploaded beyond 72 hours are awarded a grade of zero ('0') automatically.`
  },
  {
    id: "chunk-04",
    section: "1.4",
    title: "Attendance Requirements and Medical Absence",
    text: `A minimum classroom and laboratory attendance of 75% is mandatory across all registered credit courses to qualify for end-semester examinations. Students maintaining attendance between 65% and 74.9% due to verified hospitalization or bereavement may petition the Dean of Student Affairs for condonation. Medical certificates must be countersigned by the Chief Medical Officer at the Campus Health Center within 5 working days of resumption of classes. Students below 65% attendance receive an 'I' (Incomplete) grade.`
  },
  {
    id: "chunk-05",
    section: "1.5",
    title: "Grade Appeals and Script Re-evaluation",
    text: `A student disputing an evaluated end-semester exam script may submit a formal re-evaluation petition within 10 calendar days of grade declaration on the student portal. A non-refundable processing fee of ₹1,000 per theory course applies. The examination branch assigns the answer script to two independent external examiners. If the average score difference exceeds 10%, the newly computed grade supersedes the original score permanently.`
  },
  {
    id: "chunk-06",
    section: "2.1",
    title: "Off-Campus Industrial Internships and Semester Leave",
    text: `Undergraduate students desiring to undertake a full-semester off-campus industrial internship during regular academic semesters must satisfy three mandatory criteria: (1) Maintain a cumulative CGPA of 3.50 or higher at the end of the preceding semester; (2) Have successfully completed at least 5 full instructional semesters (minimum 100 earned credits); and (3) Secure formal written endorsement from the Department Head and final approval from the Dean of Academic Affairs at least 60 calendar days prior to the internship commencement date. Furthermore, the host enterprise must execute an official tripartite Institutional Memorandum of Understanding (MoU).`
  },
  {
    id: "chunk-07",
    section: "2.2",
    title: "Academic Probation and Evening Peer Tutoring",
    text: `Undergraduate students with a CGPA falling below 2.00 at the conclusion of any semester are placed on formal Academic Probation. Probationary students are required to attend mandatory evening peer tutoring sessions organized by the Academic Assistance Cell thrice weekly. Tutors are selected from high-performing senior students. The handbook outlines tutor responsibilities and attendance tracking, but financial remuneration, hourly rates, and stipend disbursements for student tutors fall under autonomous department discretionary bursaries not codified in these general regulations.`
  },
  {
    id: "chunk-08",
    section: "2.3",
    title: "Interdisciplinary Minor Certifications",
    text: `Students in good standing with a CGPA of 2.75 or above may elect to pursue an Interdisciplinary Minor (e.g., Artificial Intelligence, Financial Engineering, Sustainable Urban Planning) beginning in their third semester. Completing a minor requires 20 additional credits earned across designated prerequisite tracks without exceeding the 24-credit ceiling per regular semester. Minor credentials are authenticated on the final degree parchment upon recommendation of the Academic Senate.`
  },
  {
    id: "chunk-09",
    section: "3.1",
    title: "Hostel Room Allocation and Check-in Protocols",
    text: `Residential hall accommodations are allocated through an automated annual lottery conducted by the Chief Warden's Office. First-year undergraduates are placed in mandatory triple-occupancy suites in Halls A and B. Senior undergraduate and graduate students may bid for double or single rooms based on cumulative academic seniority. All residents must execute a joint room inventory checklist during check-in, certifying the condition of desks, beds, storage lockers, and electrical fixtures.`
  },
  {
    id: "chunk-10",
    section: "3.2",
    title: "Room Inventory, Electrical Appliances, and Fire Safety",
    text: `To prevent electrical overloading and fire hazards in student hostels, residents are strictly prohibited from possessing or operating high-wattage electrical appliances in hostel rooms. Prohibited items explicitly include electric space heaters, immersion water heating rods, air conditioners, electric hot plates, induction cookers, and open-coil cooking devices. Any prohibited appliance discovered during scheduled or surprise room inspections by the Hostel Vigilance Committee shall be confiscated immediately without return and impounded in Central Stores until the end of the academic year.`
  },
  {
    id: "chunk-11",
    section: "3.3",
    title: "Curfew Hours and Gate Entry Passes",
    text: `All campus residential hostel gates are closed promptly at 10:30 PM Sunday through Thursday, and at 11:30 PM on Fridays and Saturdays. Residents seeking late entry or overnight leave to visit local guardians must submit an electronic Gate Pass through the Warden Mobile Portal at least 6 hours in advance, accompanied by SMS confirmation from the registered parent or guardian phone number. Unsanctioned late arrivals incur warning strikes; 3 strikes trigger an immediate summons to the Proctorial Board.`
  },
  {
    id: "chunk-12",
    section: "3.4",
    title: "Hostel Guest Policy and Visitor Authorizations",
    text: `Day visitors, including parents, enrolled peers, and siblings, are permitted in hostel common lounges between 9:00 AM and 7:00 PM upon signing the gate register. No outside guests, regardless of relationship, are permitted inside individual residential rooms at any hour. Overnight guest stays are strictly confined to the Institute Guest House facility on South Campus, subject to availability and payment of standardized tariff charges, requiring 48 hours advance reservation via the Estate Office.`
  },
  {
    id: "chunk-13",
    section: "3.5",
    title: "Quiet Hours, Noise Pollution, and Common Room Etiquette",
    text: `Mandatory Quiet Hours are enforced in all residential blocks from 11:00 PM to 6:00 AM daily. Operating amplified sound equipment, musical instruments, or engaging in loud hallway gatherings during quiet hours is an actionable violation. First offenses result in formal reprimand by the Assistant Warden. Repeated violations result in forfeiture of hostel allotment for the subsequent semester and mandatory relocation to off-campus private housing.`
  },
  {
    id: "chunk-14",
    section: "4.1",
    title: "Central Library Circulation, Access, and Overdue Fees",
    text: `The Central Library is accessible 24/7 during mid-term and end-semester examination cycles. Undergraduate students may borrow up to 6 general collection volumes for a duration of 14 calendar days. Overdue items accrue a late return fee of ₹10 per book per day. In the event of a damaged or lost physical smart ID card, the student must immediately alert circulation desk personnel and pay a mandatory non-negotiable replacement penalty of ₹500 at the cash counter to re-issue library credentials.`
  },
  {
    id: "chunk-15",
    section: "4.2",
    title: "Advanced Research Laboratories and Safety Protocols",
    text: `Access to chemical, cleanroom, and high-voltage computing facilities is restricted to authorized personnel who have completed the annual EH&S Biosafety and Chemical Hazard Certification. Open-toed footwear and synthetic nylon clothing are barred inside chemical engineering bays. Chemical waste must be segregated into color-coded drums (solvents, heavy metals, biohazardous matter) and logged in the digital hazmat ledger before 4:00 PM daily.`
  },
  {
    id: "chunk-16",
    section: "4.3",
    title: "Proctorial Board and Disciplinary Hearings",
    text: `Allegations of student misconduct, harassment, destruction of institute property, or substance possession are adjudicated by the 5-member Institute Proctorial Board chaired by the Chief Proctor. Accused students are provided written notice of charges 48 hours prior to the hearing and may introduce oral testimony or documentary evidence. Legal representation is not permitted; the student may be accompanied by a designated faculty mentor in an advisory role only.`
  },
  {
    id: "chunk-17",
    section: "4.4",
    title: "Campus Motor Vehicle Permits and Parking Regulations",
    text: `Undergraduate hostel residents are strictly prohibited from keeping motorized four-wheel vehicles (cars) on campus grounds. Day scholars and graduate research scholars residing off-campus may register two-wheelers or four-wheelers with Security Operations, receiving an annual RFID parking sticker for Zone C parking lots. Parking in unauthorized service lanes or faculty bays results in vehicle wheel clamping and a ₹750 de-clamping levy.`
  },
  {
    id: "chunk-18",
    section: "5.1",
    title: "Extracurricular Events, Off-Campus Symposiums, and Travel",
    text: `The institute actively encourages student participation in recognized inter-collegiate technical symposiums, hackathons, and national robotics conferences. To be designated on 'Official Academic Duty' (OAD) status, students must obtain a faculty advisor recommendation and submit a travel manifest to the Dean of Student Affairs 14 days in advance. While the institute covers train transit fare for approved delegations, daily subsistence allowances, per diem caps, and specific meal reimbursement policies for traveling students are not governed under this handbook and are determined ad-hoc by student activity trust budgets.`
  },
  {
    id: "chunk-19",
    section: "5.2",
    title: "Student Club Recognition and Treasury Guidelines",
    text: `New student clubs require sponsorship by two permanent faculty members and a founding membership of at least 25 enrolled students. Club treasuries receive an annual operating grant of ₹50,000 from the Student Activity Fund. All club expenditures exceeding ₹5,000 require advance purchase sanction from the Faculty Treasurer and must be supported by GST-compliant invoices submitted within 10 days of the activity.`
  },
  {
    id: "chunk-20",
    section: "5.3",
    title: "Student Health Center and Emergency Services",
    text: `The Campus Health Center provides 24-hour outpatient and emergency stabilization care staffed by resident medical officers and qualified nursing personnel. Emergency ambulance transit to the affiliated University Multispecialty Hospital is provided free of charge for critical medical emergencies occurring on campus. Routine pharmaceuticals listed in the National Essential Medicines list are dispensed without charge to enrolled students upon presentation of their student smart ID card.`
  },
  {
    id: "chunk-21",
    section: "5.4",
    title: "Information Technology Acceptable Use Policy",
    text: `Campus Wi-Fi and computing cluster access are granted for educational and research endeavors. Users must not circumvent network firewalls, run unauthorized packet-sniffing software, download copyrighted torrents, or host public server daemons on campus subnets. Network traffic is monitored continuously by the Computer Center. Severe infractions result in MAC address blacklisting and immediate revocation of institutional single sign-on (SSO) credentials.`
  },
  {
    id: "chunk-22",
    section: "5.5",
    title: "Intellectual Property Rights and Student Inventions",
    text: `Inventions, algorithms, and patentable designs developed by enrolled students utilizing substantial institute resources (defined as specialized laboratory apparatus, university computing clusters, or direct seed grant financing) are jointly held between the student inventor and Apex Institute of Technology under a 60/40 commercialization royalty sharing framework in favor of the student. Pure software projects created on personal machines without institute financing remain 100% student owned.`
  },
  {
    id: "chunk-23",
    section: "6.1",
    title: "Tuition Billing Schedules and Deferred Payment Agreements",
    text: `Semester tuition, hostel rent, and mess advances must be settled in full prior to registration day. Students facing unexpected domestic financial hardship may apply to the Bursar's Office for a structured Deferred Payment Plan, splitting the semester bill into two equal tranches due at week 1 and week 8. Failure to clear installments by the stipulated deadline incurs a late administrative surcharge of ₹250 per week of delay until clearance.`
  },
  {
    id: "chunk-24",
    section: "6.2",
    title: "Merit-cum-Means Scholarships and Tuition Waivers",
    text: `Merit-cum-Means (MCM) scholarships offering 50% to 100% tuition waivers are awarded to undergraduate students whose total parental gross income does not exceed ₹6,00,000 per annum, provided they maintain a cumulative CGPA of 3.20 or above without any pending disciplinary or backlog records. Application calls are published in August annually, requiring submission of certified tax returns and revenue authority income certificates.`
  },
  {
    id: "chunk-25",
    section: "6.3",
    title: "Graduation Clearance and Official Transcript Issuance",
    text: `Final graduating students must secure physical or digital 'No Dues' clearances across 7 statutory departments: Central Library, Hostel Warden, Department Laboratories, Sports Board, NCC/NSS Wing, Accounts Section, and Placement Cell. Official stamped academic transcripts are issued within 15 working days following senate convocation. The first set of 3 certified copies is provided without fee; subsequent duplicate transcripts incur a fee of ₹300 per authenticated copy.`
  }
];

export const PRESET_TESTS = [
  {
    id: "test-1",
    title: "Test 1: Missing Info Trap",
    badge: "Sufficiency Gate Short-Circuit",
    badgeColor: "amber",
    query: "What is the exact daily meal reimbursement allowance and per diem amount for students attending the off-campus robotics symposium?",
    explanation: "Keywords like 'off-campus symposium' and 'robotics' exist in Section 5.1, but the handbook explicitly does NOT state meal allowance rates. Naive RAG will hallucinate a fake rupee amount from other numbers in the doc, whereas Jev Sufficiency Gate blocks generation cleanly with 0 LLM tokens."
  },
  {
    id: "test-2",
    title: "Test 2: False Premise Test",
    badge: "Contradiction Preservation",
    badgeColor: "purple",
    query: "Why does Section 1.3 charge students a ₹500 monetary penalty per day for late assignment submissions?",
    explanation: "The user's question contains a false premise. Section 1.3 explicitly states 'Under no circumstances are monetary fines or cash penalties levied for late coursework submissions' (only a 5% grade deduction). Naive RAG is confused by other ₹500 fines (like library cards) and answers the false premise. Jev detects contradicts_premise >= 0.60, prioritizes the contradiction chunk, and corrects the premise."
  },
  {
    id: "test-3",
    title: "Test 3: Noisy Context Benchmark",
    badge: "75%+ Token Reduction",
    badgeColor: "emerald",
    query: "What are the exact eligibility criteria, minimum CGPA, and approval requirements for an undergraduate student to apply for an off-campus industrial internship during a regular semester?",
    explanation: "A high-precision query buried in dense policy text. Naive RAG fetches 15 chunks (over 2,800 prompt tokens) including unrelated internship/leave chunks. Jev Parallel Filter & Rerank eliminates 12 noise chunks, keeping only the 3 decisive chunks, slashing prompt tokens by ~78% while preserving 100% accuracy."
  }
];
