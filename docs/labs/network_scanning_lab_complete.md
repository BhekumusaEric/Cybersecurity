# Network Scanning Lab: Comprehensive Guide

## Overview

This lab provides hands-on experience with network scanning techniques using industry-standard tools. You will learn how to discover hosts, identify open ports, detect running services, and fingerprint operating systems in a controlled environment. These skills are fundamental for the reconnaissance phase of ethical hacking.

## Learning Objectives

By completing this lab, you will be able to:

1. Discover active hosts on a network using various techniques
2. Perform port scanning to identify open ports and services
3. Fingerprint operating systems and service versions
4. Analyze network scan results to identify potential vulnerabilities
5. Document findings in a professional manner
6. Understand the implications of different scanning techniques

## Lab Environment

This lab uses a controlled network with the following components:

- **Kali Linux** (Attacker Machine): A security-focused Linux distribution with pre-installed penetration testing tools
- **Metasploitable 2** (Target 1): A deliberately vulnerable Linux server designed for security training
- **Windows Server 2016** (Target 2): A Windows server with common misconfigurations
- **Network Infrastructure**: Includes a router and proper network segmentation

### Network Topology

```
                   +-------------+
                   |   Router    |
                   | 192.168.1.1 |
                   +-------------+
                          |
                          |
         +----------------+----------------+
         |                |                |
+----------------+ +----------------+ +----------------+
|  Kali Linux    | | Metasploitable | | Windows Server |
| 192.168.1.10   | | 192.168.1.100  | | 192.168.1.200  |
+----------------+ +----------------+ +----------------+
```

## Required Tools

- **Nmap**: Network scanning and host discovery
- **Wireshark**: Network protocol analyzer
- **Zenmap**: GUI for Nmap (optional)
- **Netcat**: Versatile networking utility
- **Ping/Traceroute**: Basic network diagnostic tools

## Lab Tasks

### Task 1: Host Discovery

#### Objective
Identify all active hosts on the 192.168.1.0/24 network.

#### Steps

1. **ARP Scan** (fastest for local networks):
   ```bash
   sudo arp-scan --interface=eth0 192.168.1.0/24
   ```

2. **ICMP Echo Scan** (ping sweep):
   ```bash
   sudo nmap -sn -PE 192.168.1.0/24
   ```

3. **TCP SYN Ping Scan**:
   ```bash
   sudo nmap -sn -PS22,80,443 192.168.1.0/24
   ```

4. **UDP Ping Scan**:
   ```bash
   sudo nmap -sn -PU53,161 192.168.1.0/24
   ```

5. **Document all discovered hosts** in the following format:
   - IP Address
   - MAC Address (if available)
   - Hostname (if resolved)
   - Response time

#### Expected Results
You should discover at least 3 hosts (router, Metasploitable, Windows Server) plus your Kali machine.

### Task 2: Port Scanning

#### Objective
Identify open ports and services on the discovered hosts.

#### Steps

