# Ethical Hacking LMS Installation Guide

This guide provides comprehensive instructions for setting up, deploying, and accessing the Ethical Hacking Learning Management System (LMS).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment Options](#cloud-deployment-options)
5. [Mobile Access](#mobile-access)
6. [Lab Environment Setup](#lab-environment-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing the Ethical Hacking LMS, ensure you have the following:

### For Development

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- Git
- PostgreSQL (v14 or higher) or Docker

### For Deployment

- Docker and Docker Compose
- A server or cloud account (for production deployment)
- Domain name (optional but recommended)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/BhekumusaEric/Cybersecurity.git
cd Cybersecurity
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp src/backend/.env.example src/backend/.env

# Edit the .env file with your configuration
nano src/backend/.env
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd src/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Start Development Servers

```bash
# Start the backend server
cd src/backend
npm run dev

# In a new terminal, start the frontend server
cd src/frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Docker Deployment

### Development Environment with Docker

The easiest way to run the entire application stack is using Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000
- PostgreSQL database
- pgAdmin on http://localhost:5050

### Production Deployment with Docker

For production deployment, use the production Docker Compose file:

```bash
# Create .env file with production settings
cp .env.example .env
nano .env

# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## Cloud Deployment Options

### Render.com Deployment

1. Push your code to GitHub
2. Sign up for a [Render.com](https://render.com) account
3. Create a new Blueprint and select your repository
4. Enter a name for your blueprint (e.g., `ethical-hacking-lms-blueprint`)
5. Render will automatically detect the `render.yaml` file and set up the services
6. Click "Apply" to deploy

Your application will be available at:
- Frontend: https://ethical-hacking-lms.onrender.com
- Backend: https://ethical-hacking-lms-api.onrender.com

### DigitalOcean Deployment

1. Create a Droplet with Docker preinstalled
2. SSH into your Droplet
3. Clone your repository
4. Set up environment variables
5. Run `docker-compose -f docker-compose.prod.yml up -d`

## Mobile Access

The Ethical Hacking LMS is designed to be mobile-friendly and can be accessed in several ways:

### 1. Mobile Browser

Simply visit the application URL in your mobile browser. The responsive design will automatically adapt to your screen size.

### 2. Progressive Web App (PWA)

The application is configured as a Progressive Web App, which allows it to be installed on your home screen:

1. Visit the application in your mobile browser
2. For iOS: Tap the Share button, then "Add to Home Screen"
3. For Android: Tap the menu button, then "Add to Home Screen" or "Install App"

This provides an app-like experience with:
- Offline capabilities
- Home screen icon
- Full-screen mode
- Push notifications (where supported)

### 3. Mobile App (Future)

A dedicated mobile app is planned for future releases, which will provide enhanced features such as:
- Native device integration
- Improved performance
- Enhanced offline capabilities
- Better lab environment access

## Lab Environment Setup

The lab environment uses Docker containers to provide isolated, secure environments for hands-on practice.

### Setting Up the Lab Environment

```bash
# Navigate to the lab environment directory
cd lab_environment

# Start the lab environment
docker-compose up -d
```

This will start:
- Guacamole client on http://localhost:8080
- Kali Linux VM
- Metasploitable VM
- DVWA (Damn Vulnerable Web Application)
- OWASP Juice Shop
- Other vulnerable targets

### Accessing the Lab Environment

1. Navigate to the Labs section in the LMS
2. Select a lab to start
3. Click "Launch Lab Environment"
4. Use the provided credentials to access the environment

## Troubleshooting

### Common Issues

#### Database Connection Errors

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL if needed
docker-compose restart postgres
```

#### Frontend Cannot Connect to Backend

Ensure the `VITE_API_URL` environment variable is set correctly in the frontend.

#### Lab Environment Issues

```bash
# Check lab environment logs
cd lab_environment
docker-compose logs -f

# Restart lab environment
docker-compose down
docker-compose up -d
```

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub repository](https://github.com/BhekumusaEric/Cybersecurity) for known issues
2. Open a new issue with detailed information about your problem
3. Contact the development team at bhekumusaeric@gmail.com

## Security Considerations

- Always change default passwords in production
- Use HTTPS for all production deployments
- Regularly update dependencies
- Follow security best practices for your deployment environment

---

For more detailed information, refer to the [Documentation](./docs/) directory.
