/**
 * SkillVault Mock Data
 * Smart Education Initiative - Govt. of Jammu & Kashmir (SIH25093)
 * Centralised student achievement, verification & career intelligence repository
 */

export const mockStudent = {
  id: "STU-2025-0142",
  name: "Aarav Sharma",
  avatarUrl: null,
  email: "aarav.sharma@nitsri.ac.in",
  enrollmentNo: "2022BCSE042",
  institution: "National Institute of Technology, Srinagar",
  department: "Computer Science & Engineering",
  degree: "B.Tech (Honours)",
  batch: "2022 - 2026",
  currentSemester: "7th Semester",
  verifiedScore: 94, // Out of 100
  portfolioUrl: "https://skillvault.app/verify/STU-2025-0142",
  accreditationSummary: {
    naacCriterionPoints: "Criterion 5 (Student Support & Progression): 38.5 / 40",
    nirfMetricCredit: "Metric 4.2.3 Technical & Extra-Curricular Weightage: Max Tier"
  }
};

export const initialActivities = [
  {
    id: "act-01",
    title: "1st Place Winner - Smart India Hackathon 2024",
    category: "Technical",
    date: "2024-12-18",
    formattedDate: "18 Dec 2024",
    status: "Approved",
    approver: "Dr. Farooq Ahmad (Dean of Academic Affairs)",
    approverRole: "Dean Academics, NIT Srinagar",
    blockchainHash: "0x7f4c9b21a8d3e9104fa2e17c09d57a22bc194de8f32194a0b5c1928374a5e6d1",
    blockNumber: "Block #1,849,204",
    timestamp: "2024-12-19 · 14:32:10 UTC",
    network: "Govt. J&K EduLedger (Proof-of-Authority)",
    description: "Led a 6-member interdisciplinary engineering team to architect an edge-AI cold-storage monitoring mesh network for apple orchard logistics across Baramulla & Shopian.",
    proofType: "Certificate of Excellence & Project Appraisal",
    issuer: "Ministry of Education Innovation Cell (MIC) & AICTE",
    fileUrl: null,
    fileType: "pdf",
    fileName: "SIH2024_National_Winner_Certificate.pdf",
    skillsAwarded: ["Edge AI", "System Architecture", "Team Leadership", "IoT"]
  },
  {
    id: "act-02",
    title: "Gold Medalist - Inter-University Badminton Championship",
    category: "Sports",
    date: "2024-10-12",
    formattedDate: "12 Oct 2024",
    status: "Approved",
    approver: "Coach Tariq Mir (Director of Physical Education)",
    approverRole: "Director Physical Education, J&K University Sports Board",
    blockchainHash: "0x9f3a8b0c21b456e7d890123456789abcdef01234948192a019482bca819283fe",
    blockNumber: "Block #1,790,412",
    timestamp: "2024-10-14 · 11:45:00 UTC",
    network: "Govt. J&K EduLedger (Proof-of-Authority)",
    description: "Clinched Gold in Men's Singles category representing the university contingent against 14 state-level universities in Jammu.",
    proofType: "Official Sports Citation & Medal Certificate",
    issuer: "J&K Higher Education Sports Council",
    fileUrl: null,
    fileType: "pdf",
    fileName: "InterUniversity_Badminton_Gold_Medal.pdf",
    skillsAwarded: ["High-Pressure Decision Making", "Discipline", "Physical Endurance"]
  },
  {
    id: "act-03",
    title: "Research Paper: Edge AI for Glacial Lake Outburst Early Warning",
    category: "Research",
    date: "2024-08-28",
    formattedDate: "28 Aug 2024",
    status: "Approved",
    approver: "Dr. K. S. Manhas (Head of Dept, CSE)",
    approverRole: "Professor & HOD, Computer Science",
    blockchainHash: "0x5e2b8319f0a2d3c4b5e67890123456789abcdef049182390a1829bc128392019",
    blockNumber: "Block #1,723,109",
    timestamp: "2024-09-02 · 16:20:45 UTC",
    network: "Govt. J&K EduLedger (Proof-of-Authority)",
    description: "Published in IEEE Himalayan Computing Symposium. Developed a low-power solar acoustic radar telemetry unit for early flash flood mitigation in high altitude glacial lakes.",
    proofType: "IEEE Conference Acceptance & DOI Record #10.1109/HCS.2024.1029",
    issuer: "IEEE Computer Society & Department of Science & Technology",
    fileUrl: null,
    fileType: "pdf",
    fileName: "IEEE_GLOF_Early_Warning_Paper.pdf",
    skillsAwarded: ["Sensor Telemetry", "Scientific Writing", "Edge ML", "Data Modeling"]
  },
  {
    id: "act-04",
    title: "Summer AI/ML Research Internship at IIT Jammu",
    category: "Internship",
    date: "2024-07-15",
    formattedDate: "15 Jul 2024",
    status: "Approved",
    approver: "Prof. Rajesh Verma (Supervisor, Remote Sensing Lab)",
    approverRole: "Senior Scientist & Visiting Faculty",
    blockchainHash: "0x12dc8f47a9b0c1d2e3f4567890abcdef12345678391820491209384710293847",
    blockNumber: "Block #1,689,240",
    timestamp: "2024-07-20 · 10:00:15 UTC",
    network: "Govt. J&K EduLedger (Proof-of-Authority)",
    description: "Evaluated deep convolutional U-Nets on hyperspectral satellite imagery to generate automated soil vulnerability and landslide heatmaps along NH-44 corridor.",
    proofType: "Formal Internship Letter & Evaluation Scorecard (Grade: O / Outstanding)",
    issuer: "Indian Institute of Technology (IIT) Jammu",
    fileUrl: null,
    fileType: "pdf",
    fileName: "IIT_Jammu_Research_Internship_Appraisal.pdf",
    skillsAwarded: ["PyTorch", "Computer Vision", "Satellite Data Processing", "Docker"]
  },
  {
    id: "act-05",
    title: "Lead Convener - TechVeda State Technical Symposium",
    category: "Cultural",
    date: "2024-05-18",
    formattedDate: "18 May 2024",
    status: "Approved",
    approver: "Prof. Sunita Raina (Faculty Advisor, Student Affairs)",
    approverRole: "Associate Dean, Student Welfare",
    blockchainHash: "0x3a8d11c79ef54e201bfa8294cd9039ff02e4821a481920391203948192039182",
    blockNumber: "Block #1,610,488",
    timestamp: "2024-05-21 · 09:12:00 UTC",
    network: "Govt. J&K EduLedger (Proof-of-Authority)",
    description: "Orchestrated the annual state-level technical symposium hosting 1,200+ delegates across 18 colleges, managing a budget of ₹8.4 Lakhs and corporate sponsors.",
    proofType: "Institutional Leadership Commendation",
    issuer: "NIT Srinagar Student Activity Council",
    fileUrl: null,
    fileType: "pdf",
    fileName: "TechVeda_Lead_Organizer_Citation.pdf",
    skillsAwarded: ["Budget Management", "Vendor Coordination", "Public Speaking"]
  },
  {
    id: "act-06",
    title: "Community Telemedicine & Digital Healthcare Camp Volunteer",
    category: "Volunteering",
    date: "2024-04-10",
    formattedDate: "10 Apr 2024",
    status: "Approved",
    approver: "Dr. Naseer Ahmed (NSS Program Coordinator)",
    approverRole: "University NSS Officer",
    blockchainHash: "0x88f01a23c4d5e67890abcdef1234567890abcdef391029384019283019283019",
    blockNumber: "Block #1,570,301",
    timestamp: "2024-04-15 · 13:40:22 UTC",
    network: "Govt. J&K EduLedger (Proof-of-Authority)",
    description: "Setup mobile broadband satellite terminals and guided 320+ elder patients with electronic health records registration across rural Budgam district.",
    proofType: "NSS Certificate of Dedicated Community Service",
    issuer: "National Service Scheme (NSS), Unit 3",
    fileUrl: null,
    fileType: "pdf",
    fileName: "NSS_Community_Digital_Health_Certificate.pdf",
    skillsAwarded: ["Civic Empathy", "Field Deployment", "Crisis Communication"]
  },
  {
    id: "act-07",
    title: "Advanced Cloud Native Kubernetes & Microservices Architecture",
    category: "Technical",
    date: "2025-01-14",
    formattedDate: "14 Jan 2025",
    status: "Pending",
    approver: "Pending Faculty Verification (Dr. K. S. Manhas)",
    approverRole: "Department Verification Committee",
    description: "60-hour intensive hands-on credential covering Helm chart deployments, ingress controllers, CI/CD automated test pipelines, and distributed observability.",
    proofType: "Certified Kubernetes Associate (CKA) Verification Link",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    fileUrl: null,
    fileType: "pdf",
    fileName: "CNCF_CKA_Scorecard.pdf",
    skillsAwarded: ["Kubernetes", "DevOps", "Microservices"]
  },
  {
    id: "act-08",
    title: "Regional Table Tennis Doubles Silver Trophy",
    category: "Sports",
    date: "2025-01-05",
    formattedDate: "05 Jan 2025",
    status: "Pending",
    approver: "Pending Physical Education Review",
    approverRole: "Sports Verification Cell",
    description: "Runner-up in Men's Doubles category at the Kashmir Inter-District Indoor Sports Tournament 2025.",
    proofType: "District Youth Services & Sports Certificate",
    issuer: "District Youth Services & Sports Office, Srinagar",
    fileUrl: null,
    fileType: "pdf",
    fileName: "Regional_Table_Tennis_Silver.pdf",
    skillsAwarded: ["Teamwork", "Agility"]
  },
  {
    id: "act-09",
    title: "Lead Instructor - Rural CodeCamp for High School Girls",
    category: "Volunteering",
    date: "2025-01-20",
    formattedDate: "20 Jan 2025",
    status: "Pending",
    approver: "Pending NSS Review (Dr. Naseer Ahmed)",
    approverRole: "Social Welfare Verification Wing",
    description: "Conducted a 4-week hybrid coding workshop introducing HTML, CSS and Python computational thinking to 45 female students in Ganderbal district.",
    proofType: "Principal Endorsement & Logbook",
    issuer: "J&K Smart Education Initiative / Govt Higher Secondary School",
    fileUrl: null,
    fileType: "pdf",
    fileName: "CodeCamp_Ganderbal_Principal_Signed.pdf",
    skillsAwarded: ["Mentorship", "Curriculum Design", "Inclusion"]
  },
  {
    id: "act-10",
    title: "Introductory Web3 Tokenomics & Trading Workshop",
    category: "Technical",
    date: "2024-03-12",
    formattedDate: "12 Mar 2024",
    status: "Rejected",
    approver: "Dr. Farooq Ahmad (Dean Academics)",
    approverRole: "Dean of Academic Affairs",
    rejectionReason: "Certificate issuer lacks institutional recognition under AICTE/HEI accreditation norms. Non-standardized evaluation criteria.",
    description: "Self-paced 3-day online workshop on crypto liquidity pools and tokenomics.",
    proofType: "Unverified Online Badge",
    issuer: "Decentralized Guild Network",
    fileUrl: null,
    fileType: "pdf",
    fileName: "Decentralized_Badge_Tokenomics.png",
    skillsAwarded: []
  }
];

