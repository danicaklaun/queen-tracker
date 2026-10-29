import { Router, Request, Response } from "express";
import { CatalogService } from "../../Services/catalog/CatalogService";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";

export class CatalogController {
  public router: Router;
  private catalogService = new CatalogService();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/hive-types", authMiddleware, this.getHiveTypes.bind(this));
    this.router.get("/queen-breeds", authMiddleware, this.getQueenBreeds.bind(this));
  }

  private async getHiveTypes(_req: Request, res: Response) {
    const hiveTypes = await this.catalogService.getHiveTypes();

    return res.json({
      success: true,
      data: hiveTypes,
    });
  }

  private async getQueenBreeds(_req: Request, res: Response) {
    const queenBreeds = await this.catalogService.getQueenBreeds();

    return res.json({
      success: true,
      data: queenBreeds,
    });
  }
}