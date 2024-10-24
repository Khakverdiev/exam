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
import ShowReviews from "./ShowReviews";
import MyReview from "./MyReview";
import PrivateRoute from "./PrivateRoute";

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
        element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
        ),
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
        element: (
            <PrivateRoute>
              <Order />
            </PrivateRoute>
        )
      },
      {
        path: "order-confirmation/:orderId",
        element: (
            <PrivateRoute>
              <Order />
            </PrivateRoute>
        )
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "profile",
        element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
        )
      },
      {
        path: "profile/confirm-email",
        element: (
            <PrivateRoute>
              <ConfirmEmail />
            </PrivateRoute>
        )
      },
      {
        path: "profile/update-profile",
        element: (
            <PrivateRoute>
              <UpdateProfile/>
            </PrivateRoute>
        )
      },
      {
        path: "profile/change-password",
        element: (
            <PrivateRoute>
              <ResetPassword/>
            </PrivateRoute>
        )
      },
      {
        path: "profile/my-reviews",
        element: (
            <PrivateRoute>
              <MyReview/>
            </PrivateRoute>
        )
      },
      {
        path: "reviews",
        element: <ShowReviews/>
      }
    ],
  },
];

export default routes;
