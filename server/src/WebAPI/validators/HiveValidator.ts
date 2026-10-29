export function validateHive(data: {
  hiveTypeId: number;
  hiveCode: string;
  apiaryName: string;
  location: string;
}) {
  if (!data.hiveTypeId) {
    return "Tip košnice je obavezan.";
  }

  if (!data.hiveCode || !/^[A-Z]-[0-9]{2,}$/.test(data.hiveCode)) {
    return "Oznaka košnice mora biti u formatu A-01.";
  }

  if (!data.apiaryName || data.apiaryName.length < 2) {
    return "Naziv pčelinjaka je obavezan.";
  }

  if (!data.location || data.location.length < 2) {
    return "Lokacija je obavezna.";
  }

  return null;
}