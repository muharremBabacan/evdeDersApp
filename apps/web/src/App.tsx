import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { OnlineRegister } from "./pages/OnlineRegister";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ParentDashboard } from "./pages/ParentDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { AccountingDashboard } from "./pages/AccountingDashboard";
import "./styles.css";

export default function App() {
  const [view, setView] = useState<"landing" | "login" | "register" | "dashboard">("landing");
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("duzen");

  function handleLogin(selectedRole: string, enteredUsername: string) {
    setRole(selectedRole);
    setUsername(enteredUsername);
    setView("dashboard");
  }

  function handleRegisterComplete(newStudentUsername: string) {
    setRole("student");
    setUsername(newStudentUsername);
    setView("dashboard");
  }

  function handleLogout() {
    setView("landing");
    setRole("student");
    setUsername("");
  }

  if (view === "landing") {
    return (
      <LandingPage 
        onNavigateToLogin={() => setView("login")} 
        onNavigateToRegister={(pkg) => {
          if (pkg) setSelectedPackage(pkg);
          setView("register");
        }} 
      />
    );
  }

  if (view === "register") {
    return (
      <OnlineRegister 
        defaultPackage={selectedPackage}
        onRegisterComplete={handleRegisterComplete} 
        onBackToLogin={() => setView("login")} 
      />
    );
  }

  if (view === "login") {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onNavigateToRegister={() => setView("register")} 
      />
    );
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
      return <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setView("register")} />;
  }
}
