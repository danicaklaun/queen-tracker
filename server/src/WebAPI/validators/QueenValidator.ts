export function validateQueen(data: {
  queenBreedId: number;
  queenCode: string;
  hatchYear: number;
  origin: string;
  status: string;
}) {
  if (!data.queenBreedId) {
    return "Rasa matice je obavezna.";
  }

  if (!data.queenCode || !/^Q-[0-9]{4}-[0-9]{3,}$/.test(data.queenCode)) {
    return "Oznaka matice mora biti u formatu Q-2026-001.";
  }

  if (!data.hatchYear || data.hatchYear < 2000 || data.hatchYear > 2155) {
    return "Godina izleganja nije validna.";
  }

  if (!["purchased", "swarmed", "selected", "unknown"].includes(data.origin)) {
    return "Poreklo matice nije validno.";
  }

  if (!["active", "dead", "sold"].includes(data.status)) {
    return "Status matice nije validan.";
  }

  return null;
}