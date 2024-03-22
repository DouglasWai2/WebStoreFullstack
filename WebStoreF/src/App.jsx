import { useEffect, useState, lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { useFetchApi } from "./hooks/useFetchApi";
import { useLogOut } from "./hooks/useLogOut";
import { useCart } from "./hooks/useCart.js";
import PrivateRoutes from "./PrivateRoutes.jsx";
import PublicRoutes from "./PublicRoutes.jsx";
import Logo from "./assets/logo-no-background.svg";
const Index = lazy(() => import("./Pages/Index.jsx"));
const LoginForm = lazy(() => import("./Pages/LoginForm.jsx"));
const RegisterForm = lazy(() => import("./Pages/RegisterForm.jsx"));
const Terms = lazy(() => import("./Pages/Terms.jsx"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy.jsx"));
const NotFoundError = lazy(() => import("./Pages/NotFoundError.jsx"));
const UnexpectedError = lazy(() => import("./Pages/UnexpectedError.jsx"));
const Checkout = lazy(() => import("./Pages/Checkout/Checkout.jsx"));
const PostCheckout = lazy(() => import("./Pages/Checkout/PostCheckout.jsx"));
const ReviewCart = lazy(() => import("./Pages/Checkout/ReviewCart.jsx"));
const VerificationPage = lazy(() => import("./Pages/VerificationPage.jsx"));

function App() {
  const loggedIn = window.localStorage.getItem("accessToken") ? true : false;
  const logOut = useLogOut();
  const { syncCart } = useCart(true);
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
    if (loggedIn) setUserUrl("/user");
    const handleStorage = () => {
      if (window.localStorage.getItem("accessToken")) setUserUrl("/user");
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const props = {
    user,
    address: user?.address,
    loading,
    loggedIn,
    refreshUser,
  };

  const router = createBrowserRouter([
    error && error?.status !== 403
      ? { path: "*", element: <UnexpectedError /> }
      : {
          path: "/",
          errorElement: <NotFoundError />,
          element: <Index {...props} />,
          children: [
            ...PrivateRoutes(user, loggedIn, loading),
            ...PublicRoutes(),
          ],
        },
    {
      path: "/login",
      element: <LoginForm refreshUser={refreshUser} syncCart={syncCart} />,
      loader: redirectLoader(),
    },
    {
      path: "/signup",
      element: <RegisterForm loggedIn={loggedIn} />,
      loader: redirectLoader(),
    },
    {
      path: "/checkout/payment/:client_secret/:order_id",
      element: <Checkout user={user} />,
      loader: () => {
        if (!loggedIn) return redirect("/login");
        else return null;
      },
    },
    {
      path: "/checkout/post-checkout",
      element: <PostCheckout />,
      loader: () => {
        if (!loggedIn) return redirect("/login");
        else return null;
      },
    },
    {
      path: "/checkout/:id",
      element: <ReviewCart user={user} />,
      loader: () => {
        if (!loggedIn) return redirect("/login");
        else return null;
      },
    },
    { path: `/register/user/verify`, element: <VerificationPage /> },
    { path: "/termsandconditions", element: <Terms /> },
    { path: "/privacypolicy", element: <PrivacyPolicy /> },
  ]);

  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
