/**
 * Web Application Security Lab Environment Configuration
 * 
 * This file defines the configuration for the Web Application Security lab environment,
 * including the virtual machines, network settings, and connection details.
 */

const webAppSecurityLab = {
  id: 'web_app_security',
  name: 'Web Application Security Lab',
  description: 'A comprehensive lab environment for practicing web application security testing using industry-standard tools and vulnerable applications.',
  difficulty: 'intermediate',
  estimatedTime: 180, // minutes
  learningObjectives: [
    'Identify common web application vulnerabilities',
    'Perform manual and automated web application security testing',
    'Exploit and validate web vulnerabilities in a controlled environment',
    'Understand the OWASP Top 10 vulnerabilities',
    'Document findings and recommend remediation steps'
  ],
  prerequisites: [
    'Basic understanding of web technologies (HTTP, HTML, JavaScript)',
    'Familiarity with Linux command line',
    'Completion of Module 3: Web Technologies Fundamentals'
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
        ip: '192.168.1.10',
        subnet: '192.168.1.0/24',
        gateway: '192.168.1.1'
      },
      software: [
        {
          name: 'Burp Suite Community',
          version: '2023.1.2',
          path: '/usr/bin/burpsuite'
        },
        {
          name: 'OWASP ZAP',
          version: '2.12.0',
          path: '/usr/bin/zaproxy'
        },
        {
          name: 'Nikto',
          version: '2.1.6',
          path: '/usr/bin/nikto'
        },
        {
          name: 'SQLmap',
          version: '1.6.7',
          path: '/usr/bin/sqlmap'
        },
        {
          name: 'Firefox',
          version: '115.0',
          path: '/usr/bin/firefox'
        }
      ],
      credentials: {
        username: 'kali',
        password: 'kali'
      }
    },
    {
      name: 'dvwa',
      displayName: 'Damn Vulnerable Web Application',
      image: 'vulnerables/web-dvwa:latest',
      role: 'target',
      resources: {
        cpu: 1,
        memory: '2GB',
        disk: '10GB'
      },
      network: {
        ip: '192.168.1.100',
        subnet: '192.168.1.0/24',
        gateway: '192.168.1.1'
      },
      ports: [
        {
          container: 80,
          host: 8080
        }
      ],
      vulnerabilities: [
        {
          name: 'SQL Injection',
          description: 'Multiple endpoints vulnerable to SQL injection attacks',
          category: 'OWASP A1:2017 Injection',
          path: '/vulnerabilities/sqli/'
        },
        {
          name: 'Cross-Site Scripting (XSS)',
          description: 'Reflected and stored XSS vulnerabilities',
          category: 'OWASP A7:2017 XSS',
          path: '/vulnerabilities/xss_r/'
        },
        {
          name: 'Command Injection',
          description: 'OS command injection vulnerabilities',
          category: 'OWASP A1:2017 Injection',
          path: '/vulnerabilities/exec/'
        },
        {
          name: 'Insecure File Upload',
          description: 'Vulnerable file upload functionality',
          category: 'OWASP A5:2017 Broken Access Control',
          path: '/vulnerabilities/upload/'
        },
        {
          name: 'CSRF',
          description: 'Cross-Site Request Forgery vulnerabilities',
          category: 'OWASP A8:2017 CSRF',
          path: '/vulnerabilities/csrf/'
        }
      ],
      credentials: {
        username: 'admin',
        password: 'password'
      },
      setup: [
        {
          description: 'Initialize DVWA database',
          command: 'php /var/www/html/setup.php'
        }
      ]
    },
    {
      name: 'juice-shop',
      displayName: 'OWASP Juice Shop',
      image: 'bkimminich/juice-shop:latest',
      role: 'target',
      resources: {
        cpu: 1,
        memory: '2GB',
        disk: '10GB'
      },
      network: {
        ip: '192.168.1.101',
        subnet: '192.168.1.0/24',
        gateway: '192.168.1.1'
      },
      ports: [
        {
          container: 3000,
          host: 3000
        }
      ],
      vulnerabilities: [
        {
          name: 'Broken Authentication',
          description: 'Multiple authentication flaws',
          category: 'OWASP A2:2017 Broken Authentication',
          difficulty: 'Easy to Hard'
        },
        {
          name: 'Sensitive Data Exposure',
          description: 'Exposure of sensitive user and business data',
          category: 'OWASP A3:2017 Sensitive Data Exposure',
          difficulty: 'Medium to Hard'
        },
        {
          name: 'Broken Access Control',
          description: 'Various authorization and access control issues',
          category: 'OWASP A5:2017 Broken Access Control',
          difficulty: 'Easy to Hard'
        },
        {
          name: 'XSS Vulnerabilities',
          description: 'Multiple cross-site scripting vulnerabilities',
          category: 'OWASP A7:2017 XSS',
          difficulty: 'Easy to Medium'
        },
        {
          name: 'API Vulnerabilities',
          description: 'Insecure API endpoints',
          category: 'OWASP A10:2017 Insufficient Logging & Monitoring',
          difficulty: 'Medium to Hard'
        }
      ]
    }
  ],
  network: {
    name: 'lab-network',
    subnet: '192.168.1.0/24',
    gateway: '192.168.1.1',
    dns: ['8.8.8.8', '8.8.4.4']
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
      name: 'Reconnaissance and Enumeration',
      description: 'Identify web applications, their technologies, and potential entry points',
      hints: [
        'Use tools like Nikto for initial scanning',
        'Explore the applications manually to understand their functionality',
        'Check for hidden directories and files',
        'Identify the technologies and frameworks in use'
      ],
      validation: {
        type: 'manual',
        criteria: [
          'Identified both target applications',
          'Listed at least 3 technologies/frameworks in use',
          'Found at least 2 hidden directories or endpoints'
        ]
      }
    },
    {
      id: 'task2',
      name: 'SQL Injection Testing',
      description: 'Identify and exploit SQL injection vulnerabilities in DVWA',
      hints: [
        'Try basic SQL injection payloads like \' OR 1=1 --',
        'Use SQLmap for automated testing',
        'Try to extract database information',
        'Document the vulnerable parameters'
      ],
      validation: {
        type: 'flag',
        target: 'dvwa',
        flagLocation: '/var/www/html/flags/sql_injection_flag.txt',
        value: 'DVWA_SQL_INJECTION_MASTER'
      }
    },
    {
      id: 'task3',
      name: 'Cross-Site Scripting (XSS)',
      description: 'Identify and exploit XSS vulnerabilities in both applications',
      hints: [
        'Test for reflected XSS by injecting script tags',
        'Look for stored XSS in comment or review features',
        'Try to bypass any filters in place',
        'Use the browser console to verify execution'
      ],
      validation: {
        type: 'screenshot',
        description: 'Submit a screenshot showing a successful XSS payload execution (alert box)'
      }
    },
    {
      id: 'task4',
      name: 'Broken Authentication',
      description: 'Identify and exploit authentication vulnerabilities in Juice Shop',
      hints: [
        'Look for weak password policies',
        'Try password reset functionality',
        'Check for remember me features',
        'Inspect requests for authentication tokens'
      ],
      validation: {
        type: 'flag',
        target: 'juice-shop',
        value: 'JUICE_SHOP_AUTH_MASTER'
      }
    },
    {
      id: 'task5',
      name: 'Automated Scanning',
      description: 'Perform automated scanning using OWASP ZAP or Burp Suite',
      hints: [
        'Configure the scanner properly',
        'Analyze the results and verify findings manually',
        'Prioritize vulnerabilities by risk',
        'Document false positives'
      ],
      validation: {
        type: 'report',
        minFindings: 10
      }
    }
  ],
  completionCriteria: {
    type: 'taskPercentage',
    percentage: 80
  },
  resources: [
    {
      name: 'OWASP Top 10',
      url: 'https://owasp.org/www-project-top-ten/',
      type: 'documentation'
    },
    {
      name: 'DVWA Documentation',
      url: 'https://github.com/digininja/DVWA',
      type: 'documentation'
    },
    {
      name: 'Juice Shop Documentation',
      url: 'https://pwning.owasp-juice.shop/',
      type: 'documentation'
    },
    {
      name: 'Web Application Hacker\'s Handbook',
      url: 'https://portswigger.net/web-security',
      type: 'reference'
    }
  ]
};

export default webAppSecurityLab;
