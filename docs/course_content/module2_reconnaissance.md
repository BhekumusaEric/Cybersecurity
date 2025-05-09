# Module 2: Reconnaissance and Footprinting

## Overview

This module covers reconnaissance and footprinting techniques used in the initial phase of ethical hacking. You'll learn how to gather information about target systems and networks using both passive and active methods.

## Learning Objectives

By the end of this module, you will be able to:

1. Distinguish between passive and active reconnaissance
2. Utilize OSINT (Open Source Intelligence) tools and techniques
3. Perform domain and DNS reconnaissance
4. Identify organizational information through various sources
5. Document and organize reconnaissance findings effectively

## 2.1 Introduction to Reconnaissance

### What is Reconnaissance?

Reconnaissance, also known as information gathering or footprinting, is the first phase in the ethical hacking methodology. It involves collecting information about a target system, network, or organization to identify potential entry points and vulnerabilities.

Effective reconnaissance provides the foundation for all subsequent phases of a penetration test. The more information you gather, the more likely you are to identify security weaknesses that can be exploited.

### Types of Reconnaissance

Reconnaissance can be categorized into two main types:

#### Passive Reconnaissance

Passive reconnaissance involves gathering information without directly interacting with the target. This approach is stealthy as it doesn't generate any suspicious traffic or alerts on the target's systems.

Examples of passive reconnaissance include:
- Searching public records and databases
- Analyzing social media profiles
- Reviewing company websites and job postings
- Examining search engine results
- Analyzing WHOIS records
- Studying news articles and press releases

#### Active Reconnaissance

Active reconnaissance involves direct interaction with the target system or network. This approach is more intrusive and may be detected by security monitoring systems.

Examples of active reconnaissance include:
- DNS queries
- Port scanning
- Network mapping
- Banner grabbing
- Social engineering calls
- Email phishing attempts

### The Importance of Reconnaissance

Thorough reconnaissance is critical for several reasons:

1. **Expanded Attack Surface**: Discovering all potential entry points into a target system
2. **Vulnerability Identification**: Finding weaknesses in the target's security posture
3. **Resource Optimization**: Focusing efforts on the most promising attack vectors
4. **Risk Reduction**: Minimizing the chance of detection during later phases
5. **Comprehensive Testing**: Ensuring all aspects of the target are evaluated

## 2.2 Passive Reconnaissance Techniques

### WHOIS Lookups

WHOIS databases contain registration information for domain names and IP addresses. This information can reveal:

- Domain registrar
- Registration dates
- Expiration dates
- Registrant contact information (if not private)
- Name servers

**Tools for WHOIS lookups:**
- `whois` command-line tool
- Online services like whois.domaintools.com
- ICANN WHOIS Lookup

**Example WHOIS query:**
```
$ whois example.com
```

### DNS Reconnaissance

DNS (Domain Name System) records provide valuable information about a target's infrastructure:

- **A Records**: Map domain names to IPv4 addresses
- **AAAA Records**: Map domain names to IPv6 addresses
- **CNAME Records**: Canonical names (aliases) for domains
- **MX Records**: Mail exchange servers
- **NS Records**: Name servers for the domain
- **TXT Records**: Text information, often used for verification
- **SOA Records**: Start of Authority records with administrative information

**Tools for DNS reconnaissance:**
- `dig` and `nslookup` command-line tools
- DNSRecon
- Fierce

**Example DNS query:**
```
$ dig example.com ANY
```

### Search Engine Reconnaissance

Search engines index vast amounts of information that can be leveraged for reconnaissance:

- **Google Dorks**: Advanced search operators to find specific information
- **Cached Pages**: Historical versions of websites
- **File Type Searches**: Finding specific document types (PDF, DOCX, XLSX)
- **Site-Specific Searches**: Targeting information within a specific domain

**Example Google dorks:**
- `site:example.com filetype:pdf` (Find PDF files on a specific domain)
- `site:example.com inurl:admin` (Find admin pages)
- `site:example.com intitle:confidential` (Find pages with "confidential" in the title)

### Social Media Intelligence

Social media platforms contain a wealth of information about organizations and their employees:

- **LinkedIn**: Employee information, job titles, technologies used
- **Twitter**: Company announcements, employee interactions
- **Facebook**: Events, office locations, organizational culture
- **Instagram**: Physical security details, office layouts, employee badges

**OSINT tools for social media:**
- Maltego
- Social-Analyzer
- LinkedIn2Username

### Website Analysis

Analyzing a target's website can reveal:

- Technologies and frameworks used
- Server information
- Hidden directories and files
- Metadata in images and documents
- Comments in source code

**Tools for website analysis:**
- Wappalyzer
- BuiltWith
- HTTrack Website Copier
- ExifTool (for metadata extraction)

## 2.3 Active Reconnaissance Techniques

