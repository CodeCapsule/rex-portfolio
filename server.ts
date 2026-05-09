import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { sanitizeRequestBody } from "./utils/sanitize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown): void {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Security middleware: sanitize all incoming POST/PUT/PATCH request bodies
  app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      try {
        req.body = sanitizeRequestBody(req.body);
      } catch (err) {
        console.error("[SECURITY] Failed to sanitize request body:", err);
        return res.status(400).json({ error: "Invalid request data" });
      }
    }
    next();
  });

  // ── Health ────────────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── Auth ──────────────────────────────────────────────────────────────────
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Missing credentials" });

    if (username === "admin") {
      const salt = "rex-portfolio-admin-salt-v1";
      const expectedHash =
        "3350dacc8c88d0821cb1cc848f839a1541edd1314dd4e94b83a7c796c20d07e3fc7fe696baa6045912e77a0f279776891dd5b3e2d4ca42684ddf95da10a2b74b";
      const hash = crypto.scryptSync(password, salt, 64).toString("hex");
      if (hash === expectedHash)
        return res.json({ success: true, message: "Login successful" });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });

  app.post("/api/forgot-password", (req, res) => {
    const { email } = req.body;
    const allowedEmails = [
      "imahinasyon321@gmail.com",
      "rex.punlagao@gmail.com",
    ];
    if (email && allowedEmails.includes(email.toLowerCase())) {
      return res.json({
        success: true,
        message: "Credential recovery successful.",
        credentials: { username: "admin", password: "Bru123sh@@$$" },
      });
    }
    res.status(401).json({ error: "Email not authorized for recovery." });
  });

  // ── Categories ────────────────────────────────────────────────────────────
  app.get("/api/categories", (_req, res) => {
    res.json(readJson("categories.json", []));
  });

  app.post("/api/categories", (req, res) => {
    try {
      writeJson("categories.json", req.body);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save categories" });
    }
  });

  // ── Projects ──────────────────────────────────────────────────────────────
  app.get("/api/projects", (_req, res) => {
    const projects = readJson<any[]>("db.json", []);
    projects.sort((a, b) => a.id - b.id);
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    try {
      const projects = Array.isArray(req.body) ? req.body : [req.body];
      projects.sort((a, b) => a.id - b.id);
      writeJson("db.json", projects);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save projects" });
    }
  });

  // ── Profile ───────────────────────────────────────────────────────────────
  app.get("/api/profile", (_req, res) => {
    res.json(readJson("profile.json", {}));
  });

  app.post("/api/profile", (req, res) => {
    try {
      writeJson("profile.json", req.body);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // ── Services ──────────────────────────────────────────────────────────────
  app.get("/api/services", (_req, res) => {
    res.json(readJson("services.json", []));
  });

  app.post("/api/services", (req, res) => {
    try {
      writeJson("services.json", req.body);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save services" });
    }
  });

  // ── Skills ────────────────────────────────────────────────────────────────
  app.get("/api/skills", (_req, res) => {
    res.json(readJson("skills.json", []));
  });

  app.post("/api/skills", (req, res) => {
    try {
      writeJson("skills.json", req.body);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save skills" });
    }
  });

  // ── Social Links ──────────────────────────────────────────────────────────
  app.get("/api/social-links", (_req, res) => {
    res.json(readJson("social_links.json", []));
  });

  app.post("/api/social-links", (req, res) => {
    try {
      writeJson("social_links.json", req.body);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save social links" });
    }
  });

  // ── Maintenance ───────────────────────────────────────────────────────────
  app.get("/api/maintenance", (_req, res) => {
    res.json(readJson("maintenance.json", { enabled: false }));
  });

  app.post("/api/maintenance", (req, res) => {
    try {
      writeJson("maintenance.json", req.body);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save maintenance state" });
    }
  });

  // ── Image Upload (local) ──────────────────────────────────────────────────
  app.post("/api/upload", async (req, res) => {
    try {
      const { dataUrl, fileName } = req.body;
      if (!dataUrl || !fileName)
        return res.status(400).json({ error: "Missing data" });

      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const uploadDir = path.join(__dirname, "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      res.json({ success: true, url: `/uploads/${safeName}` });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // ── Vite Dev / Static Production ──────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
