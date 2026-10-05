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
- **Backend**: [Supabase](https://supabase.com) — Postgres, Auth and Row Level Security
- **Data Layer**: `store.js` — one async module that transparently talks to Supabase, or falls back to `localStorage` in demo mode
- **Email Delivery**: `mailto:` scheme integration and Gmail Web Compose URL generator

---

## 📁 Project Structure

```
fc-seme/
├── index.html           # Public club website (fixtures, squad, gallery, contact)
├── join.html            # Role-based membership application form (Player/Sponsor/Staff)
├── admin.html           # Administrator portal (unlisted — visit directly)
├── store.js             # Shared async data + auth layer (Supabase ⇄ localStorage)
├── supabase-schema.sql  # Tables, Row Level Security policies and seed data
├── supabase-config.js   # Your Supabase URL + anon key (git-ignored)
├── fcseme.jpg           # Hero banner & club corner flag photography
├── images/              # Additional club images and assets
└── README.md            # Project documentation
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
2. You are presented with a sign-in gate (the portal itself does not render until you authenticate).
3. Sign in and fixture management, squad management, applications and the inbox are revealed.

| | `index.html` (public) | `admin.html` (admin) |
| --- | --- | --- |
| Fixture / squad display | ✅ Read-only | ✅ Read + edit / delete |
| "Add Match" / "Add Player" buttons | ❌ Not present in markup | ✅ Present |
| Contact form & applications | ✅ Submit | ✅ Review & decide |
| Reachable from nav bar | ✅ | ❌ Unlisted |

---

## 🚀 Enabling the Backend (real access control)

Out of the box the site runs in **demo mode**: data lives in `localStorage` and the
sign-in check happens in JavaScript, so it is *not* real security. The demo-mode
banner at the top of `admin.html` tells you when this is the case.

To make it genuinely admin-only you need a free Supabase project. **~10 minutes, no card.**

### Step 1 — Create the project

1. Sign up at [supabase.com](https://supabase.com) → **New project**
2. Name it `seme-fc`, save a database password, pick the region nearest Kenya
3. Wait ~2 minutes for provisioning

### Step 2 — Create the tables and security policies

Open **SQL Editor → New query**, paste the entire contents of
[`supabase-schema.sql`](supabase-schema.sql), and press **Run**.

That script creates every table, turns on **Row Level Security**, writes the
policies that make you the only admin, and seeds your default fixtures and squad.

### Step 3 — Create your login

1. **Authentication → Users → Add user → Create a new user**
2. Email: `samuelomari3641@gmail.com`
3. Set a password of your choosing
4. Tick **Auto Confirm User**

> This is the account listed in the `admins` table by the SQL script. No other
> email can ever read your applications or inbox.

### Step 4 — Paste your keys

1. **Project Settings → API**
2. Copy the **Project URL** and the **anon / public** key
3. Open `supabase-config.js` and fill them in:

```js
window.FCSEME_SUPABASE = {
  url: 'https://xxxxxxxxxxxx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

Refresh `admin.html` — the demo-mode banner disappears and real sign-in begins.

### Why the anon key in your code is safe

The anon key is designed to be public; it ships in every Supabase app. What
actually protects your data is **Row Level Security**, which runs inside the
database. A visitor can read your `admin.html` source, copy the key, and still be
rejected by the server, because the policies only grant admin access to an
email that exists in the `admins` table.

### Adding more admins later

```sql
insert into public.admins (email) values ('someone@example.com');
```

---

## 👤 Author

- **Samuel Omari**
- Student & Developer — Moringa School
- Club Management — Seme FC, Machakos County, Kenya
- Contact: [samuelomari3641@gmail.com](mailto:samuelomari3641@gmail.com)
