import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ParentDashboard } from "./pages/ParentDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { AccountingDashboard } from "./pages/AccountingDashboard";
import "./styles.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");

  function handleLogin(selectedRole: string, enteredUsername: string) {
    setRole(selectedRole);
    setUsername(enteredUsername);
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setRole("student");
    setUsername("");
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render dashboard based on active role
  switch (role) {
    case "student":
      return <StudentDashboard username={username} onLogout={handleLogout} />;
    case "parent":
      return <ParentDashboard username={username} onLogout={handleLogout} />;
    case "teacher":
      return <TeacherDashboard username={username} onLogout={handleLogout} />;
    case "manager":
      return <ManagerDashboard username={username} onLogout={handleLogout} />;
    case "accounting":
      return <AccountingDashboard username={username} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
}
