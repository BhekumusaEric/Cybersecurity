import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Lab environment configuration
const LAB_PROVIDER = process.env.LAB_PROVIDER || 'local';
const LAB_API_KEY = process.env.LAB_API_KEY;
const LAB_API_URL = process.env.LAB_API_URL;

// Lab environment templates
const labTemplates = {
  // Network scanning lab
  'network_scanning': {
    name: 'Network Scanning Lab',
    description: 'Lab environment for practicing network scanning techniques',
    machines: [
      {
        name: 'kali',
        image: 'kali-linux:latest',
        role: 'attacker',
        resources: {
          cpu: 2,
          memory: '4GB',
          disk: '20GB'
        },
        network: {
          ip: '192.168.1.10',
          subnet: '192.168.1.0/24'
        }
      },
      {
        name: 'metasploitable',
        image: 'metasploitable:2',
        role: 'target',
        resources: {
          cpu: 1,
          memory: '2GB',
          disk: '10GB'
        },
        network: {
          ip: '192.168.1.100',
          subnet: '192.168.1.0/24'
        }
      },
      {
        name: 'windows-target',
        image: 'windows-server:2016',
        role: 'target',
        resources: {
          cpu: 2,
          memory: '4GB',
          disk: '40GB'
        },
        network: {
          ip: '192.168.1.200',
          subnet: '192.168.1.0/24'
        }
      }
    ],
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
    }
  },
  
  // Web application security lab
  'web_app_security': {
    name: 'Web Application Security Lab',
    description: 'Lab environment for practicing web application security testing',
    machines: [
      {
        name: 'kali',
        image: 'kali-linux:latest',
        role: 'attacker',
        resources: {
          cpu: 2,
          memory: '4GB',
          disk: '20GB'
        },
        network: {
          ip: '192.168.1.10',
          subnet: '192.168.1.0/24'
        }
      },
      {
        name: 'dvwa',
        image: 'dvwa:latest',
        role: 'target',
        resources: {
          cpu: 1,
          memory: '2GB',
          disk: '10GB'
        },
        network: {
          ip: '192.168.1.100',
          subnet: '192.168.1.0/24'
        },
        ports: [
          {
            container: 80,
            host: 8080
          }
        ]
      },
      {
        name: 'juice-shop',
        image: 'juice-shop:latest',
        role: 'target',
        resources: {
          cpu: 1,
          memory: '2GB',
          disk: '10GB'
        },
        network: {
          ip: '192.168.1.101',
          subnet: '192.168.1.0/24'
        },
        ports: [
          {
            container: 3000,
            host: 3000
          }
        ]
      }
    ],
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
        }
      ]
    }
  }
};

// Lab environment service
const labEnvironmentService = {
  // Start a lab environment
  startLabEnvironment: async (labId, userId, templateId) => {
    try {
      logger.info(`Starting lab environment for lab ${labId}, user ${userId}, template ${templateId}`);
      
      // In a real implementation, this would call the lab provider API
      // For now, we'll just return a mock response
      
      const template = labTemplates[templateId] || labTemplates.network_scanning;
      
      return {
        id: `lab-${Date.now()}`,
        labId,
        userId,
        templateId,
        status: 'running',
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + template.duration * 1000),
        accessUrl: `https://labs.example.com/access/${labId}/${userId}`,
        machines: template.machines.map(machine => ({
          name: machine.name,
          ip: machine.network.ip,
          status: 'running'
        }))
      };
    } catch (error) {
      logger.error(`Error starting lab environment: ${error.message}`);
      throw error;
    }
  },
  
  // Stop a lab environment
  stopLabEnvironment: async (environmentId) => {
    try {
      logger.info(`Stopping lab environment ${environmentId}`);
      
      // In a real implementation, this would call the lab provider API
      // For now, we'll just return a mock response
      
      return {
        id: environmentId,
        status: 'stopped',
        stoppedAt: new Date()
      };
    } catch (error) {
      logger.error(`Error stopping lab environment: ${error.message}`);
      throw error;
    }
  },
  
  // Reset a lab environment
  resetLabEnvironment: async (environmentId) => {
    try {
      logger.info(`Resetting lab environment ${environmentId}`);
      
      // In a real implementation, this would call the lab provider API
      // For now, we'll just return a mock response
      
      return {
        id: environmentId,
        status: 'running',
        resetAt: new Date()
      };
    } catch (error) {
      logger.error(`Error resetting lab environment: ${error.message}`);
      throw error;
    }
  },
  
  // Get lab environment status
  getLabEnvironmentStatus: async (environmentId) => {
    try {
      logger.info(`Getting status for lab environment ${environmentId}`);
      
      // In a real implementation, this would call the lab provider API
      // For now, we'll just return a mock response
      
      return {
        id: environmentId,
        status: 'running',
        startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        expiresAt: new Date(Date.now() + 90 * 60 * 1000), // 90 minutes from now
        machines: [
          {
            name: 'kali',
            ip: '192.168.1.10',
            status: 'running'
          },
          {
            name: 'metasploitable',
            ip: '192.168.1.100',
            status: 'running'
          }
        ]
      };
    } catch (error) {
      logger.error(`Error getting lab environment status: ${error.message}`);
      throw error;
    }
  }
};

export { labEnvironmentService, labTemplates };
