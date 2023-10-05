import "./App.css";
import Home from "./Pages/Home";
import LoginForm from "./Pages/LoginForm";
import RegisterForm from './Pages/RegisterForm'
import Terms from './Pages/Terms'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />}></Route>
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
