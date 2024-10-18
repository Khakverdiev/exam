import AboutUs from "./AboutUs";
import App from "./App";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Cart from "./Cart";
import Contacts from "./Contacts";
import Delivery from "./Delivery";
import Home from "./Home";
import Order from "./Order";
import ProductDetails from "./ProductDetails";
import Profile from "./Profile";
import ConfirmEmail from "./Auth/ConfirmEmail";
import { Navigate } from "react-router-dom";
import UpdateProfile from "./UpdateProfile";
import ResetPassword from "./Auth/ResetPassword";

const routes = [
  {
    path: "/",
    element: <App />,
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
        path: "home",
        element: <Home />,
      },
      {
        path: "about-us",
        element: <AboutUs />
      },
      {
        path: "contacts",
        element: <Contacts />
      },
      {
        path: "delivery",
        element: <Delivery />
      },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "order",
        element: <Order />
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "profile",
        element: <Profile/>
      },
      {
        path: "profile/confirm-email",
        element: <ConfirmEmail />
      },
      {
        path: "profile/update-profile",
        element: <UpdateProfile/>
      },
      {
        path: "profile/change-password",
        element: <ResetPassword/>
      }
    ],
  },
];

export default routes;