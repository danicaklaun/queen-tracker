import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../connection/DbConnectionPool";
import { User } from "../../../Domain/models/User";

export class UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const res = await db.getReadConnection();
    if (!res) return null;

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT id, username, full_name, email, password_hash, role, is_active
         FROM users
         WHERE username = ?`,
        [username]
      );

      if (rows.length === 0) return null;

      const row = rows[0];

      return new User(
        row.id,
        row.username,
        row.full_name,
        row.email,
        row.password_hash,
        row.role,
        Boolean(row.is_active)
      );
    } finally {
      res.conn.release();
    }
  }

  async create(data: {
    username: string;
    fullName: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const res = await db.getWriteConnection();
    if (!res) {
      throw new Error("Master database unavailable");
    }

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO users (username, full_name, email, password_hash, role)
         VALUES (?, ?, ?, ?, 'beekeeper')`,
        [data.username, data.fullName, data.email, data.passwordHash]
      );

      return new User(
        result.insertId,
        data.username,
        data.fullName,
        data.email,
        data.passwordHash,
        "beekeeper",
        true
      );
    } finally {
      res.conn.release();
    }
  }
}