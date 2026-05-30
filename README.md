# 💼 Job Application Tracker Portal



A full-stack MERN application to help job seekers track every application in one place — from the first apply to the final offer. Manage stages, attach resumes, set reminders, and visualize your pipeline with analytics.

---

## 🚀 Live Demo

> 🔗 https://www.loom.com/share/895f26419f91485fa6f589c08046a60b
---

## 📸 Screenshots

|<img width="1920" height="1080" alt="Screenshot (1094)" src="https://github.com/user-attachments/assets/fe5b399a-c640-419e-9773-4dbd1c1406b6" />
<img width="1920" height="1080" alt="Screenshot (1095)" src="https://github.com/user-attachments/assets/d5619d4c-61ae-46ff-808c-9b403e56edca" />
<img width="1920" height="1080" alt="Screenshot (1093)" src="https://github.com/user-attachments/assets/643158ad-f47a-45c3-8b38-55f1c0e6c0ab" />
---<img width="1920" height="1080" alt="Screenshot (1096)" src="https://github.com/user-attachments/assets/dafcfa6c-6b86-4f99-b277-73db7bb9d8f8" />
<img width="1920" height="1080" alt="Screenshot (1097)" src="https://github.com/user-attachments/assets/002d7e58-4fa6-4a5c-9438-5a3e948ddf3a" />


## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with protected routes
- 📋 **Application CRUD** — Add, edit, delete job applications with full details
- 🔄 **Stage Tracking** — Track progress: `Applied → OA → Interview → Offer / Rejected`
- 🔍 **Filter & Search** — Filter by status, company, date range; full-text search
- 📎 **Resume Management** — Attach resume and cover letter links per application
- 👥 **Contact Tracking** — Save recruiter/HR contacts per company
- 🔔 **Reminders** — Set follow-up reminders and deadlines
- 📊 **Analytics Dashboard** — Funnel chart, response rate, offer rate visualization
- 🏷️ **JD Keyword Extraction** — Highlight keywords from job descriptions for resume tailoring
- 📱 **Responsive Design** — Mobile-first UI built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios |
| Styling | Tailwind CSS, Headless UI |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JWT, bcrypt.js |
| Charts | Chart.js, React-Chartjs-2 |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 📁 Folder Structure

```
job-application-tracker/
│
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── ApplicationCard.jsx
│       │   ├── StageFilter.jsx
│       │   └── FunnelChart.jsx
│       ├── pages/              # Route-level pages
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Applications.jsx
│       │   ├── AddApplication.jsx
│       │   └── Analytics.jsx
│       ├── context/            # Auth context
│       ├── hooks/              # Custom hooks
│       ├── utils/              # API helpers
│       └── App.jsx
│
├── server/                     # Node.js + Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── applicationRoutes.js
│   └── server.js
│
├── docs/
│   └── screenshots/
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/job-application-tracker.git
cd job-application-tracker
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:

```bash
npm start
```

### 4. Open in browser

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get logged-in user profile |

### Application Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications for user |
| POST | `/api/applications` | Create a new application |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| GET | `/api/applications/analytics` | Get funnel and stats |

---

## 🗃️ Database Schema

### User Model
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String (hashed),
  createdAt: Date
}
```

### Application Model
```js
{
  userId: ObjectId (ref: User),
  company: String,
  role: String,
  status: Enum ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'],
  appliedDate: Date,
  resumeLink: String,
  coverLetterLink: String,
  contactName: String,
  contactEmail: String,
  notes: String,
  reminder: Date,
  jobDescription: String,
  createdAt: Date
}
```

---

## 🔄 Application Workflow

```
User registers / logs in
        ↓
JWT token stored in localStorage
        ↓
Add job application with company, role, date
        ↓
Update status as you progress through stages
        ↓
View Dashboard → see funnel analytics
        ↓
Filter / search applications by status or company
```

---

## 🚢 Deployment

### Deploy Frontend to Vercel

```bash
cd client
npm run build
# Push to GitHub and connect repo on vercel.com
```

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add your environment variables in Render dashboard

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 👨‍💻 Author

**Your Name**
- GitHub: https://github.com/Vasundhara475
- LinkedIn: www.linkedin.com/in/vasundhara-suryawanshi

---

> ⭐ If you found this project helpful, please give it a star on GitHub!
