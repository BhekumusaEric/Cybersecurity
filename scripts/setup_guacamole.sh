#!/bin/bash

# Setup script for Apache Guacamole lab environment
# This script sets up Apache Guacamole for browser-based access to virtual machines

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

# Update system
print_message "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install dependencies
print_message "Installing dependencies..."
apt-get install -y build-essential libcairo2-dev libjpeg-turbo8-dev libpng-dev \
    libossp-uuid-dev libavcodec-dev libavutil-dev libswscale-dev libfreerdp-dev \
    libpango1.0-dev libssh2-1-dev libtelnet-dev libvncserver-dev libpulse-dev \
    libssl-dev libvorbis-dev libwebp-dev libwebsockets-dev freerdp2-dev \
    libtool-bin ghostscript postgresql postgresql-contrib wget tomcat9 tomcat9-admin tomcat9-common tomcat9-user

# Create directory for Guacamole
print_message "Creating Guacamole directory..."
mkdir -p /opt/guacamole

# Download Guacamole server
print_message "Downloading Guacamole server..."
cd /opt/guacamole
GUACAMOLE_VERSION="1.4.0"
wget "https://apache.org/dyn/closer.cgi?action=download&filename=guacamole/${GUACAMOLE_VERSION}/source/guacamole-server-${GUACAMOLE_VERSION}.tar.gz" -O guacamole-server-${GUACAMOLE_VERSION}.tar.gz
tar -xzf guacamole-server-${GUACAMOLE_VERSION}.tar.gz

# Build and install Guacamole server
print_message "Building and installing Guacamole server..."
cd guacamole-server-${GUACAMOLE_VERSION}
./configure --with-init-dir=/etc/init.d
make
make install
ldconfig
systemctl enable guacd
systemctl start guacd

# Download Guacamole client
print_message "Downloading Guacamole client..."
cd /opt/guacamole
mkdir -p /etc/guacamole
wget "https://apache.org/dyn/closer.cgi?action=download&filename=guacamole/${GUACAMOLE_VERSION}/binary/guacamole-${GUACAMOLE_VERSION}.war" -O guacamole-${GUACAMOLE_VERSION}.war
cp guacamole-${GUACAMOLE_VERSION}.war /var/lib/tomcat9/webapps/guacamole.war

# Configure Guacamole
print_message "Configuring Guacamole..."
mkdir -p /etc/guacamole/{extensions,lib}
echo "guacamole.home=/etc/guacamole" > /etc/default/tomcat9

# Create guacamole.properties
cat > /etc/guacamole/guacamole.properties << EOF
# Guacamole configuration
guacd-hostname: localhost
guacd-port: 4822

# PostgreSQL properties
postgresql-hostname: localhost
postgresql-port: 5432
postgresql-database: guacamole_db
postgresql-username: guacamole_user
postgresql-password: guacamole_password
EOF

# Set up PostgreSQL for Guacamole
print_message "Setting up PostgreSQL for Guacamole..."
sudo -u postgres psql -c "CREATE DATABASE guacamole_db;"
sudo -u postgres psql -c "CREATE USER guacamole_user WITH PASSWORD 'guacamole_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE guacamole_db TO guacamole_user;"

# Download and install JDBC authentication
print_message "Setting up JDBC authentication..."
cd /opt/guacamole
wget "https://apache.org/dyn/closer.cgi?action=download&filename=guacamole/${GUACAMOLE_VERSION}/binary/guacamole-auth-jdbc-${GUACAMOLE_VERSION}.tar.gz" -O guacamole-auth-jdbc-${GUACAMOLE_VERSION}.tar.gz
tar -xzf guacamole-auth-jdbc-${GUACAMOLE_VERSION}.tar.gz

# Copy JDBC extension and schema
cp guacamole-auth-jdbc-${GUACAMOLE_VERSION}/postgresql/guacamole-auth-jdbc-postgresql-${GUACAMOLE_VERSION}.jar /etc/guacamole/extensions/
wget "https://jdbc.postgresql.org/download/postgresql-42.2.24.jar" -O /etc/guacamole/lib/postgresql-42.2.24.jar

