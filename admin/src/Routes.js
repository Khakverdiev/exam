import App from "./App";
import {Navigate} from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Products from "./Products";
import ProductReviews from "./ProductReviews";
import UpdateRole from "./UpdateRole";
import Order from "./Order";

const routes = [{
    path: "/",
    element: <App/>,
    children: [
        {
            path: "/",
            element: <Navigate to="/login" />,
        },
        {
            path: "login",
            element: <Login />,
        },
        {
            path: "register",
            element: <Register />,
        },
        {
            path: "product",
            element: <Products/>,
        },
        {
            path: "rating",
            element: <ProductReviews/>
        },
        {
            path: "role",
            element: <UpdateRole/>
        },
        {
          path: "orders",
          element: <Order/>
        }
    ]
}]

export default routes;