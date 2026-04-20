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
- **Session Management:** The React frontend stores the JWT (usually in `localStorage`) and attaches it as a `Bearer` token to the `Authorization` header for all subsequent protected API calls. The **Context API** manages the global user state across the frontend application.

### 2. Transaction Management Flow
- **Data Entry:** Users input their financial data (income or expense) via dedicated forms (`AddIncomeForm`, `AddExpenseForm`).
- **API Interaction:** The frontend sends a `POST` request using **Axios** to `/api/transactions`.
- **Database Storage:** The backend validates the request and creates a `Transaction` document in **MongoDB**. Each transaction is associated with the user's secure ObjectId to prevent unauthorized data access.
- **UI Update:** The React components re-render immediately to reflect the new balance and transaction lists seamlessly.

### 3. Analytics & Recommendation Flow
- **Complex Aggregation:** The backend exposes a powerful endpoint `/api/transactions/analytics`. It leverages MongoDB's advanced aggregation pipeline (`$facet`, `$match`, `$group`) to instantly process thousands of transactions and grouping them into current month data, category distributions, weekly/monthly trends, and predictive expenses.
- **Visualization:** The frontend captures this data and pipes it into **Chart.js**, rendering sleek, interactive graphs and dynamic insights text directly on the user's Dashboard. 

---

## 🛠️ Technology Stack & "The Why"

### Frontend
- **React (Vite) & React Router (v7):** Vite was chosen over Create React App (CRA) for its blazing-fast Hot Module Replacement (HMR) and optimized build speeds. JSX and Component-based architecture allow UI reuse (like Modals, Forms, and Navbars).
- **Tailwind CSS:** Enables rapid, highly customizable UI development without leaving the HTML/JSX. It effortlessly supports complex designs like glassmorphism and dark/light mode toggles.
- **Context API:** Selected instead of Redux for state management. Given the scope of user sessions and UI themes, Context provides a built-in, lightweight solution without Redux's heavy boilerplate.
- **Axios:** Chosen for its simplicity in handling HTTP requests, response interceptors, and automatic JSON data transformation.
- **Chart.js & react-chartjs-2:** Highly customizable and lightweight charting libraries perfect for plotting financial distributions and trendlines.

### Backend
- **Node.js & Express.js:** Fully configured to use native **ES6 Modules (ESM)** for modern `import/export` syntax, seamlessly aligning with the frontend setup. Built for fast, scalable REST APIs, with Express minimizing routing boilerplate.
- **MongoDB & Mongoose:** A NoSQL approach is highly flexible for rapidly iterating schemas. **Mongoose** simplifies the schema creation, strictly typing the documents (e.g., specific required fields for Transactions) and provides incredible query power (like Aggregation pipelines for analytics).
- **JWT Framework:** Stateless, scalable, and doesn’t require server-side session memory storage.

---

## 🌟 Key Features

- **Robust Authentication:** Securely implemented JWT logins with bcrypt hashing.
- **Rich Dashboard Analytics:** Automated financial insights detecting spending spikes/drops by categories and rendering intuitive charts.
- **Complete CRUD Operations:** Create, Read, Update, and Delete capabilities for all incomes and expenses.
- **Loan Suggestions Module:** Generates smart loan evaluations dynamically.
- **Intelligent Routing:** Protected routes that guard against unauthenticated dashboard entry.
- **Seamless Responsiveness:** Complete mobile-first support utilizing dynamic Sidebars and Hamburger menus.

---

## 📂 Project Structure

```text
expenso/
├── backend/
│   ├── config/          # Configurations (e.g. server port bindings)
│   ├── controllers/     # Modular logic handlers (mainController.js)
│   ├── middleware/      # Interceptors like Auth Protect guards
│   ├── models/          # MongoDB Mongoose schemas (User.js, Transaction.js)
│   ├── routes/          # API endpoints (authRoutes.js, transactionRoutes.js)
│   └── .env             # Secure environmental constants
└── frontend/
    ├── src/
    │   ├── api/         # Axios configurations and baser URL setup
    │   ├── components/  # Atomic React UI parts (Login, Register, Navbar)
    │   ├── context/     # Global state providers (UserContext.jsx)
    │   ├── pages/       # High-level screens representing routes
    │   └── App.jsx      # Core React Router outlet configuration
    └── package.json
```

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+ recommended)
- A local MongoDB instance or a MongoDB Atlas URI.

### 1. Backend Initialization
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install NodeJS dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file in the root of the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/xpenso
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend Node server using `nodemon` (auto-restarts on save):
   ```bash
   npm run dev
   ```

### 2. Frontend Initialization
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install UI dependencies:
   ```bash
   npm install
   ```
3. Power up the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Let's Go!
- Open your browser to the URL provided by Vite (usually `http://localhost:5173`).
- Go to the **Login** / **Register** portal to create an account, log dummy entries, and witness the analytic algorithms visualize your data instantly!
