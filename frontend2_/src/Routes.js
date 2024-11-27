import App from "./App";
import Login from "./Auth/Login";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import { Navigate } from "react-router-dom";
import AboutUs from "./Components/AboutUs"
import Contacts from "./Components/Contacts"
import Delivery from "./Components/Delivery";
import Cart from "./Components/Cart"
import Profile from "./Components/Profile";
import ProductDetails from "./Components/ProductDetails";
import MyReview from "./Components/MyReview";
import ShowReviews from "./Components/ShowReviews";
import Order from "./Components/Order";
import Receipt from "./Components/Receipt";
import Register from "./Auth/Register"
import ConfirmEmail from "./Auth/ConfirmEmail"
import ResetPassword from "./Auth/ResetPassword";
import ForgotPassword from "./Auth/ForgotPassword";
import NewPassword from "./Auth/NewPassword";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register/>,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "navbar",
        element: <Navbar />
      },
      {
        path: "about-us",
        element: <AboutUs />
      },
      {
        path: "contacts",
        element: <Contacts/>
      },
      {
        path: "delivery",
        element: <Delivery/>
      },
      {
        path: "cart",
        element: <Cart/>
      },
      {
        path: "profile",
        element: <Profile/ >
      },
      {
        path: "profile/confirm-email",
        element: <ConfirmEmail/>
      },
      {
        path: "profile/change-password",
        element: <ResetPassword/>
      },
      {
        path: "product/:id",
        element: <ProductDetails/>
      },
      {
        path: "profile/my-reviews",
        element: <MyReview/>
      },
      {
        path: "reviews",
        element: <ShowReviews/>
      },
      {
        path: "order",
        element: <Order/>
      },
      {
        path: "receipt/:orderId",
        element: <Receipt/>
      },
      {
        path: "forgot-password",
        element: <ForgotPassword/>
      },
      {
        path: "new-password",
        element: <NewPassword/>
      }
    ],
  },
];

export default routes;