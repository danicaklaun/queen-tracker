import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../connection/DbConnectionPool";

export class QueenQualityRepository {

async findAssignment(id: number) {
  const res = await db.getReadConnection();
  if (!res) return null;

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `
      SELECT
        a.id,
        q.user_id
      FROM queen_hive_assignments a
      JOIN queens q ON q.id = a.queen_id
      WHERE a.id = ?
      `,
      [id]
    );

    return rows.length ? rows[0] : null;

  } finally {
    res.conn.release();
  }
}

  async create(data: {
    assignmentId: number;
    userId: number;
    broodPattern: number;
    temperament: number;
    productivity: number;
    health: number;
    totalScore: number;
    recommendation: string;
  }) {

    const res = await db.getWriteConnection();
    if (!res) throw new Error("Master database unavailable");

    try {
      const [result] = await res.conn.execute<ResultSetHeader>(
        `INSERT INTO queen_quality_checks
        (
          assignment_id,
          user_id,
          brood_pattern,
          temperament,
          productivity,
          health,
          total_score,
          recommendation
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.assignmentId,
          data.userId,
          data.broodPattern,
          data.temperament,
          data.productivity,
          data.health,
          data.totalScore,
          data.recommendation,
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

      const [rows] = await res.conn.execute<RowDataPacket[]>(`
      SELECT
        qc.id,
        q.queen_code AS queenCode,
        h.hive_code AS hiveCode,
        qc.brood_pattern,
        qc.temperament,
        qc.productivity,
        qc.health,
        qc.total_score,
        qc.recommendation,
        qc.checked_at
      FROM queen_quality_checks qc
      JOIN queen_hive_assignments a
        ON qc.assignment_id=a.id
      JOIN queens q
        ON q.id=a.queen_id
      JOIN hives h
        ON h.id=a.hive_id
      WHERE qc.user_id=?
      ORDER BY qc.checked_at DESC
      `,[userId]);

      return rows;

    } finally {
      res.conn.release();
    }

  }

}