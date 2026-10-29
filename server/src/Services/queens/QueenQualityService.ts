import { QueenQualityRepository } from "../../Database/repositories/queens/QueenQualityRepository";

export class QueenQualityService {

    private repo = new QueenQualityRepository();

    async create(userId: number, data: any) {

        const assignment = await this.repo.findAssignment(data.assignmentId);

        if (!assignment)
            throw new Error("Dodela ne postoji.");

        if (assignment.user_id !== userId)
            throw new Error("Nemate pristup.");

        const total =
            (
                data.broodPattern +
                data.temperament +
                data.productivity +
                data.health
            ) / 4;

        let recommendation = "replace";

        if (total >= 4)
            recommendation = "keep";
        else if (total >= 3)
            recommendation = "monitor";

        return this.repo.create({
            ...data,
            userId,
            totalScore: total,
            recommendation
        });
    }

    async getMine(userId: number) {
        return this.repo.getByUser(userId);
    }

}