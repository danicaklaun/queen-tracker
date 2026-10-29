import { Router, Request, Response } from "express";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";
import { QueenHiveAssignmentService } from "../../Services/queens/QueenHiveAssignmentService";
import { validateAssignment } from "../validators/QueenHiveAssignmentValidator";



export class QueenHiveAssignmentController {
  public router: Router;
  private assignmentService = new QueenHiveAssignmentService();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authMiddleware, this.create.bind(this));
    this.router.get("/", authMiddleware, this.getMine.bind(this));
    this.router.patch(
  "/:id/end",
  authMiddleware,
  this.endAssignment.bind(this)
);
this.router.patch("/:id/end", authMiddleware, this.endAssignment.bind(this));
  }

  private async create(req: Request, res: Response) {
  try {
    const validationError = validateAssignment(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const assignmentId = await this.assignmentService.create({
      userId: req.user!.user_id,
      queenId: req.body.queenId,
      hiveId: req.body.hiveId,
      assignedAt: req.body.assignedAt,
      note: req.body.note,
    });

    return res.status(201).json({
      success: true,
      message: "Matica je uspešno dodeljena košnici.",
      data: { id: assignmentId },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Greška pri dodeli matice.",
    });
  }
}

private async getMine(req: Request, res: Response) {
  const assignments = await this.assignmentService.getByUser(
    req.user!.user_id
  );

  return res.json({
    success: true,
    data: assignments,
  });
}


private async endAssignment(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await this.assignmentService.endAssignment(id);

    return res.json({
      success: true,
      message: "Dodela je završena."
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Greška."
    });
  }
}
}