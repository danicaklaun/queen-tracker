import { AdminRepository } from "../../Database/repositories/admin/AdminRepository";

export class AdminService {
  private adminRepository = new AdminRepository();

  
  getUsers() {
    return this.adminRepository.getUsers();
  }

  async updateUserRole(adminId: number, userId: number, role: "beekeeper" | "admin") {
    if (!["beekeeper", "admin"].includes(role)) {
      throw new Error("Uloga nije validna.");
    }

    const updated = await this.adminRepository.updateUserRole(userId, role);

    if (!updated) {
      throw new Error("Korisnik nije pronađen.");
    }

    await this.adminRepository.addAuditLog(
  adminId,
  "USER_ROLE_CHANGED",
  "users",
  userId,
  { newRole: role }
);

    return true;
  }

  async deactivateUser(adminId: number, userId: number) {
    if (adminId === userId) {
      throw new Error("Admin ne može deaktivirati sopstveni nalog.");
    }

    const deactivated = await this.adminRepository.deactivateUser(userId);

    if (!deactivated) {
      throw new Error("Korisnik nije pronađen.");
    }

   await this.adminRepository.addAuditLog(
  adminId,
  "USER_DEACTIVATED",
  "users",
  userId
);

    return true;
  }

  getAuditLogs() {
    return this.adminRepository.getAuditLogs();
  }
  async createHiveType(adminId: number, data: { name: string; description?: string }) {
  if (!data.name || data.name.length < 2) {
    throw new Error("Naziv tipa košnice je obavezan.");
  }

  const id = await this.adminRepository.createHiveType(data);

  await this.adminRepository.addAuditLog(
  adminId,
  "HIVE_TYPE_CREATED",
  "hive_types",
  id
);
  return id;
}

async deactivateHiveType(adminId: number, id: number) {
  const deactivated = await this.adminRepository.deactivateHiveType(id);

  if (!deactivated) {
    throw new Error("Tip košnice nije pronađen.");
  }
await this.adminRepository.addAuditLog(
  adminId,
  "HIVE_TYPE_DEACTIVATED",
  "hive_types",
  id
);

  return true;
}

async createQueenBreed(adminId: number, data: { name: string; description?: string }) {
  if (!data.name || data.name.length < 2) {
    throw new Error("Naziv rase matice je obavezan.");
  }

  const id = await this.adminRepository.createQueenBreed(data);

  await this.adminRepository.addAuditLog(
  adminId,
  "QUEEN_BREED_CREATED",
  "queen_breeds",
  id
);

  return id;
}

async deactivateQueenBreed(adminId: number, id: number) {
  const deactivated = await this.adminRepository.deactivateQueenBreed(id);

  if (!deactivated) {
    throw new Error("Rasa matice nije pronađena.");
  }

await this.adminRepository.addAuditLog(
  adminId,
  "QUEEN_BREED_DEACTIVATED",
  "queen_breeds",
  id
);

  return true;
}
}