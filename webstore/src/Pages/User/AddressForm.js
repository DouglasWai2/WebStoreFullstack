import { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ErrorCard from "../../components/shared/ErrorCard";
import { refreshToken } from "../../helpers/getRefreshToken";
import SuccessCard from "../../components/shared/SuccessCard";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../helpers/handleError";

const AddressForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [addressInfo, setAddressInfo] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    recieverName: '',
    CPF: '',
    nickname: '',
    country: "Brasil",
  });
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityeOptions] = useState([]);
  const { cep, street, neighborhood, city, state, number, recieverName, CPF, nickname } = addressInfo;
  const [lastCep, setLastCep] = useState("");
  const [lastAdress, setLastAddress] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()

  const getCityOptions = async () => {
    // get cities from given state
    setLoading(true);
    fetch(
      `https://brasilapi.com.br/api/ibge/municipios/v1/${state}?providers=dados-abertos-br,gov,wikipedia`
    )
      .then((response) => response.json())
      .then((data) => {
        const newData = data.map((city) => {
          return city.nome.replace(/\(.+?\)/gi, "").normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
        });
        setCityeOptions(newData);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false)
      });
  };

  const getAddressByCEPData = async () => {
    // get address info with cep
    if (cep.length === 8 && lastCep !== cep) {
      setLoading(true);
      fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
        .then((response) => {
          if (response.status === 404) {
            setError("CEP não encontrado");
          } else {
            response.json().then((data) => {
              setAddressInfo((addressInfo) => ({
                ...addressInfo,
                street: data.street,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
              }));
            });
          }
        })
        .catch((errors) => console.log(errors))
        .finally(() => {
          setLastCep(cep);
          setLastAddress(street);
          setLoading(false);
        });
    }
  };

  function handleInputChange(e) {
    setAddressInfo((addressInfo) => ({
      ...addressInfo,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    // get city options from api when state changes
    if (state !== "" && state) {
      getCityOptions()    
      
    }
  }, [state]);

  useEffect(() => {
    // get states from api
    fetch("https://brasilapi.com.br/api/ibge/uf/v1")
      .then((response) => response.json())
      .then((data) => {
        const newData = data.sort((a, b) => {
          // Sort states in alphabetical order
          const nameA = a.nome.toUpperCase();
          const nameB = b.nome.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        setStateOptions(newData);
      });
  }, []);

  const getCEPByAddress = async () => {
    // get cep with street, city and state info
    if (state !== "" && city !== "" && street !== "" && lastAdress !== street) {
      setLastAddress(street);
      setLoading(true);
      const newStreet = street.toLowerCase().replace("rua ", "");
      fetch(`https://viacep.com.br/ws/${state}/${city}/${newStreet}/json/`)
        .then((response) => {
          response.json().then((data) => {
            console.log(data);
            if (data.length === 0) {
              setError("Endereço não encontrado");
            } else {
              const dataCep = data[0].cep.replace("-", "");
              setAddressInfo((addressInfo) => ({
                ...addressInfo,
                neighborhood: data[0].bairro,
                cep: dataCep,
              }));
              setLastCep(dataCep);
            }
          });
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleClick = () => {
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    const accessToken = window.localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/address/${accessToken}`,
        { address: addressInfo },
        { withCredentials: true }
      );
      setSuccess("Endereço adicionado com sucesso...");
      setTimeout(()=> navigate('/user/address'), 1500);
    } catch (error) {
      handleError(error, function(){handleSubmit(e)})
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <div
      className={
        "flex flex-col border-[1px] relative shadow-md w-3/4 py-10 px-6 rounded-sm"
      }
    >
      {error !== "" ? (
        <div className="absolute top-[-75px] left-[50%] translate-x-[-50%]">
          <ErrorCard invalid={error} handleClick={handleClick} />
        </div>
      ) : success !== "" ? (
        <div className="absolute top-[-75px] left-[50%] translate-x-[-50%]">
          <SuccessCard success={success} handleClick={handleClick} />
        </div>
      ) : (
        ""
      )}
      {loading ? (
        <div className="w-full h-full bg-black opacity-50 z-10 left-0 top-0 absolute flex items-center justify-center cursor-wait">
          <LoadingSpinner />
        </div>
      ) : (
        ""
      )}
      <form className="flex flex-col gap-8 address-form">
        <div className="flex gap-4 w-full">
          <label className="text-lg font-medium w-full" htmlFor="CEP">
            CEP
          <input
            required
            className="border-[#152128] h-[2em] w-full border-[1px] rounded-sm"
            value={cep}
            onChange={handleInputChange}
            onBlur={getAddressByCEPData}
            type="text"
            name="cep"
            placeholder="12345-678"
            />
            </label>

          <label className="text-lg font-medium w-2/5" htmlFor="state">
            Estado
          <select
            required
            onChange={handleInputChange}
            value={state}
            name="state"
            className="border-[#152128] w-full h-[2em] border-[1px] rounded-sm"
            placeholder="Selecione seu estado"
            >
            <option value="" key="placeholder">
              Selecione seu Estado
            </option>
            {stateOptions.map((option) => (
              <option key={option.sigla} value={option.sigla}>
                {option.nome}
              </option>
            ))}
          </select>
            </label>
        </div>
        <label className="text-lg font-medium" htmlFor="city">
          Cidade
          <select
            required
            onChange={handleInputChange}
            value={city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()}
            name="city"
            className="border-[#152128] h-[2em] w-full border-[1px] rounded-sm"
            disabled={state === "" ? true : false}
          >
            {state === "" ? (
              <option value="" key="placeholder">
                Selecione seu estado primeiro...
              </option>
            ) : (
              <option value="" key="placeholder">
                Selecione sua cidade
              </option>
            )}
            {cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="text-lg font-medium" htmlFor="neighborhood">
          Bairro
          <input
            required
            className="border-[#152128] w-full h-[2em] border-[1px] rounded-sm"
            value={neighborhood}
            onChange={handleInputChange}
            type="text"
            name="neighborhood"
            placeholder="Digite seu bairro aqui"
          />
        </label>
        <div className="flex w-full gap-10">
          <label className="text-lg font-medium w-3/4 " htmlFor="street">
            Lougradouro
            <input
              required
              className="border-[#152128] h-[2em] w-full border-[1px] rounded-sm"
              value={street}
              onChange={handleInputChange}
              onBlur={getCEPByAddress}
              type="text"
              name="street"
              placeholder="Digite o nome da sua rua aqui"
            />
          </label>
          <label className="text-lg font-medium w-1/4" htmlFor="street">
            Número
            <input
              required
              className="border-[#152128] h-[2em] w-full  border-[1px] rounded-sm"
              value={number}
              onChange={handleInputChange}
              type="text"
              name="number"
              placeholder="Número da casa"
            />
          </label>
        </div>
        <div className="flex w-full gap-10">
          <label className="text-lg font-medium w-3/4 " htmlFor="street">
            Nome do destinatário
            <input
              required
              className="border-[#152128] h-[2em] w-full border-[1px] rounded-sm"
              value={recieverName}
              onChange={handleInputChange}
              type="text"
              name="recieverName"
              placeholder="Digite o nome do destinatário aqui"
            />
          </label>
          <label className="text-lg font-medium w-2/5" htmlFor="street">
            CPF
            <input
              required
              className="border-[#152128] h-[2em] w-full  border-[1px] rounded-sm"
              value={CPF}
              onChange={handleInputChange}
              type="text"
              name="CPF"
              placeholder="CPF do destinatário"
            />
          </label>
        </div>
        <label className="text-lg font-medium w-full" htmlFor="street">
            Apelido (opcional)
            <input
              className="border-[#152128] h-[2em] w-full  border-[1px] rounded-sm"
              value={nickname}
              onChange={handleInputChange}
              type="text"
              name="nickname"
              placeholder="Ex: Casa, trabalho..."
            />
          </label>
        <button
          type="submit"
          onClick={handleSubmit}
          className={"button-login" + (submiting ? " brightness-75" : "")}
        >
          {submiting ? <LoadingSpinner /> : "Adicionar Endereço"}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
