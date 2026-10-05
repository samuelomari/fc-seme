/* ==========================================================================
   SEME FC - DATA + AUTH LAYER
   --------------------------------------------------------------------------
   Loaded by index.html (public site), join.html (application form) and
   admin.html (admin portal).

   TWO MODES, ONE API
   ------------------
   * BACKEND MODE  - when supabase-config.js holds real credentials.
     Every read/write goes to Postgres, and every write is authorised by
     Row Level Security policies on the server. A visitor cannot read or
     change anything they are not allowed to, even by bypassing this file.

   * DEMO MODE     - while the config still has placeholders. Falls back to
     localStorage so the site keeps working before you set the backend up.
     NOT secure - see the banner in admin.html.

   The pages never know which mode they are in.
   ========================================================================== */

/* Where club messages are delivered */
var ADMIN_EMAIL = 'samuelomari3641@gmail.com';

/* Credentials checked ONLY in demo mode. With a real backend the password
   is verified by Supabase Auth and never reaches the browser. */
var FALLBACK_ADMIN = { email: 'samuelomari3641@gmail.com', pass: '1234%^&' };

var STORAGE_KEYS = {
  isAdmin: 'fcseme_admin_logged_in',
  fixtures: 'fcseme_fixtures_v2',
  squad: 'fcseme_squad_v2',
  inbox: 'fcseme_admin_inbox_v1',
  applications: 'fcseme_applications_v1',
  staff: 'fcseme_staff_v1',
  sponsors: 'fcseme_sponsors_v1'
};

/* ==========================================================================
   BACKEND WIRING
   ========================================================================== */
var SUPABASE_CONFIG = (typeof window !== 'undefined' && window.FCSEME_SUPABASE) || null;

function isBackendReady() {
  if (!SUPABASE_CONFIG) return false;
  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) return false;
  var url = String(SUPABASE_CONFIG.url || '');
  var key = String(SUPABASE_CONFIG.anonKey || '');
  if (!url || !key) return false;
  if (/YOUR_PROJECT|PASTE_|<.*>/.test(url) || /PASTE_|YOUR_/.test(key)) return false;
  return true;
}

var sb = null;
if (isBackendReady()) {
  sb = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  if (window.supabase && window.supabase.auth && window.supabase.auth.onAuthStateChange) {
    sb.auth.onAuthStateChange(function () { /* session refresh handled by callers */ });
  }
}

/* ==========================================================================
   LOCAL STORAGE HELPERS (demo mode)
   ========================================================================== */
function lsGet(key, fallback) {
  var raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch (e) { return fallback; }
}
function lsSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

/* ==========================================================================
   ROW <-> OBJECT MAPPING
   ========================================================================== */
function toFixtureRow(f) {
  return { id: f.id, day: f.day, month: f.month, match_title: f.match, venue: f.venue, competition: f.comp };
}
function fromFixtureRow(r) {
  return { id: r.id, day: r.day, month: r.month, match: r.match_title, venue: r.venue, comp: r.competition };
}
function toSquadRow(p) {
  return { id: p.id, no: p.no, name: p.name, pos: p.pos, image: p.image || '' };
}
function fromSquadRow(r) {
  return { id: r.id, no: r.no, name: r.name, pos: r.pos, image: r.image || '' };
}
function toApplicationRow(a) {
  return {
    id: a.id, role: a.role, name: a.name, email: a.email, phone: a.phone,
    status: a.status || 'pending',
    submitted_at: a.submittedAt || '',
    accepted_at: a.acceptedAt || null,
    player_age: (typeof a.playerAge === 'number') ? a.playerAge : null,
    player_position: a.playerPosition || null,
    player_prev_club: a.playerPrevClub || null,
    player_reason: a.playerReason || null,
    sponsor_reason: a.sponsorReason || null,
    staff_role: a.staffRole || null,
    staff_experience: a.staffExperience || null
  };
}
function fromApplicationRow(r) {
  return {
    id: r.id, role: r.role, name: r.name, email: r.email, phone: r.phone,
    status: r.status,
    submittedAt: r.submitted_at || '',
    acceptedAt: r.accepted_at || '',
    playerAge: r.player_age,
    playerPosition: r.player_position,
    playerPrevClub: r.player_prev_club,
    playerReason: r.player_reason,
    sponsorReason: r.sponsor_reason,
    staffRole: r.staff_role,
    staffExperience: r.staff_experience
  };
}

