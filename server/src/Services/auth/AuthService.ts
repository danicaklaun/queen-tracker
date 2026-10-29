import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../Database/repositories/users/UserRepository";
import { AdminRepository } from "../../Database/repositories/admin/AdminRepository";

export class AuthService {
  private userRepository = new UserRepository();
  private adminRepository = new AdminRepository();

  async register(data: {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }) {
    const existingUser = await this.userRepository.findByUsername(data.username);

    if (existingUser) {
      throw new Error("Korisničko ime je već zauzeto.");
    }

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.userRepository.create({
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      passwordHash,
    });

   await this.adminRepository.addAuditLog(
  user.id,
  "USER_REGISTERED",
  "users",
  user.id
);

    return this.generateToken(user);
  }

  async login(data: { username: string; password: string }) {
    const user = await this.userRepository.findByUsername(data.username);

    if (!user || !user.isActive) {
      throw new Error("Pogrešno korisničko ime ili lozinka.");
    }

    const passwordOk = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordOk) {
      throw new Error("Pogrešno korisničko ime ili lozinka.");
    }

  await this.adminRepository.addAuditLog(
  user.id,
  "USER_LOGIN",
  "users",
  user.id
);

    return this.generateToken(user);
  }

  private generateToken(user: {
    id: number;
    username: string;
    role: "beekeeper" | "admin";
  }) {
    return jwt.sign(
      {
        user_id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback_secret",
      {
        expiresIn: "6h",
      }
    );
  }


  async logout(userId: number) {
await this.adminRepository.addAuditLog(
  userId,
  "USER_LOGOUT",
  "users",
  userId
);
return true;
  
}
}