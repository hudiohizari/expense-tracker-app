# Expense Tracker App

A mobile-first expense tracking application built with Expo (React Native), tRPC, and Drizzle ORM.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ recommended)
- pnpm (or npm)
- MySQL database (optional for UI-only testing)

### 2. Installation
Clone the repository and install dependencies:
```bash
npx pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and fill in the required variables (see `.env.example` for a template):
```bash
cp .env.example .env
```
Update `DATABASE_URL` and `OAUTH_SERVER_URL` as needed. For mobile testing, use your local IP address for the server URL.

### 4. Database Initialization (Optional)
If you have a MySQL database set up, run the following to sync the schema:
```bash
pnpm db:push
```

### 5. Running the Application
#### Development Mode (Concurrently starts server and Metro)
```bash
pnpm dev
```

#### Individual Components
- **Server**: `pnpm dev:server`
- **Metro (Web)**: `pnpm dev:metro`
- **Expo (Mobile/Tunnel)**: `npx expo start --tunnel`

## 📱 Mobile Access
1. Install **Expo Go** on your device.
2. Ensure your phone and computer are on the same Wi-Fi.
3. Run `npx expo start`.
4. Scan the QR code with your phone.

## 🛠️ Tech Stack
- **Frontend**: React Native, Expo, Expo Router, NativeWind (Tailwind CSS)
- **Backend**: Node.js, Express, tRPC
- **Database**: MySQL, Drizzle ORM
- **Authentication**: OAuth (custom implementation)

## 📄 License
MIT
