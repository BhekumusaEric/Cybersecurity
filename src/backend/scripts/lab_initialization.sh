#!/bin/bash
# Lab Environment Initialization Script
# This script initializes and configures tools in the lab environments

# Exit on error
set -e

# Log function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Error handling
handle_error() {
  log "ERROR: An error occurred on line $1"
  exit 1
}

trap 'handle_error $LINENO' ERR

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   log "This script must be run as root"
   exit 1
fi

# Get lab type from argument
LAB_TYPE=$1
if [ -z "$LAB_TYPE" ]; then
  log "Lab type not specified. Usage: $0 <lab_type>"
  exit 1
fi

log "Initializing $LAB_TYPE lab environment..."

# Common initialization for all lab types
common_init() {
  log "Performing common initialization tasks..."
  
  # Update package lists
  apt-get update -qq
  
  # Set correct permissions for home directory
  chown -R kali:kali /home/kali
  
  # Create lab directories
  mkdir -p /home/kali/lab_data
  mkdir -p /home/kali/lab_tools
  mkdir -p /home/kali/lab_results
  chown -R kali:kali /home/kali/lab_*
  
  # Set up lab environment variables
  cat > /etc/profile.d/lab_env.sh << EOF
export LAB_TYPE="$LAB_TYPE"
export LAB_DATA_DIR="/home/kali/lab_data"
export LAB_TOOLS_DIR="/home/kali/lab_tools"
export LAB_RESULTS_DIR="/home/kali/lab_results"
EOF
  
  chmod +x /etc/profile.d/lab_env.sh
  
  log "Common initialization completed"
}

