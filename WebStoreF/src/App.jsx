import Home from "./Pages/Home.jsx";
import LoginForm from "./Pages/LoginForm.jsx";
import RegisterForm from "./Pages/RegisterForm.jsx";
import Terms from "./Pages/Terms.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { useFetchApi } from "./hooks/useFetchApi";
import { useEffect, useState } from "react";
import PrivateRoutes from "./PrivateRoutes.jsx";
import PublicRoutes from "./PublicRoutes.jsx";
import NotFoundError from "./Pages/NotFoundError.jsx";
import UnexpectedError from "./Pages/UnexpectedError.jsx";
import { useLogOut } from "./hooks/useLogOut";
import Checkout from "./Pages/Checkout/Checkout.jsx";
import PostCheckout from "./Pages/Checkout/PostCheckout.jsx";
import ReviewCart from "./Pages/Checkout/ReviewCart.jsx";

function App() {
  const logOut = useLogOut();
  const [userUrl, setUserUrl] = useState(null);
  const {
    data: user,
    loading,
    error,
    refresh: refreshUser,
  } = useFetchApi(userUrl, "GET");

  //Use this function to retrieve cookies by their names
  function getCookie(name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return value != null ? unescape(value[1]) : null;
  }
  const loggedIn = window.localStorage.getItem("accessToken") ? true : false;

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
  }, []);

  const props = { user, address: user?.addressess, loading, loggedIn, refreshUser };

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
