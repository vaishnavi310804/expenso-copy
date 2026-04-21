# 🌟 Xpenso - Comprehensive Personal Finance Tracker

Welcome to **Xpenso**, a modern, responsive, full-stack MERN application designed to help users track personal finances, manage incomes and expenses, visualize financial habits, and even review smart loan suggestions.

This documentation will give you a comprehensive overview of the architecture, workflow, technologies used, and why they were chosen to help you understand the end-to-end flow of the application.

---

## 🚀 Live Workflow & Architecture Overview

The system operates on a standard Client-Server architecture utilizing the **MERN** stack (MongoDB, Express, React, Node.js).

### 1. Authentication Flow
- **User Action:** A user submits the registration (`/register`) or login (`/login`) form on the React frontend.
- **Backend Processing:**
  - The Express API (`/api/auth`) receives the credentials.
  - For registration, passwords are encrypted using **bcryptjs** before saving to the database to ensure maximum security.
  - Upon successful verification, the backend issues a **JWT (JSON Web Token)**.
- **Session Management:** The React frontend stores the JWT in `localStorage` and attaches it as a `Bearer` token to the `Authorization` header for all subsequent protected API calls. The **Context API** manages the global user state across the frontend application.

### 2. Transaction Management Flow
- **Data Entry:** Users input their financial data (income or expense) via dedicated forms (`AddIncomeForm`, `AddExpenseForm`).
- **Create:** The frontend sends a `POST` request using **Axios** to `/api/transactions`. The date is converted to a proper ISO string before sending.
- **Update:** Editing an existing transaction sends a `PATCH` request to `/api/transactions/:id` with only the changed fields (partial update).
- **Delete:** A `DELETE` request to `/api/transactions/:id` removes the record.
- **Database Storage:** All transaction `date` fields are stored as native MongoDB **Date** objects (not strings), enabling accurate sorting, filtering, and aggregation queries.
- **UI Update:** The React components re-render immediately to reflect the new balance and transaction lists seamlessly.

### 3. Analytics & Recommendation Flow
- **Complex Aggregation:** The backend exposes `/api/transactions/analytics`. It leverages MongoDB's advanced aggregation pipeline (`$facet`, `$match`, `$group`) to process transactions and group them into current month data, category distributions, weekly/monthly trends, and predictive expenses.
- **Direct Date Comparison:** Because dates are stored as native `Date` types, aggregation queries compare them directly without any string-to-date conversion overhead.
- **Visualization:** The frontend pipes this data into **Chart.js**, rendering interactive graphs and dynamic spending insights directly on the Dashboard.

---

## 🛠️ Technology Stack & "The Why"

### Frontend
- **React (Vite) & React Router (v7):** Vite was chosen over Create React App (CRA) for its blazing-fast Hot Module Replacement (HMR) and optimized build speeds. JSX and Component-based architecture allow UI reuse (like Modals, Forms, and Navbars).
- **Tailwind CSS:** Enables rapid, highly customizable UI development without leaving the HTML/JSX. It effortlessly supports complex designs like glassmorphism and dark/light mode toggles.
- **Context API:** Selected instead of Redux for state management. Given the scope of user sessions and UI themes, Context provides a built-in, lightweight solution without Redux's heavy boilerplate.
- **Axios:** Chosen for its simplicity in handling HTTP requests, response interceptors, and automatic JSON data transformation. An Axios interceptor automatically attaches the JWT token to every outbound request.
- **Chart.js & react-chartjs-2:** Highly customizable and lightweight charting libraries perfect for plotting financial distributions and trendlines.

### Backend
- **Node.js & Express.js:** Fully configured to use native **ES6 Modules (ESM)** for modern `import/export` syntax, seamlessly aligning with the frontend setup. Built for fast, scalable REST APIs.
- **MongoDB & Mongoose:** A NoSQL approach is highly flexible for rapidly iterating schemas. **Mongoose** strictly types documents — Transaction dates use the native `Date` type for correct MongoDB-level sorting and comparison. The aggregation pipeline powers the analytics engine.
- **JWT Framework:** Stateless, scalable, and doesn't require server-side session memory storage.
- **bcryptjs:** Passwords are salted and hashed before storage, ensuring credentials are never stored in plain text.

---

## 🌟 Key Features

