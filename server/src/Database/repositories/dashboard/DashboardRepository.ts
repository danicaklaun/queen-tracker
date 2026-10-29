import { RowDataPacket } from "mysql2";
import { db } from "../../connection/DbConnectionPool";
export class DashboardRepository {
async getStats(userId: number) {
  const res = await db.getReadConnection();
  if (!res) return null;

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT
        (SELECT COUNT(*) FROM hives WHERE user_id = ? AND is_archived = FALSE) AS hiveCount,
        (SELECT COUNT(*) FROM queens WHERE user_id = ?) AS queenCount,
        (
          SELECT COUNT(*)
          FROM hives h
          LEFT JOIN queen_hive_assignments a
            ON a.hive_id = h.id
            AND a.status = 'active'
            AND a.ended_at IS NULL
          WHERE h.user_id = ?
            AND h.is_archived = FALSE
            AND a.id IS NULL
        ) AS hivesWithoutQueen`,
      [userId, userId, userId]
    );

    return rows[0];
  } finally {
    res.conn.release();
  }
}

  async getOldQueens(userId: number) {
    const res = await db.getReadConnection();
if (!res) return [];
try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT id, queen_code AS queenCode, hatch_year AS hatchYear
       FROM queens
       WHERE user_id = ?
         AND status = 'active'
         AND (YEAR(CURDATE()) - hatch_year) > 2
       ORDER BY hatch_year ASC`,
      [userId]
    );
return rows;
} finally {
    res.conn.release();
}}

  async getLowRatedQueens(userId: number) {
const res = await db.getReadConnection();
if (!res) return [];

try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(      `SELECT
         q.id,
         q.queen_code AS queenCode,
         ROUND(AVG(qc.total_score), 2) AS averageScore
       FROM queens q
       JOIN queen_hive_assignments a ON a.queen_id = q.id
       JOIN queen_quality_checks qc ON qc.assignment_id = a.id
       WHERE q.user_id = ?
       GROUP BY q.id, q.queen_code
       HAVING AVG(qc.total_score) < 3
       ORDER BY averageScore ASC`,
      [userId]
    );
return rows;
} finally {
    res.conn.release();}}

  async getLatestChecks(userId: number) {
const res = await db.getReadConnection();
if (!res) return [];

try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(      `SELECT
         qc.id,
         qc.checked_at AS checkedAt,
         qc.total_score AS totalScore,
         qc.recommendation,
         q.queen_code AS queenCode,
         h.hive_code AS hiveCode
       FROM queen_quality_checks qc
       JOIN queen_hive_assignments a ON a.id = qc.assignment_id
       JOIN queens q ON q.id = a.queen_id
       JOIN hives h ON h.id = a.hive_id
       WHERE qc.user_id = ?
       ORDER BY qc.checked_at DESC, qc.id DESC
       LIMIT 5`,
      [userId]
    );

   return rows;
} finally {
    res.conn.release();}}


  async getTopQueens(userId: number) {
  const res = await db.getReadConnection();
  if (!res) return [];

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT
         q.id,
         q.queen_code AS queenCode,
         ROUND(AVG(qc.total_score), 2) AS averageScore
       FROM queens q
       JOIN queen_hive_assignments a ON a.queen_id = q.id
       JOIN queen_quality_checks qc ON qc.assignment_id = a.id
       WHERE q.user_id = ?
       GROUP BY q.id, q.queen_code
       ORDER BY averageScore DESC
       LIMIT 5`,
      [userId]
    );

    return rows;
  } finally {
    res.conn.release();
  }
}
}