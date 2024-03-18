import { Suspense, lazy } from "react";
import MyStore from "./Pages/Store/MyStore";
import ProductPage from "./Pages/Catalog/ProductPage";
import SearchResult from "./Pages/Catalog/SearchResult";

const PublicRoutes = () => {
  return [
    {
      path: "store/:storeName/:storeId",
      element: <MyStore />,
    },
    {
      path: "catalog/:productName/:productId",
      element: <ProductPage />,
    },
    {
      path: "catalog/products/search/result",
      element: <SearchResult />,
    },
  ];
};

export default PublicRoutes;
