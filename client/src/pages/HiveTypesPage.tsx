import { useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/authContext";
import { createHiveType } from "../api_services/adminApi";

export function HiveTypesPage() {
  const { token } = useAuth();

  const [hiveType, setHiveType] = useState({
    name: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return;

    await createHiveType(token, hiveType);

    setHiveType({
      name: "",
      description: "",
    });
  }

  return (
    <Layout>
      <div className="card">
        <h1>Tipovi košnica</h1>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Naziv"
            value={hiveType.name}
            onChange={(e) =>
              setHiveType({
                ...hiveType,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Opis"
            value={hiveType.description}
            onChange={(e) =>
              setHiveType({
                ...hiveType,
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