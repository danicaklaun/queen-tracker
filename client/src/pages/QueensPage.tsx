import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/authContext";
import { createQueen, getQueens } from "../api_services/queensApi";
import { getQueenBreeds } from "../api_services/catalogApi";

type Queen = {
  id: number;
  queenCode: string;
  queenBreed: string;
  hatchYear: number;
  markColor: string;
  origin: string;
  status: string;
  note: string | null;
};

export function QueensPage() {
  const { token } = useAuth();

  const [queens, setQueens] = useState<Queen[]>([]);
  const [breeds, setBreeds] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    queenBreedId: 1,
    queenCode: "",
    hatchYear: new Date().getFullYear(),
    markColor: "",
    origin: "purchased",
    status: "active",
    note: "",
  });

  useEffect(() => {
    async function load() {
      if (!token) return;

      try {
        const queenResponse = await getQueens(token);
        setQueens(queenResponse.data);

        const breedResponse = await getQueenBreeds(token);
        setBreeds(breedResponse.data);
      } catch {
        setError("Greška pri učitavanju matica.");
      }
    }

    load();
  }, [token]);

  async function handleCreateQueen(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return;

    try {
      await createQueen(token, form);

      const response = await getQueens(token);
      setQueens(response.data);

      
    } catch {
      setError("Greška pri dodavanju matice.");
    }
  }

  return (
    <Layout>
      <h1>Matice</h1>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleCreateQueen} className="card">

        <h2>Nova matica</h2>

        <input
          placeholder="Šifra matice"
          value={form.queenCode}
          onChange={(e) =>
            setForm({ ...form, queenCode: e.target.value })
          }
        />

        <select
          value={form.queenBreedId}
          onChange={(e) =>
            setForm({
              ...form,
              queenBreedId: Number(e.target.value),
            })
          }
        >
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Godina izleganja"
          value={form.hatchYear}
          onChange={(e) =>
            setForm({
              ...form,
              hatchYear: Number(e.target.value),
            })
          }
        />

        <input
          placeholder="Boja oznake"
          value={form.markColor}
          onChange={(e) =>
            setForm({
              ...form,
              markColor: e.target.value,
            })
          }
        />

        <select
  value={form.origin}
  onChange={(e) =>
    setForm({
      ...form,
      origin: e.target.value,
    })
  }
>
  <option value="purchased">Kupljena</option>
  <option value="swarmed">Roj</option>
  <option value="selected">Selekcija</option>
  <option value="unknown">Nepoznato</option>
</select>

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
        >
          <option value="active">Aktivna</option>
          <option value="inactive">Neaktivna</option>
        </select>

        <textarea
          placeholder="Napomena"
          value={form.note}
          onChange={(e) =>
            setForm({
              ...form,
              note: e.target.value,
            })
          }
        />

        <button type="submit">
          Dodaj maticu
        </button>
      </form>

      <div className="card">

        <h2>Lista matica</h2>

        <div className="table-wrap">
          <table>

            <thead>
              <tr>
                <th>Šifra</th>
                <th>Rasa</th>
                <th>Godina</th>
                <th>Boja</th>
                <th>Poreklo</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {queens.map((queen) => (
                <tr key={queen.id}>
                  <td>{queen.queenCode}</td>
                  <td>{queen.queenBreed}</td>
                  <td>{queen.hatchYear}</td>
                  <td>{queen.markColor}</td>
                  <td>{queen.origin}</td>
                  <td>{queen.status}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </Layout>
  );
}