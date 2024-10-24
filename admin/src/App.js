import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function App() {
    const [authState, setAuthState] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const accessToken = Cookies.get('AccessToken');
        if (accessToken) {
            setAuthState(true);
        } else {
            setAuthState(false);
        }
    }, [location]);

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