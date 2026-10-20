import { httpServerHandler } from "cloudflare:node";
import { env } from "cloudflare:workers";
import express, { Request, Response, NextFunction } from "express";

interface Student {
  id?: number;
  name: string;
  class_name: string;
}

interface EnvWithDB {
  DB: D1Database;
  ASSETS?: Fetcher;
}

const app = express();

// Parse JSON request body
app.use(express.json());

// CORS & Request Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// Helper function to safely get D1 database binding
function getDB(): D1Database {
  const db = (env as unknown as EnvWithDB)?.DB;
  if (!db) {
    throw new Error(
      "D1 Database binding 'DB' is not configured or not accessible in current environment."
    );
  }
  return db;
}

// Ensure students table exists helper
async function ensureTableExists(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        class_name TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();
}

// 1. Healthcheck & DB Status
app.get("/api/health", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    await ensureTableExists(db);
    const countResult = await db.prepare("SELECT COUNT(*) as total FROM students").first<{ total: number }>();
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "PaaS Express Worker",
      database: "Cloudflare D1 (paas-students-db)",
      studentCount: countResult?.total ?? 0,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error?.message || "Failed to connect to D1 database",
    });
  }
});

// 2. READ: Get all students (Returns array with ONLY id, name, class_name)
app.get("/api/students", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    await ensureTableExists(db);
    const search = req.query.q as string | undefined;

    let query: string;
    let stmt;

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = `SELECT id, name, class_name FROM students WHERE name LIKE ? OR class_name LIKE ? ORDER BY id ASC`;
      stmt = db.prepare(query).bind(term, term);
    } else {
      query = `SELECT id, name, class_name FROM students ORDER BY id ASC`;
      stmt = db.prepare(query);
    }

    const { results } = await stmt.all<Student>();
    res.json(results);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Error fetching students from D1",
    });
  }
});

// 3. READ: Get student by ID (Returns object with ONLY id, name, class_name)
app.get("/api/students/:id", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const id = parseInt(String(req.params.id), 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid student ID parameter" });
      return;
    }

    const student = await db
      .prepare("SELECT id, name, class_name FROM students WHERE id = ?")
      .bind(id)
      .first<Student>();

    if (!student) {
      res.status(404).json({ error: `Student with ID ${id} not found` });
      return;
    }

    res.json(student);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Error retrieving student",
    });
  }
});

// 4. CREATE: Add a new student (Returns ONLY id, name, class_name)
app.post("/api/students", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    await ensureTableExists(db);
    const { name, class_name } = req.body;

    if (!name || !class_name) {
      res.status(400).json({
        error: "Both 'name' and 'class_name' are required",
      });
      return;
    }

    const result = await db
      .prepare(
        `INSERT INTO students (name, class_name) VALUES (?, ?)`
      )
      .bind(name.trim(), class_name.trim())
      .run();

    const insertedId = result.meta.last_row_id;
    const newStudent = await db
      .prepare("SELECT id, name, class_name FROM students WHERE id = ?")
      .bind(insertedId)
      .first<Student>();

    res.status(201).json(newStudent);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Failed to create student",
    });
  }
});

// 5. UPDATE: Update an existing student (Returns ONLY id, name, class_name)
app.put("/api/students/:id", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const id = parseInt(String(req.params.id), 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid student ID parameter" });
      return;
    }

    const { name, class_name } = req.body;

    const existing = await db
      .prepare("SELECT id, name, class_name FROM students WHERE id = ?")
      .bind(id)
      .first<Student>();

    if (!existing) {
      res.status(404).json({ error: `Student with ID ${id} not found` });
      return;
    }

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedClassName = class_name !== undefined ? class_name.trim() : existing.class_name;

    await db
      .prepare(
        `UPDATE students SET name = ?, class_name = ? WHERE id = ?`
      )
      .bind(updatedName, updatedClassName, id)
      .run();

    const updatedStudent = await db
      .prepare("SELECT id, name, class_name FROM students WHERE id = ?")
      .bind(id)
      .first<Student>();

    res.json(updatedStudent);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Failed to update student",
    });
  }
});

// 6. DELETE: Remove a student (Returns ONLY id, name, class_name)
app.delete("/api/students/:id", async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const id = parseInt(String(req.params.id), 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid student ID parameter" });
      return;
    }

    const existing = await db
      .prepare("SELECT id, name, class_name FROM students WHERE id = ?")
      .bind(id)
      .first<Student>();

    if (!existing) {
      res.status(404).json({ error: `Student with ID ${id} not found` });
      return;
    }

    await db.prepare("DELETE FROM students WHERE id = ?").bind(id).run();

    res.json(existing);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Failed to delete student",
    });
  }
});

// 404 Handler for undefined API routes
app.use("/api/*", (req: Request, res: Response) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Bind server port & export Workers entrypoint
app.listen(3000);

export default httpServerHandler({ port: 3000 });
