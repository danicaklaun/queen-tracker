import { Router, Request, Response } from "express";
import { AuthService } from "../../Services/auth/AuthService";
import { validateLogin, validateRegister } from "../validators/authValidator";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";

export class AuthController {
  public router: Router;
  private authService = new AuthService();

constructor() {
  console.log("AUTH CONTROLLER CREATED");
  this.router = Router();
  this.initializeRoutes();
}

private initializeRoutes() {
  console.log("INITIALIZING AUTH ROUTES");

  this.router.post("/register", this.register.bind(this));    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.login.bind(this));
    this.router.post("/logout", authMiddleware, this.logout.bind(this));
  }

  private async register(req: Request, res: Response) {
    try {
      const validationError = validateRegister(req.body);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      const token = await this.authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "Registracija uspešna.",
        token,
      });
    } catch (error) {
  console.error(error);

  return res.status(400).json({
    success: false,
    message: error instanceof Error ? error.message : "Greška pri registraciji.",
  });
}
  }

  private async login(req: Request, res: Response) {
    try {
      const validationError = validateLogin(req.body);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      const token = await this.authService.login(req.body);

      return res.json({
        success: true,
        message: "Prijava uspešna.",
        token,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Greška pri prijavi.",
      });
    }
  }
  private async logout(req: Request, res: Response) {
  try {
    await this.authService.logout(req.user!.user_id);

    return res.json({
      success: true,
      message: "Odjava uspešna.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Greška pri odjavi.",
    });
  }
}
}