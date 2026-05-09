import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json({ limit: '50mb' }));

const DATA_DIR = path.join(__dirname, '..', 'data');

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown): void {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8');
}

// ── Health ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Auth ──────────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ error: 'Missing credentials' });

    if (username === 'admin') {
      const salt = 'rex-portfolio-admin-salt-v1';
      const expectedHash =
        '3350dacc8c88d0821cb1cc848f839a1541edd1314dd4e94b83a7c796c20d07e3fc7fe696baa6045912e77a0f279776891dd5b3e2d4ca42684ddf95da10a2b74b';
      const hash = crypto.scryptSync(password, salt, 64).toString('hex');
      if (hash === expectedHash)
        return res.json({ success: true, message: 'Login successful' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.post('/api/forgot-password', (req, res) => {
  try {
    const email = (req.body || {}).email;
    const allowedEmails = ['imahinasyon321@gmail.com', 'rex.punlagao@gmail.com'];
    if (email && typeof email === 'string' && allowedEmails.includes(email.toLowerCase())) {
      return res.json({
        success: true,
        message: 'Credential recovery successful.',
        credentials: { username: 'admin', password: 'Bru123sh@@$$' },
      });
    }
    res.status(401).json({ error: 'Email not authorized for recovery.' });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error during recovery' });
  }
});

// ── Categories ────────────────────────────────────────────────────────────
app.get('/api/categories', (_req, res) => {
  res.json(readJson('categories.json', []));
});

app.post('/api/categories', (req, res) => {
  try {
    writeJson('categories.json', req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save categories' });
  }
});

// ── Projects ──────────────────────────────────────────────────────────────
app.get('/api/projects', (_req, res) => {
  const projects = readJson<any[]>('db.json', []);
  projects.sort((a, b) => a.id - b.id);
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  try {
    const projects = Array.isArray(req.body) ? req.body : [req.body];
    projects.sort((a, b) => a.id - b.id);
    writeJson('db.json', projects);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save projects' });
  }
});

// ── Profile ───────────────────────────────────────────────────────────────
app.get('/api/profile', (_req, res) => {
  res.json(readJson('profile.json', {}));
});

app.post('/api/profile', (req, res) => {
  try {
    writeJson('profile.json', req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// ── Services ──────────────────────────────────────────────────────────────
app.get('/api/services', (_req, res) => {
  res.json(readJson('services.json', []));
});

app.post('/api/services', (req, res) => {
  try {
    writeJson('services.json', req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save services' });
  }
});

// ── Skills ────────────────────────────────────────────────────────────────
app.get('/api/skills', (_req, res) => {
  res.json(readJson('skills.json', []));
});

app.post('/api/skills', (req, res) => {
  try {
    writeJson('skills.json', req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save skills' });
  }
});

// ── Social Links ──────────────────────────────────────────────────────────
app.get('/api/social-links', (_req, res) => {
  res.json(readJson('social_links.json', []));
});

app.post('/api/social-links', (req, res) => {
  try {
    writeJson('social_links.json', req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save social links' });
  }
});

// ── Maintenance ───────────────────────────────────────────────────────────
app.get('/api/maintenance', (_req, res) => {
  res.json(readJson('maintenance.json', { enabled: false }));
});

app.post('/api/maintenance', (req, res) => {
  try {
    writeJson('maintenance.json', req.body);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save maintenance state' });
  }
});

module.exports = app;
