# Seme FC Official Website & Club Management Portal

A modern, responsive web portal and club administration system for **Seme FC**, a grassroots football club based in **Seme, Machakos County, Kenya**. 

Built from the ground up to showcase matchday fixtures, team squad rosters, touchline photo galleries, and an interactive multi-role membership application and approval system.

---

## Key Features

### 1. Public Club Website (`index.html`)
- **Hero & About Section**: Introduces Seme FC, club ground, colors (White & Gold), nickname (*The Strikers*), and club leadership.
- **Matchday Fixtures**: Dynamic schedule showing upcoming league, cup, and friendly matches with dates, opponents, venues, and kickoff times.
- **Squad Lineup**: Interactive roster displaying player jersey numbers, names, positions, and player profile photos.
- **Touchline Gallery**: Showcase of matchday moments and training sessions.
- **Contact Form**: Direct messaging to club administration with strict email and phone validation.

### 2. Role-Based Join Application (`join.html`)
Applicants can apply to join Seme FC with role-tailored dynamic questionnaires:
- ** Squad Player**:
  - Full Name, Email, Phone Contact
  - Age & Playing Position (Goalkeeper, Defenders, Midfielders, Wingers, Forwards)
  - Previous Club / Academy history
  - Personal ambition and reasons for wanting to join Seme FC
- ** Club Sponsor**:
  - Organization / Brand Name
  - Email & Contact details
  - Sponsorship vision, partnership scope, and equipment/financial support details
- ** Club Staff**:
  - Staff Position Choice: *Head Coach*, *Assistant Coach*, *Technical Management*, or *Support Staff*
  - Football coaching licenses, professional experience, and track record
- **Instant Feedback & Redirection**: Form data is submitted to the admin queue in `localStorage`, displays a submission confirmation, and redirects the applicant to the homepage with a welcoming acknowledgment banner (`?applied=true`).

### 3. Administrator Portal (`is-admin`)
Authorized administrators can access a suite of club management tools:
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
  - For accepted players, an **" + Add to Squad"** button quickly pre-fills the squad form to register them to the active team roster.

---

##  Technology Stack

- **Frontend**: HTML5, Semantic Markup, CSS3 (Custom Variables, Flexbox, CSS Grid, Responsive Animations)
- **Typography**: Google Fonts ([Kanit](https://fonts.google.com/specimen/Kanit) & [Karla](https://fonts.google.com/specimen/Karla))
- **Logic & Storage**: Vanilla JavaScript (ES6+), Web Storage API (`localStorage`)
- **Email Delivery**: `mailto:` scheme integration and Gmail Web Compose URL generator

---

##  Project Structure

```
fc-seme/
├── index.html        # Main club website, fixtures, squad & admin portal
├── join.html         # Role-based membership application form (Player/Sponsor/Staff)
├── fcseme.jpg        # Hero banner & club corner flag photography
├── images/           # Additional club images and assets
└── README.md         # Project documentation
```

---

##  Getting Started

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

##  Administrator Access

- **Admin Login Trigger**: Click **Admin Portal** in the navigation bar.
- **Default Google Account**: `samuelomari3641@gmail.com`
- **Default Password**: `1234%^&`

*Once logged in, the golden Admin Bar appears at the top of the screen giving direct access to Fixture, Squad, Application, and Inbox management tools.*

---

##  Author

- **Samuel Omari**
- Student & Developer — Moringa School
- Club Management — Seme FC, Machakos County, Kenya
- Contact: [samuelomari3641@gmail.com](mailto:samuelomari3641@gmail.com)