# Initialize Penetration Testing Lab
init_penetration_testing_lab() {
  log "Initializing Penetration Testing Lab..."
  
  # Start and configure PostgreSQL for Metasploit
  log "Configuring Metasploit Framework..."
  service postgresql start
  msfdb init
  
  # Create Metasploit workspace
  su - kali -c "msfconsole -q -x 'workspace -a pentest_lab; exit'"
  
  # Configure Burp Suite
  log "Configuring Burp Suite..."
  mkdir -p /home/kali/.BurpSuite
  cat > /home/kali/.BurpSuite/burp-defaults.json << EOF
{
  "user_options":{
    "connections":{
      "upstream_proxy":{
        "enabled":false
      },
      "socks_proxy":{
        "enabled":false
      },
      "timeouts":{
        "normal_timeout":"30",
        "open_timeout":"30"
      }
    },
    "display":{
      "user_interface":{
        "look_and_feel":"Dark"
      }
    },
    "misc":{
      "auto_update":{
        "enabled":false
      }
    }
  }
}
EOF
  chown -R kali:kali /home/kali/.BurpSuite
  
  # Configure Wireshark
  log "Configuring Wireshark..."
  mkdir -p /home/kali/.config/wireshark
  cat > /home/kali/.config/wireshark/preferences << EOF
# Wireshark preferences
gui.column.format:
    "No.", "%m",
    "Time", "%t",
    "Source", "%s",
    "Destination", "%d",
    "Protocol", "%p",
    "Length", "%L",
    "Info", "%i"
gui.layout_type: 2
gui.geometry_save_position: true
gui.packet_list.colorize: true
capture.auto_scroll: true
capture.prompt_monitor_mode: false
EOF
  chown -R kali:kali /home/kali/.config/wireshark
  
  # Set capabilities for Wireshark
  chmod +x /usr/bin/dumpcap
  setcap cap_net_raw,cap_net_admin+eip /usr/bin/dumpcap
  
  # Configure John the Ripper
  log "Configuring John the Ripper..."
  mkdir -p /home/kali/.john
  cp /etc/john/john.conf /home/kali/.john/
  chown -R kali:kali /home/kali/.john
  
  # Configure Responder
  log "Configuring Responder..."
  cp /usr/share/responder/Responder.conf /usr/share/responder/Responder.conf.bak
  sed -i 's/SMB = On/SMB = Off/g' /usr/share/responder/Responder.conf
  sed -i 's/HTTP = On/HTTP = Off/g' /usr/share/responder/Responder.conf
  
  # Create target network configuration
  log "Setting up target network configuration..."
  cat > /home/kali/lab_data/target_network.txt << EOF
# Target Network Information
Network: 172.16.0.0/24
Gateway: 172.16.0.1

# Target Systems
172.16.0.10 - Web Server (Ubuntu 20.04)
172.16.0.20 - File Server (Ubuntu 20.04)
172.16.0.100 - Windows Domain Controller (Windows Server 2019)
172.16.0.150 - Internal Workstation (Windows 10)

# Credentials for Testing
webadmin:Password123!
fileadmin:FileServer2023
Administrator:P@ssw0rd2023!
user:Password123
EOF
  chown kali:kali /home/kali/lab_data/target_network.txt
  
  # Create helper scripts
  log "Creating helper scripts..."
  
  # Network scanning script
  cat > /home/kali/lab_tools/network_scan.sh << EOF
#!/bin/bash
# Network scanning helper script

TARGET=\$1
if [ -z "\$TARGET" ]; then
  echo "Usage: \$0 <target_ip_or_range>"
  exit 1
fi

echo "Running initial Nmap scan on \$TARGET..."
nmap -sV -sC -oN "\$LAB_RESULTS_DIR/nmap_initial_\$(date +%Y%m%d_%H%M%S).txt" "\$TARGET"
EOF
  chmod +x /home/kali/lab_tools/network_scan.sh
  
  # Web vulnerability scanning script
  cat > /home/kali/lab_tools/web_scan.sh << EOF
#!/bin/bash
# Web vulnerability scanning helper script

TARGET=\$1
if [ -z "\$TARGET" ]; then
  echo "Usage: \$0 <target_url>"
  exit 1
fi

echo "Running Nikto scan on \$TARGET..."
nikto -h "\$TARGET" -o "\$LAB_RESULTS_DIR/nikto_\$(date +%Y%m%d_%H%M%S).txt"
EOF
  chmod +x /home/kali/lab_tools/web_scan.sh
  
  chown kali:kali /home/kali/lab_tools/*.sh
  
  log "Penetration Testing Lab initialization completed"
}

# Initialize Network Scanning Lab
init_network_scanning_lab() {
  log "Initializing Network Scanning Lab..."
  
  # Configure Nmap
  log "Configuring Nmap..."
  mkdir -p /home/kali/.nmap
  
  # Create target network configuration
  log "Setting up target network configuration..."
  cat > /home/kali/lab_data/target_network.txt << EOF
# Target Network Information
Network: 192.168.1.0/24
Gateway: 192.168.1.1

# Target Systems
192.168.1.100 - Metasploitable (Linux)
192.168.1.200 - Windows Server
EOF
  chown kali:kali /home/kali/lab_data/target_network.txt
  
  log "Network Scanning Lab initialization completed"
}

# Initialize Web Application Security Lab
init_web_app_security_lab() {
  log "Initializing Web Application Security Lab..."
  
  # Configure Burp Suite
  log "Configuring Burp Suite..."
  mkdir -p /home/kali/.BurpSuite
  cat > /home/kali/.BurpSuite/burp-defaults.json << EOF
{
  "user_options":{
    "connections":{
      "upstream_proxy":{
        "enabled":false
      },
      "socks_proxy":{
        "enabled":false
      },
      "timeouts":{
        "normal_timeout":"30",
        "open_timeout":"30"
      }
    },
    "display":{
      "user_interface":{
        "look_and_feel":"Dark"
      }
    },
    "misc":{
      "auto_update":{
        "enabled":false
      }
    }
  }
}
EOF
  chown -R kali:kali /home/kali/.BurpSuite
  
  # Create target information
  log "Setting up target information..."
  cat > /home/kali/lab_data/web_targets.txt << EOF
# Web Application Targets

DVWA: http://192.168.1.100/dvwa/
- Admin credentials: admin:password

Juice Shop: http://192.168.1.101:3000/
- No default credentials, registration required
EOF
  chown kali:kali /home/kali/lab_data/web_targets.txt
  
  log "Web Application Security Lab initialization completed"
}

# Initialize Social Engineering Lab
init_social_engineering_lab() {
  log "Initializing Social Engineering Lab..."
  
  # Configure GoPhish
  log "Configuring GoPhish..."
  mkdir -p /home/kali/gophish
  
  # Configure SET
  log "Configuring Social-Engineer Toolkit..."
  cp /usr/share/set/config/set_config /usr/share/set/config/set_config.bak
  
  log "Social Engineering Lab initialization completed"
}

# Initialize Wireless Security Lab
init_wireless_security_lab() {
  log "Initializing Wireless Security Lab..."
  
  # Configure Aircrack-ng
  log "Configuring Aircrack-ng..."
  
  # Configure Kismet
  log "Configuring Kismet..."
  mkdir -p /home/kali/.kismet
  
  log "Wireless Security Lab initialization completed"
}

# Run common initialization
common_init

# Run lab-specific initialization
case "$LAB_TYPE" in
  "penetration_testing")
    init_penetration_testing_lab
    ;;
  "network_scanning")
    init_network_scanning_lab
    ;;
  "web_app_security")
    init_web_app_security_lab
    ;;
  "social_engineering")
    init_social_engineering_lab
    ;;
  "wireless_security")
    init_wireless_security_lab
    ;;
  *)
    log "Unknown lab type: $LAB_TYPE"
    exit 1
    ;;
esac

log "Lab initialization completed successfully"
exit 0
