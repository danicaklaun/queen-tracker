import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import "./LoginPage.css";
import loginBg from "../assets/slika1.jpeg";

export function LoginPage() {
const { login } = useAuth();  
const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const loggedUser = await login(username, password);

if (loggedUser.role === "admin") {
  navigate("/admin");
} else {
  navigate("/dashboard");
}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri prijavi.");
    }
  }

 return (
<main
  className="auth-page"
  style={{
    backgroundImage: `
      linear-gradient(
        rgba(255,255,255,0.35),
        rgba(248,245,238,0.45)
      ),
      url(${loginBg})
    `,
  }}
>    <div className="login-card">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Prijava</h1>

        {error && <p className="error-message">{error}</p>}

        <label>
          Korisničko ime
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            required
          />
        </label>

        <label>
          Lozinka
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </label>

        <button type="submit">Prijavi se</button>

        <p>
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </form>
    </div>
  </main>
);
}