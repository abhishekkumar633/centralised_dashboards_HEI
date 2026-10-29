/**
 * SkillVault Jobs & Applications Mock Data
 * Smart Education Initiative - Govt. of Jammu & Kashmir (SIH25093)
 *
 * Skill vocabulary aligns with student approved activities in src/data/mock.js
 */
import { todayISO, addDays } from '../utils/dates';

const today = todayISO();

export const SKILL_VOCABULARY = [
  // Technical & Edge
  "Edge AI",
  "Edge ML",
  "System Architecture",
  "Sensor Telemetry",
  "IoT",
  "PyTorch",
  "Computer Vision",
  "Satellite Data Processing",
  "Docker",
  "Kubernetes",
  "DevOps",
  "Microservices",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "Deep Learning",
  "Data Modeling",
  "Scientific Writing",
  "REST APIs",
  "Git",
  "TypeScript",
  // Leadership & Field Operations
  "Team Leadership",
  "Field Deployment",
  "Budget Management",
  "Vendor Coordination",
  "Public Speaking",
  "Civic Empathy",
  "Crisis Communication",
  // Sports & High-Pressure
  "High-Pressure Decision Making",
  "Discipline",
  "Physical Endurance",
  "Agility"
];

export const initialJobs = [
  {
    id: "job-01",
    title: "Edge AI & Embedded Systems Engineer",
    company: "Apex Systems & AI Labs",
    location: "Srinagar (Rangreth Tech Park)",
    type: "Full-time",
    mode: "Hybrid",
    stipendOrSalary: "₹14 - 18 LPA",
    description: "Architect and deploy edge neural network inference pipelines on low-power ARM64 nodes. You will interface directly with sensor telemetry meshes across high-altitude orchard corridors and collaborate with field teams.",
    requiredSkills: ["Edge AI", "PyTorch", "System Architecture", "Sensor Telemetry"],
    preferredSkills: ["Docker", "IoT", "Field Deployment"],
    minVerifiedActivities: 3,
    deadline: addDays(today, 45),
    postedBy: "tanya.roy@apexsystems.io",
    postedAt: addDays(today, -5),
    status: "Open"
  },
  {
    id: "job-02",
    title: "Computer Vision Research Intern",
    company: "Himalayan GeoSpatial AI",
    location: "Remote",
    type: "Internship",
    mode: "Remote",
    stipendOrSalary: "₹45,000 / month",
    description: "Investigate multispectral and SAR satellite imagery using deep convolutional U-Nets for glacial lake outburst flood (GLOF) mitigation and real-time landslide monitoring.",
    requiredSkills: ["Computer Vision", "PyTorch", "Data Modeling"],
    preferredSkills: ["Satellite Data Processing", "Scientific Writing", "Docker"],
    minVerifiedActivities: 2,
    deadline: addDays(today, 30),
    postedBy: "tanya.roy@apexsystems.io",
    postedAt: addDays(today, -4),
    status: "Open"
  },
  {
    id: "job-03",
    title: "Smart City IoT Systems Engineer",
    company: "J&K Urban Development Technology Cell",
    location: "Srinagar",
    type: "Full-time",
    mode: "On-site",
    stipendOrSalary: "₹9.5 - 13 LPA",
    description: "Install, commission, and maintain smart water metering, environmental air quality arrays, and LoRaWAN gateway telemetry across municipal zones in Srinagar and Jammu.",
    requiredSkills: ["IoT", "Sensor Telemetry", "Field Deployment"],
    preferredSkills: ["Team Leadership", "Budget Management", "Edge AI"],
    minVerifiedActivities: 2,
    deadline: addDays(today, 60),
    postedBy: "tanya.roy@apexsystems.io",
    postedAt: addDays(today, -8),
    status: "Open"
  },
  {
    id: "job-04",
    title: "Cloud Infrastructure & DevOps Associate",
    company: "CloudMatrix Technologies",
    location: "Bengaluru",
    type: "Full-time",
    mode: "Hybrid",
    stipendOrSalary: "₹16 - 22 LPA",
    description: "Maintain multi-region Kubernetes clusters, automated GitOps deployment pipelines, and distributed observability stacks using Prometheus and Grafana.",
    requiredSkills: ["Docker", "Kubernetes", "DevOps", "Microservices"],
    preferredSkills: ["System Architecture", "Python", "SQL"],
    minVerifiedActivities: 1,
    deadline: addDays(today, 25),
    postedBy: "recruiter@cloudmatrix.io",
    postedAt: addDays(today, -3),
    status: "Open"
  },
  {
    id: "job-05",
    title: "Full-Stack Platform Engineering Intern",
    company: "NexVeda Digital Labs",
    location: "Delhi NCR",
    type: "Internship",
    mode: "Hybrid",
    stipendOrSalary: "₹35,000 / month",
    description: "Develop responsive React frontends, high-throughput REST APIs, and microservice authentications for government educational credential verifications.",
    requiredSkills: ["System Architecture", "React", "Node.js"],
    preferredSkills: ["Docker", "Team Leadership", "SQL"],
    minVerifiedActivities: 1,
    deadline: addDays(today, 18),
    postedBy: "hr@nexveda.com",
    postedAt: addDays(today, -6),
    status: "Open"
  },
  {
    id: "job-06",
    title: "Applied AI Solutions Fellow",
    company: "Frontier AI Institute",
    location: "Remote",
    type: "Full-time",
    mode: "Remote",
    stipendOrSalary: "₹18 - 24 LPA",
    description: "Deploy quantized vision models onto constrained edge microcontrollers and acoustic sensors. Lead technical publications and open-source benchmark suites.",
    requiredSkills: ["PyTorch", "Edge AI", "Edge ML", "Computer Vision"],
    preferredSkills: ["Data Modeling", "Scientific Writing", "System Architecture"],
    minVerifiedActivities: 3,
    deadline: addDays(today, 75),
    postedBy: "fellowships@frontierai.org",
    postedAt: addDays(today, -2),
    status: "Open"
  },
  {
    id: "job-07",
    title: "Athletic Performance & Data Specialist",
    company: "Kashmir High Performance Sports Academy",
    location: "Srinagar",
    type: "Part-time",
    mode: "On-site",
    stipendOrSalary: "₹25,000 / month",
    description: "Monitor varsity athletes using wearable biometric sensors and telemetry arrays. Guide decision-making under high competitive pressure.",
    requiredSkills: ["Sensor Telemetry", "High-Pressure Decision Making", "Physical Endurance"],
    preferredSkills: ["Discipline", "Data Modeling", "Budget Management"],
    minVerifiedActivities: 1,
    deadline: addDays(today, 35),
    postedBy: "sports.tech@khpsa.org",
    postedAt: addDays(today, -7),
    status: "Closed"
  },
  {
    id: "job-08",
    title: "Junior Machine Learning Researcher",
    company: "Valley Innovation Hub",
    location: "Srinagar",
    type: "Internship",
    mode: "On-site",
    stipendOrSalary: "₹30,000 / month",
    description: "Classify high-altitude botanical diseases with convolutional neural networks and camera traps. Prior cycle position now archived.",
    requiredSkills: ["Edge AI", "Computer Vision"],
    preferredSkills: ["PyTorch", "Scientific Writing"],
    minVerifiedActivities: 1,
    deadline: addDays(today, -10),
    postedBy: "tanya.roy@apexsystems.io",
    postedAt: addDays(today, -20),
    status: "Open"
  }
];