export const skillRadarDatasets = {
  "Full-Stack Developer": {
    radarData: [
      { subject: "System Design", student: 88, industry: 90, fullMark: 100 },
      { subject: "React & Frontend", student: 94, industry: 85, fullMark: 100 },
      { subject: "Node / APIs", student: 85, industry: 85, fullMark: 100 },
      { subject: "Database & ORM", student: 72, industry: 88, fullMark: 100 },
      { subject: "DevOps / CI/CD", student: 65, industry: 82, fullMark: 100 },
      { subject: "Testing & Security", student: 60, industry: 80, fullMark: 100 }
    ],
    roleMatchScore: 84,
    gaps: [
      {
        skill: "DevOps & Container Orchestration",
        currentLevel: 65,
        targetLevel: 82,
        delta: "-17%",
        recommendation: "Deploy a production-grade Kubernetes cluster with Prometheus observability to close the gap.",
        badge: "High Priority"
      },
      {
        skill: "Distributed SQL & Query Tuning",
        currentLevel: 72,
        targetLevel: 88,
        delta: "-16%",
        recommendation: "Take the PostgreSQL indexing & replication micro-credential or contribute to the university database portal.",
        badge: "Medium Priority"
      },
      {
        skill: "Automated End-to-End Testing & OWASP",
        currentLevel: 60,
        targetLevel: 80,
        delta: "-20%",
        recommendation: "Implement Cypress / Playwright test suites with OAuth2 security audits on your capstone repo.",
        badge: "Recommended"
      }
    ]
  },
  "Data Analyst": {
    radarData: [
      { subject: "SQL & Wrangling", student: 90, industry: 92, fullMark: 100 },
      { subject: "Python / Pandas", student: 86, industry: 85, fullMark: 100 },
      { subject: "BI Tools (PowerBI)", student: 68, industry: 88, fullMark: 100 },
      { subject: "Statistical Modeling", student: 75, industry: 80, fullMark: 100 },
      { subject: "Data Storytelling", student: 82, industry: 85, fullMark: 100 },
      { subject: "ETL Pipelines", student: 62, industry: 78, fullMark: 100 }
    ],
    roleMatchScore: 78,
    gaps: [
      {
        skill: "Enterprise BI Dashboards (PowerBI / Tableau)",
        currentLevel: 68,
        targetLevel: 88,
        delta: "-20%",
        recommendation: "Build a state healthcare telemetry dashboard using PowerBI connected to live public health APIs.",
        badge: "High Priority"
      },
      {
        skill: "ETL / Airflow Workflow Orchestration",
        currentLevel: 62,
        targetLevel: 78,
        delta: "-16%",
        recommendation: "Automate daily data ingestion pipelines using Apache Airflow and dbt.",
        badge: "Medium Priority"
      }
    ]
  },
  "ML Engineer": {
    radarData: [
      { subject: "Deep Learning", student: 88, industry: 85, fullMark: 100 },
      { subject: "PyTorch & Math", student: 90, industry: 88, fullMark: 100 },
      { subject: "MLOps & MLflow", student: 58, industry: 84, fullMark: 100 },
      { subject: "Model Optimization", student: 64, industry: 80, fullMark: 100 },
      { subject: "Feature Stores", student: 52, industry: 76, fullMark: 100 },
      { subject: "Data Pipelines", student: 74, industry: 82, fullMark: 100 }
    ],
    roleMatchScore: 72,
    gaps: [
      {
        skill: "MLOps & CI/CD for Machine Learning",
        currentLevel: 58,
        targetLevel: 84,
        delta: "-26%",
        recommendation: "Setup MLflow tracking and automated model packaging on AWS SageMaker / Hugging Face Spaces.",
        badge: "Critical Gap"
      },
      {
        skill: "Quantization & Edge Inference (ONNX/TensorRT)",
        currentLevel: 64,
        targetLevel: 80,
        delta: "-16%",
        recommendation: "Benchmark 4-bit INT quantization on ARM64 Raspberry Pi boards for your GLOF research model.",
        badge: "High Priority"
      }
    ]
  }
};

