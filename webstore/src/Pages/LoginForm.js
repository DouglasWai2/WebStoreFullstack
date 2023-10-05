import Logo from "../logo-no-background-2.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../reducers/authSlice'


const LoginForm = () => {
  const baseUrl = "http://localhost:5000";
  const [invalid, setInvalid] = useState("");
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  axios.defaults.withCredentials=true

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const userData = await axios.post(
          `${baseUrl}/auth/login`,
          {
            email,
            password
          },
          {
            headers: {
              "content-type":
                "application/x-www-form-urlencoded;charset=utf-8",
            }
    })
        console.log(userData)
        dispatch(setCredentials({accessToken: userData.data.authorization, email}))
        window.localStorage.setItem('accessToken', userData.data.authorization)
        window.localStorage.setItem('LoggedIn', true)
        window.localStorage.setItem('name', userData.data.name)
        window.localStorage.setItem('userid', userData.data.userId)
        window.localStorage.setItem('verified', userData.data.isVerfied)
        setEmail('')
        setPassword('')
        navigate('/')
    } catch (err) {
      console.log(err)
      const { error } =  err.response.data
        if (error === 'User does not exist') {
          setInvalid('E-mail ou senha incorretos')
        } else if (error === 'Wrong password'){
          setInvalid('Senha incorreta')
        }
    }
}

const handleEmailInput = (e) => setEmail(e.target.value)

const handlePasswordInput = (e) => setPassword(e.target.value)

  return (
    <main className="flex flex-col z-[-1] justify-center items-center w-screen h-screen bg-[#F9F7F1]">
      {invalid !== "" && (
        <div className="absolute top-[100px] bg-white rounded-sm border-[1px] border-red-500 text-red-500 p-4">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {invalid}
          <button onClick={() => setInvalid('')} className="ml-5">X</button>
        </div>
      )}
      <div className="w-[500px] rounded-lg shadow-md p-8 py-24">
        <a href='/'><img src={Logo} /></a>
            <form
              className="flex flex-col justify-center gap-8 relative"
              onSubmit={handleSubmit}
            >
              <label htmlFor="email" className="flex flex-col">
                <span className="flex justify-between">
                  E-mail
                </span>
                <input
                  className={
                    "input-login"
                  }
                  type="email"
                  name="email"
                  onChange={handleEmailInput}
                  value={email}
                />
              </label>
              <label htmlFor="password" className="flex flex-col">
                Senha
                <input
                  className="input-login"
                  type="password"
                  name="password"
                  onChange={handlePasswordInput}
                  value={password}
                />
              </label>
              <button
                className="button-login"
                type="submit"
              >
                Fazer login
              </button>
            </form>
      </div>
      <div className="mt-6 text-center w-full box-shadow-bottom">
        <h3>É novo por aqui?</h3>
        <button onClick={() => navigate('/login')} className="bg-white border-[#D7E3EA] border-[1px] px-16 py-1 rounded-md mt-2">
          Crie sua conta
        </button>
      </div>
    </main>
  );
};

export default LoginForm;