// Advanced Ethical Hacking Assessments
// This file contains quizzes and assessments for the 12-week ethical hacking curriculum

export const advancedAssessments = [
  // Week 1: Introduction to Ethical Hacking
  {
    title: 'Ethical Hacking Fundamentals Quiz',
    description: 'Test your understanding of ethical hacking concepts, methodology, and legal considerations.',
    type: 'quiz',
    timeLimit: 30, // minutes
    passingScore: 70,
    maxAttempts: 3,
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 1, // Introduction to Ethical Hacking
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
      },
      {
        question: 'What is the difference between black box, white box, and gray box testing?',
        options: [
          'The color of the testing equipment used',
          'The level of information provided to the tester about the target system',
          'The severity of vulnerabilities being tested',
          'The time of day when testing is performed'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is a legal requirement for ethical hacking?',
        options: [
          'Using only open-source tools',
          'Performing tests only during business hours',
          'Obtaining proper written authorization',
          'Publishing all findings publicly'
        ],
        correctAnswer: 2
      },
      {
        question: 'What does "maintaining access" refer to in the ethical hacking methodology?',
        options: [
          'Keeping detailed logs of all testing activities',
          'Ensuring the tester can access the system after exploitation to demonstrate persistence',
          'Maintaining good relationships with the client',
          'Keeping access credentials secure'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following best describes a "zero-day vulnerability"?',
        options: [
          'A vulnerability that has existed in the software since day zero of development',
          'A vulnerability that takes zero days to exploit',
          'A vulnerability that is known to the attacker but not to the vendor or public',
          'A vulnerability that has zero impact on the system'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the purpose of a penetration testing report?',
        options: [
          'To showcase the tester\'s technical skills',
          'To document all vulnerabilities found and provide remediation recommendations',
          'To fulfill legal requirements only',
          'To compare results with previous security audits'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following tools is primarily used for network scanning?',
        options: [
          'Metasploit',
          'Wireshark',
          'Nmap',
          'John the Ripper'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the difference between a vulnerability assessment and a penetration test?',
        options: [
          'Vulnerability assessments are automated while penetration tests are manual',
          'Vulnerability assessments identify weaknesses while penetration tests exploit them',
          'Vulnerability assessments are legal while penetration tests are not',
          'There is no difference; the terms are interchangeable'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is an example of passive reconnaissance?',
        options: [
          'Port scanning',
          'Social engineering',
          'Reviewing a company\'s public website',
          'Sending phishing emails'
        ],
        correctAnswer: 2
      }
    ]
  },

  // Week 3: Reconnaissance and Information Gathering
  {
    title: 'OSINT and Reconnaissance Techniques Assessment',
    description: 'Test your knowledge of open-source intelligence gathering and reconnaissance techniques.',
    type: 'quiz',
    timeLimit: 25, // minutes
    passingScore: 70,
    maxAttempts: 2,
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 3, // Reconnaissance and Information Gathering
    questions: [
      {
        question: 'Which of the following is NOT considered a passive reconnaissance technique?',
        options: [
          'Reviewing a company\'s LinkedIn page',
          'Analyzing WHOIS data',
          'Port scanning the target network',
          'Reading press releases'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the primary purpose of DNS enumeration?',
        options: [
          'To identify all domain names owned by a target organization',
          'To map the internal network structure',
          'To crack DNS authentication',
          'To perform denial of service attacks'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which tool is specifically designed for email harvesting?',
        options: [
          'Nmap',
          'theHarvester',
          'Wireshark',
          'Metasploit'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is a "Google dork"?',
        options: [
          'A Google employee who provides technical support',
          'A specialized search query using Google\'s advanced operators to find specific information',
          'A tool for hacking Google services',
          'A vulnerability in Google\'s search algorithm'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following is NOT typically found in WHOIS data?',
        options: [
          'Domain registrar information',
          'Registration date',
          'Server passwords',
          'Technical contact details'
        ],
        correctAnswer: 2
      },
      {
        question: 'What type of information can be gathered from social media platforms during reconnaissance?',
        options: [
          'Employee names and roles',
          'Technology stack details',
          'Office locations',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        question: 'What is Shodan primarily used for?',
        options: [
          'Social media analysis',
          'Password cracking',
          'Searching for internet-connected devices',
          'DNS enumeration'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which of the following commands would you use to perform a zone transfer?',
        options: [
          'nmap -sS target.com',
          'dig axfr @ns1.target.com target.com',
          'whois target.com',
          'ping target.com'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the main ethical concern when performing OSINT gathering?',
        options: [
          'It requires specialized tools',
          'It may reveal too much about the target',
          'Respecting privacy and legal boundaries',
          'It takes too much time'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which of the following is a valid technique for subdomain enumeration?',
        options: [
          'ARP poisoning',
          'Brute forcing common subdomain names',
          'SQL injection',
          'Cross-site scripting'
        ],
        correctAnswer: 1
      }
    ]
  },

  // Week 4: Network Scanning and Enumeration
  {
    title: 'Network Scanning Techniques Assessment',
    description: 'Evaluate your understanding of network scanning methodologies, tools, and interpretation of results.',
    type: 'quiz',
    timeLimit: 30, // minutes
    passingScore: 75,
    maxAttempts: 2,
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 4, // Network Scanning and Enumeration
    questions: [
      {
        question: 'Which Nmap scan type uses a complete three-way handshake?',
        options: [
          'SYN scan (-sS)',
          'Connect scan (-sT)',
          'FIN scan (-sF)',
          'XMAS scan (-sX)'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the primary advantage of a SYN scan over a Connect scan?',
        options: [
          'It\'s faster',
          'It\'s more reliable',
          'It\'s less likely to be logged',
          'It can scan more ports'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which of the following Nmap commands would perform host discovery without port scanning?',
        options: [
          'nmap -sS 192.168.1.0/24',
          'nmap -sn 192.168.1.0/24',
          'nmap -sV 192.168.1.0/24',
          'nmap -O 192.168.1.0/24'
        ],
        correctAnswer: 1
      },
      {
        question: 'What does the Nmap option "-sV" do?',
        options: [
          'Performs a vulnerability scan',
          'Detects service versions',
          'Scans for viruses',
          'Uses stealth scanning techniques'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which scan type is most useful for detecting UDP services?',
        options: [
          'TCP SYN scan',
          'TCP Connect scan',
          'UDP scan',
          'XMAS scan'
        ],
        correctAnswer: 2
      },
      {
        question: 'What information can be determined through OS fingerprinting?',
        options: [
          'Exact version of all installed software',
          'User credentials',
          'Operating system type and version',
          'Source code of the operating system'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the purpose of the Nmap Scripting Engine (NSE)?',
        options: [
          'To automate complex scanning tasks',
          'To create custom scanning tools',
          'To extend Nmap\'s functionality with additional tests and detection capabilities',
          'To generate scan reports'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which of the following would be considered a stealthy scanning technique?',
        options: [
          'TCP Connect scan to all ports',
          'Using -T5 timing template',
          'FIN scan with packet fragmentation',
          'Running a full vulnerability scan'
        ],
        correctAnswer: 2
      },
      {
        question: 'What does the Nmap output "Filtered" indicate about a port?',
        options: [
          'The port is open and accepting connections',
          'The port is closed',
          'A firewall or filter is blocking access to the port',
          'The service on the port is corrupted'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which Nmap timing template (-T) provides the fastest scanning speed?',
        options: [
          '-T0',
          '-T3',
          '-T4',
          '-T5'
        ],
        correctAnswer: 3
      }
    ]
  },

  // Week 6: Web Application Security
  {
    title: 'Web Application Security Assessment',
    description: 'Test your knowledge of web application vulnerabilities, exploitation techniques, and security best practices.',
    type: 'quiz',
    timeLimit: 35, // minutes
    passingScore: 80,
    maxAttempts: 2,
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 6, // Web Application Security
    questions: [
      {
        question: 'Which of the following is an example of a SQL injection attack?',
        options: [
          '<script>alert("XSS")</script>',
          '1\' OR \'1\'=\'1',
          'document.cookie',
          'rm -rf /'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the primary defense against SQL injection attacks?',
        options: [
          'Input validation',
          'Parameterized queries',
          'Web application firewalls',
          'Strong passwords'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following best describes Cross-Site Scripting (XSS)?',
        options: [
          'Injecting malicious scripts that execute in users\' browsers',
          'Exploiting server-side vulnerabilities',
          'Intercepting network traffic between sites',
          'Bypassing authentication mechanisms'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the difference between reflected and stored XSS?',
        options: [
          'Reflected XSS affects the server while stored XSS affects the client',
          'Reflected XSS requires user interaction while stored XSS is automatic',
          'Reflected XSS is non-persistent while stored XSS is persistent in the application',
          'There is no difference; they are different terms for the same vulnerability'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which HTTP header helps prevent Cross-Site Request Forgery (CSRF)?',
        options: [
          'Content-Security-Policy',
          'X-XSS-Protection',
          'X-Frame-Options',
          'Same-Origin-Policy'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is an Insecure Direct Object Reference (IDOR) vulnerability?',
        options: [
          'When a web application uses client-supplied input to access objects directly',
          'When object-oriented programming is implemented insecurely',
          'When references to external resources are not properly validated',
          'When direct memory references are exposed to users'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which of the following is NOT a common authentication vulnerability?',
        options: [
          'Weak password policies',
          'Lack of multi-factor authentication',
          'Insecure password storage',
          'Using HTTPS'
        ],
        correctAnswer: 3
      },
      {
        question: 'What is the purpose of the "HttpOnly" flag for cookies?',
        options: [
          'To ensure cookies are only sent over HTTPS connections',
          'To prevent JavaScript from accessing the cookie',
          'To make cookies accessible only to the domain that set them',
          'To set an expiration date for the cookie'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which tool is commonly used for intercepting and modifying HTTP/HTTPS traffic during web application testing?',
        options: [
          'Nmap',
          'Wireshark',
          'Burp Suite',
          'Metasploit'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is XML External Entity (XXE) injection?',
        options: [
          'Injecting malicious XML that references external entities to disclose internal files or perform SSRF',
          'Using XML to bypass authentication mechanisms',
          'Exploiting XML parsers to execute arbitrary code',
          'Modifying XML responses to alter application behavior'
        ],
        correctAnswer: 0
      }
    ]
  },

  // Week 7: System Hacking - Gaining Access
  {
    title: 'System Hacking and Exploitation Assessment',
    description: 'Evaluate your understanding of system hacking techniques, exploitation frameworks, and initial access tactics.',
    type: 'quiz',
    timeLimit: 30, // minutes
    passingScore: 75,
    maxAttempts: 2,
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 7, // System Hacking - Gaining Access
    questions: [
      {
        question: 'Which password attack attempts all possible combinations of characters?',
        options: [
          'Dictionary attack',
          'Rainbow table attack',
          'Brute force attack',
          'Social engineering'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the primary purpose of the Metasploit Framework?',
        options: [
          'Network scanning',
          'Password cracking',
          'Vulnerability exploitation',
          'Traffic analysis'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which of the following is NOT a common password cracking tool?',
        options: [
          'John the Ripper',
          'Hashcat',
          'Hydra',
          'Wireshark'
        ],
        correctAnswer: 3
      },
      {
        question: 'What is a "payload" in the context of exploitation?',
        options: [
          'The vulnerability being exploited',
          'The code that runs after successful exploitation',
          'The target system information',
          'The scanning results'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which of the following best describes a "reverse shell"?',
        options: [
          'A shell that allows you to execute commands in reverse order',
          'A connection initiated from the target back to the attacker',
          'A shell that undoes previous commands',
          'A shell with administrative privileges'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the purpose of a "meterpreter" payload in Metasploit?',
        options: [
          'To scan for vulnerabilities',
          'To crack passwords',
          'To provide an advanced command shell with additional features',
          'To perform denial of service attacks'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which technique involves sending emails with malicious attachments to gain initial access?',
        options: [
          'Brute forcing',
          'Phishing',
          'Port scanning',
          'ARP poisoning'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the purpose of encoding or obfuscating payloads?',
        options: [
          'To make them smaller in size',
          'To make them execute faster',
          'To evade antivirus detection',
          'To make them compatible with more systems'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which of the following is a common Windows vulnerability that has been exploited for remote code execution?',
        options: [
          'EternalBlue',
          'Heartbleed',
          'Shellshock',
          'Dirty COW'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a "rubber ducky" in the context of physical security attacks?',
        options: [
          'A tool for picking locks',
          'A device that appears as a USB drive but acts as a keyboard to inject commands',
          'A technique for cloning RFID cards',
          'A method for bypassing biometric authentication'
        ],
        correctAnswer: 1
      }
    ]
  }
];
