/**
 * SkillVault Activities Seed Data
 * Smart Education Initiative - Higher Education Department, Govt. of Jammu & Kashmir (SIH25093)
 *
 * Activities store canonical student records, institutional verification states,
 * and minted J&K EduLedger blockchain proof objects.
 */
import { todayISO, addDays } from '../utils/dates';
import { initialActivities as legacyActivities } from './mock';

const today = todayISO();

// Demo student Aarav Sharma's migrated activities
const migratedAaravActivities = legacyActivities.map((act, index) => {
  const isApproved = act.status === 'Approved';
  const isRejected = act.status === 'Rejected';
  const rawHash = act.blockchainHash
    ? act.blockchainHash.replace(/^0x/, '')
    : `7f4c9b21a8d3e9104fa2e17c09d57a22bc194de8f32194a0b5c1928374a5e6${index}d`;

  return {
    id: act.id,
    studentEmail: 'aarav.sharma@nitsri.ac.in',
    studentName: 'Aarav Sharma',
    institution: 'National Institute of Technology, Srinagar',
    title: act.title,
    category: act.category,
    date: act.date,
    formattedDate: act.formattedDate || act.date,
    description: act.description,
    skills: act.skillsAwarded || [],
    skillsAwarded: isApproved ? act.skillsAwarded || [] : [],
    fileName: act.fileName || (act.fileType === 'image' ? 'achievement_proof.png' : 'achievement_proof.pdf'),
    fileType: act.fileType || 'pdf',
    fileUrl: act.fileUrl || null,
    fileHash: rawHash.padStart(64, '0').slice(0, 64),
    status: act.status, // 'Approved' | 'Pending' | 'Rejected'
    submittedAt: act.date || addDays(today, -(20 + index * 5)),
    reviewedBy: isApproved ? act.approver : isRejected ? act.approver : null,
    reviewedAt: isApproved ? act.date || addDays(today, -(18 + index * 5)) : isRejected ? act.date : null,
    rejectionReason: isRejected ? act.rejectionReason || 'Institutional criteria not fulfilled.' : null,
    proof: isApproved
      ? {
          hash: act.blockchainHash || `0x${rawHash.padStart(64, '0')}`,
          timestamp: act.timestamp || `${act.date} · 12:00:00 UTC`,
          blockNumber: act.blockNumber ? parseInt(act.blockNumber.replace(/\D/g, ''), 10) || 1849200 + index : 1849200 + index,
          network: act.network || 'Govt. J&K EduLedger (Proof-of-Authority)'
        }
      : null
  };
});

