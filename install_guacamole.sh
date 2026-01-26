#!/bin/bash

# Netwall - Automated Guacamole Installer
# Tested on Ubuntu 20.04/22.04 LTS

set -e

GUAC_VERSION="1.5.5"
POSTGRES_JDBC_VERSION="42.7.2"

echo ">>> Updating System..."
sudo apt update

echo ">>> Installing Dependencies..."
# Remove tomcat9 from apt install
sudo apt install -y make gcc libcairo2-dev libjpeg-turbo8-dev libpng-dev \
libtool-bin libossp-uuid-dev libvncserver-dev freerdp2-dev libssh2-1-dev \
libtelnet-dev libwebsockets-dev libpango1.0-dev libpulse-dev libvorbis-dev \
libwebp-dev libssl-dev postgresql postgresql-contrib wget default-jdk

# ... (Guacamole compilation steps remain same) ...

echo ">>> Installing Tomcat 9 (Manual Binary)..."
# Tomcat 9 is required for Guacamole 1.5.x compatibility (javax.servlet)
TOMCAT_VERSION="9.0.87"
wget "https://archive.apache.org/dist/tomcat/tomcat-9/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz"
sudo tar -xzf apache-tomcat-${TOMCAT_VERSION}.tar.gz -C /opt/
sudo mv /opt/apache-tomcat-${TOMCAT_VERSION} /opt/tomcat9
sudo useradd -r -m -U -d /opt/tomcat9 -s /bin/false tomcat
sudo chown -R tomcat: /opt/tomcat9

# Create systemd service for Tomcat
sudo bash -c 'cat > /etc/systemd/system/tomcat9.service <<EOF
[Unit]
Description=Apache Tomcat Web Application Container
After=network.target

[Service]
Type=forking

User=tomcat
Group=tomcat

Environment="JAVA_HOME=/usr/lib/jvm/default-java"
Environment="JAVA_OPTS=-Djava.security.egd=file:///dev/urandom -Djava.awt.headless=true"

Environment="CATALINA_BASE=/opt/tomcat9"
Environment="CATALINA_HOME=/opt/tomcat9"
Environment="CATALINA_PID=/opt/tomcat9/temp/tomcat.pid"
Environment="CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC"

ExecStart=/opt/tomcat9/bin/startup.sh
ExecStop=/opt/tomcat9/bin/shutdown.sh

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl start tomcat9
sudo systemctl enable tomcat9

echo ">>> Installing Guacamole Webapp..."
wget "https://apache.org/dyn/closer.lua/guacamole/${GUAC_VERSION}/binary/guacamole-${GUAC_VERSION}.war?action=download" -O guacamole.war
sudo cp guacamole.war /opt/tomcat9/webapps/

echo ">>> Configuring Extensions..."
sudo mkdir -p /etc/guacamole/{extensions,lib}
if [ -d "guacamole-auth-jdbc-${GUAC_VERSION}" ]; then
    sudo cp guacamole-auth-jdbc-${GUAC_VERSION}/postgresql/guacamole-auth-jdbc-postgresql-${GUAC_VERSION}.jar /etc/guacamole/extensions/
fi

echo ">>> Downloading PostgreSQL JDBC Driver..."
wget "https://jdbc.postgresql.org/download/postgresql-${POSTGRES_JDBC_VERSION}.jar"
sudo mv postgresql-${POSTGRES_JDBC_VERSION}.jar /etc/guacamole/lib/

# ... (Config property step) ...

echo ">>> Linking Config to Tomcat..."
# For manual install, we copy/link to .guacamole in tomcat home
sudo mkdir -p /opt/tomcat9/.guacamole
sudo cp -r /etc/guacamole/* /opt/tomcat9/.guacamole/
sudo chown -R tomcat: /opt/tomcat9/.guacamole

echo ">>> Configuring PostgreSQL..."
# Check if DB exists to avoid error
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw guacamole_db; then
    echo "Database 'guacamole_db' already exists. Skipping creation."
else
    sudo -u postgres psql -c "CREATE DATABASE guacamole_db;"
    sudo -u postgres psql -c "CREATE USER guacamole_user WITH PASSWORD 'guacamole_password';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE guacamole_db TO guacamole_user;"
    
    echo ">>> Initializing Database Schema..."
    wget "https://apache.org/dyn/closer.lua/guacamole/${GUAC_VERSION}/binary/guacamole-auth-jdbc-${GUAC_VERSION}.tar.gz?action=download" -O guacamole-auth-jdbc-${GUAC_VERSION}.tar.gz
    tar -xzf guacamole-auth-jdbc-${GUAC_VERSION}.tar.gz
    cat guacamole-auth-jdbc-${GUAC_VERSION}/postgresql/schema/*.sql | sudo -u postgres psql -d guacamole_db
fi

echo ">>> Installing Guacamole Webapp..."
wget "https://apache.org/dyn/closer.lua/guacamole/${GUAC_VERSION}/binary/guacamole-${GUAC_VERSION}.war?action=download" -O guacamole.war
sudo mv guacamole.war /var/lib/tomcat9/webapps/

echo ">>> Configuring Extensions..."
sudo mkdir -p /etc/guacamole/{extensions,lib}
if [ -d "guacamole-auth-jdbc-${GUAC_VERSION}" ]; then
    sudo cp guacamole-auth-jdbc-${GUAC_VERSION}/postgresql/guacamole-auth-jdbc-postgresql-${GUAC_VERSION}.jar /etc/guacamole/extensions/
fi

echo ">>> Downloading PostgreSQL JDBC Driver..."
wget "https://jdbc.postgresql.org/download/postgresql-${POSTGRES_JDBC_VERSION}.jar"
sudo mv postgresql-${POSTGRES_JDBC_VERSION}.jar /etc/guacamole/lib/

echo ">>> Creating Configuration File..."
sudo bash -c 'cat > /etc/guacamole/guacamole.properties <<EOF
guacd-hostname: localhost
guacd-port: 4822
postgresql-hostname: localhost
postgresql-port: 5432
postgresql-database: guacamole_db
postgresql-username: guacamole_user
postgresql-password: guacamole_password
postgresql-auto-create-accounts: true
EOF'

echo ">>> Linking Config to Tomcat..."
sudo ln -sf /etc/guacamole /usr/share/tomcat9/.guacamole

echo ">>> Restarting Services..."
sudo systemctl restart tomcat9
sudo systemctl restart guacd

echo ">>> Installation Complete!"
echo "Access Guacamole at: http://<YOUR_SERVER_IP>:8080/guacamole"
echo "Default Login: guacadmin / guacadmin"
