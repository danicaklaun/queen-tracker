import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api_services/authApi";
import "./RegisterPage.css";

export function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const response = await register(form);

      if (!response.success) {
        throw new Error(response.message);
      }

      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri registraciji.");
    }
  }

  return (
    <main className="auth-page">

      <form className="auth-card" onSubmit={handleSubmit}>

        <h1>Registracija</h1>

        {error && <p className="error-message">{error}</p>}

        <label>
          Korisničko ime
          <input
            value={form.username}
            onChange={(event) =>
              setForm({ ...form, username: event.target.value })
            }
            minLength={3}
            required
          />
        </label>

        <label>
          Ime i prezime
          <input
            value={form.fullName}
            onChange={(event) =>
              setForm({ ...form, fullName: event.target.value })
            }
            minLength={3}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            required
          />
        </label>

        <label>
          Lozinka
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            minLength={6}
            required
          />
        </label>

        <button type="submit">Registruj se</button>

        <p>
          Već imaš nalog? <Link to="/login">Prijavi se</Link>
        </p>
      </form>
      
    </main>
  );
}