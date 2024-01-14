import "./App.css";
import Home from "./Pages/Home";
import LoginForm from "./Pages/LoginForm";
import RegisterForm from "./Pages/RegisterForm";
import Terms from "./Pages/Terms";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useFetchApi } from "./helpers/useFetchApi";
import { useEffect, useState } from "react";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import api from "./helpers/api";

function App() {
  const [userUrl, setUserUrl] = useState(null);
  const [addressUrl, setAddressUrl] = useState(null);
  const { data, loading, error } = useFetchApi(userUrl, "GET");
  const { data: address, loading: fetching } = useFetchApi(addressUrl, "GET");

  //Use this function to retrieve cookies by their names
  function getCookie(name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return value != null ? unescape(value[1]) : null;
  }
  const loggedIn = getCookie("loggedin");

  useEffect(() => {
    if (!loggedIn) {
      return;
    } else {
      setUserUrl("/api/user");
      setAddressUrl("/api/address");
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: 
        <Home
          user={data}
          address={address}
          loading={loading}
          fetching={fetching}
          loggedIn={loggedIn}
        />,
        
        children: [...PrivateRoutes(data, loggedIn), ...PublicRoutes()]
    },
    { path: "/login", element: <LoginForm /> },
    { path: "/signup", element: <RegisterForm /> },
    { path: "/termsandconditions", element: <Terms /> },
    { path: "/privacypolicy", element: <PrivacyPolicy /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
