import "./App.css";
import Home from "./Pages/Home";
import LoginForm from "./Pages/LoginForm";
import RegisterForm from "./Pages/RegisterForm";
import Terms from "./Pages/Terms";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ProfilePage from "./Pages/User/PersonalData";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Address from "./Pages/User/Address";
import User from "./Pages/User/User";
import Security from "./Pages/User/Security";
import PaymentMethods from "./Pages/User/PaymentMethods";
import YourPurchases from "./Pages/User/YourPurchases";
import AddressForm from "./Pages/User/AddressForm";
import PaymentMethodForm from "./Pages/User/SetupForm";
import Merchant from "./Pages/Store/Store";
import RegisterStore from "./Pages/Store/RegisterStore";
import MyStore from "./Pages/Store/MyStore";
import StoreAddress from "./Pages/Store/StoreAddress";
import NewProduct from "./Pages/Store/NewProduct";
import { useFetchApi } from "./helpers/useFetchApi";
import { useEffect, useState } from "react";

function App() {
  const [userUrl, setUserUrl] = useState(null);
  const [addressUrl, setAddressUrl] = useState(null);

  //Use this function to retrieve cookies by their names
  function getCookie(name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return value != null ? unescape(value[1]) : null;
  }
  const loggedIn = getCookie("loggedin");
  
 useEffect(() => {

    if (!loggedIn) {
      return ;
    } else {
      setUserUrl("/api/user");
      setAddressUrl("/api/address");
    }
  }, []);
  const { data, loading, error } = useFetchApi(userUrl, "GET");
  const { data: address, loading: fetching } = useFetchApi(addressUrl, "GET");

  console.log("User: " + data)
  console.log(loading)


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <Home
              user={data}
              address={address}
              loading={loading}
              fetching={fetching}
              loggedIn={loggedIn}
            />
          }
        >
          <Route path="store/:storeName/:storeId" element={<MyStore />} />
          <Route path="store" element={<Merchant />}>
            <Route path="signup" element={<RegisterStore />} />

            <Route path="my-store" element={<MyStore />}>
              <Route path="address" element={<StoreAddress />} />
            </Route>
            <Route path="new-product" element={<NewProduct />} />
          </Route>
          <Route path="user" element={<User />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="address" element={<Address />} />
            <Route path="new-address" element={<AddressForm />} />
            <Route path="security" element={<Security />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="new-payment-method" element={<PaymentMethodForm />} />
            <Route path="your-purchases" element={<YourPurchases />} />
          </Route>
        </Route>
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<RegisterForm />} />
        <Route path="termsandconditions" element={<Terms />} />
        <Route path="privacypolicy" element={<PrivacyPolicy />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
