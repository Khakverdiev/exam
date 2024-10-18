import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import routes from "./Routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import { CartProvider } from "./CartContext";

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <CartProvider>
            <RouterProvider router={router} />
        </CartProvider>
    </AuthProvider>
);