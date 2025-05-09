# Ethical Hacking LMS Deployment Guide

This guide provides instructions for deploying the Ethical Hacking LMS to various hosting platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
  - [Option 1: Deploy to Render.com](#option-1-deploy-to-rendercom)
  - [Option 2: Deploy to DigitalOcean](#option-2-deploy-to-digitalocean)
  - [Option 3: Deploy to AWS](#option-3-deploy-to-aws)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [SSL Configuration](#ssl-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, make sure you have:

1. A GitHub account with your code repository
2. Access to your chosen hosting platform
3. Database credentials (if using an external database)
4. Domain name (optional but recommended)

## Deployment Options

### Option 1: Deploy to Render.com

Render.com offers a simple deployment process with a generous free tier.

#### Backend Deployment

1. Log in to [Render.com](https://render.com)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `ethical-hacking-lms-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node src/backend/server.js`
   - Select the appropriate plan (Free tier works for testing)
5. Add environment variables (see [Environment Variables](#environment-variables))
6. Click "Create Web Service"

#### Frontend Deployment

1. Click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `ethical-hacking-lms`
   - Build Command: `cd src/frontend && npm install && npm run build`
   - Publish Directory: `src/frontend/dist`
4. Add environment variables:
   - `VITE_API_URL`: URL of your backend service (e.g., `https://ethical-hacking-lms-api.onrender.com/api`)
5. Click "Create Static Site"

#### Database Setup on Render

1. Click "New" and select "PostgreSQL"
2. Configure the database:
   - Name: `ethical-hacking-lms-db`
   - Select the appropriate plan
3. Note the connection details for your environment variables

### Option 2: Deploy to DigitalOcean

DigitalOcean provides more control and scalability.

#### Using App Platform

1. Log in to [DigitalOcean](https://cloud.digitalocean.com)
2. Navigate to "Apps" and click "Create App"
3. Connect your GitHub repository
4. Configure the app:
   - Select the repository and branch
   - Configure the backend service:
     - Source Directory: `src/backend`
     - Build Command: `npm install`
     - Run Command: `node server.js`
   - Configure the frontend service:
     - Source Directory: `src/frontend`
     - Build Command: `npm install && npm run build`
     - Output Directory: `dist`
5. Add environment variables
6. Click "Next" and select your plan
7. Click "Create Resources"

#### Using Docker and Droplets

1. Create a new Droplet (Ubuntu recommended)
2. SSH into your Droplet
3. Install Docker and Docker Compose:
   ```bash
   apt update
   apt install -y docker.io docker-compose
   ```
4. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/ethical-hacking-lms.git
   cd ethical-hacking-lms
   ```
5. Create a `.env` file with your environment variables
6. Run the application:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 3: Deploy to AWS

For larger deployments with more advanced requirements.

#### Using Elastic Beanstalk

1. Create an Elastic Beanstalk application
2. Create a new environment (Web server environment)
3. Select the platform (Node.js)
4. Upload your code as a zip file or connect to your GitHub repository
5. Configure environment variables
6. Launch the environment

## Environment Variables

The following environment variables should be set in your deployment:

### Backend Variables
- `NODE_ENV`: Set to `production`
- `PORT`: Port for the backend (usually set by the platform)
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time (e.g., `30d`)
- `DATABASE_URL`: Database connection string

### Frontend Variables
- `VITE_API_URL`: URL of your backend API

## Database Setup

### PostgreSQL Setup

1. Create a PostgreSQL database
2. Set the `DATABASE_URL` environment variable:
   ```
   DATABASE_URL=postgres://username:password@host:port/database
   ```

### Database Migration

On first deployment, the database tables will be created automatically if you set:
```
NODE_ENV=production
```

## SSL Configuration

Most platforms provide SSL certificates automatically. If you're using a custom domain:

1. Configure your domain's DNS settings to point to your deployment
2. Enable SSL in your hosting platform settings
3. For manual setup, use Let's Encrypt with Certbot

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check if your backend service is running and the port is correct
2. **Database Connection Error**: Verify your database credentials and connection string
3. **CORS Issues**: Ensure your backend CORS settings allow requests from your frontend domain
4. **Build Failures**: Check build logs for errors in your code or dependencies

### Logs

Access logs through your hosting platform's dashboard to diagnose issues.

### Support

For additional help, refer to your hosting platform's documentation or contact their support team.
