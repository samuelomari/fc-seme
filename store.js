/* ==========================================================================
   SEME FC — SHARED DATA LAYER (Web Storage API)
   --------------------------------------------------------------------------
   Loaded by BOTH index.html (public site) and admin.html (admin portal) so
   the two pages read and write exactly the same records.

   NOTE: this is still browser-only storage. Moving to a real backend later
   means replacing the bodies of these functions only — the pages and all
   their render logic stay exactly as they are.
   ========================================================================== */

/* Where club messages are delivered */
const ADMIN_EMAIL = 'samuelomari3641@gmail.com';

const STORAGE_KEYS = {
  isAdmin: 'fcseme_admin_logged_in',
  fixtures: 'fcseme_fixtures_v2',
  squad: 'fcseme_squad_v2',
  inbox: 'fcseme_admin_inbox_v1',
  applications: 'fcseme_applications_v1',
  staff: 'fcseme_staff_v1',
  sponsors: 'fcseme_sponsors_v1'
};

/* Default initial fixtures */
const DEFAULT_FIXTURES = [
  {
    id: 'fix-1',
    day: 'SAT',
    month: 'Sep 12',
    match: 'Seme FC vs Machakos All Stars',
    venue: 'Seme Grounds · 3:00 PM',
    comp: 'League'
  },
  {
    id: 'fix-2',
    day: 'SUN',
    month: 'Sep 20',
    match: 'Athi River FC vs Seme FC',
    venue: 'Away · 2:30 PM',
    comp: 'League'
  },
  {
    id: 'fix-3',
    day: 'SAT',
    month: 'Sep 27',
    match: 'Seme FC vs Katangi United',
    venue: 'Seme Grounds · 3:00 PM',
    comp: 'Cup'
  }
];

/* Default initial squad with placeholder player cards */
const DEFAULT_SQUAD = [
  { id: 'sq-1', no: '01', name: 'James Otieno', pos: 'Goalkeeper', image: '' },
  { id: 'sq-2', no: '02', name: 'Brian Mutua', pos: 'Defender', image: '' },
  { id: 'sq-3', no: '04', name: 'David Kioko', pos: 'Defender', image: '' },
  { id: 'sq-4', no: '06', name: 'Kevin Omondi', pos: 'Midfielder', image: '' },
  { id: 'sq-5', no: '08', name: 'Emmanuel Wambua', pos: 'Midfielder', image: '' },
  { id: 'sq-6', no: '09', name: 'Collins Mwangi', pos: 'Forward', image: '' },
  { id: 'sq-7', no: '10', name: 'Samuel Omari', pos: 'Forward', image: '' },
  { id: 'sq-8', no: '14', name: 'Victor Mutiso', pos: 'Winger', image: '' }
];

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
function getIsAdmin() {
  return localStorage.getItem(STORAGE_KEYS.isAdmin) === 'true';
}

function setIsAdmin(val) {
  if (val) {
    localStorage.setItem(STORAGE_KEYS.isAdmin, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.isAdmin);
  }
}

function getFixtures() {
  const raw = localStorage.getItem(STORAGE_KEYS.fixtures);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.fixtures, JSON.stringify(DEFAULT_FIXTURES));
    return DEFAULT_FIXTURES;
  }
  try {
    return JSON.parse(raw);
  } catch(e) {
    return DEFAULT_FIXTURES;
  }
}

function saveFixtures(fixtures) {
  localStorage.setItem(STORAGE_KEYS.fixtures, JSON.stringify(fixtures));
  if (typeof renderFixtures === 'function') renderFixtures();
}

function getSquad() {
  const raw = localStorage.getItem(STORAGE_KEYS.squad);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.squad, JSON.stringify(DEFAULT_SQUAD));
    return DEFAULT_SQUAD;
  }
  try {
    return JSON.parse(raw);
  } catch(e) {
    return DEFAULT_SQUAD;
  }
}

function saveSquad(squad) {
  localStorage.setItem(STORAGE_KEYS.squad, JSON.stringify(squad));
  if (typeof renderSquad === 'function') renderSquad();
}

function getInbox() {
  const raw = localStorage.getItem(STORAGE_KEYS.inbox);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch(e) {
    return [];
  }
}

function saveInbox(inbox) {
  localStorage.setItem(STORAGE_KEYS.inbox, JSON.stringify(inbox));
  if (typeof updateInboxCount === 'function') updateInboxCount();
}

function getApplications() {
  const raw = localStorage.getItem(STORAGE_KEYS.applications);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch(e) {
    return [];
  }
}

function saveApplications(apps) {
  localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(apps));
  if (typeof updateAppsCount === 'function') updateAppsCount();
}

function getStaff() {
  const raw = localStorage.getItem(STORAGE_KEYS.staff);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch(e) { return []; }
}

function saveStaff(staff) {
  localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
}

function getSponsors() {
  const raw = localStorage.getItem(STORAGE_KEYS.sponsors);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch(e) { return []; }
}

function saveSponsors(sponsors) {
  localStorage.setItem(STORAGE_KEYS.sponsors, JSON.stringify(sponsors));
}

/* ==========================================================================
   UTILS
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
