# Expense Tracker

A full-stack Expense Tracker application built with **Node.js**, **Express**, **MongoDB**, **React**, **Redux Toolkit**, and **Tailwind CSS**.

---

## Features Implemented

### Backend (Node.js + Express + MongoDB)

- RESTful API built with Express.
- MongoDB (via Mongoose) for persistent data.
- CRUD operations for transactions with fields:
  - `type`: income or expense
  - `amount`: number
  - `description`: string
  - `category`: string
  - `date`: date
- Endpoints to **filter transactions** by type, category, and date range.
- Input validation using Zod and error handling middleware.
- `.env` configuration for `MONGODB_URI` and `PORT`.

### Frontend (React + Redux Toolkit + Tailwind CSS)

- Responsive dashboard UI built with Tailwind CSS.
- Add transaction form with validation.
- Filters by **type**, **category**, and **date range**.
- Summary cards showing total income, total expenses, and balance.
- Charts using **Recharts** (Bar and Pie).
- Dark/Light theme toggle (persisted preference).
- Proper loading states and error displays.

---

## Tech Stack

**Frontend:** React, Vite, Redux Toolkit, TypeScript, Tailwind CSS, Recharts  
**Backend:** Node.js, Express.js, Mongoose, Zod  
**Database:** MongoDB (Atlas or local)

---

## Setup Instructions

### 1️ Clone the repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2️ Install dependencies

```bash
npm install
```

### 3 Configure environment variables

Create a `.env` file inside the `server` folder:

```
MONGODB_URI=<your MongoDB connection string>
PORT=4000
```

### 4️ Run the project (monorepo root)

```bash
npm run dev
```

This will start both the **server** (on `localhost:4000`) and **client** (on `localhost:5173`).

## API Endpoints

| Method | Endpoint | Description |

| `GET` | `/api/transactions` | Fetch all transactions (with filters) |
| `POST` | `/api/transactions` | Add a new transaction |
| `PUT` | `/api/transactions/:id` | Update an existing transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `GET` | `/api/summary` | Get income, expense, and balance summary |

### Filter Example:

GET /api/transactions?type=income&category=salary&startDate=2025-11-01&endDate=2025-11-30

## Validation & Error Handling

- All endpoints validate incoming data using Zod.
- API returns proper status codes (400, 404, 500).
- Frontend shows inline errors for invalid inputs.

## Submission Notes

- Built and tested on Node.js **v18+**
- Compatible with **VS Code** (launch.json included).
- MongoDB Atlas compatible.
- Meets all stated requirements.
- **No extra dependencies (like Docker or JWT)** were added since not requested.

## Quick Demo

1. Run the backend and frontend using `npm run dev`
2. Add transactions from the dashboard.
3. Use filters and charts to analyze your data.
4. Toggle Dark/Light theme for a better UX.

##  License

This project is for the AECCI machine test submission.
© 2025 — Developed by [Your Name]
