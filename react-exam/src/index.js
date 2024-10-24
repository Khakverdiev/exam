import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import routes from "./Routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import { CartProvider } from "./CartContext";
import {store} from "./app/store";
import {Provider} from "react-redux";

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <CartProvider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </CartProvider>
    </AuthProvider>
);