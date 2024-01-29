import React from "react";
import {
  Navigate,
} from "react-router-dom";
import MyStore from "./Pages/Store/MyStore";
import ProductPage from "./Pages/Catalog/ProductPage";


const PublicRoutes = () => {
  return [
    { path: "store/:storeName/:storeId", element: <MyStore /> },
    {path: "catalog/:productName/:productId", element: <ProductPage />}
  ];
};

export default PublicRoutes;