# Initialize database
cat guacamole-auth-jdbc-${GUACAMOLE_VERSION}/postgresql/schema/*.sql | sudo -u postgres psql -d guacamole_db

# Restart services
print_message "Restarting services..."
systemctl restart guacd
systemctl restart tomcat9

# Create sample VMs configuration
print_message "Creating sample VM configurations..."
sudo -u postgres psql -d guacamole_db << EOF
-- Create connection group for lab environments
INSERT INTO guacamole_connection_group (connection_group_name, type)
VALUES ('Lab Environments', 'ORGANIZATIONAL');

-- Get the connection group ID
\set group_id `sudo -u postgres psql -d guacamole_db -t -c "SELECT connection_group_id FROM guacamole_connection_group WHERE connection_group_name = 'Lab Environments';"`

-- Create Kali Linux connection
INSERT INTO guacamole_connection (connection_name, protocol, max_connections, max_connections_per_user, connection_group_id)
VALUES ('Kali Linux', 'vnc', 20, 1, :group_id);

-- Get the Kali connection ID
\set kali_id `sudo -u postgres psql -d guacamole_db -t -c "SELECT connection_id FROM guacamole_connection WHERE connection_name = 'Kali Linux';"`

-- Add Kali connection parameters
INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:kali_id, 'hostname', '192.168.1.10');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:kali_id, 'port', '5901');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:kali_id, 'username', 'kali');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:kali_id, 'password', 'kali');

-- Create Metasploitable connection
INSERT INTO guacamole_connection (connection_name, protocol, max_connections, max_connections_per_user, connection_group_id)
VALUES ('Metasploitable', 'vnc', 20, 1, :group_id);

-- Get the Metasploitable connection ID
\set meta_id `sudo -u postgres psql -d guacamole_db -t -c "SELECT connection_id FROM guacamole_connection WHERE connection_name = 'Metasploitable';"`

-- Add Metasploitable connection parameters
INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:meta_id, 'hostname', '192.168.1.100');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:meta_id, 'port', '5900');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:meta_id, 'username', 'msfadmin');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:meta_id, 'password', 'msfadmin');

-- Create Windows Server connection
INSERT INTO guacamole_connection (connection_name, protocol, max_connections, max_connections_per_user, connection_group_id)
VALUES ('Windows Server', 'rdp', 20, 1, :group_id);

-- Get the Windows connection ID
\set win_id `sudo -u postgres psql -d guacamole_db -t -c "SELECT connection_id FROM guacamole_connection WHERE connection_name = 'Windows Server';"`

-- Add Windows connection parameters
INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:win_id, 'hostname', '192.168.1.200');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:win_id, 'port', '3389');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:win_id, 'username', 'Administrator');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:win_id, 'password', 'Password123!');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:win_id, 'security', 'nla');

INSERT INTO guacamole_connection_parameter (connection_id, parameter_name, parameter_value)
VALUES (:win_id, 'ignore-cert', 'true');
EOF

# Create default admin user
print_message "Creating default admin user..."
sudo -u postgres psql -d guacamole_db << EOF
-- Create default admin user (username: admin, password: admin)
INSERT INTO guacamole_entity (name, type) 
VALUES ('admin', 'USER');

INSERT INTO guacamole_user (entity_id, password_hash, password_salt, password_date)
SELECT 
    entity_id,
    decode('CA458A7D494E3BE824F5E1E175A1556C0F8EEF2C2D7DF3633BEC4A29C4411960', 'hex'),  -- Hashed 'admin' password
    decode('FE24ADC5E11E2B25288D1704ABE67A79', 'hex'),                                  -- Salt
    now()
FROM guacamole_entity
WHERE name = 'admin' AND type = 'USER';

-- Grant admin permissions
INSERT INTO guacamole_system_permission (entity_id, permission)
SELECT entity_id, permission::guacamole_system_permission_type
FROM (
    VALUES
        ('admin', 'CREATE_CONNECTION'),
        ('admin', 'CREATE_CONNECTION_GROUP'),
        ('admin', 'CREATE_USER'),
        ('admin', 'ADMINISTER')
) AS permissions (name, permission)
JOIN guacamole_entity ON permissions.name = guacamole_entity.name AND guacamole_entity.type = 'USER';
EOF

print_message "Guacamole setup complete!"
print_message "Access Guacamole at: http://your-server-ip:8080/guacamole/"
print_message "Default credentials: admin / admin"
print_message "Please change the default password immediately after logging in."
