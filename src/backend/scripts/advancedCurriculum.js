// Advanced Ethical Hacking Curriculum
// This file contains a comprehensive 12-week ethical hacking curriculum

export const advancedCurriculum = {
  course: {
    title: 'Comprehensive Ethical Hacking',
    description: 'A complete 12-week journey into ethical hacking and penetration testing. This course covers everything from basic concepts to advanced exploitation techniques, preparing you for real-world security assessments and certifications like CEH and OSCP.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    duration: 12, // weeks
    level: 'intermediate',
    prerequisites: [
      'Basic networking knowledge',
      'Familiarity with operating systems (Windows, Linux)',
      'Command line experience',
      'Basic programming concepts'
    ],
    learningOutcomes: [
      'Understand the ethical hacking methodology and legal framework',
      'Perform comprehensive reconnaissance and intelligence gathering',
      'Execute network scanning and vulnerability assessment',
      'Exploit web application vulnerabilities',
      'Conduct wireless network security assessments',
      'Perform social engineering attacks',
      'Execute system hacking and privilege escalation',
      'Implement post-exploitation techniques',
      'Create professional penetration testing reports'
    ],
    tags: ['Ethical Hacking', 'Penetration Testing', 'Cybersecurity', 'Network Security', 'Web Security'],
    isPublished: true,
    publishedAt: new Date()
  },

  modules: [
    // Week 1: Introduction to Ethical Hacking
    {
      title: 'Introduction to Ethical Hacking',
      description: 'Understand the fundamentals of ethical hacking, including methodology, legal considerations, and career paths.',
      order: 1,
      duration: 180, // minutes
      content: `
# Introduction to Ethical Hacking

## What is Ethical Hacking?

Ethical hacking involves legally breaking into computers and devices to test an organization's defenses. It's among the most exciting IT fields today, and the perfect career for those who enjoy the thrill of the chase and solving complex puzzles.

## The Ethical Hacking Methodology

1. **Reconnaissance**: Gathering information about the target
2. **Scanning**: Identifying open ports and vulnerabilities
3. **Gaining Access**: Exploiting vulnerabilities
4. **Maintaining Access**: Ensuring persistent access
5. **Covering Tracks**: Removing evidence of compromise
6. **Reporting**: Documenting findings and recommendations

## Legal and Ethical Considerations

* **Authorization**: Always obtain proper written permission
* **Scope**: Stay within the defined boundaries
* **Data Protection**: Handle sensitive data appropriately
* **Documentation**: Maintain detailed records of all activities

## Setting Up Your Lab Environment

In this course, you'll need a secure environment to practice your skills. We recommend:

* Kali Linux (primary attack platform)
* Vulnerable virtual machines (Metasploitable, DVWA, etc.)
* Virtualization software (VirtualBox, VMware)
* Isolated network environment

## Essential Tools Overview

* **Nmap**: Network scanning
* **Wireshark**: Packet analysis
* **Metasploit**: Exploitation framework
* **Burp Suite**: Web application testing
* **Hashcat**: Password cracking

## Career Paths in Ethical Hacking

* Penetration Tester
* Security Consultant
* Red Team Operator
* Bug Bounty Hunter
* Security Researcher
      `,
      videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
      isPublished: true,
      publishedAt: new Date(),
      resources: [
        {
          title: 'OWASP Top 10',
          url: 'https://owasp.org/www-project-top-ten/'
        },
        {
          title: 'Kali Linux Documentation',
          url: 'https://www.kali.org/docs/'
        },
        {
          title: 'Computer Fraud and Abuse Act',
          url: 'https://www.justice.gov/criminal-ccips/computer-fraud-and-abuse-act'
        }
      ]
    },

    // Week 2: Setting Up the Lab Environment
    {
      title: 'Setting Up Your Hacking Lab',
      description: 'Learn how to create a secure, isolated environment for practicing ethical hacking techniques.',
      order: 2,
      duration: 150, // minutes
      content: `
# Setting Up Your Ethical Hacking Lab

## Why You Need a Lab Environment

Practicing ethical hacking techniques requires a safe, controlled environment where you can legally perform attacks without risking damage to production systems or breaking laws.

## Virtualization Platforms

### VirtualBox
* Free and open-source
* Cross-platform (Windows, Linux, macOS)
* Supports most operating systems
* Setup instructions:
  1. Download from virtualbox.org
  2. Install with default settings
  3. Configure host-only network

### VMware
* Commercial option with free tier (VMware Player)
* Better performance for some workloads
* Enhanced snapshot capabilities

## Essential Virtual Machines

### Attack Platforms
* **Kali Linux**: The industry standard for penetration testing
  * Pre-installed with 600+ security tools
  * Regular updates with latest security tools
  * Installation guide:
    1. Download ISO from kali.org
    2. Create new VM with at least 2GB RAM and 20GB storage
    3. Install with default settings

### Target Systems
* **Metasploitable 2**: Intentionally vulnerable Linux server
* **DVWA (Damn Vulnerable Web Application)**: Web application security practice
* **Windows Server**: For Active Directory attacks
* **OWASP WebGoat**: Web application security training

## Network Configuration

### Isolated Network Setup
* Create host-only network in virtualization software
* Ensure no connection to external networks
* Configure static IP addresses

### Network Topology Options
* Simple flat network
* Segmented network with firewall
* Enterprise simulation with multiple subnets

## Security Considerations

* Never connect vulnerable machines to the internet
* Use strong passwords even in lab environments
* Regularly backup your virtual machines
* Consider disk encryption for sensitive labs

## Lab Documentation

* Document IP addresses and credentials
* Create network diagrams
* Maintain configuration notes
      `,
      videoUrl: 'https://www.youtube.com/watch?v=nvdM8Vz8AQI',
      isPublished: true,
      publishedAt: new Date(),
      resources: [
        {
          title: 'Kali Linux Downloads',
          url: 'https://www.kali.org/downloads/'
        },
        {
          title: 'Metasploitable 2 Download',
          url: 'https://sourceforge.net/projects/metasploitable/'
        },
        {
          title: 'DVWA GitHub Repository',
          url: 'https://github.com/digininja/DVWA'
        }
      ]
    },

    // Week 3: Reconnaissance and Information Gathering
    {
      title: 'Reconnaissance and Information Gathering',
      description: 'Master the techniques for gathering intelligence about your target without direct interaction.',
      order: 3,
      duration: 210, // minutes
      content: `
# Reconnaissance and Information Gathering

## The Importance of Reconnaissance

Reconnaissance is the first and most critical phase of ethical hacking. Thorough information gathering can reveal:
* Potential entry points
* Technology stack vulnerabilities
* Organizational structure
* Security posture

## Passive Reconnaissance Techniques

### OSINT (Open Source Intelligence)
* **Company Websites**: Job listings, technology stack, employee information
* **Social Media**: LinkedIn, Twitter, Facebook for employee details
* **Public Records**: SEC filings, legal documents, patents
* **WHOIS Data**: Domain registration information
* **Google Dorking**: Advanced search operators to find sensitive information

### Tools for Passive Reconnaissance
* **theHarvester**: Email harvesting
* **Maltego**: Relationship mapping
* **Shodan**: Internet-connected device search
* **Recon-ng**: Web reconnaissance framework
* **OSINT Framework**: Collection of OSINT resources

## Active Reconnaissance Techniques

### DNS Enumeration
* **Zone Transfers**: Attempting to transfer DNS zone data
* **Subdomain Enumeration**: Discovering subdomains
* **DNS Record Analysis**: MX, TXT, A, AAAA records

### Network Mapping
* **Traceroute**: Discovering network paths
* **Network Range Identification**: Finding IP blocks

### Tools for Active Reconnaissance
* **dig/nslookup**: DNS interrogation
* **DNSRecon**: DNS enumeration
* **Sublist3r**: Subdomain enumeration
* **Amass**: In-depth DNS enumeration

## Social Engineering Reconnaissance
* **Pretexting**: Creating scenarios to extract information
* **Phishing Preparation**: Gathering email formats and contacts
* **Physical Reconnaissance**: Understanding physical security

## Organizing Reconnaissance Data
* Creating target profiles
* Documenting findings
* Identifying high-value targets
* Preparing for the scanning phase

## Legal and Ethical Considerations
* Staying within authorized scope
* Avoiding disruptive activities
* Respecting privacy boundaries
      `,
      videoUrl: 'https://www.youtube.com/watch?v=1CzCp7vvq8Y',
      isPublished: true,
      publishedAt: new Date(),
      resources: [
        {
          title: 'OSINT Framework',
          url: 'https://osintframework.com/'
        },
        {
          title: 'Google Hacking Database',
          url: 'https://www.exploit-db.com/google-hacking-database'
        },
        {
          title: 'Shodan',
          url: 'https://www.shodan.io/'
        }
      ]
    },

    // Week 4: Network Scanning and Enumeration
    {
      title: 'Network Scanning and Enumeration',
      description: 'Learn how to scan networks to identify hosts, open ports, services, and potential vulnerabilities.',
      order: 4,
      duration: 180, // minutes
      content: `
# Network Scanning and Enumeration

## The Art of Network Scanning

Network scanning is the process of identifying active hosts, open ports, running services, and potential vulnerabilities on a target network. This phase builds upon the information gathered during reconnaissance.

## Scanning Methodology

1. **Host Discovery**: Identifying live hosts on the network
2. **Port Scanning**: Finding open ports on target systems
3. **Service Detection**: Identifying services running on open ports
4. **OS Fingerprinting**: Determining operating systems
5. **Version Detection**: Identifying specific software versions
6. **Vulnerability Scanning**: Identifying potential security weaknesses

## Host Discovery Techniques

### ARP Scanning (Layer 2)
* Fast and reliable for local networks
* Cannot traverse routers
* Difficult to detect

### ICMP Scanning
* Ping sweep (ICMP Echo)
* ICMP timestamp and address mask requests
* Often blocked by firewalls

### TCP/UDP Scanning
* TCP SYN ping
* TCP ACK ping
* UDP ping

## Port Scanning Techniques

### TCP Scanning
* **TCP Connect Scan**: Complete three-way handshake
* **SYN Scan (Half-open)**: Only send SYN packet
* **FIN Scan**: Send FIN packet to elicit response
* **Xmas Scan**: Send FIN, URG, PSH flags
* **NULL Scan**: No flags set

### UDP Scanning
* Slower and less reliable than TCP
* Important for discovering UDP services
* Techniques for improving accuracy

## Service and Version Detection

* Banner grabbing
* Service probes
* Application fingerprinting
* Version enumeration

## OS Fingerprinting

* TCP/IP stack behavior analysis
* TTL values
* Window sizes
* TCP options

## Nmap Mastery

### Basic Scanning
\`\`\`bash
# Host discovery
nmap -sn 192.168.1.0/24

# TCP SYN scan
nmap -sS 192.168.1.1

# Service version detection
nmap -sV 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# Comprehensive scan
nmap -sS -sV -O -A 192.168.1.1
\`\`\`

### Advanced Techniques
* Timing options (-T0 to -T5)
* Evasion techniques
* Output formats
* Scripting with NSE

## Other Scanning Tools

* **Masscan**: Fastest port scanner
* **Unicornscan**: Efficient asynchronous scanning
* **Zmap**: Internet-scale scanning
* **Angry IP Scanner**: Simple GUI scanner

## Enumeration Techniques

### Windows Enumeration
* SMB/CIFS enumeration
* NetBIOS enumeration
* RPC enumeration

### Linux/Unix Enumeration
* NFS enumeration
* SNMP enumeration
* SMTP enumeration

## Vulnerability Scanning

* **Nessus**: Comprehensive vulnerability scanner
* **OpenVAS**: Open-source vulnerability scanner
* **Nexpose**: Enterprise vulnerability management
* **Qualys**: Cloud-based scanning

## Scan Analysis and Documentation

* Interpreting scan results
* Prioritizing findings
* Documenting for the exploitation phase
* Avoiding false positives
      `,
      videoUrl: 'https://www.youtube.com/watch?v=4t4kBkMsDbQ',
      isPublished: true,
      publishedAt: new Date(),
      resources: [
        {
          title: 'Nmap Documentation',
          url: 'https://nmap.org/book/'
        },
        {
          title: 'Nmap NSE Scripts',
          url: 'https://nmap.org/nsedoc/'
        },
        {
          title: 'Masscan GitHub Repository',
          url: 'https://github.com/robertdavidgraham/masscan'
        }
      ]
    },

    // Week 5: Vulnerability Assessment
    {
      title: 'Vulnerability Assessment',
      description: 'Learn how to identify, classify, and prioritize security vulnerabilities in systems and networks.',
      order: 5,
      duration: 180, // minutes
      content: `
# Vulnerability Assessment

## Understanding Vulnerability Assessment

Vulnerability assessment is the systematic review of security weaknesses in systems, applications, and networks. It bridges the gap between scanning and exploitation, helping to identify and prioritize security issues.

## Vulnerability Assessment vs. Penetration Testing

* **Vulnerability Assessment**: Identifies vulnerabilities
* **Penetration Testing**: Exploits vulnerabilities to demonstrate impact
* **When to use each approach**
* **Combining both for comprehensive security**

## Types of Vulnerabilities

### Network Vulnerabilities
* Open ports and insecure services
* Misconfigured firewalls and network devices
* Weak encryption protocols
* Insecure network architecture

### System Vulnerabilities
* Unpatched operating systems
* Default or weak credentials
* Misconfigured permissions
* Insecure service configurations

### Application Vulnerabilities
* Input validation flaws
* Authentication and session management issues
* Business logic flaws
* API security issues

## Vulnerability Assessment Methodology

1. **Planning and Reconnaissance**
   * Defining scope
   * Gathering target information
   * Identifying assessment requirements

2. **Scanning and Enumeration**
   * Automated scanning
   * Manual verification
   * Service enumeration

3. **Vulnerability Analysis**
   * Identifying vulnerabilities
   * Eliminating false positives
   * Vulnerability validation

4. **Risk Assessment**
   * Assessing impact
   * Determining likelihood
   * Calculating risk scores

5. **Reporting and Remediation**
   * Documenting findings
   * Prioritizing fixes
   * Recommending mitigations

## Vulnerability Scanning Tools

### Commercial Scanners
* **Nessus**: Comprehensive vulnerability scanner
* **Nexpose**: Enterprise vulnerability management
* **Qualys**: Cloud-based scanning solution

### Open-Source Scanners
* **OpenVAS**: Open Vulnerability Assessment System
* **OWASP ZAP**: Web application scanner
* **Nikto**: Web server scanner

## Manual Assessment Techniques

* Service banner grabbing
* Configuration review
* Code review basics
* Manual testing procedures

## Vulnerability Databases and Scoring

* **Common Vulnerabilities and Exposures (CVE)**
* **National Vulnerability Database (NVD)**
* **Common Vulnerability Scoring System (CVSS)**
* **Exploit databases**

## Specialized Assessments

### Web Application Assessment
* OWASP Top 10 vulnerabilities
* Web application scanning tools
* Manual testing techniques

### Cloud Infrastructure Assessment
* Cloud-specific vulnerabilities
* Shared responsibility model
* Cloud security tools

### IoT Device Assessment
* IoT security challenges
* Hardware and firmware assessment
* Communication protocol security

## Reporting and Documentation

* Executive summary
* Technical findings
* Risk prioritization
* Remediation recommendations
* Verification procedures

## Continuous Vulnerability Management

* Implementing regular assessments
* Integrating with development lifecycle
* Vulnerability management programs
* Metrics and tracking
      `,
      videoUrl: 'https://www.youtube.com/watch?v=1PndIu-zqCY',
      isPublished: true,
      publishedAt: new Date(),
      resources: [
        {
          title: 'OWASP Top 10',
          url: 'https://owasp.org/www-project-top-ten/'
        },
        {
          title: 'National Vulnerability Database',
          url: 'https://nvd.nist.gov/'
        },
        {
          title: 'CVSS Calculator',
          url: 'https://www.first.org/cvss/calculator/3.1'
        }
      ]
    },

    // Week 6: Web Application Security
    {
      title: 'Web Application Security',
      description: 'Learn how to identify and exploit common web application vulnerabilities following the OWASP methodology.',
      order: 6,
      duration: 240, // minutes
      content: `
# Web Application Security

## The Web Application Security Landscape

Web applications are the primary interface between organizations and their users, making them a critical attack surface. Understanding web application security is essential for any ethical hacker.

## Web Application Architecture

* **Client-side components**: HTML, CSS, JavaScript
* **Server-side components**: Backend languages, frameworks
* **Database layer**: SQL, NoSQL databases
* **API services**: REST, GraphQL, SOAP
* **Authentication systems**: Session management, tokens

## OWASP Top 10 Vulnerabilities

### 1. Injection Flaws
* **SQL Injection**
  * Types: Union-based, Error-based, Blind
  * Prevention: Parameterized queries, ORM
  * Tools: SQLmap, Burp Suite

* **Command Injection**
  * OS command execution
  * Prevention: Input validation, allowlists
  * Detection techniques

### 2. Broken Authentication
* Session management flaws
* Credential stuffing
* Brute force vulnerabilities
* Multi-factor authentication bypass

### 3. Sensitive Data Exposure
* Insecure data storage
* Weak cryptography
* Data in transit vulnerabilities
* Information leakage

### 4. XML External Entities (XXE)
* XXE attack vectors
* File disclosure via XXE
* Server-side request forgery via XXE
* Prevention techniques

### 5. Broken Access Control
* Insecure direct object references (IDOR)
* Missing function level access control
* JWT token vulnerabilities
* Privilege escalation techniques

### 6. Security Misconfigurations
* Default credentials
* Error handling information disclosure
* Unnecessary features enabled
* Outdated software

### 7. Cross-Site Scripting (XSS)
* **Reflected XSS**
  * Attack vectors
  * Impact and exploitation
  * Prevention techniques

* **Stored XSS**
  * Persistent attack scenarios
  * Impact and data exfiltration
  * Remediation approaches

* **DOM-based XSS**
  * Client-side vulnerabilities
  * Detection challenges
  * Modern framework protections

### 8. Insecure Deserialization
* Serialization concepts
* Exploitation techniques
* Prevention strategies
* Language-specific vulnerabilities

### 9. Using Components with Known Vulnerabilities
* Dependency management
* Vulnerability databases
* Automated scanning
* Patch management

### 10. Insufficient Logging & Monitoring
* Detection failures
* Incident response gaps
* Logging best practices
* Monitoring strategies

## Web Application Testing Methodology

1. **Reconnaissance**
   * Technology stack identification
   * Directory enumeration
   * Hidden parameter discovery

2. **Mapping the Application**
   * Functionality identification
   * User role analysis
   * Authentication flow mapping

3. **Vulnerability Discovery**
   * Automated scanning
   * Manual testing
   * Business logic testing

4. **Exploitation**
   * Proof of concept development
   * Chaining vulnerabilities
   * Privilege escalation

5. **Reporting**
   * Vulnerability documentation
   * Impact assessment
   * Remediation guidance

## Web Application Security Tools

### Proxy Tools
* **Burp Suite**: Industry standard for web app testing
* **OWASP ZAP**: Open-source alternative
* **Fiddler**: HTTP debugging proxy

### Scanning Tools
* **Nikto**: Web server scanner
* **Wapiti**: Web application vulnerability scanner
* **Arachni**: Feature-rich scanner

### Specialized Tools
* **SQLmap**: Automated SQL injection
* **XSStrike**: XSS discovery and exploitation
* **JWT_Tool**: JWT testing
* **Commix**: Command injection testing

## Advanced Web Attacks

* **Server-Side Request Forgery (SSRF)**
* **Cross-Site Request Forgery (CSRF)**
* **Server-Side Template Injection (SSTI)**
* **HTTP Request Smuggling**
* **OAuth 2.0 vulnerabilities**
* **GraphQL security issues**
* **API security testing**

## Secure Development Practices

* Secure coding guidelines
* Security testing integration
* DevSecOps principles
* Web application firewalls
      `,
      videoUrl: 'https://www.youtube.com/watch?v=9ayNDnn2qqA',
      isPublished: true,
      publishedAt: new Date(),
      resources: [
        {
          title: 'OWASP Web Security Testing Guide',
          url: 'https://owasp.org/www-project-web-security-testing-guide/'
        },
        {
          title: 'PortSwigger Web Security Academy',
          url: 'https://portswigger.net/web-security'
        },
        {
          title: 'OWASP Cheat Sheet Series',
          url: 'https://cheatsheetseries.owasp.org/'
        }
      ]
    },

    // Week 7: System Hacking - Gaining Access
    {
      title: 'System Hacking - Gaining Access',
      description: 'Learn techniques to exploit vulnerabilities and gain initial access to target systems.',
      order: 7,
      duration: 210, // minutes
      content: `
# System Hacking: Gaining Access

## The System Hacking Process

System hacking is the process of gaining unauthorized access to computer systems by exploiting vulnerabilities. This module focuses on the initial access phase of the ethical hacking methodology.

## Pre-Attack Preparation

* Gathering target information
* Identifying potential vulnerabilities
* Selecting appropriate attack vectors
* Preparing exploitation environment

## Password Attacks

### Password Cracking Techniques
* **Dictionary Attacks**: Using wordlists
* **Brute Force Attacks**: Trying all possibilities
* **Rule-Based Attacks**: Applying transformation rules
* **Rainbow Table Attacks**: Precomputed hash chains

### Password Cracking Tools
* **Hashcat**: GPU-accelerated password cracking
* **John the Ripper**: Versatile password cracker
* **Hydra**: Online password attack tool
* **Medusa**: Parallel login brute-forcer

### Creating Custom Wordlists
* Target-specific wordlist generation
* Using CeWL for website scraping
* Customizing with rules and masks
* Optimizing for efficiency

## Vulnerability Exploitation

### Exploitation Frameworks
* **Metasploit Framework**
  * Architecture and components
  * Finding and selecting exploits
  * Payload selection and configuration
  * Post-exploitation modules

* **Empire/PowerShell Empire**
  * PowerShell-based post-exploitation
  * Listener setup and management
  * Stager generation and delivery

* **Cobalt Strike**
  * Commercial red team framework
  * Beacon payload and C2
  * Team collaboration features

### Common Exploitation Targets
* **Windows Vulnerabilities**
  * SMB vulnerabilities (EternalBlue, etc.)
  * RDP vulnerabilities
  * Windows privilege escalation

* **Linux Vulnerabilities**
  * Service misconfigurations
  * Kernel exploits
  * Linux privilege escalation

* **Network Service Vulnerabilities**
  * FTP, SSH, Telnet vulnerabilities
  * Web server exploits
  * Database server attacks

## Client-Side Attacks

### Social Engineering Attacks
* Phishing campaigns
* Spear phishing techniques
* Pretexting and impersonation

### Malicious File Attacks
* Macro-enabled documents
* Executable payloads
* PDF exploits
* HTA, VBS, and other file types

### Browser Exploitation
* Browser exploit frameworks
* Drive-by download attacks
* Browser plugin vulnerabilities

## Physical Access Attacks

### Physical Access Techniques
* USB attack vectors
* Boot sequence attacks
* BIOS/UEFI attacks

### Tools for Physical Access
* **Rubber Ducky**: HID attack tool
* **PoisonTap**: Network hijacking
* **LAN Turtle**: Covert network access

## Evasion Techniques

### Antivirus Evasion
* Signature-based detection bypass
* Behavior-based detection bypass
* Sandbox evasion techniques

### IDS/IPS Evasion
* Traffic fragmentation
* Protocol-level evasion
* Timing attacks

### Application Whitelisting Bypass
* Living off the land techniques
* Fileless malware approaches
* DLL hijacking and side-loading

## Gaining Persistence

* Startup folder persistence
* Registry modifications
* Scheduled tasks and cron jobs
* Service creation
* WMI event subscription

## Ethical Considerations and Legal Boundaries

* Authorized scope limitations
* Avoiding collateral damage
* Data protection requirements
* Documentation and evidence handling
      `,
      videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
      isPublished: true,
      publishedAt: new Date(),
      resources: [
        {
          title: 'Metasploit Unleashed',
          url: 'https://www.offensive-security.com/metasploit-unleashed/'
        },
        {
          title: 'Hashcat Documentation',
          url: 'https://hashcat.net/wiki/'
        },
        {
          title: 'MITRE ATT&CK Framework',
          url: 'https://attack.mitre.org/'
        }
      ]
    }
  ]
};
