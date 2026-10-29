import { Router, Request, Response } from "express";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";
import { DashboardService } from "../../Services/dashboard/DashboardService";

export class DashboardController {
  public router: Router;
  private dashboardService = new DashboardService();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", authMiddleware, this.getDashboard.bind(this));
  }

  private async getDashboard(req: Request, res: Response) {
    try {
      const dashboard = await this.dashboardService.getDashboard(req.user!.user_id);

      return res.json({
        success: true,
        data: dashboard,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Greška pri učitavanju dashboard-a.",
      });
    }
  }
}