import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { HivesPage } from "./pages/HivesPage";
import { QueensPage } from "./pages/QueensPage";
import { AssignmentsPage } from "./pages/AssignmentsPage";
import { HiveTypesPage } from "./pages/HiveTypesPage";
import { QueenBreedsPage } from "./pages/QueenBreedsPage";
import { QualityChecksPage } from "./pages/QualityChecksPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={["beekeeper"]}>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
      <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboardPage />
    </ProtectedRoute>
  }
/>

<Route
    path="/hives"
    element={
        <ProtectedRoute allowedRoles={["beekeeper"]}>
            <HivesPage />
        </ProtectedRoute>
    }
/>

<Route
    path="/queens"
    element={
        <ProtectedRoute allowedRoles={["beekeeper"]}>
            <QueensPage />
        </ProtectedRoute>
    }
/>
<Route
  path="/quality-checks"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <QualityChecksPage />
    </ProtectedRoute>
  }
/>
<Route
    path="/assignments"
    element={
        <ProtectedRoute allowedRoles={["beekeeper"]}>
            <AssignmentsPage />
        </ProtectedRoute>
    }
/>

<Route
  path="/admin/hive-types"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <HiveTypesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/queen-breeds"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <QueenBreedsPage />
    </ProtectedRoute>
  }
/>
    </Routes>

    
  );
}