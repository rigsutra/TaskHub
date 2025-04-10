import {Pool} from 'pg';
import {v4 as uuidv4} from 'uuid';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export async function createUserTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const client = await pool.connect();
  try {
    const id = uuidv4();
    const query = `
      INSERT INTO users(id, username, email, password)
      VALUES($1, $2, $3, $4)
      RETURNING id, username, email;
    `;
    const values = [id, user.username, user.email, user.password];
    const result = await client.query(query, values);
    return result.rows[0] as User;
  } finally {
    client.release();
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, username, email, password
      FROM users
      WHERE email = $1;
    `;
    const result = await client.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } finally {
    client.release();
  }
}

createUserTable().catch(err => console.error('Error creating user table:', err));