/* ==========================================================================
   GENERIC SUPABASE HELPERS
   ========================================================================== */
async function sbSelect(table) {
  var res = await sb.from(table).select('*').order('created_at', { ascending: true });
  if (res.error) throw res.error;
  return res.data || [];
}

/* Upsert the given rows and remove any row not in the list. */
async function sbSync(table, rows) {
  var existing = await sbSelect(table);
  var keep = rows.map(function (r) { return r.id; });
  var remove = existing.map(function (r) { return r.id; }).filter(function (id) { return keep.indexOf(id) === -1; });

  if (rows.length) {
    var up = await sb.from(table).upsert(rows);
    if (up.error) throw up.error;
  }
  if (remove.length) {
    var del = await sb.from(table).delete().in('id', remove);
    if (del.error) throw del.error;
  }
}

/* ==========================================================================
   PUBLIC API - READ
   Every one of these is async. Always `await` them.
   ========================================================================== */
async function getFixtures() {
  if (sb) return (await sbSelect('fixtures')).map(fromFixtureRow);
  return lsGet(STORAGE_KEYS.fixtures, null) || lsSeedFixtures();
}

async function getSquad() {
  if (sb) return (await sbSelect('squad')).map(fromSquadRow);
  return lsGet(STORAGE_KEYS.squad, null) || lsSeedSquad();
}

async function getStaff() {
  if (sb) return (await sbSelect('staff'));
  return lsGet(STORAGE_KEYS.staff, []);
}

async function getSponsors() {
  if (sb) return (await sbSelect('sponsors'));
  return lsGet(STORAGE_KEYS.sponsors, []);
}

async function getApplications() {
  if (sb) return (await sbSelect('applications')).map(fromApplicationRow);
  return lsGet(STORAGE_KEYS.applications, []);
}

async function getInbox() {
  if (sb) return (await sbSelect('messages'));
  return lsGet(STORAGE_KEYS.inbox, []);
}

/* ==========================================================================
   PUBLIC API - WRITE (admin operations)
   In backend mode these are enforced by RLS: if you are not signed in as an
   admin, the database silently rejects them.
   ========================================================================== */
async function saveFixtures(list) {
  if (sb) await sbSync('fixtures', list.map(toFixtureRow));
  else lsSet(STORAGE_KEYS.fixtures, list);
  if (typeof renderFixtures === 'function') await renderFixtures();
}

async function saveSquad(list) {
  if (sb) await sbSync('squad', list.map(toSquadRow));
  else lsSet(STORAGE_KEYS.squad, list);
  if (typeof renderSquad === 'function') await renderSquad();
}

async function saveApplications(list) {
  if (sb) await sbSync('applications', list.map(toApplicationRow));
  else lsSet(STORAGE_KEYS.applications, list);
  if (typeof updateAppsCount === 'function') updateAppsCount();
}

async function saveInbox(list) {
  if (sb) await sbSync('messages', list);
  else lsSet(STORAGE_KEYS.inbox, list);
  if (typeof updateInboxCount === 'function') updateInboxCount();
}

async function saveStaff(list) {
  if (sb) await sbSync('staff', list);
  else lsSet(STORAGE_KEYS.staff, list);
}

async function saveSponsors(list) {
  if (sb) await sbSync('sponsors', list);
  else lsSet(STORAGE_KEYS.sponsors, list);
}

/* ==========================================================================
   PUBLIC API - SUBMISSIONS (open to the public, read-back is not)
   ========================================================================== */
async function submitApplication(app) {
  if (sb) {
    var ins = await sb.from('applications').insert(toApplicationRow(app));
    if (ins.error) throw ins.error;
    return true;
  }
  var apps = lsGet(STORAGE_KEYS.applications, []);
  apps.unshift(app);
  lsSet(STORAGE_KEYS.applications, apps);
  return true;
}

