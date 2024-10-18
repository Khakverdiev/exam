import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";

function App() {

  const [authState, setAuthState] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setAuthState(true);
    }
  }, [authState]);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="App">
      <header>
        {!hideNavbar && <Navbar authState={authState} />}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;