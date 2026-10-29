import { Router, Request, Response } from "express";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";
import { QueenService } from "../../Services/queens/QueenService";
import { validateQueen } from "../validators/QueenValidator";

export class QueenController {
  public router: Router;
  private queenService = new QueenService();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authMiddleware, this.create.bind(this));
    this.router.get("/", authMiddleware, this.getMine.bind(this));
  }

  private async create(req: Request, res: Response) {
    try {
      const validationError = validateQueen(req.body);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      const result = await this.queenService.create({
        userId: req.user!.user_id,
        queenBreedId: req.body.queenBreedId,
        queenCode: req.body.queenCode,
        hatchYear: req.body.hatchYear,
        origin: req.body.origin,
        status: req.body.status,
        note: req.body.note,
      });

      return res.status(201).json({
        success: true,
        message: "Matica je uspešno dodata.",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Greška pri dodavanju matice.",
      });
    }
  }

  private async getMine(req: Request, res: Response) {
    const queens = await this.queenService.getByUser(req.user!.user_id);

    return res.json({
      success: true,
      data: queens,
    });
  }
}