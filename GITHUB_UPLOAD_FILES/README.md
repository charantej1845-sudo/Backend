# Volunteer Management System (MERN Stack)

A full-stack web application designed for non-governmental organizations (NGOs) to manage volunteers, coordinate events, track skills, configure availability schedules, and monitor community impact.

---

## 🌟 Key Features

### 1. Multi-Role Authentication & Access Control
- **JWT (JSON Web Tokens)** & **Bcrypt** password hashing.
- Role-Based Access Control (RBAC) supporting three distinct personas:
  - **Volunteer**: Browse opportunities, match required skills, set availability, apply for events, and view verified hours.
  - **NGO (Organizer)**: Create, edit, and manage events, review applicant profiles, approve/reject volunteers, record attendance, and award service hours.
  - **Admin**: Oversee all platform metrics, manage global skills catalog, and inspect system accounts.
- **1-Click Demo Sandbox Banner**: Seamlessly switch between Volunteer, NGO, and Admin accounts directly from the UI.

### 2. Comprehensive Entity Management (CRUD Operations)
- **Volunteers**: Profile management, skills tagging, city/location, emergency contacts, and badges.
- **NGOs**: Organization identity, verified status, cause category, mission statement, contact person, and address.
- **Skills Catalog**: Categorized competencies (Healthcare, STEM, IT, Media, Logistics, Environment) used to match volunteers with event requirements.
- **Events**: Full lifecycle management (Draft, Upcoming, Active, Completed, Cancelled), capacity tracking, location (In-Person / Virtual / Hybrid), and certified hours credits.
- **Availability Matrix**: Interactive weekly schedule manager (Days of week, shift time slots, max weekly hours, location preference).
- **Applications & Attendance**: Application submission with personalized notes, status workflow (`pending` → `approved` → `attended`), feedback ratings, and service hours credit.

---

## 🏗️ Technology Architecture

```
Volunteer Management System
├── backend/ (Node.js + Express.js + MongoDB)
│   ├── src/
│   │   ├── config/db.js           # Mongoose database connection
│   │   ├── models/                # MongoDB Data Schemas
│   │   │   ├── User.js            # Authentication & base user
│   │   │   ├── VolunteerProfile.js# Skills, bio, hours logged
│   │   │   ├── NGOProfile.js      # Organization info, cause, mission
│   │   │   ├── Skill.js           # Platform skill taxonomy
│   │   │   ├── Event.js           # Events, dates, capacity, credits
│   │   │   ├── Availability.js    # Weekly schedule & shift preference
│   │   │   └── Application.js     # Applications, review, attendance
│   │   ├── routes/                # RESTful API endpoints
│   │   ├── middleware/            # JWT authentication & authorization
│   │   ├── seed/seeder.js         # Realistic seed dataset
│   │   └── server.js              # Express server entry point
│   ├── .env
│   └── package.json
└── frontend/ (React 18 + Vite + Tailwind CSS + Lucide Icons)
    ├── src/
    │   ├── components/            # Reusable UI widgets & DemoBanner
    │   ├── context/AuthContext.jsx # Global auth, profile & demo login
    │   ├── pages/
    │   │   ├── Home.jsx           # Landing page with live impact metrics
    │   │   ├── EventsList.jsx     # Filterable event directory
    │   │   ├── EventDetail.jsx    # Event overview & application modal
    │   │   ├── NGODirectory.jsx   # Non-profit directory
    │   │   ├── SkillsDirectory.jsx# Competency directory
    │   │   ├── Login.jsx          # Sign-in with quick-fill demo buttons
    │   │   ├── Register.jsx       # Tabbed registration (Volunteer vs NGO)
    │   │   ├── volunteer/         # Dashboard, Availability, Profile, Applications
    │   │   ├── ngo/               # Dashboard, Event CRUD, Applicants, Volunteers
    │   │   └── admin/             # System overview & Skills CRUD
    │   └── services/api.js        # Axios instance with auto JWT interceptor
    ├── vite.config.js
    └── package.json
```

---

## 🔑 Pre-Seeded Demo Credentials

You can log in manually using the credentials below, or click any persona in the **1-Click Demo Sandbox Banner** at the top of the app:

| Role | Email | Password | Persona Details |
| :--- | :--- | :--- | :--- |
| **Volunteer** | `sarah.jenkins@example.com` | `password123` | Sarah Jenkins (Environmentalist, STEM Tutor, 24 hrs logged) |
| **Volunteer 2** | `alex.rivera@example.com` | `password123` | Alex Rivera (First Aid & CPR, Web Dev, 36 hrs logged) |
| **NGO Organizer** | `greenearth@ngo.org` | `password123` | Green Earth Conservation Alliance (Urban forestry & cleanups) |
| **NGO Organizer 2** | `hopeforall@ngo.org` | `password123` | Hope For All Children Foundation (STEM & literacy drives) |
| **System Admin** | `admin@volunteerhub.org` | `adminpassword123` | Platform Superadmin (Full governance & skills CRUD) |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running on default port `27017` or configured via `MONGODB_URI`)

### 1. Install All Dependencies
From the repository root directory:
```bash
npm run install:all
```

### 2. Seed the Database
Populate MongoDB with verified skills, NGOs, volunteers, availability schedules, events, and applications:
```bash
npm run seed
```

### 3. Run Development Servers
Start both backend (port `5000`) and frontend (port `3000`) with a single command:
```bash
npm run dev
```

Visit the application at:
👉 **`http://localhost:3000/`**

---

## 📡 REST API Reference

### Authentication & Profiles (`/api/auth`)
- `POST /api/auth/register` - Create volunteer or NGO account
- `POST /api/auth/login` - Authenticate and obtain JWT
- `GET /api/auth/me` - Get current session, user role, and profile
- `PUT /api/auth/profile` - Update basic name/phone/avatar

### Events (`/api/events`)
- `GET /api/events` - List events with query filters (`search`, `category`, `locationType`, `skill`)
- `GET /api/events/:id` - Detailed event information with NGO & skill details
- `POST /api/events` - Create event (NGO / Admin)
- `PUT /api/events/:id` - Update event (NGO owner / Admin)
- `DELETE /api/events/:id` - Delete event & linked applications
- `GET /api/events/ngo/my-events` - Get events owned by current NGO

### Volunteer Schedule & Availability (`/api/availability`)
- `GET /api/availability/me` - Get logged-in volunteer's schedule
- `PUT /api/availability/me` - Update days of week, shift slots, max hours/wk
- `GET /api/availability/volunteer/:volunteerId` - View volunteer availability (NGO)

### Applications & Attendance (`/api/applications`)
- `POST /api/applications/apply/:eventId` - Volunteer applies for an event
- `GET /api/applications/my-applications` - List applications for current volunteer
- `DELETE /api/applications/:id/cancel` - Withdraw application
- `GET /api/applications/ngo/all` - List applications across all NGO events
- `PUT /api/applications/:id/status` - Approve, reject, or mark attended with hours logged & rating

### Skills Catalog (`/api/skills`)
- `GET /api/skills` - List skills catalog
- `POST /api/skills` - Add new skill (Admin / NGO)
- `PUT /api/skills/:id` - Update skill (Admin)
- `DELETE /api/skills/:id` - Remove skill (Admin)

### Platform Statistics (`/api/stats`)
- `GET /api/stats/overview` - Public platform impact metrics
- `GET /api/stats/volunteer` - Volunteer dashboard metrics
- `GET /api/stats/ngo` - NGO organizer dashboard metrics
- `GET /api/stats/admin` - System governance metrics
