import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/authContext";
import {
  getHives,
  createHive,
  archiveHive,
} from "../api_services/hivesApi";
import { getHiveTypes } from "../api_services/catalogApi";

type Hive = {
  id: number;
  hiveCode: string;
  apiaryName: string;
  location: string;
  hiveType: string;
  isArchived: number;
  note: string | null;
};

export function HivesPage() {
  const { token } = useAuth();

  const [hives, setHives] = useState<Hive[]>([]);
  const [error, setError] = useState("");

  
  const [form, setForm] = useState({
  hiveCode: "",
  apiaryName: "",
  location: "",
  hiveTypeId: 1,
  note: "",
});

const [hiveTypes, setHiveTypes] = useState<
  { id: number; name: string }[]
>([]);

  useEffect(() => {
    async function load() {
      if (!token) return;

      try {
        const response = await getHives(token);
        setHives(response.data);
        const catalogs = await getHiveTypes(token);
setHiveTypes(catalogs.data);
      } catch {
        setError("Greška pri učitavanju košnica.");
      }
      
    }

    load();
  }, [token]);

async function handleArchive(id: number) {
  if (!token) return;

  try {
    await archiveHive(token, id);

    const response = await getHives(token);
    setHives(response.data);
  } catch {
    setError("Greška pri arhiviranju košnice.");
  }
}

  async function handleCreateHive(e: React.FormEvent) {
  e.preventDefault();

  if (!token) return;

  try {
    await createHive(token, form);

    const response = await getHives(token);
    setHives(response.data);

    setForm({
      hiveCode: "",
      apiaryName: "",
      location: "",
      hiveTypeId: 1,
      note: "",
    });
  } catch {
    setError("Greška pri dodavanju košnice.");
  }
}
  return (
    <Layout>
      <h1>Košnice</h1>

      {error && <p>{error}</p>}
<form onSubmit={handleCreateHive} className="card">

    <h2>Nova košnica</h2>

    <input
        placeholder="Šifra"
        value={form.hiveCode}
        onChange={(e)=>
            setForm({...form,hiveCode:e.target.value})
        }
    />

    <input
        placeholder="Pčelinjak"
        value={form.apiaryName}
        onChange={(e)=>
            setForm({...form,apiaryName:e.target.value})
        }
    />

    <input
        placeholder="Lokacija"
        value={form.location}
        onChange={(e)=>
            setForm({...form,location:e.target.value})
        }
    />

    <select
        value={form.hiveTypeId}
        onChange={(e)=>
            setForm({...form,hiveTypeId:Number(e.target.value)})
        }
    >
        {hiveTypes.map(type=>(
            <option
                key={type.id}
                value={type.id}
            >
                {type.name}
            </option>
        ))}
    </select>

    <textarea
        placeholder="Napomena"
        value={form.note}
        onChange={(e)=>
            setForm({...form,note:e.target.value})
        }
   />

    <button type="submit">
        Dodaj košnicu
    </button>

</form >

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Šifra</th>
              <th>Pčelinjak</th>
              <th>Lokacija</th>
              <th>Tip</th>
              <th>Status</th>
                  <th>Akcije</th>

            </tr>
          </thead>

          <tbody>
            {hives.map((hive) => (
              <tr key={hive.id}>
                <td>{hive.hiveCode}</td>
                <td>{hive.apiaryName}</td>
                <td>{hive.location}</td>
                <td>{hive.hiveType}</td>
                <td>{hive.isArchived ? "Arhivirana" : "Aktivna"}</td>
                <td>
  {!hive.isArchived && (
    <button onClick={() => handleArchive(hive.id)}>
      Arhiviraj
    </button>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}