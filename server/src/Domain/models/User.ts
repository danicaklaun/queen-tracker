export class User {
  constructor(
    public id: number,
    public username: string,
    public fullName: string,
    public email: string,
    public passwordHash: string,
    public role: "beekeeper" | "admin",
    public isActive: boolean
  ) {}
}