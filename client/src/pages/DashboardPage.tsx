import { useEffect, useState } from "react";
import { getDashboard } from "../api_services/dashboardApi";
import { useAuth } from "../contexts/authContext";
import { Layout } from "../components/Layout";
import "./DashboardPage.css";

type DashboardData = {
  stats: {
    hiveCount: number;
    queenCount: number;
    hivesWithoutQueen: number;
  };
  alerts: {
    oldQueens: Array<{
      id: number;
      queenCode: string;
      hatchYear: number;
    }>;
    lowRatedQueens: Array<{
      id: number;
      queenCode: string;
      averageScore: number;
    }>;
  };
  latestChecks: Array<{
    id: number;
    checkedAt: string;
    totalScore: number;
    recommendation: string;
    queenCode: string;
    hiveCode: string;
  }>;
  topQueens: Array<{
    id: number;
    queenCode: string;
    averageScore: number;
  }>;
};

export function DashboardPage() {
  const { token } = useAuth();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      if (!token) return;

      try {
        const response = await getDashboard(token);
        setDashboard(response.data);
      } catch {
        setError("Greška pri učitavanju dashboard-a.");
      }
    }

    loadDashboard();
  }, [token]);

 

  return (
    <main className="dashboard-page">
      <Layout>

      {error && <p className="error-message">{error}</p>}

      {!dashboard && !error && <p>Učitavanje dashboard-a...</p>}

      {dashboard && (
        <>
          <section className="stats-grid">
            <article className="dashboard-card">
              <div className="stat-number">{dashboard.stats.hiveCount}</div>
              <div className="stat-label">Košnice</div>
            </article>

            <article className="dashboard-card">
              <div className="stat-number">{dashboard.stats.queenCount}</div>
              <div className="stat-label">Matice</div>
            </article>

            <article className="dashboard-card">
              <div className="stat-number">{dashboard.stats.hivesWithoutQueen}</div>
              <div className="stat-label">Košnice bez matice</div>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="dashboard-card">
              <h2>Upozorenja</h2>

              <h3>Starije matice</h3>
              {dashboard.alerts.oldQueens.length === 0 ? (
                <p>Nema starijih matica.</p>
              ) : (
                <ul>
                  {dashboard.alerts.oldQueens.map((queen) => (
                    <li key={queen.id}>
                      {queen.queenCode} - {queen.hatchYear}
                    </li>
                  ))}
                </ul>
              )}

              <h3>Niske ocene</h3>
              {dashboard.alerts.lowRatedQueens.length === 0 ? (
                <p>Nema matica sa niskom prosečnom ocenom.</p>
              ) : (
                <ul>
                  {dashboard.alerts.lowRatedQueens.map((queen) => (
                    <li key={queen.id}>
                      {queen.queenCode} - {queen.averageScore}
                    </li>
                  ))}
                  
                </ul>
              )}
            </article>

            <article className="dashboard-card">
              <h2>Poslednje kontrole</h2>

              {dashboard.latestChecks.length === 0 ? (
                <p>Nema unetih kontrola.</p>
              ) : (
                <ul>
                  {dashboard.latestChecks.map((check) => (
                    <li key={check.id}>
                      {check.checkedAt} | {check.queenCode} | {check.hiveCode} |
                      ocena {check.totalScore} | {check.recommendation}
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="dashboard-card">
              <h2>Najbolje matice</h2>

              {dashboard.topQueens.length === 0 ? (
                <p>Nema rang liste.</p>
              ) : (
                <ul>
                  {dashboard.topQueens.map((queen) => (
                    <li key={queen.id}>
                      {queen.queenCode} - prosečna ocena {queen.averageScore}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        </>
      )}
      </Layout>
    </main>
  );
}