export const careerRecommendations = [
  {
    role: "Full-Stack Cloud Engineer",
    companyCategory: "Govt. Digital Mission & Tech Enterprises",
    match: 91,
    avgPackage: "₹14 - 22 LPA",
    growthIndex: "+34% YoY Demand",
    topSkillsMatched: ["System Architecture", "React", "Node.js", "Edge Computing"],
    openingsInRegion: "18+ J&K & National Vacancies"
  },
  {
    role: "AI / Edge Systems Engineer",
    companyCategory: "Research Labs & DeepTech Startups",
    match: 86,
    avgPackage: "₹16 - 26 LPA",
    growthIndex: "+48% YoY Demand",
    topSkillsMatched: ["PyTorch", "Sensor Telemetry", "Computer Vision", "Docker"],
    openingsInRegion: "12+ National Research Openings"
  },
  {
    role: "Digital Solutions Consultant",
    companyCategory: "Public Policy & EdTech Advisory",
    match: 82,
    avgPackage: "₹12 - 18 LPA",
    growthIndex: "+28% YoY Demand",
    topSkillsMatched: ["Team Leadership", "Budgeting", "Field Deployment", "Public Speaking"],
    openingsInRegion: "24+ Accreditation / Govt Programs"
  }
];

export const verificationSteps = [
  {
    step: "01",
    title: "Faculty Approval",
    description: "Student submits certificates with metadata; assigned departmental faculty or sports director reviews authenticity and approves."
  },
  {
    step: "02",
    title: "SHA-256 Hash Minted",
    description: "The digital proof is cryptographically hashed, signed by the institution's key, and recorded on the immutable J&K EduLedger."
  },
  {
    step: "03",
    title: "Recruiter Instant Scan",
    description: "Recruiters and NAAC audit teams scan the verified QR code or portfolio link to instantly inspect tamper-proof on-chain proofs."
  }
];
