import "./App.css";
import Home from "./Pages/Home";
import LoginForm from "./Pages/LoginForm";
import RegisterForm from "./Pages/RegisterForm";
import Terms from "./Pages/Terms";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { useFetchApi } from "./hooks/useFetchApi";
import { useEffect, useState } from "react";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import NotFoundError from "./Pages/NotFoundError";
import UnexpectedError from "./Pages/UnexpectedError";
import { useLogOut } from "./hooks/useLogOut";
import Checkout from "./Pages/Checkout/Checkout";
import PostCheckout from "./Pages/Checkout/PostCheckout";
import ReviewCart from "./Pages/Checkout/ReviewCart";

function App() {
  const logOut = useLogOut();
  const [userUrl, setUserUrl] = useState(null);
  const [addressUrl, setAddressUrl] = useState(null);
  const {
    data: user,
    loading,
    error,
    refresh: refreshUser,
  } = useFetchApi(userUrl, "GET");
  const { data: address, loading: fetching } = useFetchApi(addressUrl, "GET");

  //Use this function to retrieve cookies by their names
  function getCookie(name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return value != null ? unescape(value[1]) : null;
  }
  const loggedIn = getCookie("loggedin");

  function redirectLoader() {
    if (loggedIn) {
      return redirect("/");
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (error?.data === "Access Denied. No token provided.") logOut(); // If loggedIn cookie is true but there's no access token, i.e. user is not logged in
  }, [error]);

  useEffect(() => {
    if (!loggedIn) return;
    setUserUrl("/user");
    setAddressUrl("/address");
  }, []);

  const props = { user, address, loading, fetching, loggedIn, refreshUser };

  const router = createBrowserRouter([
    error
      ? { path: "*", element: <UnexpectedError /> }
      : {
          path: "/",
          element: <Home {...props} />,

          children: [
            ...PrivateRoutes(user, loggedIn, loading),
            ...PublicRoutes(),
          ],
        },
    {
      path: "/login",
      element: <LoginForm />,
      loader: redirectLoader(),
    },
    {
      path: "/signup",
      element: <RegisterForm loggedIn={loggedIn} />,
      loader: redirectLoader(),
    },
    {
      path: "/checkout/:productName/:productId/:client_secret",
      element: <Checkout />,
      loader: () => {
        if (!loggedIn) redirect("/login");
        else return null;
      },
    },
    {
      path: "/checkout/post-checkout",
      element: <PostCheckout />,
      loader: () => {
        if (!loggedIn) redirect("/login");
        else return null;
      },
    },
    {
      path: "/checkout/review-cart",
      element: <ReviewCart />,
      loader: () => {
        if (!loggedIn) redirect("/login");
        else return null;
      },
    },
    { path: "/termsandconditions", element: <Terms /> },
    { path: "/privacypolicy", element: <PrivacyPolicy /> },
    { path: "*", element: <NotFoundError /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
