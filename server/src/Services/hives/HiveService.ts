import { HiveRepository } from "../../Database/repositories/hives/HiveRepository";
import { AdminRepository } from "../../Database/repositories/admin/AdminRepository";
export class HiveService {
  private hiveRepository = new HiveRepository();
  private adminRepository = new AdminRepository();

  async create(data: {
    userId: number;
    hiveTypeId: number;
    hiveCode: string;
    apiaryName: string;
    location: string;
    note?: string;
  }) {
    try {
      const hiveId = await this.hiveRepository.create(data);

     await this.adminRepository.addAuditLog(
  data.userId,
  "HIVE_CREATED",
  "hives",
  hiveId
);

      return hiveId;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Duplicate entry")
      ) {
        throw new Error("Već postoji košnica sa tom oznakom.");
      }

      throw error;
    }
  }

  getByUser(userId: number) {
    return this.hiveRepository.getByUser(userId);
  }

  async archive(id: number, userId: number) {
    const archived = await this.hiveRepository.archive(id, userId);

    if (!archived) {
      throw new Error("Košnica nije pronađena.");
    }

   await this.adminRepository.addAuditLog(
  userId,
  "HIVE_ARCHIVED",
  "hives",
  id
);

    return true;
  }
}