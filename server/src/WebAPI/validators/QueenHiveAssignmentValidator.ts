export function validateAssignment(data: {
    queenId: number;
    hiveId: number;
    assignedAt: string;
}) {

    if (!data.queenId)
        return "Matica je obavezna.";

    if (!data.hiveId)
        return "Košnica je obavezna.";

    if (!data.assignedAt)
        return "Datum dodele je obavezan.";

    return null;
}