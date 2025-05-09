# Network Scanning Lab Guide

## Overview

In this lab, you will learn how to perform network scanning using Nmap, one of the most powerful and widely used reconnaissance tools in cybersecurity. You will scan a target network to identify active hosts, open ports, running services, and potential vulnerabilities.

## Learning Objectives

By the end of this lab, you will be able to:

1. Use Nmap to discover active hosts on a network
2. Perform port scanning to identify open ports and services
3. Determine operating system information through OS fingerprinting
4. Detect service versions running on target systems
5. Generate and interpret Nmap scan reports
6. Understand how to use scanning results for further penetration testing

## Prerequisites

- Basic understanding of networking concepts (IP addresses, ports, protocols)
- Familiarity with the Linux command line
- Access to the lab environment (Kali Linux VM)

## Lab Environment

For this lab, you will use:

- Kali Linux as your attack machine
- Metasploitable 2 as your primary target
- Additional virtual machines in the target network

## Safety and Ethics Notice

Remember that scanning networks without permission is illegal and unethical. In this lab, you are only authorized to scan the provided virtual machines in the lab environment. Never use these techniques against systems without explicit written permission.

## Lab Tasks

### Task 1: Network Discovery

1. Open a terminal in your Kali Linux VM
2. Identify your own IP address using:
   ```
   ip addr show
   ```
3. Perform a ping sweep to discover active hosts:
   ```
   sudo nmap -sn 192.168.1.0/24
   ```
4. Record all active IP addresses found in the target network

### Task 2: Basic Port Scanning

1. Perform a basic TCP scan on the Metasploitable machine:
   ```
   sudo nmap 192.168.1.X
   ```
   (Replace X with the IP of your Metasploitable VM)
2. Analyze the results and identify open ports
3. Perform a more comprehensive scan:
   ```
   sudo nmap -p 1-65535 192.168.1.X
   ```
4. Compare the results with the default scan

### Task 3: Service and Version Detection

1. Perform a service version detection scan:
   ```
   sudo nmap -sV 192.168.1.X
   ```
2. Identify the services running on each open port
3. Note any outdated or potentially vulnerable services
4. Perform a more aggressive version scan:
   ```
   sudo nmap -sV --version-intensity 9 192.168.1.X
   ```

### Task 4: OS Fingerprinting

1. Perform OS detection:
   ```
   sudo nmap -O 192.168.1.X
   ```
2. Record the operating system details detected
3. Run a more comprehensive scan combining OS and service detection:
   ```
   sudo nmap -A 192.168.1.X
   ```

### Task 5: Stealth Scanning

1. Perform a SYN scan (half-open scanning):
   ```
   sudo nmap -sS 192.168.1.X
   ```
2. Compare the results with the full TCP connect scan
3. Discuss the advantages and disadvantages of stealth scanning

### Task 6: Vulnerability Scanning with NSE Scripts

1. List available vulnerability scanning scripts:
   ```
   ls /usr/share/nmap/scripts/*vuln*
   ```
2. Run a vulnerability scan using NSE scripts:
   ```
   sudo nmap --script vuln 192.168.1.X
   ```
3. Analyze the results and identify potential vulnerabilities

### Task 7: Saving and Analyzing Results

1. Save scan results in all formats:
   ```
   sudo nmap -A 192.168.1.X -oA scan_results
   ```
2. Examine the different output files:
   - scan_results.nmap (normal output)
   - scan_results.xml (XML format)
   - scan_results.gnmap (grepable format)
3. Use the XML output to generate an HTML report:
   ```
   xsltproc scan_results.xml -o scan_results.html
   ```

## Questions for Analysis

1. Which ports were found open on the Metasploitable machine and what services were running on them?
2. What operating system was detected on the target machine?
3. Which services appeared to be running outdated versions?
4. What potential vulnerabilities were identified by the NSE scripts?
5. How would you prioritize these vulnerabilities for further exploitation?
6. What additional information would you need to gather before attempting exploitation?

## Submission Requirements

Submit a detailed report including:

1. Screenshots of all key scan results
2. Answers to the analysis questions
3. A summary of potential security issues identified
4. Recommendations for securing the vulnerable services found

## Additional Challenges

If you complete the main tasks, try these additional challenges:

1. Perform a scan with timing options to evade detection:
   ```
   sudo nmap -T2 -f 192.168.1.X
   ```
2. Use Nmap scripting to perform banner grabbing:
   ```
   sudo nmap --script banner 192.168.1.X
   ```
3. Attempt to identify web applications using HTTP-specific scripts:
   ```
   sudo nmap --script http-enum 192.168.1.X
   ```

## Resources

- [Nmap Official Documentation](https://nmap.org/book/man.html)
- [Nmap NSE Scripts](https://nmap.org/nsedoc/)
- [SANS Nmap Cheat Sheet](https://www.sans.org/security-resources/sec560/netcat_cheat_sheet_v1.pdf)

## Troubleshooting

If you encounter issues:

1. Verify that all VMs are running and properly networked
2. Ensure you're using sudo for scans that require raw socket access
3. Check that your Kali VM has internet access for any script updates
4. Consult the lab instructor if you encounter persistent problems
