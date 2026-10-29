import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/authContext";
import {
  getUsers,
  getAuditLogs,
  updateUserRole,
  deactivateUser,
} from "../api_services/adminApi";

type User = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  isActive: number;
};

type AuditLog = {
  id: number;
  action: string;
  entityName: string;
  entityId: number;
  username: string;
  createdAt: string;
};

export function AdminDashboardPage() {
  const { token } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");

 

  async function loadData() {
    if (!token) return;

    try {
      const usersResponse = await getUsers(token);
      setUsers(usersResponse.data);

      const logsResponse = await getAuditLogs(token);
      setLogs(logsResponse.data);
    } catch {
      setError("Greška pri učitavanju podataka.");
    }
  }
  useEffect(() => {
  loadData();
}, [token]);

  async function handleRoleChange(userId: number, currentRole: string) {
    if (!token) return;

    const newRole =
        currentRole === "admin"
            ? "beekeeper"
            : "admin";

    await updateUserRole(token, userId, newRole);

    const response = await getUsers(token);
    setUsers(response.data);
}

async function handleDeactivate(userId: number) {
    if (!token) return;

    await deactivateUser(token, userId);

    const response = await getUsers(token);
    setUsers(response.data);
}




  return (
    <Layout>

      <h1>Administracija</h1>

      {error && <p className="error-message">{error}</p>}

      <div  className="card">

        <h2>Korisnici</h2>

        <div className="table-wrap">
          <table>

            <thead>
              <tr>
                <th>Korisnik</th>
                <th>Email</th>
                <th>Uloga</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>

            <tbody>

              {users.map(user => (

                <tr key={user.id}>

                  <td>{user.username}</td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>
                    {user.isActive ? "Aktivan" : "Neaktivan"}
                  </td>

                 <td>
        <button
          onClick={() =>
            handleRoleChange(user.id, user.role)
          }
        >
          Promeni ulogu
        </button>

        {user.isActive && (
          <button
            onClick={() =>
              handleDeactivate(user.id)
            }
          >
            Deaktiviraj
          </button>
        )}
      </td>
                </tr>

              ))}

            </tbody>

          </table>
        </div>

      </div>

     

         

         
    

      

      <div className="card">

        <h2>Audit log</h2>

        <div className="table-wrap">

          <table>

            <thead>

              <tr>
                <th>Akcija</th>
                <th>Entitet</th>
                <th>ID</th>
                <th>Korisnik</th>
                <th>Datum</th>
              </tr>

            </thead>

            <tbody>

              {logs.map(log => (

                <tr key={log.id}>

                  <td>{log.action}</td>

                  <td>{log.entityName}</td>

                  <td>{log.entityId}</td>

                  <td>{log.username}</td>

                  <td>{log.createdAt.slice(0,10)}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}