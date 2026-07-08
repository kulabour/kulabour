#!/bin/bash
# ─── Kuli EC2 Server Setup Script ────────────────────────────────────────
# Run this on a fresh Ubuntu 24.04 EC2 instance to prepare it for Kuli.
# Usage: ssh into your EC2 instance, then run:
#   curl -sSL https://raw.githubusercontent.com/YOUR_ORG/kuli-platform/main/infra/ec2-setup.sh | bash
#   OR copy this file and run: chmod +x ec2-setup.sh && sudo ./ec2-setup.sh

set -euo pipefail

echo "══════════════════════════════════════════════════════════════"
echo "  🏗️  Kuli Platform — EC2 Server Setup"
echo "══════════════════════════════════════════════════════════════"

# ── 1. System Update ──────────────────────────────────────────────────
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ── 2. Install Docker ─────────────────────────────────────────────────
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo systemctl enable docker
  sudo systemctl start docker
  sudo usermod -aG docker $USER
  echo "   ✅ Docker installed"
else
  echo "   ✅ Docker already installed"
fi

# ── 3. Install Docker Compose v2 ─────────────────────────────────────
echo "🔧 Installing Docker Compose plugin..."
sudo apt-get install -y docker-compose-plugin
echo "   ✅ Docker Compose v2 installed"

# ── 4. Create App Directory ──────────────────────────────────────────
echo "📁 Creating application directory..."
sudo mkdir -p /opt/kuli
sudo chown $USER:$USER /opt/kuli

# ── 5. Create .env Template ─────────────────────────────────────────
echo "📝 Creating .env template..."
cat > /opt/kuli/.env << 'EOF'
# ─── Kuli Backend Environment Variables ───────────────────────────────
# IMPORTANT: Replace ALL placeholder values before starting the app!

# Database
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Authentication
JWT_SECRET=CHANGE_ME_TO_A_RANDOM_STRING

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXX

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=kuli-app

# Docker Image (updated by CI/CD)
DOCKER_IMAGE=kulilabour/kuli-backend:latest
EOF

echo "   ✅ .env template created at /opt/kuli/.env"

# ── 6. Firewall Configuration ───────────────────────────────────────
echo "🔒 Configuring firewall (UFW)..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Kuli API
sudo ufw --force enable
echo "   ✅ Firewall configured"

# ── 7. Install Fail2ban for SSH Protection ───────────────────────────
echo "🛡️ Installing Fail2ban..."
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
echo "   ✅ Fail2ban installed and running"

# ── 8. Setup Swap (for t3.micro/small instances) ────────────────────
echo "💾 Setting up 2GB swap file..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo "   ✅ 2GB swap enabled"
else
  echo "   ✅ Swap already exists"
fi

echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo ""
echo "  Next Steps:"
echo "  1. Edit /opt/kuli/.env with your real credentials"
echo "  2. Copy docker-compose.prod.yml to /opt/kuli/"
echo "  3. Run: cd /opt/kuli && docker compose -f docker-compose.prod.yml up -d"
echo "  4. Run migrations: docker exec kuli-api npx prisma migrate deploy"
echo "══════════════════════════════════════════════════════════════"
