export function validateRegister(data: {
  username: string;
  fullName: string;
  email: string;
  password: string;
}) {
  if (!data.username || data.username.length < 3 || data.username.length > 50) {
    return "Korisničko ime mora imati između 3 i 50 karaktera.";
  }

  if (!data.fullName || data.fullName.length < 3) {
    return "Ime i prezime je obavezno.";
  }

  if (!data.email || !data.email.includes("@")) {
    return "Email nije validan.";
  }

  if (!data.password || data.password.length < 6) {
    return "Lozinka mora imati najmanje 6 karaktera.";
  }

  return null;
}

export function validateLogin(data: {
  username: string;
  password: string;
}) {
  if (!data.username || data.username.length < 3) {
    return "Korisničko ime je obavezno.";
  }

  if (!data.password || data.password.length < 6) {
    return "Lozinka je obavezna.";
  }

  return null;
}