# Guacamole Server Manual Installation Guide

This guide details the steps to manually install Apache Guacamole (guacd + webapp) on a Linux server (Debian/Ubuntu) without Docker.

## 1. Install Dependencies

Install the required build tools and libraries for compiling `guacamole-server`:

```bash
sudo apt update
sudo apt install -y make gcc libcairo2-dev libjpeg-turbo8-dev libpng-dev \
libtool-bin libossp-uuid-dev libvncserver-dev freerdp2-dev libssh2-1-dev \
libtelnet-dev libwebsockets-dev libpango1.0-dev libpulse-dev libvorbis-dev \
libwebp-dev libssl-dev tomcat9 tomcat9-admin tomcat9-common tomcat9-user \
postgresql postgresql-contrib
```

## 2. Compile and Install guacamole-server (guacd)

The `guacd` daemon acts as a proxy between the web application and remote desktop protocols (RDP, VNC).

1.  **Download Source**:
    ```bash
    wget https://apache.org/dyn/closer.lua/guacamole/1.5.5/source/guacamole-server-1.5.5.tar.gz?action=download -O guacamole-server-1.5.5.tar.gz
    tar -xzf guacamole-server-1.5.5.tar.gz
    cd guacamole-server-1.5.5
    ```

2.  **Configure and Build**:
    ```bash
    ./configure --with-init-dir=/etc/init.d
    make
    sudo make install
    sudo ldconfig
    ```

3.  **Start Service**:
    ```bash
    sudo systemctl enable guacd
    sudo systemctl start guacd
    ```

## 3. Configure PostgreSQL Database

Guacamole needs a database to store connections and user data.

1.  **Create Database and User**:
    ```bash
    sudo -u postgres psql
    ```
    ```sql
    CREATE DATABASE guacamole_db;
    CREATE USER guacamole_user WITH PASSWORD 'guacamole_password';
    GRANT ALL PRIVILEGES ON DATABASE guacamole_db TO guacamole_user;
    \q
    ```

2.  **Initialize Schema**:
    Download the schema scripts from the Guacamole client (requires extracting the JDBC auth jar).
    *For simplicity, you can usually find the schema in the `guacamole-auth-jdbc` package download.*

    ```bash
    # Download JDBC auth extension
    wget https://apache.org/dyn/closer.lua/guacamole/1.5.5/binary/guacamole-auth-jdbc-1.5.5.tar.gz?action=download -O guacamole-auth-jdbc-1.5.5.tar.gz
    tar -xzf guacamole-auth-jdbc-1.5.5.tar.gz
    
    # Run schema scripts
    cat guacamole-auth-jdbc-1.5.5/postgresql/schema/*.sql | sudo -u postgres psql -d guacamole_db
    ```

## 4. Install Guacamole Client (Webapp)

1.  **Deploy WAR**:
    ```bash
    wget https://apache.org/dyn/closer.lua/guacamole/1.5.5/binary/guacamole-1.5.5.war?action=download -O guacamole.war
    sudo mv guacamole.war /var/lib/tomcat9/webapps/
    ```

2.  **Install Extensions and Drivers**:
    
    Create configuration directories:
    ```bash
    sudo mkdir -p /etc/guacamole/{extensions,lib}
    ```

    Copy JDBC Auth extension:
    ```bash
    sudo cp guacamole-auth-jdbc-1.5.5/postgresql/guacamole-auth-jdbc-postgresql-1.5.5.jar /etc/guacamole/extensions/
    ```

    Download PostgreSQL JDBC Driver:
    ```bash
    wget https://jdbc.postgresql.org/download/postgresql-42.7.2.jar
    sudo mv postgresql-42.7.2.jar /etc/guacamole/lib/
    ```

## 5. Configure Guacamole

Create `/etc/guacamole/guacamole.properties`:

```bash
sudo nano /etc/guacamole/guacamole.properties
```

Add the following content:

```properties
# Hostname and Port of guacd
guacd-hostname: localhost
guacd-port: 4822

# PostgreSQL Configuration
postgresql-hostname: localhost
postgresql-port: 5432
postgresql-database: guacamole_db
postgresql-username: guacamole_user
postgresql-password: guacamole_password

# Optional: Auto-create users if they don't exist (useful for API integration)
postgresql-auto-create-accounts: true
```

Link configuration for Tomcat:
```bash
sudo ln -s /etc/guacamole /usr/share/tomcat9/.guacamole
```

## 6. Restart Services

```bash
sudo systemctl restart tomcat9
sudo systemctl restart guacd
```

## 7. Verify Installation

Access `http://<your-server-ip>:8080/guacamole`.
Default login: `guacadmin` / `guacadmin`.

> [!IMPORTANT]
> Change the default password immediately after logging in!
