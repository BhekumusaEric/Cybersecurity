# This is a multi-stage build Dockerfile for the Ethical Hacking LMS

# Stage 1: Build the frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

# Copy frontend package.json and package-lock.json
COPY src/frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY src/frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine as backend-build

WORKDIR /app/backend

# Copy backend package.json and package-lock.json
COPY src/backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY src/backend/ ./

# Stage 3: Setup the production environment
FROM nginx:alpine

# Copy the built frontend from the frontend-build stage
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY src/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create directory for the backend
WORKDIR /app/backend

# Copy the backend from the backend-build stage
COPY --from=backend-build /app/backend ./

# Expose ports
EXPOSE 80 5001

# Start both nginx and the Node.js backend
CMD ["sh", "-c", "nginx -g 'daemon off;' & node server.js"]