### Network Scanning

Network scanning involves sending packets to target systems to discover hosts, open ports, and services:

- **Ping Sweeps**: Identify active hosts on a network
- **Port Scanning**: Determine open ports and services
- **Service Enumeration**: Identify specific services and versions
- **OS Fingerprinting**: Determine the operating system of target hosts

**Tools for network scanning:**
- Nmap
- Masscan
- Angry IP Scanner

**Example Nmap command:**
```
$ nmap -A -T4 example.com
```

### DNS Zone Transfers

A DNS zone transfer is a type of DNS transaction where a DNS server passes a copy of part of its database (zone) to another DNS server. While this is a legitimate function, it can be exploited if not properly secured:

**Example zone transfer attempt:**
```
$ dig axfr @ns1.example.com example.com
```

### Web Application Enumeration

Web application enumeration involves identifying:

- Directories and files
- Parameters and input fields
- Authentication mechanisms
- Error handling behavior
- API endpoints

**Tools for web application enumeration:**
- Dirb
- Gobuster
- Burp Suite
- OWASP ZAP

**Example directory brute force:**
```
$ gobuster dir -u https://example.com -w /usr/share/wordlists/dirb/common.txt
```

### Email Harvesting

Email harvesting involves collecting email addresses associated with a target organization:

**Tools for email harvesting:**
- theHarvester
- Hunter.io
- Email-Checker

**Example theHarvester command:**
```
$ theHarvester -d example.com -b all
```

## 2.4 OSINT Frameworks and Tools

### Maltego

Maltego is a powerful OSINT and graphical link analysis tool that provides a visual representation of relationships between pieces of information:

- Entities (people, companies, domains, etc.)
- Transforms (actions that discover new entities)
- Graph visualization of connections

### Shodan

Shodan is a search engine for Internet-connected devices:

- IoT devices
- Industrial control systems
- Servers and networking equipment
- Webcams and security systems

### OSINT Framework

The OSINT Framework is a collection of various OSINT tools categorized by their function:

- Domain/IP research
- Email search
- Username search
- People search
- Social media analysis
- Image analysis

### Recon-ng

Recon-ng is a full-featured reconnaissance framework with modules for:

- Domain enumeration
- Contact harvesting
- Vulnerability identification
- Reporting

## 2.5 Documenting Reconnaissance Findings

### Importance of Documentation

Proper documentation of reconnaissance findings is crucial for:

- Organizing large amounts of information
- Identifying patterns and connections
- Sharing information with team members
- Creating comprehensive reports
- Planning subsequent testing phases

### Documentation Methods

Effective documentation methods include:

- **Mind Maps**: Visual representation of information and relationships
- **Spreadsheets**: Structured data organization
- **Databases**: Searchable repositories of findings
- **Note-Taking Tools**: Centralized information storage
- **Screenshots**: Visual evidence of findings

### Tools for Documentation

- CherryTree
- OneNote
- Notion
- Joplin
- GitLab/GitHub wikis

## 2.6 Legal and Ethical Considerations

### Legal Boundaries

When performing reconnaissance, it's essential to understand legal boundaries:

- Unauthorized access to systems is illegal
- Some active reconnaissance techniques may violate laws
- Privacy laws may restrict certain types of information gathering
- Different jurisdictions have different legal frameworks

### Ethical Guidelines

Ethical considerations for reconnaissance include:

- Only perform reconnaissance within the scope of your authorization
- Respect privacy and confidentiality
- Avoid disrupting normal operations
- Document your activities thoroughly
- Report findings responsibly

## Summary

In this module, we've covered the fundamental concepts and techniques of reconnaissance and footprinting:

- The difference between passive and active reconnaissance
- Various techniques for gathering information without direct interaction
- Methods for active information gathering
- OSINT frameworks and tools
- Documentation best practices
- Legal and ethical considerations

Effective reconnaissance provides the foundation for a successful penetration test. By gathering comprehensive information about your target, you can identify potential vulnerabilities and entry points that will guide your subsequent testing activities.

## Additional Resources

### Books
- "Open Source Intelligence Techniques" by Michael Bazzell
- "OSINT: How to Find Information About Anyone" by Jason Martin
- "Penetration Testing: A Hands-On Introduction to Hacking" by Georgia Weidman

### Websites
- OSINT Framework: https://osintframework.com/
- IntelTechniques: https://inteltechniques.com/
- SANS OSINT Resources: https://www.sans.org/blog/list-of-resource-links-from-open-source-intelligence-summit-2019/

### Tools
- Maltego: https://www.maltego.com/
- Shodan: https://www.shodan.io/
- Recon-ng: https://github.com/lanmaster53/recon-ng
- theHarvester: https://github.com/laramies/theHarvester

## Module Quiz

Test your understanding of the concepts covered in this module by completing the quiz in the learning management system.
