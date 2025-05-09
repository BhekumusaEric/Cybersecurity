import { sequelize } from '../config/database.js';
import {
  User,
  Course,
  Module,
  Lab,
  Assessment,
  UserCourse,
  LabSubmission,
  AssessmentAttempt
} from '../models/index.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';

// Sample data for database initialization
const sampleData = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Instructor User',
      email: 'instructor@example.com',
      password: 'instructor123',
      role: 'instructor'
    },
    {
      name: 'Student User',
      email: 'student@example.com',
      password: 'student123',
      role: 'student'
    }
  ],
  courses: [
    {
      title: 'Ethical Hacking Fundamentals',
      description: 'Learn the fundamentals of ethical hacking, including methodology, legal considerations, and basic techniques.',
      thumbnail: 'https://via.placeholder.com/800x400?text=Ethical+Hacking+Fundamentals',
      duration: 12,
      level: 'beginner',
      prerequisites: ['Basic networking knowledge', 'Linux fundamentals', 'Command line experience'],
      learningOutcomes: [
        'Understand ethical hacking principles and methodology',
        'Perform reconnaissance and scanning',
        'Identify common vulnerabilities',
        'Execute basic exploits safely',
        'Document findings professionally'
      ],
      tags: ['Fundamentals', 'Ethics', 'Methodology'],
      isPublished: true,
      publishedAt: new Date()
    },
    {
      title: 'Advanced Penetration Testing',
      description: 'Master advanced penetration testing techniques for real-world security assessments.',
      thumbnail: 'https://via.placeholder.com/800x400?text=Advanced+Penetration+Testing',
      duration: 10,
      level: 'advanced',
      prerequisites: ['Ethical Hacking Fundamentals', 'Network security knowledge', 'Basic scripting skills'],
      learningOutcomes: [
        'Conduct comprehensive penetration tests',
        'Exploit advanced vulnerabilities',
        'Perform post-exploitation techniques',
        'Bypass security controls',
        'Create detailed penetration testing reports'
      ],
      tags: ['Advanced', 'Exploitation', 'Post-Exploitation'],
      isPublished: true,
      publishedAt: new Date()
    }
  ],
  modules: [
    {
      title: 'Introduction to Ethical Hacking',
      description: 'Learn the fundamentals of ethical hacking, including legal and ethical considerations.',
      order: 1,
      duration: 60,
      content: 'This is the content for the Introduction to Ethical Hacking module.',
      isPublished: true,
      publishedAt: new Date(),
      courseId: 1
    },
    {
      title: 'Reconnaissance and Footprinting',
      description: 'Master techniques for gathering information about target systems and networks.',
      order: 2,
      duration: 90,
      content: 'This is the content for the Reconnaissance and Footprinting module.',
      isPublished: true,
      publishedAt: new Date(),
      courseId: 1
    },
    {
      title: 'Scanning Networks',
      description: 'Learn how to scan networks to identify hosts, ports, and services.',
      order: 3,
      duration: 120,
      content: 'This is the content for the Scanning Networks module.',
      isPublished: true,
      publishedAt: new Date(),
      courseId: 1
    }
  ],
  labs: [
    {
      title: 'Network Scanning with Nmap',
      description: 'Learn how to perform comprehensive network scanning using Nmap.',
      instructions: 'This is the instructions for the Network Scanning with Nmap lab.',
      difficulty: 'beginner',
      estimatedTime: 60,
      environmentType: 'browser',
      environmentConfig: {
        template: 'network_scanning'
      },
      tools: ['Nmap', 'Wireshark'],
      isPublished: true,
      publishedAt: new Date(),
      moduleId: 3
    }
  ],
  assessments: [
    {
      title: 'Ethical Hacking Fundamentals Quiz',
      description: 'Test your knowledge of ethical hacking fundamentals.',
      type: 'quiz',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      questions: [
        {
          question: 'What is the primary goal of ethical hacking?',
          options: [
            'To exploit vulnerabilities for personal gain',
            'To identify and fix security vulnerabilities before malicious hackers can exploit them',
            'To break into systems without permission',
            'To develop new hacking tools'
          ],
          correctAnswer: 1
        },
        {
          question: 'Which of the following is NOT a phase in the ethical hacking methodology?',
          options: [
            'Reconnaissance',
            'Scanning',
            'Exploitation',
            'Celebration'
          ],
          correctAnswer: 3
        }
      ],
      isPublished: true,
      publishedAt: new Date(),
      moduleId: 1
    }
  ]
};

// Initialize database
const initDb = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    logger.info('Database synchronized');

    // Create users
    const users = await Promise.all(
      sampleData.users.map(async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        return User.create({
          ...userData,
          password: hashedPassword
        });
      })
    );
    logger.info(`Created ${users.length} users`);

    // Create courses
    const courses = await Promise.all(
      sampleData.courses.map(courseData => Course.create(courseData))
    );
    logger.info(`Created ${courses.length} courses`);

    // Create modules
    const modules = await Promise.all(
      sampleData.modules.map(moduleData => Module.create(moduleData))
    );
    logger.info(`Created ${modules.length} modules`);

    // Create labs
    const labs = await Promise.all(
      sampleData.labs.map(labData => Lab.create(labData))
    );
    logger.info(`Created ${labs.length} labs`);

    // Create assessments
    const assessments = await Promise.all(
      sampleData.assessments.map(assessmentData => Assessment.create(assessmentData))
    );
    logger.info(`Created ${assessments.length} assessments`);

    // Enroll student in first course
    await UserCourse.create({
      userId: 3, // Student user
      courseId: 1, // First course
      role: 'student',
      enrolledAt: new Date(),
      progress: 30
    });
    logger.info('Enrolled student in course');

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initDb();
