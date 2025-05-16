/**
 * Social Engineering Lab Environment Configuration
 * 
 * This file defines the configuration for the Social Engineering lab environment,
 * including simulated targets, tools, and assessment scenarios.
 */

const socialEngineeringLab = {
  id: 'social_engineering',
  name: 'Social Engineering Assessment Lab',
  description: 'A comprehensive lab environment for practicing ethical social engineering techniques, including phishing campaigns, pretexting scenarios, and security awareness assessment.',
  difficulty: 'intermediate',
  estimatedTime: 180, // minutes
  learningObjectives: [
    'Plan and execute ethical phishing campaigns',
    'Develop effective pretexting scenarios',
    'Create convincing social engineering pretexts',
    'Analyze social engineering vulnerabilities',
    'Measure security awareness levels',
    'Document social engineering findings professionally'
  ],
  prerequisites: [
    'Completion of Module 7: Social Engineering',
    'Understanding of ethical boundaries in security testing',
    'Familiarity with email systems and web technologies'
  ],
  machines: [
    {
      name: 'kali',
      displayName: 'Kali Linux',
      image: 'kali-linux:2023.1',
      role: 'attacker',
      resources: {
        cpu: 2,
        memory: '4GB',
        disk: '20GB'
      },
      network: {
        ip: '10.0.0.10',
        subnet: '10.0.0.0/24',
        gateway: '10.0.0.1'
      },
      software: [
        {
          name: 'GoPhish',
          version: '0.12.1',
          path: '/usr/local/bin/gophish'
        },
        {
          name: 'SET (Social-Engineer Toolkit)',
          version: '8.0.3',
          path: '/usr/bin/setoolkit'
        },
        {
          name: 'OSINT Framework',
          type: 'collection',
          description: 'Collection of OSINT tools for information gathering'
        },
        {
          name: 'SpiderFoot',
          version: '3.5',
          path: '/usr/local/bin/sf'
        },
        {
          name: 'Maltego CE',
          version: '4.3.0',
          path: '/usr/bin/maltego'
        }
      ],
      credentials: {
        username: 'kali',
        password: 'kali'
      }
    },
    {
      name: 'mail-server',
      displayName: 'Mail Server',
      image: 'mail-server:latest',
      role: 'infrastructure',
      resources: {
        cpu: 1,
        memory: '2GB',
        disk: '20GB'
      },
      network: {
        ip: '10.0.0.20',
        subnet: '10.0.0.0/24',
        gateway: '10.0.0.1'
      },
      ports: [
        {
          container: 25,
          host: 2525
        },
        {
          container: 80,
          host: 8025
        },
        {
          container: 443,
          host: 8443
        }
      ],
      software: [
        {
          name: 'Postfix',
          version: '3.5.6',
          config: '/etc/postfix/main.cf'
        },
        {
          name: 'Dovecot',
          version: '2.3.13',
          config: '/etc/dovecot/dovecot.conf'
        },
        {
          name: 'MailHog',
          version: '1.0.1',
          description: 'Email testing tool with web interface'
        }
      ],
      credentials: {
        username: 'admin',
        password: 'mail@dmin123'
      }
    },
    {
      name: 'target-organization',
      displayName: 'Target Organization Simulation',
      image: 'target-org:latest',
      role: 'target',
      resources: {
        cpu: 2,
        memory: '4GB',
        disk: '40GB'
      },
      network: {
        ip: '10.0.0.30',
        subnet: '10.0.0.0/24',
        gateway: '10.0.0.1'
      },
      ports: [
        {
          container: 80,
          host: 8080
        },
        {
          container: 443,
          host: 8443
        }
      ],
      components: [
        {
          name: 'Corporate Website',
          description: 'Simulated corporate website with employee information',
          url: 'http://10.0.0.30/corporate'
        },
        {
          name: 'Employee Directory',
          description: 'Searchable employee directory with contact information',
          url: 'http://10.0.0.30/directory'
        },
        {
          name: 'Webmail Portal',
          description: 'Employee webmail access portal',
          url: 'http://10.0.0.30/webmail'
        },
        {
          name: 'Intranet',
          description: 'Internal company portal with various resources',
          url: 'http://10.0.0.30/intranet'
        }
      ],
      users: [
        {
          name: 'John Smith',
          position: 'CEO',
          email: 'j.smith@targetorg.lab',
          phone: '555-123-4567',
          department: 'Executive'
        },
        {
          name: 'Sarah Johnson',
          position: 'CFO',
          email: 's.johnson@targetorg.lab',
          phone: '555-123-4568',
          department: 'Finance'
        },
        {
          name: 'Michael Chen',
          position: 'IT Director',
          email: 'm.chen@targetorg.lab',
          phone: '555-123-4569',
          department: 'IT'
        },
        {
          name: 'Jessica Williams',
          position: 'HR Manager',
          email: 'j.williams@targetorg.lab',
          phone: '555-123-4570',
          department: 'Human Resources'
        },
        {
          name: 'Robert Taylor',
          position: 'Help Desk Technician',
          email: 'r.taylor@targetorg.lab',
          phone: '555-123-4571',
          department: 'IT'
        },
        {
          name: 'Amanda Garcia',
          position: 'Marketing Director',
          email: 'a.garcia@targetorg.lab',
          phone: '555-123-4572',
          department: 'Marketing'
        },
        {
          name: 'David Wilson',
          position: 'Sales Representative',
          email: 'd.wilson@targetorg.lab',
          phone: '555-123-4573',
          department: 'Sales'
        },
        {
          name: 'Lisa Brown',
          position: 'Executive Assistant',
          email: 'l.brown@targetorg.lab',
          phone: '555-123-4574',
          department: 'Executive'
        },
        {
          name: 'James Miller',
          position: 'Accountant',
          email: 'j.miller@targetorg.lab',
          phone: '555-123-4575',
          department: 'Finance'
        },
        {
          name: 'Emily Davis',
          position: 'Receptionist',
          email: 'e.davis@targetorg.lab',
          phone: '555-123-4576',
          department: 'Administration'
        }
      ],
      credentials: {
        username: 'admin',
        password: 'Adm1n@Target'
      }
    },
    {
      name: 'phishing-tracker',
      displayName: 'Phishing Campaign Tracker',
      image: 'phishing-tracker:latest',
      role: 'infrastructure',
      resources: {
        cpu: 1,
        memory: '2GB',
        disk: '10GB'
      },
      network: {
        ip: '10.0.0.40',
        subnet: '10.0.0.0/24',
        gateway: '10.0.0.1'
      },
      ports: [
        {
          container: 80,
          host: 8081
        }
      ],
      description: 'Tracks and analyzes phishing campaign results, including open rates, click rates, and credential submission',
      credentials: {
        username: 'admin',
        password: 'track@dmin123'
      }
    }
  ],
  network: {
    name: 'social-engineering-network',
    subnet: '10.0.0.0/24',
    gateway: '10.0.0.1',
    dns: ['10.0.0.1', '8.8.8.8']
  },
  duration: 3 * 60 * 60, // 3 hours in seconds
  guacamole: {
    enabled: true,
    connections: [
      {
        name: 'Kali Linux',
        protocol: 'vnc',
        hostname: '${kali_ip}',
        port: 5901,
        username: 'kali',
        password: 'kali'
      }
    ]
  },
  tasks: [
    {
      id: 'task1',
      name: 'Information Gathering',
      description: 'Gather information about the target organization and its employees using OSINT techniques',
      hints: [
        'Explore the corporate website for organizational structure',
        'Check the employee directory for contact information',
        'Look for information that could be used in social engineering pretexts',
        'Document reporting structure and relationships between employees'
      ],
      validation: {
        type: 'manual',
        criteria: [
          'Identified at least 8 employees with their roles',
          'Documented organizational structure',
          'Found at least 3 potential pieces of information useful for pretexting',
          'Created a target profile for the organization'
        ]
      }
    },
    {
      id: 'task2',
      name: 'Phishing Campaign Planning',
      description: 'Design a phishing campaign targeting the organization, including email templates and landing pages',
      hints: [
        'Use GoPhish to create your campaign',
        'Design emails that would be relevant to the target organization',
        'Create convincing landing pages for credential harvesting',
        'Consider different psychological triggers (urgency, authority, etc.)'
      ],
      validation: {
        type: 'manual',
        criteria: [
          'Created at least 2 different phishing email templates',
          'Designed a convincing landing page',
          'Configured proper tracking for campaign metrics',
          'Documented the psychological triggers used in each template'
        ]
      }
    },
    {
      id: 'task3',
      name: 'Phishing Campaign Execution',
      description: 'Execute the phishing campaign against the simulated organization and track results',
      hints: [
        'Launch your campaign using GoPhish',
        'Monitor email delivery and open rates',
        'Track click-through rates on malicious links',
        'Collect any submitted credentials'
      ],
      validation: {
        type: 'metrics',
        requirements: {
          emailsSent: 10,
          emailsOpened: 5,
          linksClicked: 3,
          credentialsHarvested: 2
        }
      }
    },
    {
      id: 'task4',
      name: 'Pretexting Scenario Development',
      description: 'Develop pretexting scenarios for phone-based social engineering',
      hints: [
        'Create believable scenarios based on the organization',
        'Develop scripts for different departments (IT, HR, Finance)',
        'Prepare responses to common objections',
        'Document your approach and expected outcomes'
      ],
      validation: {
        type: 'manual',
        criteria: [
          'Created at least 3 different pretexting scenarios',
          'Developed detailed scripts for each scenario',
          'Included responses to potential objections',
          'Documented the psychological principles leveraged in each scenario'
        ]
      }
    },
    {
      id: 'task5',
      name: 'Social Engineering Report',
      description: 'Create a comprehensive report documenting your social engineering assessment',
      hints: [
        'Include an executive summary with key findings',
        'Document methodology and approach',
        'Provide detailed results with metrics',
        'Include recommendations for improving security awareness'
      ],
      validation: {
        type: 'document',
        requirements: [
          'Executive Summary',
          'Methodology',
          'Detailed Findings',
          'Campaign Metrics',
          'Recommendations',
          'Appendices with Evidence'
        ]
      }
    }
  ],
  completionCriteria: {
    type: 'allTasks',
    requiredScore: 80
  },
  resources: [
    {
      name: 'Social Engineering: The Science of Human Hacking',
      author: 'Christopher Hadnagy',
      type: 'book',
      description: 'Comprehensive guide to social engineering techniques and methodologies'
    },
    {
      name: 'SANS Social Engineering Training',
      url: 'https://www.sans.org/security-awareness-training/',
      type: 'training',
      description: 'Professional training materials on social engineering and security awareness'
    },
    {
      name: 'GoPhish Documentation',
      url: 'https://getgophish.com/documentation/',
      type: 'documentation',
      description: 'Official documentation for the GoPhish phishing framework'
    },
    {
      name: 'Social-Engineer.org Resources',
      url: 'https://www.social-engineer.org/framework/general-discussion/',
      type: 'website',
      description: 'Collection of resources on social engineering techniques and countermeasures'
    }
  ],
  deliverables: {
    required: [
      {
        name: 'Social Engineering Assessment Report',
        description: 'A comprehensive report documenting the methodology, findings, and recommendations',
        template: '/templates/social_engineering_report_template.docx'
      }
    ],
    optional: [
      {
        name: 'Phishing Campaign Results',
        description: 'Detailed metrics and analysis of phishing campaign effectiveness'
      },
      {
        name: 'Pretexting Scripts',
        description: 'Scripts and scenarios developed for phone-based social engineering'
      },
      {
        name: 'Security Awareness Recommendations',
        description: 'Specific recommendations for improving security awareness training'
      }
    ]
  }
};

export default socialEngineeringLab;
