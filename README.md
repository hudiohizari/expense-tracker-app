# Expense Tracker App

A modern, mobile-first expense tracking application built with **React Native** and **Expo**. This app is designed to be fully autonomous, storing all your financial data locally on your device for maximum privacy and performance.

## ✨ Features

- **Local-First**: All data is stored securely using `AsyncStorage`. No server or internet connection required.
- **Modern UI**: Clean, professional design with light and dark mode support.
- **Safe Area Optimized**: Robust layout handling across all devices (including those with notches/home indicators).
- **Responsive Stats**: Automatic font resizing for long financial values to ensure a single-line display.
- **Keyboard Friendly**: Integrated keyboard avoidance on all form screens.

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: (v20+ recommended)
- **npm** or **pnpm** or **yarn**

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Running the Application
Start the Expo development server:
```bash
npx expo start
```

## 📱 Mobile Access
1. Install **Expo Go** on your device (available on iOS App Store and Google Play).
2. Ensure your phone and computer are on the same Wi-Fi network.
3. Scan the QR code displayed in the terminal with your phone's camera (iOS) or the Expo Go app (Android).

## 🛠️ Tech Stack
- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Safe Area**: [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
- **Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

## 📄 License
MIT
