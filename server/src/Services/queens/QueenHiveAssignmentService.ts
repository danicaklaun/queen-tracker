import { QueenHiveAssignmentRepository } from "../../Database/repositories/queens/QueenHiveAssignmentRepository";

export class QueenHiveAssignmentService {

  private repository = new QueenHiveAssignmentRepository();

  async create(data: {
    userId: number;
    queenId: number;
    hiveId: number;
    assignedAt: string;
    note?: string;
  }) {
        const queen = await this.repository.findQueen(data.queenId);

if (!queen) {
  throw new Error("Matica nije pronađena.");
}
        const hive = await this.repository.findHive(data.hiveId);

if (!hive) {
  throw new Error("Košnica nije pronađena.");
}
console.log({
  loggedUser: data.userId,
  queenUser: queen.user_id,
  hiveUser: hive.user_id,
});

if (queen.user_id !== data.userId || hive.user_id !== data.userId) {
  throw new Error("Nemate pristup ovoj košnici ili matici.");
}
if (hive.is_archived) {
  throw new Error("Košnica je arhivirana.");
}
const queenAssigned =
  await this.repository.hasActiveAssignmentForQueen(data.queenId);

if (queenAssigned) {
  throw new Error("Matica je već dodeljena drugoj košnici.");
}
const hiveAssigned =
  await this.repository.hasActiveAssignmentForHive(data.hiveId);

if (hiveAssigned) {
  throw new Error("Košnica već ima aktivnu maticu.");
}
const assignmentId = await this.repository.create(data);

return assignmentId;
  }

async getByUser(userId: number) {
    return this.repository.getByUser(userId);
}
async endAssignment(id: number) {
    const success = await this.repository.endAssignment(id);

    if (!success) {
        throw new Error("Dodela nije pronađena.");
    }
}

}