async function submitMessage(msg) {
  if (sb) {
    var ins = await sb.from('messages').insert(msg);
    if (ins.error) throw ins.error;
    return true;
  }
  var inbox = lsGet(STORAGE_KEYS.inbox, []);
  inbox.unshift(msg);
  lsSet(STORAGE_KEYS.inbox, inbox);
  return true;
}

/* ==========================================================================
   AUTH
   ========================================================================== */

/* True when the visitor holds a valid authenticated session. */
async function isSignedIn() {
  if (!sb) return isFallbackAdmin();
  var res = await sb.auth.getSession();
  return !!(res.data && res.data.session);
}

async function getSession() {
  if (!sb) return null;
  var res = await sb.auth.getSession();
  return res.data ? res.data.session : null;
}

/* Returns the signed-in admin's email, or null. */
async function getAdminEmail() {
  var session = await getSession();
  return session ? session.user.email : null;
}

/* Throws on invalid credentials. Verified by Supabase, not by this file. */
async function signIn(email, password) {
  if (!sb) {
    if (email === FALLBACK_ADMIN.email && password === FALLBACK_ADMIN.pass) {
      localStorage.setItem(STORAGE_KEYS.isAdmin, 'true');
      return { email: FALLBACK_ADMIN.email };
    }
    throw new Error('Invalid credentials.');
  }
  var res = await sb.auth.signInWithPassword({ email: email, password: password });
  if (res.error) throw res.error;
  return { email: res.data.user.email };
}

async function signOut() {
  if (!sb) {
    localStorage.removeItem(STORAGE_KEYS.isAdmin);
    return;
  }
  await sb.auth.signOut();
}

/* Demo-mode only flag. Returns true/false rather than throwing. */
function isFallbackAdmin() {
  return localStorage.getItem(STORAGE_KEYS.isAdmin) === 'true';
}

/* Subscribe to sign-in / sign-out so the UI can react. */
function onAuthChange(handler) {
  if (sb && sb.auth && sb.auth.onAuthStateChange) {
    sb.auth.onAuthStateChange(handler);
  }
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

/* Demo-mode seeds so a fresh browser still sees content. */
function lsSeedFixtures() {
  var d = [
    { id: 'fix-1', day: 'SAT', month: 'Sep 12', match: 'Seme FC vs Machakos All Stars', venue: 'Seme Grounds · 3:00 PM', comp: 'League' },
    { id: 'fix-2', day: 'SUN', month: 'Sep 20', match: 'Athi River FC vs Seme FC', venue: 'Away · 2:30 PM', comp: 'League' },
    { id: 'fix-3', day: 'SAT', month: 'Sep 27', match: 'Seme FC vs Katangi United', venue: 'Seme Grounds · 3:00 PM', comp: 'Cup' }
  ];
  lsSet(STORAGE_KEYS.fixtures, d);
  return d;
}
function lsSeedSquad() {
  var d = [
    { id: 'sq-1', no: '01', name: 'James Otieno', pos: 'Goalkeeper', image: '' },
    { id: 'sq-2', no: '02', name: 'Brian Mutua', pos: 'Defender', image: '' },
    { id: 'sq-3', no: '04', name: 'David Kioko', pos: 'Defender', image: '' },
    { id: 'sq-4', no: '06', name: 'Kevin Omondi', pos: 'Midfielder', image: '' },
    { id: 'sq-5', no: '08', name: 'Emmanuel Wambua', pos: 'Midfielder', image: '' },
    { id: 'sq-6', no: '09', name: 'Collins Mwangi', pos: 'Forward', image: '' },
    { id: 'sq-7', no: '10', name: 'Samuel Omari', pos: 'Forward', image: '' },
    { id: 'sq-8', no: '14', name: 'Victor Mutiso', pos: 'Winger', image: '' }
  ];
  lsSet(STORAGE_KEYS.squad, d);
  return d;
}
