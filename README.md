# Xpenso - Personal Finance Tracker

Xpenso is a modern, responsive full-stack web application designed to help users track their personal finances effectively. It allows users to log their incomes and expenses, providing visual insights and real-time dashboard metrics to summarize their financial health.

## 🌟 Key Features
- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing. User sessions are persisted securely.
- **Dynamic Dashboard**: Interactive charts (using Chart.js) presenting a high-level overview of income, expenses, and total balance.
- **Comprehensive Transaction Management**: 
  - Add, Edit, Delete, and categorize your income and expense records seamlessly.
  - Choose related visual icons for categories (e.g., 🛍️, 💻, 🛒, 💼, 🍽️).
  - Smart date formatting with suffixes (1st, 2nd, 3rd, th).
- **Data Export & Reports**: Download your categorized transaction histories (e.g., Income Details) instantly into CSV files for external spreadsheet tracking.
- **Loan Suggestions**: Integrated feature offering loan suggestions based on the user's financial profile.
- **Responsive UI & Navigation**: Handcrafted using Tailwind CSS with glassmorphism effects, modern gradients, and micro-animations. 
  - Dynamic **Sidebar** for desktop navigation.
  - Interactive **Hamburger Menu** for seamless mobile access.
- **Dark & Light Mode Support**: Context-driven built-in theme toggler lets you switch smoothly between Light and Dark modes.
- **Customizable Profile**: Choose from predefined avatar images during the registration flow, displayed persistently on the navigation bars.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router DOM, Tailwind CSS, Context API, Axios, Chart.js, React-Toastify, React Icons.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB.

## 📂 Project Structure
```text
expenso/
├── backend/
│   ├── config/          # Server configuration
│   ├── middleware/      # Authentication mechanisms (JWT)
│   ├── models/          # MongoDB schemas (User, Transaction)
│   ├── routes/          # Express API endpoints
│   ├── .env             # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/         # Axios configuration (api, base URL)
    │   ├── components/  # Reusable UI parts (Navbar, Sidebar, Form Modals, Auth)
    │   ├── context/     # Global state management using Context API (Theme, User, Data)
    │   ├── pages/       # High-level screens (Dashboard, Home, Income, Expense, Loan Suggestion)
    │   └── App.jsx      # Main application router
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- Local [MongoDB](https://www.mongodb.com/try/download/community) server running (or a MongoDB Atlas URI string).

### 1. Setup the Backend
Navigate into the backend directory and install the required dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and configure the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/xpenso
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server (defaults to `http://localhost:5000`):
```bash 
npm run dev
```

### 2. Setup the Frontend
Open a new terminal, navigate to the frontend directory, and install its packages:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Access the Application
Open your browser and navigate to `http://localhost:5173`. 
Click **Login** -> **Sign up here**, choose an avatar, and start managing your finances effectively!
