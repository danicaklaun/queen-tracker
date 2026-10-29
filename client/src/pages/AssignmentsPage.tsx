import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/authContext";
import {
  getAssignments,
  createAssignment,
  endAssignment,
} from "../api_services/assignmentApi";
import { getQueens } from "../api_services/queensApi";
import { getHives } from "../api_services/hivesApi";

type Assignment = {
  id: number;
  queenCode: string;
  hiveCode: string;
  assignedAt: string;
  endedAt: string | null;
  assignmentStatus: string;
};

type Queen = {
  id: number;
  queenCode: string;
};

type Hive = {
  id: number;
  hiveCode: string;
};

export function AssignmentsPage() {
  const { token } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [queens, setQueens] = useState<Queen[]>([]);
  const [hives, setHives] = useState<Hive[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    queenId: 1,
    hiveId: 1,
    assignedAt: new Date().toISOString().slice(0, 10),
  });

  async function loadData() {
    if (!token) return;

    try {
      const assignmentResponse = await getAssignments(token);
      setAssignments(assignmentResponse.data);

      const queenResponse = await getQueens(token);
console.log("QUEENS", queenResponse.data);
setQueens(queenResponse.data);



const hiveResponse = await getHives(token);
console.log("HIVES", hiveResponse.data);

if (queenResponse.data.length > 0 && hiveResponse.data.length > 0) {
  setForm((prev) => ({
    ...prev,
    queenId: queenResponse.data[0].id,
    hiveId: hiveResponse.data[0].id,
  }));
}
setHives(hiveResponse.data);
    } catch {
      setError("Greška pri učitavanju podataka.");
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return;

    try {
      await createAssignment(token, form);

      setForm({
        queenId: 1,
        hiveId: 1,
        assignedAt: new Date().toISOString().slice(0, 10),
      });

      await loadData();
    } catch {
      setError("Greška pri dodeli matice.");
    }
  }

  async function handleEnd(id: number) {
    if (!token) return;

    try {
      await endAssignment(token, id);
      await loadData();
    } catch {
      setError("Greška pri završavanju dodele.");
    }
  }

  return (
    <Layout>
      <h1>Dodele matica</h1>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleCreate}  className="card">
        <h2>Nova dodela</h2>

        <select
          value={form.queenId}
          onChange={(e) =>
            setForm({
              ...form,
              queenId: Number(e.target.value),
            })
          }
        >
          {queens.map((queen) => (
            <option key={queen.id} value={queen.id}>
              {queen.queenCode}
            </option>
          ))}
        </select>

        <select
          value={form.hiveId}
          onChange={(e) =>
            setForm({
              ...form,
              hiveId: Number(e.target.value),
            })
          }
        >
          {hives.map((hive) => (
            <option key={hive.id} value={hive.id}>
              {hive.hiveCode}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.assignedAt}
          onChange={(e) =>
            setForm({
              ...form,
              assignedAt: e.target.value,
            })
          }
        />

        <button type="submit">
          Dodeli maticu
        </button>
      </form>

      <div  className="card">
        <h2>Aktuelne dodele</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Matica</th>
                <th>Košnica</th>
                <th>Početak</th>
                <th>Kraj</th>
                <th>Status</th>
                <th>Akcija</th>
              </tr>
            </thead>

            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.queenCode}</td>
                  <td>{assignment.hiveCode}</td>
                  <td>{assignment.assignedAt.slice(0, 10)}</td>
                  <td>
                    {assignment.endedAt
                      ? assignment.endedAt.slice(0, 10)
                      : "-"}
                  </td>
                  <td>{assignment.assignmentStatus}</td>
                  <td>
                    {assignment.assignmentStatus === "active" && (
                      <button
                        onClick={() => handleEnd(assignment.id)}
                      >
                        Završi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </Layout>
  );
}