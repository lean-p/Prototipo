import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RegistrarSeguimiento from "./pages/RegistrarSeguimiento.jsx";

function App() {
  const [screen, setScreen] = useState("login");

  return (
    <>
      {screen === "login" && (
        <Login onLogin={() => setScreen("dashboard")} />
      )}
      {screen === "dashboard" && (
        <Dashboard onRegistrar={() => setScreen("registrar")} />
      )}
      {screen === "registrar" && (
        <RegistrarSeguimiento onBack={() => setScreen("dashboard")} />
      )}
    </>
  );
}

export default App;