- **Robust Authentication:** Securely implemented JWT logins with bcrypt hashing.
- **Rich Dashboard Analytics:** Automated financial insights detecting spending spikes/drops by categories and rendering intuitive charts.
- **Complete CRUD Operations:** Create, Read, Update (via `PATCH`), and Delete capabilities for all incomes and expenses.
- **Native Date Handling:** Transaction dates are stored as MongoDB `Date` objects and displayed using `toLocaleDateString()` — no fragile string parsing.
- **Smart Edit Forms:** Edit forms pre-fill all existing values (including icon and date) correctly. Balance validation is skipped during edits to allow legitimate updates.
- **Loan Suggestions Module:** Generates smart loan evaluations dynamically.
- **Intelligent Routing:** Protected routes that guard against unauthenticated dashboard entry.
- **Seamless Responsiveness:** Complete mobile-first support utilizing dynamic Sidebars and Hamburger menus.

---

## 📂 Project Structure

```text
expenso/
├── backend/
│   ├── config/          # Server bootstrap & MongoDB connection (server.js)
│   ├── controllers/     # Business logic handlers (mainController.js)
│   ├── middleware/      # Auth protection guard (authMiddleware.js)
│   ├── models/          # Mongoose schemas — date field is type: Date (Transaction.js)
│   ├── routes/          # REST endpoints (authRoutes.js, transactionRoutes.js)
│   └── .env             # Secure environment variables
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance with base URL & JWT interceptor
    │   ├── components/  # Reusable UI components (Forms, Navbar, IncomeSources, etc.)
    │   ├── context/     # Global state — user session, transactions, editable data
    │   ├── pages/       # Route-level screens (Dashboard, Income, Expense, Loan)
    │   └── App.jsx      # React Router outlet configuration
    └── package.json
```

---

## 🔌 API Reference

| Method   | Endpoint                       | Auth | Description                          |
|----------|--------------------------------|------|--------------------------------------|
| `POST`   | `/api/auth/register`           | ❌   | Register a new user                  |
| `POST`   | `/api/auth/login`              | ❌   | Login and receive JWT token          |
| `GET`    | `/api/auth/me`                 | ✅   | Get current user profile             |
| `GET`    | `/api/transactions`            | ✅   | List all transactions for the user   |
| `POST`   | `/api/transactions`            | ✅   | Create a new transaction             |
| `PATCH`  | `/api/transactions/:id`        | ✅   | Partially update a transaction       |
| `DELETE` | `/api/transactions/:id`        | ✅   | Delete a transaction                 |
| `GET`    | `/api/transactions/analytics`  | ✅   | Get aggregated analytics data        |

> ✅ Protected routes require `Authorization: Bearer <token>` header.

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas URI or local MongoDB instance.

### 1. Backend Initialization
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   > The server will start on `http://localhost:5000`. You should see `Connected to MongoDB` and `Server is running on port 5000` in the terminal.

### 2. Frontend Initialization
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure `src/api/axiosConfig.js` is pointing to your local backend:
   ```js
   baseURL: 'http://localhost:5000/api',
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Let's Go!
- Open your browser to `http://localhost:5173`.
- Register a new account, add income/expense entries, and see the analytics dashboard populate in real time!

---

## 📝 Recent Refactoring Notes

| Area | Change |
|---|---|
| `Transaction.js` schema | `date` field changed from `String` → `Date` |
| `mainController.js` | Removed `$dateFromString` from aggregation; dates compared natively |
| `mainController.js` | `createTransaction` wraps incoming date with `new Date(date)` |
| `mainController.js` | `updateTransaction` applies partial updates; converts date if present |
| `transactionRoutes.js` | Update route changed from `PUT` → `PATCH` |
| `AddExpenseForm.jsx` | Sends `new Date(form.date).toISOString()`; uses `PATCH` on edit |
| `AddIncomeForm.jsx` | Same — sends ISO date string; uses `PATCH` on edit |
| `AddExpenseForm.jsx` | Balance check skipped when editing an existing expense |
| `AddExpenseForm/IncomeForm` | Edit pre-fills icon, date, category, amount correctly |
| `ExpenseSources.jsx` | Dates displayed via `new Date(item.date).toLocaleDateString()` |
| `IncomeSources.jsx` | Same date display fix; CSV export also uses localized dates |