1. **TCP SYN Scan** (stealthy, doesn't complete connections):
   ```bash
   sudo nmap -sS 192.168.1.100
   sudo nmap -sS 192.168.1.200
   ```

2. **TCP Connect Scan** (completes the TCP handshake):
   ```bash
   nmap -sT 192.168.1.100
   nmap -sT 192.168.1.200
   ```

3. **UDP Scan** (for services like DNS, SNMP):
   ```bash
   sudo nmap -sU --top-ports=20 192.168.1.100
   sudo nmap -sU --top-ports=20 192.168.1.200
   ```

4. **Service Version Detection**:
   ```bash
   sudo nmap -sV 192.168.1.100
   sudo nmap -sV 192.168.1.200
   ```

5. **Document all open ports** for each host in the following format:
   - Port number
   - Protocol (TCP/UDP)
   - Service name
   - Service version (if detected)

#### Expected Results
- Metasploitable should have numerous open ports including 21 (FTP), 22 (SSH), 23 (Telnet), 80 (HTTP)
- Windows Server should have ports like 135 (RPC), 139/445 (SMB), 3389 (RDP)

### Task 3: OS Fingerprinting

#### Objective
Determine the operating systems running on the target hosts.

#### Steps

1. **Nmap OS Detection**:
   ```bash
   sudo nmap -O 192.168.1.100
   sudo nmap -O 192.168.1.200
   ```

2. **Aggressive Detection** (combines OS detection, version detection, script scanning, and traceroute):
   ```bash
   sudo nmap -A 192.168.1.100
   sudo nmap -A 192.168.1.200
   ```

3. **Document OS information** for each host:
   - OS name and version
   - Confidence level of the detection
   - Device type (server, router, etc.)
   - OS family

#### Expected Results
- Metasploitable should be identified as Linux (likely Ubuntu)
- Windows Server should be identified as Windows Server 2016

### Task 4: Vulnerability Identification

#### Objective
Identify potential vulnerabilities based on service versions.

#### Steps

1. **Run Nmap with vulnerability scanning scripts**:
   ```bash
   sudo nmap --script vuln 192.168.1.100
   sudo nmap --script vuln 192.168.1.200
   ```

2. **Targeted service scanning**:
   ```bash
   # For FTP
   sudo nmap --script=ftp-* 192.168.1.100 -p 21
   
   # For SMB
   sudo nmap --script=smb-* 192.168.1.200 -p 445
   ```

3. **Document potential vulnerabilities** for each service:
   - Vulnerability name/ID
   - Affected service and version
   - Potential impact
   - CVE number (if available)

#### Expected Results
You should identify several vulnerabilities, particularly on Metasploitable which is intentionally vulnerable.

### Task 5: Network Traffic Analysis

#### Objective
Analyze network traffic generated by different scanning techniques.

#### Steps

1. **Start Wireshark** on your Kali machine to capture traffic.

2. **Perform different types of scans** while capturing:
   - A stealthy SYN scan
   - A full connect scan
   - A UDP scan

3. **Analyze the captured traffic** and document:
   - Differences in packet types between scan methods
   - Volume of traffic generated
   - Potential indicators that could be used to detect each scan type
   - How a firewall might respond to each scan type

#### Expected Results
You should observe different packet patterns for each scan type, with SYN scans showing incomplete connections.

## Completion Criteria

To successfully complete this lab, you must:

1. Identify all live hosts on the network (at least 3 plus your Kali machine)
2. Discover at least 10 open ports across all targets
3. Correctly identify the operating system of each target
4. Find at least 5 potential vulnerabilities
5. Document your methodology and findings in a professional report format

## Lab Report Template

Your lab report should include:

### 1. Executive Summary
Brief overview of what you did and what you found.

### 2. Methodology
Detailed description of the tools and commands used.

### 3. Findings
#### Host Discovery Results
| IP Address | MAC Address | Hostname | Status |
|------------|-------------|----------|--------|
| 192.168.1.1 | 00:11:22:33:44:55 | router | Active |
| ... | ... | ... | ... |

#### Port Scan Results
| IP Address | Port | Protocol | Service | Version | Status |
|------------|------|----------|---------|---------|--------|
| 192.168.1.100 | 22 | TCP | SSH | OpenSSH 4.7p1 | Open |
| ... | ... | ... | ... | ... | ... |

#### OS Detection Results
| IP Address | OS | Confidence | Device Type |
|------------|----|-----------| ------------|
| 192.168.1.100 | Ubuntu 8.04 | 98% | Linux Server |
| ... | ... | ... | ... |

#### Vulnerability Assessment
| IP Address | Service | Vulnerability | CVE | Severity |
|------------|---------|---------------|-----|----------|
| 192.168.1.100 | FTP | Anonymous login | CVE-2020-XXXX | High |
| ... | ... | ... | ... | ... |

### 4. Recommendations
Suggestions for remediation of identified vulnerabilities.

### 5. Conclusion
Summary of the lab experience and key takeaways.

## Additional Challenges

If you complete the main tasks quickly, try these additional challenges:

1. **Evasion Techniques**: Try different timing options (-T0 to -T5) and evasion techniques to avoid detection
2. **Script Development**: Write a custom NSE script for Nmap to check for a specific vulnerability
3. **Automation**: Create a Bash script that automates the entire scanning process and generates a report
4. **Comparison**: Compare the results of Nmap with other scanning tools like Masscan or Unicornscan
