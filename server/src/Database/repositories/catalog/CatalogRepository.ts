import { RowDataPacket } from "mysql2";
import { db } from "../../connection/DbConnectionPool";

export class CatalogRepository {
  async getHiveTypes() {
    const res = await db.getReadConnection();
    if (!res) return [];

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT id, name, description
         FROM hive_types
         WHERE is_active = TRUE
         ORDER BY name`
      );

      return rows;
    } finally {
      res.conn.release();
    }
  }

  async getQueenBreeds() {
    const res = await db.getReadConnection();
    if (!res) return [];

    try {
      const [rows] = await res.conn.execute<RowDataPacket[]>(
        `SELECT id, name, description
         FROM queen_breeds
         WHERE is_active = TRUE
         ORDER BY name`
      );

      return rows;
    } finally {
      res.conn.release();
    }
  }
}