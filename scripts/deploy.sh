#!/bin/bash

# Deployment script for Ethical Hacking LMS
# This script deploys the application to a production environment

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${GREEN}[+] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[!] $1${NC}"
}

print_error() {
    echo -e "${RED}[-] $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create it before deploying."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
required_vars=(
    "DB_NAME"
    "DB_USER"
    "DB_PASSWORD"
    "JWT_SECRET"
    "EMAIL_HOST"
    "EMAIL_PORT"
    "EMAIL_USER"
    "EMAIL_PASSWORD"
    "EMAIL_FROM"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "AWS_REGION"
    "AWS_BUCKET_NAME"
    "LAB_PROVIDER"
    "LAB_API_KEY"
    "LAB_API_URL"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set in .env file"
        exit 1
    fi
done

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create SSL certificates directory
print_message "Creating SSL certificates directory..."
mkdir -p nginx/ssl

# Check if SSL certificates exist
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    print_warning "SSL certificates not found. Generating self-signed certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    
    print_warning "Self-signed certificates generated. Replace with proper certificates in production."
fi

# Create backup directory
print_message "Creating backup directory..."
mkdir -p backups

# Pull latest code from repository
print_message "Pulling latest code from repository..."
git pull

# Build and start containers
print_message "Building and starting containers..."
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Initialize database if needed
print_message "Checking if database initialization is needed..."
if [ "$INIT_DB" = "true" ]; then
    print_message "Initializing database..."
    docker-compose -f docker-compose.prod.yml exec backend node scripts/initDb.js
fi

# Wait for services to start
print_message "Waiting for services to start..."
sleep 10

# Check if services are running
print_message "Checking if services are running..."
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    print_error "One or more services failed to start. Check logs with 'docker-compose -f docker-compose.prod.yml logs'"
    exit 1
fi

# Create initial admin user if needed
if [ "$CREATE_ADMIN" = "true" ]; then
    print_message "Creating initial admin user..."
    docker-compose -f docker-compose.prod.yml exec backend node scripts/createAdmin.js
fi

# Print success message
print_message "Deployment completed successfully!"
print_message "The application is now running at https://localhost"
print_message "Admin panel is available at https://localhost/admin"
print_message "API is available at https://localhost/api"
print_message "Lab environment is available at https://localhost/guacamole"

# Print warning for self-signed certificates
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    print_warning "You are using self-signed SSL certificates. Replace them with proper certificates for production use."
fi
