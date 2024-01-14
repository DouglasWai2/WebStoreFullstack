import React from "react";
import {
  Navigate,
} from "react-router-dom";
import MyStore from "./Pages/Store/MyStore";

const PublicRoutes = () => {
  return [
    { path: "store/:storeName/:storeId", element: <MyStore /> },
    { path: "*", element: <Navigate to="/login" replace /> },
  ];
};

export default PublicRoutes;
