# 🎓 Tutorial: Local Development Setup

Welcome to the Kuli Platform team! This tutorial is designed for new engineers joining the project. By the end of this guide, you will have the entire Kuli stack (Database, Cache, Backend API, and Mobile App) running locally on your machine.

---

## 🛑 Prerequisites

Before you begin, ensure you have the following installed on your machine:

1.  **[Node.js](https://nodejs.org/en/)** (v18 or higher)
2.  **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Required for PostgreSQL and Redis)
3.  **[Expo Go App](https://expo.dev/client)** (Install this on your physical iOS or Android device)
4.  **[Git](https://git-scm.com/)**

---

## 🛠️ Step 1: Clone the Repository

First, clone the full project documentation suite (which contains our monorepo structure) to your local machine:

```bash
git clone https://github.com/your-org/kuli-platform.git
cd kuli-platform
```

*(Note: Replace the URL with the actual repository URL once hosted).*

---

## 🗄️ Step 2: Booting the Backend API

The Kuli backend is built with NestJS and uses PostgreSQL for relational data and Redis for caching and live tracking.

1.  **Navigate to the backend directory:**
    ```bash
    cd kuli-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Infrastructure (Docker):**
    We use a `docker-compose.yml` file to instantly spin up Postgres and Redis. Make sure Docker Desktop is running, then execute:
    ```bash
    docker compose up -d
    ```

4.  **Run Database Migrations:**
    This command will read the `prisma/schema.prisma` file and create the required tables in your fresh PostgreSQL database:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start the API Server:**
    ```bash
    npm run start:dev
    ```
    ✅ *Success! You should see the NestJS startup logs in your terminal. The API is now listening on `http://localhost:3000`.*

---

## 📱 Step 3: Booting the Mobile App

With the backend running, open a **new terminal window** to start the frontend application.

1.  **Navigate to the app directory:**
    ```bash
    cd ../kuli-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API Networking (CRITICAL):**
    Because you are running the app on a physical phone via Expo Go, your phone cannot connect to `localhost` (that points to the phone itself!).
    
    *   Find your computer's local IP address (e.g., `192.168.1.5`).
        *   *Windows:* `ipconfig`
        *   *Mac:* `ipconfig getifaddr en0`
    *   Open `kuli-app/config.ts` (or wherever your API base URL is stored) and change it to point to your computer's IP:
        ```typescript
        // Change from this:
        export const API_URL = 'http://localhost:3000/api';
        
        // To this:
        export const API_URL = 'http://192.168.1.5:3000/api'; 
        ```

4.  **Start the Expo Metro Bundler:**
    ```bash
    npx expo start -c
    ```
    *(The `-c` flag clears the cache to ensure your IP address change is picked up).*

5.  **Launch the App!**
    *   A massive QR code will appear in your terminal.
    *   Open the **Expo Go app** on your physical smartphone and scan the QR code.
    *   The Javascript bundle will compile and download to your phone.

✅ *Success! You should now see the high-contrast, brutalist Kuli UI on your phone, and it should be successfully communicating with your local backend server.*

---

## 🎉 Next Steps

You've successfully completed the local setup! 
If you want to understand *how* the app flows or *why* certain design decisions were made, head over to the `01_PRD.md` or `03_APP_FLOW.md` reference documents. Happy coding!