// 6 Pending submissions from 4 other fake students across J&K HEIs
const additionalPendingSubmissions = [
  {
    id: 'act-p01',
    studentEmail: 'zehra.batool@iitjammu.ac.in',
    studentName: 'Zehra Batool',
    institution: 'Indian Institute of Technology, Jammu',
    title: 'Autonomous Himalayan Drone Navigation & Edge SLAM',
    category: 'Technical',
    date: addDays(today, -4),
    formattedDate: addDays(today, -4),
    description: 'Engineered a low-power edge compute payload on ARM64 with ROS2 and PyTorch for GPS-denied mountain rescue navigation in Pir Panjal range.',
    skills: ['PyTorch', 'Computer Vision', 'System Architecture', 'Edge AI'],
    skillsAwarded: [],
    fileName: 'Himalayan_Drone_SLAM_Research_Report.pdf',
    fileType: 'pdf',
    fileUrl: null,
    fileHash: 'a589cf8b19324d081274bc32890123fe567890abcdef1234567890abcdef1234',
    status: 'Pending',
    submittedAt: addDays(today, -4),
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    proof: null
  },
  {
    id: 'act-p02',
    studentEmail: 'zehra.batool@iitjammu.ac.in',
    studentName: 'Zehra Batool',
    institution: 'Indian Institute of Technology, Jammu',
    title: 'All-India Inter-Collegiate Robotics Conclave Winner',
    category: 'Technical',
    date: addDays(today, -1),
    formattedDate: addDays(today, -1),
    description: 'First runner-up trophy in terrain navigation with custom multi-sensor telemetry mesh and telemetry dashboard.',
    skills: ['IoT', 'Sensor Telemetry', 'High-Pressure Decision Making'],
    skillsAwarded: [],
    fileName: 'Robotics_Conclave_Trophy_Certificate.pdf',
    fileType: 'pdf',
    fileUrl: null,
    fileHash: 'b912384a7c0129384bcdae891234567890abcdef1234567890abcdef567890ab',
    status: 'Pending',
    submittedAt: addDays(today, -1),
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    proof: null
  },
  {
    id: 'act-p03',
    studentEmail: 'tariq.dar@iust.ac.in',
    studentName: 'Tariq Hameed Dar',
    institution: 'Islamic University of Science & Technology, Awantipora',
    title: 'Saffron Yield Prediction Using Micro-Climate Sensors',
    category: 'Research',
    date: addDays(today, -5),
    formattedDate: addDays(today, -5),
    description: 'Authored empirical paper modeling soil humidity and solar irradiance regression curves across Pampore saffron karewas.',
    skills: ['Python', 'Data Modeling', 'Scientific Writing', 'Sensor Telemetry'],
    skillsAwarded: [],
    fileName: 'IUST_Saffron_Climate_Sensor_Study.pdf',
    fileType: 'pdf',
    fileUrl: null,
    fileHash: 'c45678901234567890abcdef1234567890abcdef1234567890abcdef12345678',
    status: 'Pending',
    submittedAt: addDays(today, -5),
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    proof: null
  },
  {
    id: 'act-p04',
    studentEmail: 'tariq.dar@iust.ac.in',
    studentName: 'Tariq Hameed Dar',
    institution: 'Islamic University of Science & Technology, Awantipora',
    title: 'Youth Red Cross First-Responder & Disaster Relief Volunteer',
    category: 'Volunteering',
    date: addDays(today, -2),
    formattedDate: addDays(today, -2),
    description: 'Completed 80 hours of verified field deployment, emergency medical triage, and flood warning exercises along Jhelum river basin.',
    skills: ['Crisis Communication', 'Field Deployment', 'Civic Empathy'],
    skillsAwarded: [],
    fileName: 'Red_Cross_Disaster_Relief_Attestation.pdf',
    fileType: 'pdf',
    fileUrl: null,
    fileHash: 'd8765432109876543210abcdef1234567890abcdef1234567890abcdef432109',
    status: 'Pending',
    submittedAt: addDays(today, -2),
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    proof: null
  },
  {
    id: 'act-p05',
    studentEmail: 'mehak.rashid@uok.edu.in',
    studentName: 'Mehak Rashid',
    institution: 'University of Kashmir, Hazratbal',
    title: 'Kashmir Valley Inter-College Debate Championship Winner',
    category: 'Cultural',
    date: addDays(today, -6),
    formattedDate: addDays(today, -6),
    description: 'Secured First Prize presenting on Digital Sovereignty and Tamper-Proof Academic Ledgers at Sir Syed Hall.',
    skills: ['Public Speaking', 'Team Leadership'],
    skillsAwarded: [],
    fileName: 'UoK_InterCollege_Debate_Gold.pdf',
    fileType: 'pdf',
    fileUrl: null,
    fileHash: 'e1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Pending',
    submittedAt: addDays(today, -6),
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    proof: null
  },
  {
    id: 'act-p06',
    studentEmail: 'sahil.sharma@smvdu.ac.in',
    studentName: 'Sahil Sharma',
    institution: 'Shri Mata Vaishno Devi University, Katra',
    title: 'North-Zone Inter-University Basketball Tournament Captain',
    category: 'Sports',
    date: addDays(today, -3),
    formattedDate: addDays(today, -3),
    description: 'Captained the university varsity squad to the quarterfinals in Chandigarh, demonstrating tactical game leadership and physical endurance.',
    skills: ['Physical Endurance', 'Team Leadership', 'Discipline', 'Agility'],
    skillsAwarded: [],
    fileName: 'SMVDU_Varsity_Basketball_Captaincy.pdf',
    fileType: 'pdf',
    fileUrl: null,
    fileHash: 'f9876543210abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'Pending',
    submittedAt: addDays(today, -3),
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    proof: null
  }
];

export const initialActivities = [
  ...migratedAaravActivities,
  ...additionalPendingSubmissions
];
