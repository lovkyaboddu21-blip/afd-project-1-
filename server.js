import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = 'civic-connect-super-secret-local-key';
const DB_FILE = path.join(process.cwd(), 'database.json');

// --- DATABASE HELPERS ---
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error("Error reading DB", e);
    }
  }
  
  // Default Initial DB
  const defaultDB = {
    users: [
      { id: 1, name: 'Admin User', email: 'admin@civic.local', passwordHash: bcrypt.hashSync('admin123', 8), role: 'admin' },
      { id: 2, name: 'Citizen Joe', email: 'citizen@example.com', passwordHash: bcrypt.hashSync('password', 8), role: 'citizen' }
    ],
    complaints: [
      { id: 'C-2026-042', title: 'Massive Pipe Burst', category: 'Water leakage', department: 'Water Board', severity: 'High', status: 'In Progress', date: 'Oct 24, 09:30 AM', location: 'North Zone', description: 'Major leak.', assignedTo: 'Officer Michael B.' },
      { id: 'C-2026-041', title: 'Streetlight Out', category: 'Broken streetlight', department: 'Power & Safety', severity: 'Low', status: 'Pending', date: 'Oct 23, 08:15 PM', location: 'South Zone', description: 'Dark alley.', assignedTo: null },
      { id: 'C-2026-040', title: 'Pothole on Main', category: 'Potholes', department: 'Public Works', severity: 'Medium', status: 'Resolved', date: 'Oct 22, 10:00 AM', location: 'East Zone', description: 'Deep pothole.', assignedTo: 'Engineer Sarah T.' }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2));
  return defaultDB;
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = loadDB();

// Simple state for demo notifications
let userEmailAddress = null;
let emailTransporter = null;

// Initialize an Ethereal Mail account for testing
nodemailer.createTestAccount().then(account => {
  emailTransporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
  console.log('Ethereal Test Mailer initialized. Ready to send mock emails.');
}).catch(console.error);

async function sendNotificationEmail(subject, text) {
  if (!emailTransporter || !userEmailAddress) return;
  try {
    const info = await emailTransporter.sendMail({
      from: '"CivicConnect Alerts" <noreply@civicconnect.local>',
      to: userEmailAddress,
      subject: subject,
      text: text,
      html: `<h3>${subject}</h3><p>${text}</p>`
    });
    console.log("Email Notification Sent: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// In-Memory Database for Live Preview
// When you run the Python backend locally, the SQLite database takes over.
let complaints = [
  { id: 'C-2026-042', title: 'Massive Pipe Burst', category: 'Water leakage', department: 'Water Board', severity: 'High', status: 'In Progress', date: 'Oct 24, 09:30 AM', location: 'North Zone', description: 'Major leak.', assignedTo: 'Officer Michael B.' },
  { id: 'C-2026-041', title: 'Streetlight Out', category: 'Broken streetlight', department: 'Power & Safety', severity: 'Low', status: 'Pending', date: 'Oct 23, 08:15 PM', location: 'South Zone', description: 'Dark alley.', assignedTo: null },
  { id: 'C-2026-040', title: 'Pothole on Main', category: 'Potholes', department: 'Public Works', severity: 'Medium', status: 'Resolved', date: 'Oct 22, 10:00 AM', location: 'East Zone', description: 'Deep pothole.', assignedTo: 'Engineer Sarah T.' }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === API ENDPOINTS (Mirrors the FastAPI Python Backend) ===

  // AUTH ENDPOINTS
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ detail: "Invalid credentials" });

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ detail: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body;
    if (db.users.find(u => u.email === email)) return res.status(400).json({ detail: "Email already in use" });

    const newUser = {
      id: db.users.length + 1,
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 8),
      role: 'citizen'
    };
    db.users.push(newUser);
    saveDB(db);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  });

  // GET all complaints
  app.get("/api/complaints", (req, res) => {
    res.json(db.complaints);
  });

  // GET single complaint
  app.get("/api/complaints/:id", (req, res) => {
    const comp = db.complaints.find(c => c.id === req.params.id);
    if (!comp) return res.status(404).json({ detail: "Complaint not found" });
    res.json(comp);
  });

  // POST new complaint
  app.post("/api/complaints", (req, res) => {
    const body = req.body;
    
    // Auto-assignment routing logic mirroring python backend
    let department = "General Municipal";
    if (["Water leakage", "Drain blockage", "Sewage"].includes(body.category)) department = "Water Board";
    else if (["Potholes", "Road damage"].includes(body.category)) department = "Public Works";
    else if (["Garbage", "Illegal dumping"].includes(body.category)) department = "Sanitation";
    else if (["Broken streetlight", "Public safety hazard"].includes(body.category)) department = "Power & Safety";

    const newComplaint = {
      id: `C-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      title: body.title,
      category: body.category,
      severity: body.severity,
      description: body.description,
      location: body.location,
      status: "Pending",
      department,
      date: new Date().toLocaleString(),
      assignedTo: null
    };
    
    db.complaints = [newComplaint, ...db.complaints];
    saveDB(db);
    res.json(newComplaint);
  });

  // GET / POST settings
  app.get("/api/settings/email", (req, res) => {
    res.json({ email: userEmailAddress || "" });
  });

  app.post("/api/settings/email", (req, res) => {
    userEmailAddress = req.body.email || null;
    res.json({ message: "Email preferences saved.", email: userEmailAddress });
  });

  // PATCH status
  app.patch("/api/complaints/:id/status", (req, res) => {
    const idx = db.complaints.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ detail: "Complaint not found" });
    
    const oldStatus = db.complaints[idx].status;
    db.complaints[idx].status = req.body.status;
    saveDB(db);
    
    // Send email notification dynamically!
    if (oldStatus !== req.body.status) {
      sendNotificationEmail(
        `Status Update: Complaint ${db.complaints[idx].id}`,
        `The status of your reported complaint "${db.complaints[idx].title}" has changed from ${oldStatus} to ${req.body.status}.`
      );
    }
    
    res.json({ message: `Complaint updated to ${req.body.status}` });
  });

  // PATCH assignedTo
  app.patch("/api/complaints/:id/assign", (req, res) => {
    const idx = db.complaints.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ detail: "Complaint not found" });
    
    const oldAssignee = db.complaints[idx].assignedTo;
    db.complaints[idx].assignedTo = req.body.assignedTo;
    saveDB(db);
    
    if (oldAssignee !== req.body.assignedTo) {
      sendNotificationEmail(
        `Staff Assigned: Complaint ${db.complaints[idx].id}`,
        `Your complaint "${db.complaints[idx].title}" has now been assigned to ${req.body.assignedTo || "Unassigned"}.`
      );
    }

    res.json({ message: `Complaint assigned to ${req.body.assignedTo}` });
  });

  // === VITE FRONTEND MIDDLEWARE ===
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();