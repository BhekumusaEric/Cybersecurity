# Professional Ethical Hacking Course & Custom LMS

A comprehensive 12-week ethical hacking course with a custom-built Learning Management System designed for maximum control over the learning experience, lab environments, and student assessment.

## 🔐 Course Overview

This professional ethical hacking course provides students with both theoretical knowledge and practical skills in cybersecurity. The curriculum follows industry best practices and prepares students for real-world ethical hacking scenarios while emphasizing legal and ethical responsibilities.

### 🎓 Learning Outcomes

By the end of this course, students will be able to:

- Understand legal and ethical responsibilities of ethical hackers
- Conduct reconnaissance using OSINT and scanning tools
- Identify vulnerabilities in systems and web applications
- Perform exploitation using controlled, legal lab environments
- Document findings and communicate risk in a professional report

## 📚 Course Structure

The course is structured as a 12-week program with the following components for each module:

- Lecture videos (15-30 minutes)
- Reading materials and slides
- Interactive quizzes
- Hands-on lab exercises
- Discussion forums

### 🗓️ Weekly Breakdown

| Week | Module | Topics | Tools | Assignment |
|------|--------|--------|-------|------------|
| 1 | Introduction to Ethical Hacking | Laws, ethics, hacker types, pentest stages | - | Quiz |
| 2 | Networking Fundamentals | TCP/IP, ports, DNS, firewalls | Wireshark | Network mapping quiz |
| 3 | Linux Essentials | File system, terminal, permissions | Kali Linux | Linux CLI challenge |
| 4 | Reconnaissance | WHOIS, NSLookup, Google Hacking | Nmap, Dig, theHarvester | OSINT scavenger hunt |
| 5 | Scanning and Enumeration | Port scanning, banners | Nmap, Netcat, Nikto | Target analysis lab |
| 6 | Vulnerability Scanning | CVEs, automated scans | OpenVAS, Nessus (free) | Vuln report |
| 7 | Exploitation Basics | Manual vs. automated exploitation | Metasploit | Exploit DVWA vuln |
| 8 | Web App Hacking | OWASP Top 10 | Burp Suite, DVWA | XSS/SQLi lab |
| 9 | Wireless Hacking | WPA2, Evil Twin, sniffing | Airodump-ng, Aircrack-ng | WPA crack demo |
| 10 | Post-Exploitation | Privilege escalation, persistence | Mimikatz, Linux enum | Root access challenge |
| 11 | Reporting & Communication | Writing reports, executive summaries | - | Sample report writing |
| 12 | Final Capstone | Full penetration test simulation | All tools | Project + report |

## 🧪 Lab Environment

Our custom LMS integrates various lab environments to provide hands-on experience:

| Option | Tools | Pros | Cons |
|--------|-------|------|------|
| Local VMs | VirtualBox, Kali, Metasploitable | Full control | Requires setup + good hardware |
| Cloud-based VMs | Google Cloud, AWS, Proxmox | Scalable | Higher cost, admin overhead |
| TryHackMe or Hack The Box | Prebuilt labs | Quick start | Less control over flow |
| Browser-based VMs | Guacamole, NoVNC | LMS integration | Needs custom hosting backend |

## 🔐 Custom LMS Technical Stack

Our custom-built Learning Management System includes:

### �� Core Features

- User registration/login with role-based access
- Progress tracking and analytics
- Video content delivery
- Interactive quiz engine
- Assignment submission and grading
- Virtual lab integration
- Certificate generation

### 🖥️ Technology Stack

- **Frontend**: React.js with Material UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **File/Media Storage**: Amazon S3
- **Hosting**: DigitalOcean or AWS

## 📝 Assessment and Certification

The course includes multiple assessment methods:

- **Weekly quizzes** and lab exercises
- **Final capstone project** with a simulated penetration testing scenario
- **Professional certification** upon successful completion

## 🤝 Support and Community

Students receive comprehensive support through:

- Discussion forums for peer learning
- FAQ and helpdesk system
- Scheduled office hours with instructors
- Gamified learning with leaderboards

## 📊 Project Status

This project is currently in development. See the [project roadmap](docs/roadmap.md) for more details.

## 🚀 Deployment

### Option 1: Deploy to Render.com (Recommended for Free Tier)

1. Fork this repository to your GitHub account
2. Sign up for a [Render.com](https://render.com) account
3. In the Render dashboard, click "New" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and set up the services
6. Click "Apply" to deploy the application

The deployment will create:
- A web service for the backend API
- A static site for the frontend
- Automatically connect the frontend to the backend

### Option 2: Manual Deployment to Render.com

#### Backend Deployment

1. In the Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `ethical-hacking-lms-api`
   - **Environment**: Node
   - **Build Command**: `cd src/backend && npm install`
   - **Start Command**: `cd src/backend && node server.js`
   - **Plan**: Free

4. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: (generate a secure random string)
   - `JWT_EXPIRE`: `30d`
   - `DB_DIALECT`: `sqlite`

5. Click "Create Web Service"

#### Frontend Deployment

1. In the Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `ethical-hacking-lms`
   - **Build Command**: `cd src/frontend && npm install && npm run build`
   - **Publish Directory**: `src/frontend/dist`
   - **Plan**: Free

4. Add environment variable:
   - `VITE_API_URL`: (URL of your backend service + `/api`)

5. Click "Create Static Site"

### Option 3: Local Development with Docker

1. Clone the repository
2. Run `docker-compose -f docker-compose.simple.yml up -d`
3. Access the application at:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5002/api
