import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/authContext";
import {
  getQualityChecks,
  createQualityCheck,
} from "../api_services/qualityApi";
import { getAssignments } from "../api_services/assignmentApi";

type Assignment = {
  id: number;
  queenCode: string;
  hiveCode: string;
};

type QualityCheck = {
  id: number;
  queenCode: string;
  hiveCode: string;
  total_score: number;
  recommendation: string;
  checked_at: string;
};

export function QualityChecksPage() {
  const { token } = useAuth();

  const [checks, setChecks] = useState<QualityCheck[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [form, setForm] = useState({
    assignmentId: 1,
    broodPattern: 5,
    temperament: 5,
    productivity: 5,
    health: 5,
  });

  async function loadData() {
    if (!token) return;

    const assignmentResponse = await getAssignments(token);
    setAssignments(assignmentResponse.data);

    const qualityResponse = await getQualityChecks(token);
    setChecks(qualityResponse.data);
  }

  useEffect(() => {
    loadData();
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
  e.preventDefault();

  if (!token) return;

  await createQualityCheck(token, form);

  await loadData();
}
return (
  <Layout>
    <h1>Kontrole kvaliteta</h1>

    <div className="card">
      <h2>Nova kontrola</h2>

<form onSubmit={handleCreate}>        <select
          value={form.assignmentId}
          onChange={(e) =>
            setForm({
              ...form,
              assignmentId: Number(e.target.value),
            })
          }
        >
          {assignments.map((assignment) => (
            <option
              key={assignment.id}
              value={assignment.id}
            >
              {assignment.queenCode} → {assignment.hiveCode}
            </option>
          ))}
        </select>

       <select
  value={form.broodPattern}
  onChange={(e) =>
    setForm({
      ...form,
      broodPattern: Number(e.target.value),
    })
  }
>
  {[1, 2, 3, 4, 5].map((n) => (
    <option key={n} value={n}>
      {n}
    </option>
  ))}
</select>

       <select
  value={form.temperament}
  onChange={(e) =>
    setForm({
      ...form,
      temperament: Number(e.target.value),
    })
  }
>
  {[1, 2, 3, 4, 5].map((n) => (
    <option key={n} value={n}>
      {n}
    </option>
  ))}
</select>

        <select
  value={form.productivity}
  onChange={(e) =>
    setForm({
      ...form,
      productivity: Number(e.target.value),
    })
  }
>
  {[1, 2, 3, 4, 5].map((n) => (
    <option key={n} value={n}>
      {n}
    </option>
  ))}
</select>

        <select
  value={form.health}
  onChange={(e) =>
    setForm({
      ...form,
      health: Number(e.target.value),
    })
  }
>
  {[1, 2, 3, 4, 5].map((n) => (
    <option key={n} value={n}>
      {n}
    </option>
  ))}
</select>

<button type="submit">          Sačuvaj kontrolu
        </button>
      </form>
    </div>

    <div className="card">
      <h2>Istorija kontrola</h2>

      <table>
        <thead>
          <tr>
            <th>Matica</th>
            <th>Košnica</th>
            <th>Ocena</th>
            <th>Preporuka</th>
            <th>Datum</th>
          </tr>
        </thead>

        <tbody>
          {checks.map((check) => (
            <tr key={check.id}>
              <td>{check.queenCode}</td>
              <td>{check.hiveCode}</td>
              <td>{check.total_score}</td>
              <td>{check.recommendation}</td>
              <td>{check.checked_at.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Layout>
);
}