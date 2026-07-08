# 🚀 Kuli Platform — Production Deployment Guide

This guide walks you through deploying the Kuli Backend API to an AWS EC2 instance and building the Android APK for distribution.

---

## Prerequisites

Before you begin, ensure you have:

1. An **AWS Account** with permissions to create EC2 instances, VPCs, and Security Groups.
2. An **AWS CLI** installed and configured (`aws configure`).
3. An **EC2 Key Pair** created in the `ap-south-1` (Mumbai) region.
4. A **Docker Hub account** at [hub.docker.com](https://hub.docker.com).
5. A **GitHub repository** with this codebase pushed.

---

## Part 1: Provision the EC2 Instance

You have two options: **CloudFormation (recommended)** or **manual setup**.

### Option A: CloudFormation (One-Click Infrastructure)

This provisions a VPC, subnet, security group, and EC2 instance in a single command.

```bash
aws cloudformation create-stack \
  --stack-name kuli-mvp \
  --template-body file://infra/cloudformation.yml \
  --parameters \
    ParameterKey=KeyPairName,ParameterValue=YOUR_KEY_PAIR_NAME \
    ParameterKey=InstanceType,ParameterValue=t3.small \
  --region ap-south-1
```

Wait for the stack to complete (~3 minutes):
```bash
aws cloudformation wait stack-create-complete --stack-name kuli-mvp --region ap-south-1
```

Get your server's public IP:
```bash
aws cloudformation describe-stacks --stack-name kuli-mvp --region ap-south-1 \
  --query "Stacks[0].Outputs[?OutputKey=='InstancePublicIP'].OutputValue" --output text
```

### Option B: Manual Setup

1. Launch an Ubuntu 24.04 `t3.small` instance in the AWS Console.
2. Assign a security group allowing ports: `22` (SSH), `80`, `443`, `3000` (API).
3. SSH into the instance and run the setup script:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Download and run the setup script
curl -sSL https://raw.githubusercontent.com/YOUR_ORG/kuli-platform/main/infra/ec2-setup.sh | bash
```

---

## Part 2: Configure Environment Variables

SSH into the server and edit the `.env` file:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
nano /opt/kuli/.env
```

Fill in your real credentials:
```env
POSTGRES_PASSWORD=your_strong_database_password
JWT_SECRET=your_random_jwt_secret_string
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
DOCKER_IMAGE=kulilabour/kuli-backend:latest
```

Copy the production Docker Compose file to the server:
```bash
scp -i your-key.pem kuli-backend/docker-compose.prod.yml ubuntu@YOUR_EC2_IP:/opt/kuli/
```

---

## Part 3: Configure GitHub Actions (CI/CD)

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** and add these secrets:

| Secret Name | Value |
|:---|:---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (generate at hub.docker.com/settings/security) |
| `EC2_HOST` | Your EC2 public IP address |
| `EC2_USERNAME` | `ubuntu` |
| `EC2_SSH_KEY` | The full contents of your `.pem` private key file |

Once these secrets are set, every push to the `main` branch that modifies `kuli-backend/` will automatically:
1. ✅ Run the test suite
2. 🐳 Build the Docker image
3. 📦 Push to Docker Hub as `kulilabour/kuli-backend:latest`
4. 🚀 SSH into EC2, pull the image, and restart containers

---

## Part 4: First Manual Deployment

For the very first deployment (before CI/CD is active), deploy manually:

```bash
# SSH into the server
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
cd /opt/kuli

# Pull and start all containers
docker compose -f docker-compose.prod.yml up -d

# Wait for Postgres to be healthy, then run migrations
sleep 15
docker exec kuli-api npx prisma migrate deploy

# Verify the API is running
curl http://localhost:3000/
```

Your API is now live at `http://YOUR_EC2_IP:3000`! 🎉

---

## Part 5: Build the Android APK

On your local machine, install EAS CLI and build:

```bash
cd kuli-app

# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Set the production API URL before building
# Replace YOUR_EC2_IP with your actual EC2 public IP
export EXPO_PUBLIC_API_URL=http://YOUR_EC2_IP:3000
export EXPO_PUBLIC_SOCKET_URL=http://YOUR_EC2_IP:3000

# Build the production APK
eas build --platform android --profile production
```

The build will run on Expo's cloud servers and produce a downloadable `.apk` file. Share this APK directly with your beta testers!

---

## Part 6: Verify the Full Stack

Once the backend is deployed and the APK is built:

1. **Test the API:**
   ```bash
   curl http://YOUR_EC2_IP:3000/api/search/nearby?lat=23.0225&lng=72.5714&radius=5
   ```

2. **Test WebSockets:**
   Open a browser console and run:
   ```javascript
   const io = require('socket.io-client');
   const socket = io('http://YOUR_EC2_IP:3000');
   socket.on('connect', () => console.log('✅ Connected!'));
   ```

3. **Install the APK** on an Android device and verify the app connects to the live API.

---

## Troubleshooting

| Problem | Solution |
|:---|:---|
| `docker: permission denied` | Run `sudo usermod -aG docker $USER` and re-login |
| API not accessible | Check security group allows port 3000 inbound |
| Database connection refused | Run `docker compose -f docker-compose.prod.yml logs postgres` |
| Migration fails | Run `docker exec -it kuli-api npx prisma migrate reset` (⚠️ destroys data) |
| APK can't reach API | Verify `EXPO_PUBLIC_API_URL` was set before `eas build` |
