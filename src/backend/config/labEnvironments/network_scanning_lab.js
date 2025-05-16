/**
 * Network Scanning Lab Environment Configuration
 * 
 * This file defines the configuration for the Network Scanning lab environment,
 * including the virtual machines, network settings, and connection details.
 */

const networkScanningLab = {
  id: 'network_scanning',
  name: 'Network Scanning Lab',
  description: 'A comprehensive lab environment for practicing network scanning techniques using industry-standard tools.',
  difficulty: 'beginner',
  estimatedTime: 120, // minutes
  learningObjectives: [
    'Discover active hosts on a network using various techniques',
    'Perform port scanning to identify open ports and services',
    'Fingerprint operating systems and service versions',
    'Analyze network scan results to identify potential vulnerabilities',
    'Document findings in a professional manner'
  ],
  prerequisites: [
    'Basic understanding of networking concepts',
    'Familiarity with Linux command line',
    'Completion of Module 2: Networking Fundamentals'
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
          name: 'Nmap',
          version: '7.93',
          path: '/usr/bin/nmap'
        },
        {
          name: 'Wireshark',
          version: '4.0.6',
          path: '/usr/bin/wireshark'
        },
        {
          name: 'Zenmap',
          version: '7.93',
          path: '/usr/bin/zenmap'
        },
        {
          name: 'Netcat',
          version: '1.10',
          path: '/usr/bin/nc'
        }
      ],
      credentials: {
        username: 'kali',
        password: 'kali'
      }
    },
    {
      name: 'metasploitable',
      displayName: 'Metasploitable 2',
      image: 'metasploitable:2',
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
      vulnerabilities: [
        {
          name: 'FTP Anonymous Access',
          description: 'The FTP server allows anonymous login',
          service: 'vsftpd 2.3.4',
          port: 21,
          cve: 'CVE-2011-2523'
        },
        {
          name: 'Unpatched SSH Server',
          description: 'Running outdated SSH server with known vulnerabilities',
          service: 'OpenSSH 4.7p1',
          port: 22,
          cve: 'CVE-2008-1483'
        },
        {
          name: 'Vulnerable Web Server',
          description: 'Running outdated Apache with vulnerable PHP version',
          service: 'Apache 2.2.8',
          port: 80,
          cve: 'CVE-2011-3192'
        },
        {
          name: 'Vulnerable SMB Service',
          description: 'Samba service with multiple vulnerabilities',
          service: 'Samba 3.0.20',
          port: 445,
          cve: 'CVE-2007-2447'
        },
        {
          name: 'Unprotected MySQL',
          description: 'MySQL with weak credentials',
          service: 'MySQL 5.0.51a',
          port: 3306,
          cve: 'N/A'
        }
      ],
      credentials: {
        username: 'msfadmin',
        password: 'msfadmin'
      }
    },
    {
      name: 'windows-target',
      displayName: 'Windows Server',
      image: 'windows-server:2016',
      role: 'target',
      resources: {
        cpu: 2,
        memory: '4GB',
        disk: '40GB'
      },
      network: {
        ip: '192.168.1.200',
        subnet: '192.168.1.0/24',
        gateway: '192.168.1.1'
      },
      vulnerabilities: [
        {
          name: 'SMB Vulnerabilities',
          description: 'Windows SMB service with potential misconfigurations',
          service: 'SMB',
          port: 445,
          cve: 'Various'
        },
        {
          name: 'RDP Exposed',
          description: 'Remote Desktop Protocol exposed to the network',
          service: 'RDP',
          port: 3389,
          cve: 'N/A'
        }
      ],
      credentials: {
        username: 'Administrator',
        password: 'Password123!'
      }
    }
  ],
  network: {
    name: 'lab-network',
    subnet: '192.168.1.0/24',
    gateway: '192.168.1.1',
    dns: ['8.8.8.8', '8.8.4.4']
  },
  duration: 2 * 60 * 60, // 2 hours in seconds
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
      },
      {
        name: 'Metasploitable',
        protocol: 'vnc',
        hostname: '${metasploitable_ip}',
        port: 5900,
        username: 'msfadmin',
        password: 'msfadmin'
      },
      {
        name: 'Windows Server',
        protocol: 'rdp',
        hostname: '${windows_target_ip}',
        port: 3389,
        username: 'Administrator',
        password: 'Password123!'
      }
    ]
  },
  tasks: [
    {
      id: 'task1',
      name: 'Host Discovery',
      description: 'Identify all active hosts on the 192.168.1.0/24 network',
      hints: [
        'Try using different scanning techniques (ARP, ICMP, TCP, UDP)',
        'The arp-scan tool is very effective for local networks',
        'Nmap\'s -sn option performs a ping scan without port scanning'
      ],
      validation: {
        type: 'hostCount',
        expectedHosts: ['192.168.1.1', '192.168.1.10', '192.168.1.100', '192.168.1.200'],
        minRequired: 3
      }
    },
    {
      id: 'task2',
      name: 'Port Scanning',
      description: 'Identify open ports and services on the discovered hosts',
      hints: [
        'Use different scan types (SYN, Connect, UDP)',
        'Try service version detection with -sV',
        'Focus on common ports first, then expand'
      ],
      validation: {
        type: 'portCount',
        targets: {
          '192.168.1.100': {
            minPorts: 5,
            mustInclude: [21, 22, 80]
          },
          '192.168.1.200': {
            minPorts: 3,
            mustInclude: [445, 3389]
          }
        }
      }
    },
    {
      id: 'task3',
      name: 'OS Fingerprinting',
      description: 'Determine the operating systems running on the target hosts',
      hints: [
        'Nmap\'s -O option performs OS detection',
        'Combine with -A for aggressive detection',
        'Look at TTL values in ping responses as a simple indicator'
      ],
      validation: {
        type: 'osDetection',
        targets: {
          '192.168.1.100': {
            os: 'Linux',
            minConfidence: 80
          },
          '192.168.1.200': {
            os: 'Windows',
            minConfidence: 80
          }
        }
      }
    },
    {
      id: 'task4',
      name: 'Vulnerability Identification',
      description: 'Identify potential vulnerabilities based on service versions',
      hints: [
        'Use Nmap\'s vulnerability scanning scripts (--script vuln)',
        'Research the versions of services you identified',
        'Look for outdated software versions'
      ],
      validation: {
        type: 'vulnerabilityCount',
        minRequired: 5
      }
    }
  ],
  completionCriteria: {
    type: 'allTasks',
    requiredScore: 80
  },
  resources: [
    {
      name: 'Nmap Documentation',
      url: 'https://nmap.org/book/man.html',
      type: 'documentation'
    },
    {
      name: 'Network Scanning Techniques',
      url: 'https://resources.infosecinstitute.com/topic/network-scanning-techniques/',
      type: 'article'
    },
    {
      name: 'SANS: Network Scanning Fundamentals',
      url: 'https://www.sans.org/blog/network-scanning-fundamentals/',
      type: 'article'
    }
  ]
};

export default networkScanningLab;
