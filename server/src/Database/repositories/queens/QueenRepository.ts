import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../connection/DbConnectionPool";

export class QueenRepository {
  async create(data: {
    userId: number;
    queenBreedId: number;
    queenCode: string;
    hatchYear: number;
    markColor: string;
    origin: string;
    status: string;
    note?: string;
  }) {
    const res = await db.getWriteConnection();
    if (!res) throw new Error("Master database unavailable");

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO queens
         (user_id, queen_breed_id, queen_code, hatch_year, mark_color, origin, status, note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.userId,
          data.queenBreedId,
          data.queenCode,
          data.hatchYear,
          data.markColor,
          data.origin,
          data.status,
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
           q.id,
           q.queen_code AS queenCode,
           qb.name AS queenBreed,
           q.hatch_year AS hatchYear,
           q.mark_color AS markColor,
           q.origin,
           q.status,
           q.note
         FROM queens q
         JOIN queen_breeds qb ON qb.id = q.queen_breed_id
         WHERE q.user_id = ?
         ORDER BY q.created_at DESC`,
        [userId]
      );

      return rows;
    } finally {
      res.conn.release();
    }
  }
}