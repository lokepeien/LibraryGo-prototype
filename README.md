# ⚡ LibraryGo - Academic Seat & Facilities Management System

Welcome to the **LibraryGo** prototype workspace. This repository has been structured as a complete full-stack monorepo containing the Express API backend, the React Vite web admin dashboard, and the React Native student mobile companion application.

---

## 📂 Repository Structure

```text
librarygo/ (Repository Root)
├── backend/               # Node.js + Express.js API Server
│   ├── src/
│   │   └── index.js       # Main server entrypoint (REST API routes)
│   ├── package.json       # Backend script commands & dependencies
│   └── ...
├── frontend-web/          # Admin/Librarian Web Dashboard (React + AntD)
│   ├── src/
│   │   ├── App.jsx        # Admin dashboard structure (stateful)
│   │   └── index.css      # Customized AntD styling overrides
│   ├── public/
│   ├── package.json       # React Vite dev scripts & dependencies
│   └── ...
└── frontend-mobile/       # Student/Admin Mobile App (React Native)
    ├── android/           # Stub Gradle files
    ├── ios/               # Stub CocoaPods config
    ├── src/
    ├── App.jsx            # Student NFC booking & timer screens
    ├── package.json       # React Native runner scripts
    └── ...
```

---

## 🛠️ Components & How to Run

### 1. `backend/` (Express API)
Provides APIs for seat states, student strikes, disciplinary blacklists, and environment complaints.
* **Dependencies**: `express`, `cors`
* **Dev Dependencies**: `nodemon`
* **Commands**:
  ```bash
  cd backend
  npm install
  npm run dev   # Starts Nodemon watcher at http://localhost:5000
  ```

### 2. `frontend-web/` (Admin Web Dashboard)
Real-time dashboard for librarians built with Ant Design (AntD v5). Contains collapsible sidebar tabs, interactive metrics, dynamic badge selectors, expandable tables with real-time comments, and search features.
* **Dependencies**: `antd`, `@ant-design/icons`, `react`, `react-dom`
* **Commands**:
  ```bash
  cd frontend-web
  npm install
  npm run dev   # Starts Vite server at http://localhost:5173
  ```

### 3. `frontend-mobile/` (Student Mobile App)
Misplacement recovery and seat checking client built on React Native. Simulates scanning desk-embedded physical NFC Tags, auto-release timers, and alerts.
* **Dependencies**: `react`, `react-native`
* **Commands**:
  ```bash
  cd frontend-mobile
  npm install
  npm run android # Run on Android Emulator
  npm run ios     # Run on iOS Simulator
  ```
