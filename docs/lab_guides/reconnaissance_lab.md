# Reconnaissance and OSINT Lab Guide

## Overview

In this lab, you will practice various reconnaissance and Open Source Intelligence (OSINT) techniques to gather information about a target organization. You will use both passive and active methods to collect data that could be valuable in a security assessment.

## Learning Objectives

By the end of this lab, you will be able to:

1. Perform passive reconnaissance using public resources
2. Utilize OSINT tools to gather information about domains and organizations
3. Conduct DNS enumeration to map network infrastructure
4. Extract metadata from documents and websites
5. Document and organize reconnaissance findings effectively
6. Understand the ethical and legal boundaries of information gathering

## Prerequisites

- Basic understanding of networking concepts
- Familiarity with the Linux command line
- Access to the lab environment (Kali Linux VM)
- Understanding of DNS and web technologies

## Lab Environment

For this lab, you will use:

- Kali Linux as your primary platform
- Various OSINT tools pre-installed in Kali
- A fictional target company: "Acme Security Solutions"

## Safety and Ethics Notice

Remember that unauthorized reconnaissance against real organizations without permission is illegal and unethical. In this lab, you are only authorized to gather information about the fictional company provided in the lab environment. Never use these techniques against systems without explicit written permission.

## Lab Tasks

### Task 1: Passive Domain Reconnaissance

1. Open a terminal in your Kali Linux VM
2. Perform a WHOIS lookup on the target domain:
   ```
   whois acmesecurity.lab
   ```
3. Record the following information:
   - Domain registrar
   - Registration date
   - Expiration date
   - Name servers
   - Administrative contact (if available)

4. Use the `host` command to find basic DNS information:
   ```
   host -a acmesecurity.lab
   ```

5. Use `dig` to query different DNS record types:
   ```
   dig acmesecurity.lab A
   dig acmesecurity.lab MX
   dig acmesecurity.lab NS
   dig acmesecurity.lab TXT
   ```

6. Document all IP addresses, mail servers, and name servers discovered

### Task 2: Subdomain Enumeration

1. Use Sublist3r to discover subdomains:
   ```
   sublist3r -d acmesecurity.lab
   ```

2. Try another tool like Amass for comparison:
   ```
   amass enum -d acmesecurity.lab
   ```

3. Verify discovered subdomains with DNS resolution:
   ```
   host [subdomain].acmesecurity.lab
   ```

4. Create a list of all valid subdomains and their corresponding IP addresses

### Task 3: Web-Based OSINT

1. Use search engines to find information about Acme Security Solutions:
   - Google: `site:acmesecurity.lab`
   - Google: `filetype:pdf site:acmesecurity.lab`
   - Google: `inurl:admin site:acmesecurity.lab`

2. Check for cached versions of the website:
   - Visit `cache:acmesecurity.lab` in Google

3. Use the Wayback Machine to find historical versions of the website:
   - Visit archive.org and enter acmesecurity.lab

4. Document any interesting findings, including:
   - Company structure
   - Employee names and positions
   - Technologies used
   - Documents and files discovered

### Task 4: Website Technology Analysis

1. Install the Wappalyzer browser extension in Firefox
2. Visit the main Acme Security website and analyze the technologies used
3. View the page source to look for:
   - Comments that might contain sensitive information
   - Hidden directories or files
   - API endpoints
   - JavaScript libraries and versions

4. Use the `whatweb` tool for additional information:
   ```
   whatweb acmesecurity.lab
   ```

5. Document all technologies, frameworks, and potential vulnerabilities identified

### Task 5: Document Metadata Extraction

1. Download PDF files from the target website:
   ```
   wget -r -l 1 -A .pdf https://acmesecurity.lab
   ```

2. Use ExifTool to extract metadata from the downloaded files:
   ```
   exiftool *.pdf
   ```

3. Look for the following information in the metadata:
   - Author names
   - Creation and modification dates
   - Software used to create the documents
   - Printer information
   - Location data

4. Document all findings in your report

### Task 6: Email Harvesting

1. Use theHarvester to find email addresses associated with the domain:
   ```
   theHarvester -d acmesecurity.lab -b all
   ```

2. Try the hunter.io website to find additional email addresses
   
3. Identify the email naming convention used by the organization (e.g., firstname.lastname@domain.com)

4. Create a list of all discovered email addresses and their sources

### Task 7: Social Media Intelligence

1. Search for the company on major social media platforms:
   - LinkedIn
   - Twitter
   - Facebook
   - Instagram

2. For each platform, document:
   - Company profile information
   - Key employees and their roles
   - Recent announcements or news
   - Office locations and photos
   - Technologies mentioned

3. Use a tool like Social-Analyzer to automate some of this process:
   ```
   social-analyzer -t acmesecurity
   ```

### Task 8: Network Infrastructure Mapping

1. Based on the information gathered so far, create a map of the target's network infrastructure
2. Use tools like Maltego to visualize relationships between different entities
3. Your map should include:
   - Domain names and subdomains
   - IP addresses and ranges
   - Mail servers
   - Web servers
   - Cloud services
   - Geographic locations

### Task 9: Shodan Reconnaissance

1. Visit shodan.io and search for the IP addresses discovered earlier
2. Look for:
   - Open ports and services
   - Vulnerable software versions
   - Internet-facing devices
   - Geographic information

3. Use the Shodan CLI tool for more detailed searches:
   ```
   shodan search org:"Acme Security Solutions"
   ```

4. Document all findings in your report

### Task 10: Reporting and Analysis

1. Compile all your findings into a comprehensive reconnaissance report
2. Organize the information into the following sections:
   - Executive Summary
   - Domain Information
   - Network Infrastructure
   - Web Technologies
   - Email and Social Media Presence
   - Potential Security Issues
   - Recommendations

3. Create visualizations to represent the data, such as:
   - Network diagrams
   - Organizational charts
   - Timeline of discoveries

## Questions for Analysis

1. What was the most valuable piece of information you discovered during the reconnaissance phase?
2. How could the target organization improve their security posture to limit the information available through passive reconnaissance?
3. Which OSINT technique provided the most useful results? Why?
4. What potential attack vectors did you identify based on your reconnaissance findings?
5. How would your approach differ if this were a real-world penetration test?
6. What legal or ethical concerns might arise during reconnaissance activities?

## Submission Requirements

Submit a detailed report including:

1. Answers to all the questions in each task
2. Screenshots of key findings
3. A comprehensive list of all information gathered
4. Analysis of potential security implications
5. Recommendations for improving security posture
6. Answers to the analysis questions

## Additional Challenges

If you complete the main tasks, try these additional challenges:

1. Create a custom wordlist based on the target organization for potential password attacks
2. Develop a script to automate some of the reconnaissance tasks
3. Use Recon-ng to perform additional reconnaissance and compare the results
4. Create a more advanced visualization of the target's infrastructure using Maltego

## Resources

- [OSINT Framework](https://osintframework.com/)
- [Google Hacking Database](https://www.exploit-db.com/google-hacking-database)
- [Shodan Documentation](https://help.shodan.io/)
- [Maltego Documentation](https://docs.maltego.com/)

## Troubleshooting

If you encounter issues:

1. Ensure your Kali VM has internet access
2. Check that you're using the correct domain name (acmesecurity.lab)
3. Some tools may require API keys for full functionality
4. If a tool fails, try an alternative with similar capabilities
5. Consult the lab instructor if you encounter persistent problems
