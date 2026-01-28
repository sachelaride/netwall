#!/bin/bash

# setup_local_infra.sh - Netwall Local Infrastructure Setup (CRITICAL FIX for Ubuntu 24.04)

set -e

echo "Starting local infrastructure setup for Netwall on Ubuntu 24.04 (Noble)..."

# 0. PRE-CLEANUP: Full purge of any previous InfluxDB config to avoid conflicts
echo "Purging old InfluxDB configurations..."
sudo rm -f /etc/apt/sources.list.d/influx*.list
sudo rm -f /etc/apt/trusted.gpg.d/influx*.gpg
sudo rm -f /etc/apt/keyrings/influx*.gpg
sudo rm -f /etc/apt/keyrings/influx*.asc
# Also remove any keys added via apt-key that might conflict
sudo apt-key del 7C3D57159FC2F927 || true
sudo apt-key del DA61C26A0585BD3B || true

# 1. Update and install basic dependencies
echo "Updating apt and installing core dependencies..."
sudo apt-get update || echo "Warning: apt update failed, attempting to continue..."
sudo apt-get install -y curl wget gpg postgresql postgresql-contrib redis-server

# 2. Add InfluxData Repository for InfluxDB 2
echo "Adding InfluxDB 2 repository using modern Ubuntu 24.04 standards..."
sudo mkdir -p /etc/apt/keyrings

# Download the NEW archive key (not the compat one) and dearmor it
# This matches the sha256 checksum and format Ubuntu 24.04 prefers
wget -qO- https://repos.influxdata.com/influxdata-archive.key | gpg --dearmor | sudo tee /etc/apt/keyrings/influxdata-archive.gpg > /dev/null

# Set correct permissions
sudo chmod 644 /etc/apt/keyrings/influxdata-archive.gpg

# Add the repository targeting the 'stable' distribution
# Specifically using the [signed-by=...] pointing to the .gpg file we just created
echo "deb [signed-by=/etc/apt/keyrings/influxdata-archive.gpg] https://repos.influxdata.com/debian stable main" | sudo tee /etc/apt/sources.list.d/influxdata.list

# Update specifically for the new repo
echo "Updating apt for InfluxDB..."
sudo apt-get update

echo "Installing InfluxDB 2..."
sudo apt-get install -y influxdb2

# 3. Configure PostgreSQL
echo "Configuring PostgreSQL..."
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'netwall';" || true
sudo -u postgres psql -c "ALTER USER admin WITH PASSWORD 'netwall';"
sudo -u postgres psql -c "CREATE DATABASE netmonitor OWNER admin;" || true

# 4. Start Services
echo "Ensuring services are enabled and running..."
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo systemctl enable influxdb
sudo systemctl start influxdb

# 5. InfluxDB Initial Setup
echo "Running InfluxDB initial setup..."
if ! influx setup --username admin --password netwall123 --org netmonitor --bucket metrics --force; then
    echo "InfluxDB setup already exists or skipped."
fi

echo "Setup COMPLETE. All services are now running locally on Ubuntu 24.04!"
