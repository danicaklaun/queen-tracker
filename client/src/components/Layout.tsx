import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import "./Layout.css";
import dashboardBg from "../assets/slika2.jpeg";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
<div
 className="card"  style={{
  backgroundImage: `
    linear-gradient(
      rgba(255,255,255,0.45),
      rgba(248,245,238,0.55)
    ),
    url(${dashboardBg})
  `,
}}
>    <div className="layout">
      <header className="topbar">

        <div className="logo">
          <h1>Queen Tracker</h1>
        </div>

        <nav>
          <Link to="/dashboard">Dashboard</Link>

          {user?.role === "beekeeper" && (
            <>
              <Link to="/hives">Košnice</Link>
              <Link to="/queens">Matice</Link>
              <Link to="/assignments">Dodele</Link>
            </>
          )}
 {user?.role === "admin" && (
  <>
    <Link to="/admin">Admin</Link>
    <Link to="/admin/hive-types">Tipovi košnica</Link>
<Link to="/admin/queen-breeds">Rase matica</Link>
<Link to="/quality-checks">
  Kontrole
</Link>
  </>
  
)}

        </nav>

        <div className="user-info">
          <span>{user?.username}</span>

          <button onClick={handleLogout}>
            Odjava
          </button>
        </div>

      </header>

      <main className="page-content">
        {children}
      </main>
    </div>
    </div>
  );
}