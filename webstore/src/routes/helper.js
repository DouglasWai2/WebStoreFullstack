<Formik
isSubmitting={isSubmitting}
initialValues={{ email: "", password: "" }}
validate={(values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Insira um email";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = "Insira um endereço de email válido";
  }
  return errors;
}}
onSubmit={(values) => {
  setSubmitting(true)
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
    .then((response) => {
      setSubmitting(false)
      // window.location.href='/'          
    })
    .catch((error) => {
      if (error.response.data.error === "User does not exist") {
        setInvalid("E-mail ou senha estão incorretos");
      }
    });
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
}) => (<div>{" "}
{errors.email && touched.email ? (
  <span className="text-red-500">
    <FontAwesomeIcon
      className="mr-2"
      icon={faCircleExclamation}
      style={{ color: "#ef4444" }}
    />
    {errors.email}
  </span>
) : ''}</div>)}
</Formik>