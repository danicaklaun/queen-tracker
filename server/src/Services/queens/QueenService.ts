import { QueenRepository } from "../../Database/repositories/queens/QueenRepository";
import { AdminRepository } from "../../Database/repositories/admin/AdminRepository";

export class QueenService {
  private queenRepository = new QueenRepository();
  private adminRepository = new AdminRepository();

  private getMarkColor(hatchYear: number) {
    const lastDigit = hatchYear % 10;

    if (lastDigit === 1 || lastDigit === 6) return "white";
    if (lastDigit === 2 || lastDigit === 7) return "yellow";
    if (lastDigit === 3 || lastDigit === 8) return "red";
    if (lastDigit === 4 || lastDigit === 9) return "green";
    return "blue";
  }

  async create(data: {
    userId: number;
    queenBreedId: number;
    queenCode: string;
    hatchYear: number;
    origin: "purchased" | "swarmed" | "selected" | "unknown";
    status: "active" | "dead" | "sold";
    note?: string;
  }) {
    try {
      const markColor = this.getMarkColor(data.hatchYear);

      const queenId = await this.queenRepository.create({
        ...data,
        markColor,
      });

     await this.adminRepository.addAuditLog(
  data.userId,
  "QUEEN_CREATED",
  "queens",
  queenId
);

      return {
        id: queenId,
        markColor,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Duplicate entry")
      ) {
        throw new Error("Već postoji matica sa tom oznakom.");
      }

      throw error;
    }
  }

  getByUser(userId: number) {
    return this.queenRepository.getByUser(userId);
  }
}