export const initialApplications = [
  {
    id: "app-01",
    jobId: "job-01",
    studentEmail: "aarav.sharma@nitsri.ac.in",
    studentName: "Aarav Sharma",
    appliedAt: addDays(today, -5),
    status: "Shortlisted",
    matchScore: 100
  },
  {
    id: "app-02",
    jobId: "job-02",
    studentEmail: "aarav.sharma@nitsri.ac.in",
    studentName: "Aarav Sharma",
    appliedAt: addDays(today, -3),
    status: "Applied",
    matchScore: 90
  },
  {
    id: "app-03",
    jobId: "job-01",
    studentEmail: "zahoor.rather@iitj.ac.in",
    studentName: "Zahoor Rather",
    appliedAt: addDays(today, -4),
    status: "Interviewing",
    matchScore: 82
  },
  {
    id: "app-04",
    jobId: "job-01",
    studentEmail: "mehak.jan@smvdu.ac.in",
    studentName: "Mehak Jan",
    appliedAt: addDays(today, -2),
    status: "Applied",
    matchScore: 58
  },
  {
    id: "app-05",
    jobId: "job-03",
    studentEmail: "mehak.jan@smvdu.ac.in",
    studentName: "Mehak Jan",
    appliedAt: addDays(today, -6),
    status: "Shortlisted",
    matchScore: 92
  }
];

