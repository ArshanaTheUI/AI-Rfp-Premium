# 🤖 AI-Powered RFP Management System

## 📌 Overview

**AI-Rfp-Premium** is a full-stack procurement automation platform that streamlines the entire Request for Proposal (RFP) lifecycle — from creation to vendor comparison — using AI at every step.

A procurement manager can:
- Write an RFP in plain natural language and have AI convert it to a structured format
- Manage a vendor database
- Email RFPs directly to selected vendors
- Automatically receive and parse vendor proposals from email
- Compare proposals with AI-generated scoring and recommendations

---

## ✨ Features

### 📝 1. Natural Language RFP Creation
Type your requirements in plain English. GPT converts your messy text into a clean, structured JSON RFP — no templates needed.

### 🧑‍💼 2. Vendor Management
Add, edit, and store vendor profiles in MongoDB. Vendors are available to select when sending out any RFP.

### ✉️ 3. Send RFP via Email
Select one or more vendors and dispatch the RFP details directly from the platform using Nodemailer (SMTP).

### 📥 4. Automated Proposal Intake
Incoming vendor reply emails are auto-parsed using GPT — extracting pricing, delivery timelines, warranty terms, and completeness scores without manual effort.

### 📊 5. Proposal Comparison & AI Recommendation
Vendors are scored and ranked across multiple dimensions:
- 💰 Price
- 🚚 Delivery timeline
- 🛡 Warranty terms
- ✅ Proposal completeness
- 🤖 AI-generated recommendation

### 🎯 6. Onboarding Wizard
A guided, step-by-step setup flow helps new users configure the system and understand the full RFP workflow.

### 📈 7. Dashboard
A central dashboard displays key stats, the latest RFPs, and quick-action shortcuts for power users.

---

## 🧠 AI Integration

| Task | How AI Helps |
|---|---|
| Parse natural language RFP | Converts free-text input into structured JSON |
| Parse vendor email proposals | Extracts price, delivery days, warranty, totals |
| Compare vendors | Scores, ranks, and writes a recommendation summary |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Axios, Custom CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT Models , Gemini  |
| Email (outbound) | Nodemailer (SMTP) |
| Email (inbound) | IMAP Email Receiver |

---

## 📁 Project Structure

```
AI-Rfp-Premium/
├── backend/
│   └── src/
│       ├── controllers/    # Route handlers / business logic
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express API routes
│       ├── services/       # AI & email service integrations
│       └── server.js       # Entry point
│
├── frontend/
│   └── src/
│       ├── pages/          # Full page views (Dashboard, RFP, Compare, etc.)
│       ├── components/     # Reusable UI components
│       ├── styles/         # Custom CSS
│       └── api.js          # Axios API configuration
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API key
- Gmail account with App Password enabled (for SMTP/IMAP)

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start the backend:

```bash
npm start
# or for development with hot reload:
npm run dev
```

Backend runs at → `http://localhost:4000`

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🔌 API Endpoints

### RFP

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/rfps` | Create a new RFP from natural language |
| `GET` | `/api/rfps` | List all RFPs |
| `GET` | `/api/rfps/:id/details` | Get a specific RFP with proposals |
| `GET` | `/api/rfps/:id/compare` | Compare proposals with AI recommendation |

### Vendors

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/vendors` | Add a new vendor |
| `GET` | `/api/vendors` | List all vendors |

### Email

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/send-rfp` | Send RFP email to selected vendors |
| `POST` | `/api/email/receive` | Trigger inbound email parsing |

---

## 🧪 Seed Script

Quickly populate the database with sample data for testing:

```bash
node seed.js
```

This generates:
- 1 sample RFP
- Multiple vendor records
- 3 vendor proposals with varied pricing and terms

---

## 🚀 Planned Future Improvements

- [ ] PDF proposal parsing (attach & extract)
- [ ] Multi-user accounts with role-based access
- [ ] Dedicated vendor login portal
- [ ] Analytics dashboard with historical trends
- [ ] Full proposal timeline & audit history

---

## 🧰 Tools Used During Development

| Tool | Purpose |
|---|---|
| ChatGPT | Architecture planning & debugging |
| VS Code | Development environment |
| MongoDB Compass | Database inspection |
| React DevTools | Frontend debugging |
| Postman | API endpoint testing |

---

## 🏁 What This Project Demonstrates

- ✅ Real-world AI integration (GPT for parsing + comparison)
- ✅ Email automation (SMTP sending + IMAP receiving)
- ✅ RESTful backend architecture with Express
- ✅ MongoDB data modeling with Mongoose
- ✅ React frontend with component-driven UI
- ✅ End-to-end RFP lifecycle automation

---

## 📄 License

This project is open source. Feel free to fork, extend, and build on it.

---

> Built by [@ArshanaTheUI](https://github.com/ArshanaTheUI)