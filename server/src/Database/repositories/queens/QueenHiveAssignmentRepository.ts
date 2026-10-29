import { RowDataPacket, ResultSetHeader } from "mysql2";
import { db } from "../../connection/DbConnectionPool";
import { QueenHiveAssignment } from "../../../Domain/models/QueenHiveAssignment";

export class QueenHiveAssignmentRepository {
async findQueen(id: number) {
  const res = await db.getReadConnection();
  if (!res) return null;

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT id, user_id
       FROM queens
       WHERE id = ?`,
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  } finally {
    res.conn.release();
  }
}
async findHive(id: number) {
  const res = await db.getReadConnection();
  if (!res) return null;

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT id, user_id, is_archived
       FROM hives
       WHERE id = ?`,
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  } finally {
    res.conn.release();
  }
}

async hasActiveAssignmentForQueen(queenId: number) {
  const res = await db.getReadConnection();
  if (!res) return false;

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT id
       FROM queen_hive_assignments
       WHERE queen_id = ?
         AND status = 'active'
       LIMIT 1`,
      [queenId]
    );

    return rows.length > 0;
  } finally {
    res.conn.release();
  }
}

async hasActiveAssignmentForHive(hiveId: number) {
  const res = await db.getReadConnection();
  if (!res) return false;

  try {
    const [rows] = await res.conn.execute<RowDataPacket[]>(
      `SELECT id
       FROM queen_hive_assignments
       WHERE hive_id = ?
         AND status = 'active'
       LIMIT 1`,
      [hiveId]
    );

    return rows.length > 0;
  } finally {
    res.conn.release();
  }
}

async create(data: {
  queenId: number;
  hiveId: number;
  assignedAt: string;
}) {
  const res = await db.getWriteConnection();
  if (!res) throw new Error("Master database unavailable");

  try {
    const [result] = await res.conn.execute<ResultSetHeader>(
      `INSERT INTO queen_hive_assignments
       (queen_id, hive_id, started_at, status)
       VALUES (?, ?, ?, 'active')`,
      [
        data.queenId,
        data.hiveId,
        data.assignedAt,
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
      a.id,
      q.queen_code AS queenCode,
      h.hive_code AS hiveCode,
      a.started_at AS assignedAt,
      a.ended_at AS endedAt,
      a.status AS assignmentStatus
   FROM queen_hive_assignments a
   JOIN queens q ON q.id = a.queen_id
   JOIN hives h ON h.id = a.hive_id
   WHERE q.user_id = ?
   ORDER BY a.started_at DESC`,
  [userId]
);

    return rows;
  } finally {
    res.conn.release();
  }
}

async endAssignment(id: number) {
    const res = await db.getWriteConnection();
    if (!res) return false;

    try {
        const [result] = await res.conn.execute<ResultSetHeader>(
            `UPDATE queen_hive_assignments
             SET status='ended',
                 ended_at=NOW()
             WHERE id=? AND status='active'`,
            [id]
        );

        return result.affectedRows > 0;
    } finally {
        res.conn.release();
    }
}
}