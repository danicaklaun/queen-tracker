import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../connection/DbConnectionPool";

export class AdminRepository {
  async getUsers() {
const res = await db.getReadConnection();
if (!res) return [];

try {
  const [rows] = await res.conn.execute<RowDataPacket[]>(      `SELECT
         id,
         username,
         full_name AS fullName,
         email,
         role,
         is_active AS isActive,
         created_at AS createdAt
       FROM users
       ORDER BY created_at DESC`
    );
return rows;
} finally {
  res.conn.release();
}}


  async updateUserRole(userId: number, role: "beekeeper" | "admin") {
const res = await db.getWriteConnection();
if (!res) return false;

try {
  const [result] = await res.conn.execute<ResultSetHeader>(      `UPDATE users
       SET role = ?
       WHERE id = ?`,
      [role, userId]
    );

 return result.affectedRows > 0;
} finally {
  res.conn.release();
}  }


  async deactivateUser(userId: number) {
const res = await db.getWriteConnection();
if (!res) return false;

try {
  const [result] = await res.conn.execute<ResultSetHeader>(      `UPDATE users
       SET is_active = FALSE
       WHERE id = ?`,
      [userId]
    );

 return result.affectedRows > 0;
} finally {
  res.conn.release();
}  }

  async getAuditLogs() {
const res = await db.getReadConnection();
if (!res) return [];

try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(      `SELECT
         al.id,
         al.action,
         al.entity_name AS entityName,
         al.entity_id AS entityId,
         al.ip_address AS ipAddress,
         al.details,
         al.created_at AS createdAt,
         u.username
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.user_id
       ORDER BY al.created_at DESC
       LIMIT 100`
    );

return rows;
} finally {
    res.conn.release();
}  }


  async createHiveType(data: { name: string; description?: string }) {
const res = await db.getWriteConnection();
if (!res) throw new Error("Master database unavailable");

try {
    const [result] = await res.conn.execute<ResultSetHeader>(    `INSERT INTO hive_types (name, description)
     VALUES (?, ?)`,
    [data.name, data.description || null]
  );

return result.insertId;
} finally {
    res.conn.release();
}}


async deactivateHiveType(id: number) {
const res = await db.getWriteConnection();
if (!res) return false;

try {
    const [result] = await res.conn.execute<ResultSetHeader>(    `UPDATE hive_types
     SET is_active = FALSE
     WHERE id = ?`,
    [id]
  );

return result.affectedRows > 0;
} finally {
    res.conn.release();
}}


async createQueenBreed(data: { name: string; description?: string }) {
const res = await db.getWriteConnection();
if (!res) throw new Error("Master database unavailable");

try {
    const [result] = await res.conn.execute<ResultSetHeader>(    `INSERT INTO queen_breeds (name, description)
     VALUES (?, ?)`,
    [data.name, data.description || null]
  );

return result.insertId;
} finally {
    res.conn.release();
}}

async deactivateQueenBreed(id: number) {
const res = await db.getWriteConnection();
if (!res) return false;

try {
    const [result] = await res.conn.execute<ResultSetHeader>(    `UPDATE queen_breeds
     SET is_active = FALSE
     WHERE id = ?`,
    [id]
  );

return result.affectedRows > 0;
} finally {
    res.conn.release();
}}

async addAuditLog(
  userId: number,
  action: string,
  entityName: string,
  entityId: number,
  details?: unknown
) {
  const res = await db.getWriteConnection();
  if (!res) throw new Error("Master database unavailable");

  try {
    await res.conn.execute(
      `INSERT INTO audit_logs
       (user_id, action, entity_name, entity_id, details)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        action,
        entityName,
        entityId,
        details ? JSON.stringify(details) : null,
      ]
    );
  } finally {
    res.conn.release();
  }
}
}