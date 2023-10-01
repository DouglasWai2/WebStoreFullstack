import "./App.css";
import Home from "./routes/Home";
import LoginForm from "./routes/LoginForm";
import RegisterForm from './routes/RegisterForm'
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
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
