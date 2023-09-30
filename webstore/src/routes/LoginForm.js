import { Formik } from "formik";
import { useForm } from "react-hook-form";
import Logo from "../logo-no-background-2.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const LoginForm = () => {
  const baseUrl = "http://localhost:5000";

  return (
    <main className="flex flex-col z-[-1] justify-center items-center w-screen h-screen bg-[#F9F7F1]">
      <div className="w-[500px] rounded-lg shadow-md p-8 py-24">
        <img src={Logo} />
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Insira um email";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            axios
              .post(
                `${baseUrl}/auth/login`,
                {
                  email: values.email,
                  password: values.password,
                },
                {
                  headers: {
                    "content-type":
                      "application/x-www-form-urlencoded;charset=utf-8",
                  },
                }
              )
              .then((response) => response);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form
              className="flex flex-col justify-center gap-8 relative"
              onSubmit={handleSubmit}
            >
              <label htmlFor="email" className="flex flex-col">
                <span className="flex justify-between">
                  E-mail{" "}
                  {errors.email && touched.email && (
                    <span className="text-red-500">
                      <FontAwesomeIcon
                        className="mr-2"
                        icon={faCircleExclamation}
                        style={{ color: "#ef4444" }}
                      />
                      {errors.email}
                    </span>
                  )}
                </span>
                <input
                  className={
                    "input-login " + (errors.email && "!border-red-500")
                  }
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
              </label>
              <label htmlFor="password" className="flex flex-col">
                Senha
                <input
                  className="input-login"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
              </label>
              {errors.password && touched.password && errors.password}
              <button
                className="button-login"
                type="submit"
                disabled={isSubmitting}
              >
                Fazer login
              </button>
            </form>
          )}
        </Formik>
      </div>
      <div className="mt-6 text-center w-full box-shadow-bottom">
        <h3>É novo por aqui?</h3>
        <button className="bg-white border-[#D7E3EA] border-[1px] px-16 py-1 rounded-md mt-2">
          Crie sua conta
        </button>
      </div>
    </main>
  );
};

export default LoginForm;
