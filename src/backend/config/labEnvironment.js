import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import networkScanningLab from './labEnvironments/network_scanning_lab.js';
import webAppSecurityLab from './labEnvironments/web_app_security_lab.js';
import penetrationTestingLab from './labEnvironments/penetration_testing_lab.js';
import socialEngineeringLab from './labEnvironments/social_engineering_lab.js';

dotenv.config();

// Lab environment configuration
const LAB_PROVIDER = process.env.LAB_PROVIDER || 'local';
const LAB_API_KEY = process.env.LAB_API_KEY;
const LAB_API_URL = process.env.LAB_API_URL;

// Import lab templates from separate files
const labTemplates = {
  // Network scanning lab - using the detailed configuration
  'network_scanning': networkScanningLab,

  // Web application security lab - using the detailed configuration
  'web_app_security': webAppSecurityLab,

  // Penetration testing lab - using the detailed configuration
  'penetration_testing': penetrationTestingLab,

  // Social engineering lab - using the detailed configuration
  'social_engineering': socialEngineeringLab,

  // Wireless security lab
  'wireless_security': {
    id: 'wireless_security',
    name: 'Wireless Security Lab',
    description: 'Lab environment for practicing wireless network security testing and analysis',
    difficulty: 'intermediate',
    estimatedTime: 150, // minutes
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
            name: 'Aircrack-ng',
            version: '1.6',
            path: '/usr/bin/aircrack-ng'
          },
          {
            name: 'Wireshark',
            version: '4.0.6',
            path: '/usr/bin/wireshark'
          },
          {
            name: 'Kismet',
            version: '2022.08.R1',
            path: '/usr/bin/kismet'
          }
        ],
        credentials: {
          username: 'kali',
          password: 'kali'
        }
      },
      {
        name: 'wireless-router',
        displayName: 'Wireless Router',
        image: 'wireless-router-sim:latest',
        role: 'target',
        resources: {
          cpu: 1,
          memory: '1GB',
          disk: '5GB'
        },
        network: {
          ip: '192.168.1.1',
          subnet: '192.168.1.0/24'
        },
        credentials: {
          username: 'admin',
          password: 'admin123'
        }
      },
      {
        name: 'client1',
        displayName: 'Client Device 1',
        image: 'ubuntu:20.04',
        role: 'client',
        resources: {
          cpu: 1,
          memory: '2GB',
          disk: '10GB'
        },
        network: {
          ip: '192.168.1.101',
          subnet: '192.168.1.0/24',
          gateway: '192.168.1.1'
        }
      }
    ],
    duration: 2.5 * 60 * 60, // 2.5 hours in seconds
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
