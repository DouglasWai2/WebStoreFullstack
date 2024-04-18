import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import ProfilePage from "./Pages/User/ProfilePage";
import Address from "./Pages/User/Address";
import User from "./Pages/User/User";
import Security from "./Pages/User/Security";
import PaymentMethods from "./Pages/User/PaymentMethods";
import YourPurchases from "./Pages/User/YourOrders/YourPurchases";
import AddressForm from "./components/shared/AddressForm";
import Store from "./Pages/Store/Store";
import RegisterStore from "./Pages/Store/RegisterStore";
import MyStore from "./Pages/Store/MyStore";
import NewProduct from "./Pages/Store/NewProduct";
import MyProducts from "./Pages/Store/MyProducts";
import OrderDetails from "./Pages/User/YourOrders/OrderDetails";
import Orders from "./Pages/Store/Orders/Orders";
import Details from "./Pages/Store/Orders/Details";
import Rating from "./Pages/Rating";

const PrivateRoutes = (user, loggedIn, loading, refreshUser) => {
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
          { path: "signup", element: <RegisterStore /> },
          {
            path: "my-store",
            element: <MyStore />,
          },
          {
            path: "/store/my-store/orders",
            element: <Orders />,
          },
          {
            path: "/store/my-store/orders/:order_id",
            element: <Details />,
          },
          {
            path: "/store/my-store/address",
            element: (
              <div className="w-full h-full flex items-center justify-center">
                <AddressForm
                  url="/store/address"
                  type="store"
                />
              </div>
            ),
          },
          { path: "new-product", element: <NewProduct /> },
          { path: "my-products", element: <MyProducts /> },
          ,
        ],
      },
      {
        path: "user",
        element: <User />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "address", element: <Address /> },
          { path: "security", element: <Security /> },
          { path: "new-address", element: <AddressForm url="/user/address" /> },
          {
            path: "your-orders",
            element: <YourPurchases />,
            children: [{ path: ":order_id", element: <OrderDetails /> }],
          },
        ],
      },
      {
        path: "rating/:store_id/:order_id",
        element: <Rating />,
      }
    ];
  }
};

export default PrivateRoutes;
