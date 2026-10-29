import { Request, Response, Router } from "express";
import { QueenQualityService } from "../../Services/queens/QueenQualityService";
import { authMiddleware } from "../../Middlewares/AuthMiddleware";

export class QueenQualityController {

    public router = Router();

    private service = new QueenQualityService();

    constructor() {
        this.router.get(
            "/",
            authMiddleware,
            this.getMine
        );

        this.router.post(
            "/",
            authMiddleware,
            this.create
        );
    }

    create = async (req: Request, res: Response) => {

        const id = await this.service.create(
            req.user!.user_id,
            req.body
        );

        res.status(201).json({
            success: true,
            id,
        });
    };

    getMine = async (req: Request, res: Response) => {

        const data = await this.service.getMine(
            req.user!.user_id
        );

        res.json({
            success: true,
            data,
        });
    };
}