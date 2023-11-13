import "./App.css";
import Home from "./Pages/Home";
import LoginForm from "./Pages/LoginForm";
import RegisterForm from './Pages/RegisterForm'
import Terms from './Pages/Terms'
import PrivacyPolicy from './Pages/PrivacyPolicy'
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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />}>
        </Route>
        <Route path="user" element={<User />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="address" element={<Address />} />
          <Route path="new-address" element={<AddressForm />} />
          <Route path="security" element={<Security />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="your-purchases" element={<YourPurchases />} />
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
