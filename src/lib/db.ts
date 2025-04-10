import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://postgres:password@localhost:5432/postgres",
});

// Database connection logic
export const db = {
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  },
};

export async function createUserTable() {
  await db.query(
    `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`
  );
}

export async function createTaskTable() {
  await db.query(
    `CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        metaTags TEXT[],
        maxParticipants INTEGER NOT NULL,
        creator_id UUID NOT NULL,
        participants UUID[],
        FOREIGN KEY (creator_id) REFERENCES users(id)
    )`
  );
}

export async function createUser(id: string, username: string, email: string, hashedPassword) {
  try {
    const result = await db.query(
      "INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, username, email, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function findUserByEmail(email) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createTask(id: string, title: string, description: string, metaTags: string[], maxParticipants: number, creatorId: string) {
  try {
    const result = await db.query(
      "INSERT INTO tasks (id, title, description, metaTags, maxParticipants, creator_id, participants) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [id, title, description, metaTags, maxParticipants, creatorId, []]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAllTasks() {
    try {
      const result = await db.query("SELECT * FROM tasks");
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
}

export async function getTaskById(id: string) {
  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function joinTask(taskId: string, userId: string) {
  try {
    const task = await getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.participants.length >= task.maxParticipants) {
      throw new Error("Task is full");
    }
    if (task.participants.includes(userId)) {
      throw new Error("User already joined");
    }
    const result = await db.query(
      "UPDATE tasks SET participants = array_append(participants, $1) WHERE id = $2 RETURNING *",
      [userId, taskId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message);
  }
}
