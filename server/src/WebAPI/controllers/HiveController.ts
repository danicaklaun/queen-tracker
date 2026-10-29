import { Router, Request, Response } from "express";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";
import { HiveService } from "../../Services/hives/HiveService";
import { validateHive } from "../validators/HiveValidator";

export class HiveController {
  public router: Router;
  private hiveService = new HiveService();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authMiddleware, this.create.bind(this));
    this.router.get("/", authMiddleware, this.getMine.bind(this));
    this.router.patch("/:id/archive", authMiddleware, this.archive.bind(this));
  }

  private async create(req: Request, res: Response) {
    try {
      const validationError = validateHive(req.body);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      const hiveId = await this.hiveService.create({
        userId: req.user!.user_id,
        hiveTypeId: req.body.hiveTypeId,
        hiveCode: req.body.hiveCode,
        apiaryName: req.body.apiaryName,
        location: req.body.location,
        note: req.body.note,
      });

      return res.status(201).json({
        success: true,
        message: "Košnica je uspešno dodata.",
        data: { id: hiveId },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Greška pri dodavanju košnice.",
      });
    }
  }

  private async getMine(req: Request, res: Response) {
    const hives = await this.hiveService.getByUser(req.user!.user_id);

    return res.json({
      success: true,
      data: hives,
    });
  }

  private async archive(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await this.hiveService.archive(id, req.user!.user_id);

      return res.json({
        success: true,
        message: "Košnica je arhivirana.",
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : "Greška pri arhiviranju košnice.",
      });
    }
  }
}