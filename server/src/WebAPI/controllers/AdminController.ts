import { Router, Request, Response } from "express";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";
import { authorizeMiddleware } from "../../Middlewares/AuthorizeMiddleware";
import { AdminService } from "../../Services/admin/AdminService";

export class AdminController {
  public router: Router;
  private adminService = new AdminService();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/users",
      authMiddleware,
      authorizeMiddleware("admin"),
      this.getUsers.bind(this)
    );

    this.router.patch(
      "/users/:id/role",
      authMiddleware,
      authorizeMiddleware("admin"),
      this.updateUserRole.bind(this)
    );

    this.router.patch(
      "/users/:id/deactivate",
      authMiddleware,
      authorizeMiddleware("admin"),
      this.deactivateUser.bind(this)
    );

    this.router.get(
      "/audit-logs",
      authMiddleware,
      authorizeMiddleware("admin"),
      this.getAuditLogs.bind(this)
    );
    this.router.post(
  "/hive-types",
  authMiddleware,
  authorizeMiddleware("admin"),
  this.createHiveType.bind(this)
);

this.router.patch(
  "/hive-types/:id/deactivate",
  authMiddleware,
  authorizeMiddleware("admin"),
  this.deactivateHiveType.bind(this)
);

this.router.post(
  "/queen-breeds",
  authMiddleware,
  authorizeMiddleware("admin"),
  this.createQueenBreed.bind(this)
);

this.router.patch(
  "/queen-breeds/:id/deactivate",
  authMiddleware,
  authorizeMiddleware("admin"),
  this.deactivateQueenBreed.bind(this)
);
  }

  private async getUsers(_req: Request, res: Response) {
    const users = await this.adminService.getUsers();

    return res.json({
      success: true,
      data: users,
    });
  }

  private async updateUserRole(req: Request, res: Response) {
    try {
      await this.adminService.updateUserRole(
        req.user!.user_id,
        Number(req.params.id),
        req.body.role
      );

      return res.json({
        success: true,
        message: "Uloga korisnika je promenjena.",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Greška pri promeni uloge.",
      });
    }
  }

  private async deactivateUser(req: Request, res: Response) {
    try {
      await this.adminService.deactivateUser(
        req.user!.user_id,
        Number(req.params.id)
      );

      return res.json({
        success: true,
        message: "Korisnik je deaktiviran.",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Greška pri deaktiviranju korisnika.",
      });
    }
  }

  private async getAuditLogs(_req: Request, res: Response) {
    const logs = await this.adminService.getAuditLogs();

    return res.json({
      success: true,
      data: logs,
    });
  }
  private async createHiveType(req: Request, res: Response) {
  try {
    const id = await this.adminService.createHiveType(req.user!.user_id, req.body);

    return res.status(201).json({
      success: true,
      message: "Tip košnice je dodat.",
      data: { id },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Greška pri dodavanju tipa košnice.",
    });
  }
}

private async deactivateHiveType(req: Request, res: Response) {
  try {
    await this.adminService.deactivateHiveType(
      req.user!.user_id,
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: "Tip košnice je deaktiviran.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Greška pri deaktiviranju tipa košnice.",
    });
  }
}

private async createQueenBreed(req: Request, res: Response) {
  try {
    const id = await this.adminService.createQueenBreed(req.user!.user_id, req.body);

    return res.status(201).json({
      success: true,
      message: "Rasa matice je dodata.",
      data: { id },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Greška pri dodavanju rase matice.",
    });
  }
}

private async deactivateQueenBreed(req: Request, res: Response) {
  try {
    await this.adminService.deactivateQueenBreed(
      req.user!.user_id,
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: "Rasa matice je deaktivirana.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Greška pri deaktiviranju rase matice.",
    });
  }
}
}