# Seme FC Official Website & Club Management Portal

A modern, responsive web portal and club administration system for **Seme FC**, a grassroots football club based in **Seme, Machakos County, Kenya**. 

Built from the ground up to showcase matchday fixtures, team squad rosters, touchline photo galleries, and an interactive multi-role membership application and approval system.

---

## 🌟 Key Features

### 1. Public Club Website (`index.html`)
- **Hero & About Section**: Introduces Seme FC, club ground, colors (White & Gold), nickname (*The Strikers*), and club leadership.
- **Matchday Fixtures**: Dynamic schedule showing upcoming league, cup, and friendly matches with dates, opponents, venues, and kickoff times.
- **Squad Lineup**: Interactive roster displaying player jersey numbers, names, positions, and player profile photos.
- **Touchline Gallery**: Showcase of matchday moments and training sessions.
- **Contact Form**: Direct messaging to club administration with strict email and phone validation.

### 2. Role-Based Join Application (`join.html`)
Applicants can apply to join Seme FC with role-tailored dynamic questionnaires:
- **⚽ Squad Player**:
  - Full Name, Email, Phone Contact
  - Age & Playing Position (Goalkeeper, Defenders, Midfielders, Wingers, Forwards)
  - Previous Club / Academy history
  - Personal ambition and reasons for wanting to join Seme FC
- **🤝 Club Sponsor**:
  - Organization / Brand Name
  - Email & Contact details
  - Sponsorship vision, partnership scope, and equipment/financial support details
- **📋 Club Staff**:
  - Staff Position Choice: *Head Coach*, *Assistant Coach*, *Technical Management*, or *Support Staff*
  - Football coaching licenses, professional experience, and track record
- **Instant Feedback & Redirection**: Form data is submitted to the admin queue in `localStorage`, displays a submission confirmation, and redirects the applicant to the homepage with a welcoming acknowledgment banner (`?applied=true`).

### 3. Administrator Portal (`admin.html`)
The admin portal is a **standalone page**. It is not linked from the public website or its navigation bar — you reach it by opening `admin.html` directly (bookmark it). Unauthorized visitors are shown a sign-in gate instead of the portal.

Authorized administrators get a suite of club management tools:
- **Fixture Management**: Create, update, or remove match fixtures in real time.
- **Squad & Photo Uploads**: Add new players, assign jersey numbers, edit details, and upload or link player profile photos.
- **Message Inbox**: View incoming contact messages and inquiries with sender contact info and timestamps.
- **Applications Management**:
  - Filter applicants by status (*All*, *Pending Approval*, *Accepted / Entry Granted*, *Rejected*) or by role (*Players*, *Sponsors*, *Staff*).
  - Review detailed applicant profiles, football background, contact details, and motivation.
- **Acceptance & Training Invitation Dispatch**:
  - Approving an application marks it as **Entry Granted** with timestamp.
  - Automatically prepares the official acceptance letter inviting the applicant to team training at Seme Pitch (Machakos County).
  - Provides instant **Send via Mail Client**, **Open in Gmail Web**, and **Copy Email Text** actions.
  - For accepted players, an **"⚽ + Add to Squad"** button quickly pre-fills the squad form to register them to the active team roster.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Semantic Markup, CSS3 (Custom Variables, Flexbox, CSS Grid, Responsive Animations)
- **Typography**: Google Fonts ([Kanit](https://fonts.google.com/specimen/Kanit) & [Karla](https://fonts.google.com/specimen/Karla))
- **Logic & Storage**: Vanilla JavaScript (ES6+), Web Storage API (`localStorage`)
- **Shared Data Layer**: `store.js` — one module loaded by both pages so the public site and the admin portal read and write the same records
- **Email Delivery**: `mailto:` scheme integration and Gmail Web Compose URL generator

---

## 📁 Project Structure

```
fc-seme/
├── index.html        # Public club website (fixtures, squad, gallery, contact)
├── join.html         # Role-based membership application form (Player/Sponsor/Staff)
├── admin.html        # Administrator portal (unlisted — visit directly)
├── store.js          # Shared localStorage data layer used by index.html & admin.html
├── fcseme.jpg        # Hero banner & club corner flag photography
├── images/           # Additional club images and assets
└── README.md         # Project documentation
```

---

## 🚀 Getting Started

### Running Locally

Since the application is purely client-side with `localStorage` persistence, you can run it using any static file server:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/samuelomari/fc-seme.git
   cd fc-seme
   ```

2. **Serve locally using Python**:
   ```bash
   # Python 3
   python3 -m http.server 8000
   ```

3. **Open in your browser**:
   ```
   http://localhost:8000
   ```
   Or open `index.html` directly in any modern web browser.

---

## 🔐 Administrator Access

The admin portal lives on its own page, **`admin.html`**. It has **no link anywhere on the public website** — open it directly and bookmark it.

1. Go to `http://localhost:8000/admin.html`
2. You will be presented with a full-page sign-in gate (the portal itself does not load until you authenticate).
3. Sign in and the admin bar, fixture management, squad management, applications and inbox are revealed.

- **Admin Email**: `samuelomari3641@gmail.com`
- **Default Password**: `1234%^&`

### Public site vs. admin portal

| | `index.html` (public) | `admin.html` (admin) |
| --- | --- | --- |
| Fixture / squad display | ✅ Read-only | ✅ Read + edit / delete |
| "Add Match" / "Add Player" buttons | ❌ Not present in markup | ✅ Present |
| Contact form & applications | ✅ Submit | ✅ Review & decide |
| Reachable from nav bar | ✅ | ❌ Unlisted |

### ⚠️ Security note

This is still a **client-side only** application. The credential check runs in the browser and the password sits in readable JavaScript, and all data lives in each visitor's own `localStorage`. Splitting the portal onto its own page makes it *discoverable only by direct URL* — it is **not** true access control.

When you add a backend, only the small set of `get*` / `save*` functions in **`store.js`** need to be replaced with API calls; the pages and all rendering logic stay exactly as they are.

---

## 👤 Author

- **Samuel Omari**
- Student & Developer — Moringa School
- Club Management — Seme FC, Machakos County, Kenya
- Contact: [samuelomari3641@gmail.com](mailto:samuelomari3641@gmail.com)
