import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <main className="auth-page">
      <div className="card">
        <h1>Zabranjen pristup</h1>
        <p>Nemaš dozvolu za ovu stranicu.</p>
        <Link to="/dashboard">Nazad na dashboard</Link>
      </div>
    </main>
  );
}