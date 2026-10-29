import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../connection/DbConnectionPool";

export class HiveRepository {
  async create(data: {
    userId: number;
    hiveTypeId: number;
    hiveCode: string;
    apiaryName: string;
    location: string;
    note?: string;
  }) {
    const res = await db.getWriteConnection();
    if (!res) throw new Error("Master database unavailable");

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO hives
         (user_id, hive_type_id, hive_code, apiary_name, location, note)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.userId,
          data.hiveTypeId,
          data.hiveCode,
          data.apiaryName,
          data.location,
          data.note || null,
        ]
      );

      return result.insertId;
    } finally {
      res.conn.release();
    }
  }

  async getByUser(userId: number) {
    const res = await db.getReadConnection();
    if (!res) return [];

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT
           h.id,
           h.hive_code AS hiveCode,
           h.apiary_name AS apiaryName,
           h.location,
           h.note,
           h.is_archived AS isArchived,
           ht.name AS hiveType
         FROM hives h
         JOIN hive_types ht ON ht.id = h.hive_type_id
         WHERE h.user_id = ?
         ORDER BY h.created_at DESC`,
        [userId]
      );

      return rows;
    } finally {
      res.conn.release();
    }
  }

  async archive(id: number, userId: number) {
    const res = await db.getWriteConnection();
    if (!res) return false;

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `UPDATE hives
         SET is_archived = TRUE
         WHERE id = ? AND user_id = ?`,
        [id, userId]
      );

      return result.affectedRows > 0;
    } finally {
      res.conn.release();
    }
  }
}