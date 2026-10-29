export class QueenHiveAssignment {
  constructor(
    public id: number,
    public queenId: number,
    public hiveId: number,
    public assignedAt: Date,
    public endedAt: Date | null,
    public assignmentStatus: string,
    public note: string | null
  ) {}
}