export const mockApplicantPool = {
  "aarav.sharma@nitsri.ac.in": {
    name: "Aarav Sharma",
    email: "aarav.sharma@nitsri.ac.in",
    institution: "National Institute of Technology, Srinagar",
    verifiedScore: 94,
    degree: "B.Tech CSE (7th Sem)",
    verifiedSkills: [
      "Edge AI",
      "System Architecture",
      "Team Leadership",
      "IoT",
      "High-Pressure Decision Making",
      "Discipline",
      "Physical Endurance",
      "Sensor Telemetry",
      "Scientific Writing",
      "Edge ML",
      "Data Modeling",
      "PyTorch",
      "Computer Vision",
      "Satellite Data Processing",
      "Docker",
      "Budget Management",
      "Vendor Coordination",
      "Public Speaking",
      "Civic Empathy",
      "Field Deployment",
      "Crisis Communication"
    ],
    approvedActivities: [
      {
        id: "act-01",
        title: "1st Place Winner - Smart India Hackathon 2024",
        category: "Technical",
        formattedDate: "18 Dec 2024",
        blockchainHash: "0x7f4c9b21a8d3e9104fa2e17c09d57a22bc194de8f32194a0b5c1928374a5e6d1",
        skillsAwarded: ["Edge AI", "System Architecture", "Team Leadership", "IoT"]
      },
      {
        id: "act-02",
        title: "Gold Medalist - Inter-University Badminton Championship",
        category: "Sports",
        formattedDate: "12 Oct 2024",
        blockchainHash: "0x9f3a8b0c21b456e7d890123456789abcdef01234948192a019482bca819283fe",
        skillsAwarded: ["High-Pressure Decision Making", "Discipline", "Physical Endurance"]
      },
      {
        id: "act-03",
        title: "Research Paper: Edge AI for Glacial Lake Outburst Early Warning",
        category: "Research",
        formattedDate: "28 Aug 2024",
        blockchainHash: "0x5e2b8319f0a2d3c4b5e67890123456789abcdef049182390a1829bc128392019",
        skillsAwarded: ["Sensor Telemetry", "Scientific Writing", "Edge ML", "Data Modeling"]
      },
      {
        id: "act-04",
        title: "Summer AI/ML Research Internship at IIT Jammu",
        category: "Internship",
        formattedDate: "15 Jul 2024",
        blockchainHash: "0x12dc8f47a9b0c1d2e3f4567890abcdef12345678391820491209384710293847",
        skillsAwarded: ["PyTorch", "Computer Vision", "Satellite Data Processing", "Docker"]
      },
      {
        id: "act-05",
        title: "Lead Convener - TechVeda State Technical Symposium",
        category: "Cultural",
        formattedDate: "18 May 2024",
        blockchainHash: "0x3a8d11c79ef54e201bfa8294cd9039ff02e4821a481920391203948192039182",
        skillsAwarded: ["Budget Management", "Vendor Coordination", "Public Speaking"]
      },
      {
        id: "act-06",
        title: "Community Telemedicine & Digital Healthcare Camp Volunteer",
        category: "Volunteering",
        formattedDate: "10 Apr 2024",
        blockchainHash: "0x88f01a23c4d5e67890abcdef1234567890abcdef391029384019283019283019",
        skillsAwarded: ["Civic Empathy", "Field Deployment", "Crisis Communication"]
      }
    ]
  },
  "zahoor.rather@iitj.ac.in": {
    name: "Zahoor Rather",
    email: "zahoor.rather@iitj.ac.in",
    institution: "Indian Institute of Technology, Jammu",
    verifiedScore: 91,
    degree: "B.Tech CSE (6th Sem)",
    verifiedSkills: ["PyTorch", "Computer Vision", "Deep Learning", "Docker", "Python", "System Architecture"],
    approvedActivities: [
      {
        id: "zh-act-1",
        title: "Autonomous Drone Navigation for Avalanche Rescue",
        category: "Research",
        formattedDate: "15 Nov 2024",
        blockchainHash: "0x8b4c91a029384fe10293847102938471029384710293847102938471e12d90a1",
        skillsAwarded: ["Computer Vision", "PyTorch", "Deep Learning"]
      },
      {
        id: "zh-act-2",
        title: "Docker Microservices for Alpine Sensor Grid",
        category: "Technical",
        formattedDate: "02 Oct 2024",
        blockchainHash: "0x3f1a29b049182049120938471029384710293847102938471029384794c03819",
        skillsAwarded: ["Docker", "System Architecture", "Python"]
      }
    ]
  },
  "mehak.jan@smvdu.ac.in": {
    name: "Mehak Jan",
    email: "mehak.jan@smvdu.ac.in",
    institution: "SMVD University, Katra",
    verifiedScore: 88,
    degree: "B.Tech ECE (7th Sem)",
    verifiedSkills: ["IoT", "Sensor Telemetry", "Field Deployment", "Team Leadership", "Civic Empathy"],
    approvedActivities: [
      {
        id: "mj-act-1",
        title: "Smart Micro-Hydro Telemetry Monitoring Network",
        category: "Technical",
        formattedDate: "20 Dec 2024",
        blockchainHash: "0x1c89f2a01928374650192837465019283746501928374650192837468831b9e0",
        skillsAwarded: ["IoT", "Sensor Telemetry", "Field Deployment"]
      },
      {
        id: "mj-act-2",
        title: "Katra Solar Irrigation Community Deployment",
        category: "Volunteering",
        formattedDate: "05 Nov 2024",
        blockchainHash: "0x77c91a8239019284710293847102938471029384710293847102938471029384",
        skillsAwarded: ["Team Leadership", "Civic Empathy"]
      }
    ]
  },
  "irfan.lone@nitsri.ac.in": {
    name: "Irfan Lone",
    email: "irfan.lone@nitsri.ac.in",
    institution: "National Institute of Technology, Srinagar",
    verifiedScore: 85,
    degree: "B.Tech Mechanical (8th Sem)",
    verifiedSkills: ["High-Pressure Decision Making", "Physical Endurance", "Discipline", "Budget Management"],
    approvedActivities: [
      {
        id: "il-act-1",
        title: "National Mountaineering & Winter Expedition Leader",
        category: "Sports",
        formattedDate: "10 Jan 2025",
        blockchainHash: "0x49da1029384710293847102938471029384710293847102938471029bc338812",
        skillsAwarded: ["High-Pressure Decision Making", "Physical Endurance", "Discipline"]
      }
    ]
  }
};
