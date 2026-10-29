import { useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/authContext";
import { createQueenBreed } from "../api_services/adminApi";

export function QueenBreedsPage() {
  const { token } = useAuth();

  const [breed, setBreed] = useState({
    name: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return;

    await createQueenBreed(token, breed);

    setBreed({
      name: "",
      description: "",
    });
  }

  return (
    <Layout>
      <div className="card">
        <h1>Rase matica</h1>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Naziv"
            value={breed.name}
            onChange={(e) =>
              setBreed({
                ...breed,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Opis"
            value={breed.description}
            onChange={(e) =>
              setBreed({
                ...breed,
                description: e.target.value,
              })
            }
          />

          <button>Dodaj</button>
        </form>
      </div>
    </Layout>
  );
}