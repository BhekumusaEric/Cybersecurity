/**
 * Penetration Testing Lab Environment Configuration
 *
 * This file defines the configuration for the Penetration Testing lab environment,
 * including the virtual machines, network settings, and connection details.
 * This lab simulates a corporate network with multiple targets for a full penetration test.
 */

const penetrationTestingLab = {
  id: 'penetration_testing',
  name: 'Corporate Network Penetration Testing Lab',
  description: 'A comprehensive lab environment for practicing full-scope penetration testing against a simulated corporate network with multiple targets and security layers.',
  difficulty: 'advanced',
  estimatedTime: 240, // minutes
  learningObjectives: [
    'Conduct a methodical penetration test following industry standards',
    'Perform reconnaissance and enumeration against a corporate network',
    'Exploit vulnerabilities to gain initial access',
    'Perform privilege escalation and lateral movement',
    'Maintain persistence in a compromised network',
    'Document findings and create a professional penetration testing report'
  ],
  prerequisites: [
    'Completion of Module 3: Network Security',
    'Completion of Module 4: Web Application Security',
    'Familiarity with penetration testing methodology',
    'Experience with basic exploitation techniques'
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
        disk: '40GB'
      },
      network: {
        ip: '10.0.0.10',
        subnet: '10.0.0.0/24',
        gateway: '10.0.0.1'
      },
      software: [
        {
          name: 'Metasploit Framework',
          version: '6.3.4',
          path: '/usr/bin/msfconsole',
          config: '/usr/share/metasploit-framework/config/database.yml',
          startup: 'service postgresql start && msfdb init'
        },
        {
          name: 'Nmap',
          version: '7.93',
          path: '/usr/bin/nmap',
          config: null,
          startup: null
        },
        {
          name: 'Burp Suite Community',
          version: '2023.1.2',
          path: '/usr/bin/burpsuite',
          config: '/home/kali/.BurpSuite/burp-defaults.json',
          startup: null
        },
        {
          name: 'Wireshark',
          version: '4.0.6',
          path: '/usr/bin/wireshark',
          config: '/home/kali/.config/wireshark/preferences',
          startup: 'chmod +x /usr/bin/dumpcap && setcap cap_net_raw,cap_net_admin+eip /usr/bin/dumpcap'
        },
        {
          name: 'Hydra',
          version: '9.4',
          path: '/usr/bin/hydra',
          config: null,
          startup: null
        },
        {
          name: 'John the Ripper',
          version: '1.9.0',
          path: '/usr/bin/john',
          config: '/home/kali/.john/john.conf',
          startup: null
        },
        {
          name: 'Hashcat',
          version: '6.2.6',
          path: '/usr/bin/hashcat',
          config: null,
          startup: null
        },
        {
          name: 'Responder',
          version: '3.1.3.0',
          path: '/usr/bin/responder',
          config: '/usr/share/responder/Responder.conf',
          startup: null
        }
      ],
      credentials: {
        username: 'kali',
        password: 'kali'
      }
    },
    {
      name: 'perimeter-router',
      displayName: 'Perimeter Router',
      image: 'vyos:1.4',
      role: 'network',
      resources: {
        cpu: 1,
        memory: '1GB',
        disk: '5GB'
      },
      network: {
        interfaces: [
          {
            name: 'eth0',
            ip: '10.0.0.1',
            subnet: '10.0.0.0/24'
          },
          {
            name: 'eth1',
            ip: '172.16.0.1',
            subnet: '172.16.0.0/24'
          }
        ]
      },
      vulnerabilities: [
        {
          name: 'Default Credentials',
          description: 'Router configured with default credentials',
          service: 'SSH',
          port: 22
        },
        {
          name: 'Misconfigured ACLs',
          description: 'Access control lists improperly configured allowing traffic between segments',
          impact: 'Network segmentation bypass'
        }
      ],
      credentials: {
        username: 'vyos',
        password: 'vyos'
      }
    },
    {
      name: 'web-server',
      displayName: 'Web Server',
      image: 'ubuntu:20.04',
      role: 'target',
      resources: {
        cpu: 2,
        memory: '2GB',
        disk: '20GB'
      },
      network: {
        ip: '172.16.0.10',
        subnet: '172.16.0.0/24',
        gateway: '172.16.0.1'
      },
      ports: [
        {
          container: 80,
          host: 8080
        },
        {
          container: 443,
          host: 8443
        },
        {
          container: 22,
          host: 2201
        }
      ],
      software: [
        {
          name: 'Apache',
          version: '2.4.41',
          config: '/etc/apache2/apache2.conf'
        },
        {
          name: 'PHP',
          version: '7.4.3',
          config: '/etc/php/7.4/apache2/php.ini'
        },
        {
          name: 'MySQL',
          version: '8.0.28',
          config: '/etc/mysql/mysql.conf.d/mysqld.cnf'
        }
      ],
      vulnerabilities: [
        {
          name: 'SQL Injection',
          description: 'The web application is vulnerable to SQL injection in the login form',
          path: '/login.php',
          parameter: 'username'
        },
        {
          name: 'File Upload Vulnerability',
          description: 'Unrestricted file upload allowing PHP files to be uploaded and executed',
          path: '/admin/upload.php'
        },
        {
          name: 'Outdated Apache Module',
          description: 'Running a vulnerable version of mod_cgi',
          cve: 'CVE-2021-44790'
        }
      ],
      credentials: {
        username: 'webadmin',
        password: 'Password123!'
      }
    },
    {
      name: 'file-server',
      displayName: 'File Server',
      image: 'ubuntu:20.04',
      role: 'target',
      resources: {
        cpu: 1,
        memory: '2GB',
        disk: '50GB'
      },
      network: {
        ip: '172.16.0.20',
        subnet: '172.16.0.0/24',
        gateway: '172.16.0.1'
      },
      ports: [
        {
          container: 22,
          host: 2202
        },
        {
          container: 445,
          host: 4450
        },
        {
          container: 139,
          host: 1390
        }
      ],
      software: [
        {
          name: 'Samba',
          version: '4.11.6',
          config: '/etc/samba/smb.conf'
        }
      ],
      vulnerabilities: [
        {
          name: 'Misconfigured Share Permissions',
          description: 'Anonymous access to sensitive shares',
          path: '//172.16.0.20/public'
        },
        {
          name: 'Weak Credentials',
          description: 'User accounts with weak passwords',
          accounts: ['user1:password', 'user2:123456']
        }
      ],
      credentials: {
        username: 'fileadmin',
        password: 'FileServer2023'
      }
    },
    {
      name: 'windows-server',
      displayName: 'Windows Domain Controller',
      image: 'windows-server:2019',
      role: 'target',
      resources: {
        cpu: 2,
        memory: '4GB',
        disk: '60GB'
      },
      network: {
        ip: '172.16.0.100',
        subnet: '172.16.0.0/24',
        gateway: '172.16.0.1'
      },
      ports: [
        {
          container: 3389,
          host: 33890
        },
        {
          container: 445,
          host: 4451
        },
        {
          container: 88,
          host: 880
        },
        {
          container: 389,
          host: 3890
        }
      ],
      software: [
        {
          name: 'Active Directory Domain Services',
          version: '2019'
        },
        {
          name: 'DNS Server',
          version: '2019'
        },
        {
          name: 'IIS',
          version: '10.0'
        }
      ],
      vulnerabilities: [
        {
          name: 'Kerberoasting',
          description: 'Service accounts with weak passwords vulnerable to Kerberoasting',
          accounts: ['svc_web', 'svc_sql']
        },
        {
          name: 'LLMNR/NBT-NS Poisoning',
          description: 'LLMNR and NBT-NS enabled and vulnerable to poisoning attacks'
        },
        {
          name: 'SMB Signing Disabled',
          description: 'SMB signing not enforced, allowing relay attacks'
        }
      ],
      credentials: {
        username: 'Administrator',
        password: 'P@ssw0rd2023!'
      }
    },
    {
      name: 'internal-workstation',
      displayName: 'Internal Workstation',
      image: 'windows:10',
      role: 'target',
      resources: {
        cpu: 2,
        memory: '4GB',
        disk: '40GB'
      },
      network: {
        ip: '172.16.0.150',
        subnet: '172.16.0.0/24',
        gateway: '172.16.0.1'
      },
      ports: [
        {
          container: 3389,
          host: 33891
        },
        {
          container: 445,
          host: 4452
        }
      ],
      vulnerabilities: [
        {
          name: 'Unpatched Operating System',
          description: 'Missing critical security updates',
          cve: 'CVE-2020-0796'
        },
        {
          name: 'Stored Credentials',
          description: 'Credentials stored in plaintext files',
          path: 'C:\\Users\\user\\Desktop\\passwords.txt'
        }
      ],
      credentials: {
        username: 'user',
        password: 'Password123'
      }
    }
  ],
  network: {
    name: 'corporate-network',
    segments: [
      {
        name: 'dmz',
        subnet: '10.0.0.0/24',
        gateway: '10.0.0.1'
      },
      {
        name: 'internal',
        subnet: '172.16.0.0/24',
        gateway: '172.16.0.1'
      }
    ],
    firewall_rules: [
      {
        source: '10.0.0.0/24',
        destination: '172.16.0.0/24',
        ports: [80, 443, 22],
        action: 'allow'
      },
      {
        source: '172.16.0.0/24',
        destination: '10.0.0.0/24',
        ports: 'any',
        action: 'allow'
      }
    ]
  },
  duration: 4 * 60 * 60, // 4 hours in seconds
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
        name: 'Windows Server',
        protocol: 'rdp',
        hostname: '${windows_server_ip}',
        port: 3389,
        username: 'Administrator',
        password: 'P@ssw0rd2023!'
      },
      {
        name: 'Windows Workstation',
        protocol: 'rdp',
        hostname: '${internal_workstation_ip}',
        port: 3389,
        username: 'user',
        password: 'Password123'
      }
    ]
  },
  tasks: [
    {
      id: 'task1',
      name: 'Reconnaissance and Enumeration',
      description: 'Perform reconnaissance and enumeration of the network to identify hosts, services, and potential entry points',
      hints: [
        'Start with network scanning to identify live hosts',
        'Use port scanning to identify services running on each host',
        'Look for information disclosure in web applications',
        'Check for default credentials on network devices'
      ],
      validation: {
        type: 'manual',
        criteria: [
          'Identified all hosts in the network',
          'Documented open ports and services',
          'Identified at least 3 potential vulnerabilities'
        ]
      }
    },
    {
      id: 'task2',
      name: 'Initial Access',
      description: 'Exploit a vulnerability to gain initial access to at least one system in the network',
      hints: [
        'Look for web application vulnerabilities',
        'Check for default or weak credentials',
        'Consider exploiting unpatched services'
      ],
      validation: {
        type: 'flag',
        target: 'web-server',
        flagLocation: '/var/www/html/flags/initial_access_flag.txt',
        value: 'PENTEST_INITIAL_ACCESS_COMPLETE'
      }
    },
    {
      id: 'task3',
      name: 'Privilege Escalation',
      description: 'Escalate privileges on a compromised system to gain administrative access',
      hints: [
        'Look for misconfigured permissions',
        'Check for vulnerable services running with elevated privileges',
        'Search for stored credentials or configuration files'
      ],
      validation: {
        type: 'flag',
        target: 'web-server',
        flagLocation: '/root/flags/privilege_escalation_flag.txt',
        value: 'PENTEST_PRIVILEGE_ESCALATION_COMPLETE'
      }
    },
    {
      id: 'task4',
      name: 'Lateral Movement',
      description: 'Move laterally through the network to access additional systems',
      hints: [
        'Use compromised credentials to access other systems',
        'Look for trust relationships between systems',
        'Consider pivoting through compromised hosts'
      ],
      validation: {
        type: 'flag',
        target: 'windows-server',
        flagLocation: 'C:\\flags\\lateral_movement_flag.txt',
        value: 'PENTEST_LATERAL_MOVEMENT_COMPLETE'
      }
    },
    {
      id: 'task5',
      name: 'Data Exfiltration',
      description: 'Locate and exfiltrate sensitive data from the compromised network',
      hints: [
        'Look for databases containing sensitive information',
        'Search for files with keywords like "password", "confidential", or "secret"',
        'Check user directories for valuable information'
      ],
      validation: {
        type: 'flag',
        target: 'windows-server',
        flagLocation: 'C:\\sensitive_data\\exfiltration_flag.txt',
        value: 'PENTEST_DATA_EXFILTRATION_COMPLETE'
      }
    }
  ],
  completionCriteria: {
    type: 'allTasks',
    requiredScore: 80
  },
  resources: [
    {
      name: 'OWASP Web Security Testing Guide',
      url: 'https://owasp.org/www-project-web-security-testing-guide/',
      type: 'documentation'
    },
    {
      name: 'Penetration Testing Execution Standard',
      url: 'http://www.pentest-standard.org/',
      type: 'methodology'
    },
    {
      name: 'Metasploit Unleashed',
      url: 'https://www.offensive-security.com/metasploit-unleashed/',
      type: 'tutorial'
    }
  ],
  deliverables: {
    required: [
      {
        name: 'Penetration Testing Report',
        description: 'A comprehensive report documenting the methodology, findings, and recommendations',
        template: '/templates/pentest_report_template.docx'
      }
    ],
    optional: [
      {
        name: 'Evidence Files',
        description: 'Screenshots, logs, and other evidence collected during the penetration test'
      },
      {
        name: 'Remediation Plan',
        description: 'Detailed recommendations for addressing the identified vulnerabilities'
      }
    ]
  }
};

export default penetrationTestingLab;
