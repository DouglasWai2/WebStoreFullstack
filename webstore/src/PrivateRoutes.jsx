import React from "react";
import ProfilePage from "./Pages/User/ProfilePage";
import { Navigate } from "react-router-dom";
import Address from "./Pages/User/Address";
import User from "./Pages/User/User";
import Security from "./Pages/User/Security";
import PaymentMethods from "./Pages/User/PaymentMethods";
import YourPurchases from "./Pages/User/YourPurchases";
import AddressForm from "./components/shared/AddressForm";
import Store from "./Pages/Store/Store";
import RegisterStore from "./Pages/Store/RegisterStore";
import MyStore from "./Pages/Store/MyStore";
import NewProduct from "./Pages/Store/NewProduct";
import MyProducts from "./Pages/Store/MyProducts";

const PrivateRoutes = (user, loggedIn, loading) => {
  if (!loggedIn || (loading === false && !user)) {
    return [
      { path: "/user/*", element: <Navigate to="/login" replace /> },
      { path: "/store/*", element: <Navigate to="/login" replace /> },
    ];
  } else {
    return [
      {
        path: "store",
        element: <Store />,
        children: [
          {
            path: "my-store",
            element: <MyStore />,
            children: [
              {
                path: "address",
                element: <AddressForm url="/store/address" type="store" />,
              },
            ],
          },
          { path: "signup", element: <RegisterStore /> },
          { path: "new-product", element: <NewProduct /> },
          { path: "my-products", element: <MyProducts /> },
        ],
      },
      {
        path: "user",
        element: <User />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "address", element: <Address /> },
          { path: "security", element: <Security /> },
          { path: "new-address", element: <AddressForm url="/address" /> },
          { path: "payment-methods", element: <PaymentMethods /> },
          { path: "your-purchases", element: <YourPurchases /> },
        ],
      },
    ];
  }
};

export default PrivateRoutes;
