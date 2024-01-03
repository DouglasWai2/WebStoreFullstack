import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ErrorCard from "../../components/shared/ErrorCard";
import SuccessCard from "../../components/shared/SuccessCard";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";
import { CEPMask } from "../../helpers/CEPMask";
import { CPFMask } from "../../helpers/CPFMask";
import SubmitButton from "../../components/shared/SubmitButton";

const AddressForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState(null);
  const [addressInfo, setAddressInfo] = useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    recieverName: "",
    CPF: "",
    nickname: "",
    country: "Brasil",
  });
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityeOptions] = useState([]);
  const {
    cep,
    street,
    neighborhood,
    city,
    state,
    number,
    recieverName,
    CPF,
    nickname,
  } = addressInfo;
  const [lastCep, setLastCep] = useState("");
  const [lastAdress, setLastAddress] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const {
    data,
    loading: fetching,
    error: badRequest,
  } = useFetchApi("/api/address", "POST", body);

  useEffect(() => {
    if (data === "Address saved successfully") {
      setSuccess("Endereço adicionado com sucesso. Redirecionando...");
      setTimeout(() => {
        navigate(-1);
      }, 600);
    }

    if (badRequest) {
      console.log(badRequest);
    }
  }, [data]);

  const getCityOptions = async () => {
    // get cities from given state
    setLoading(true);
    fetch(
      `https://brasilapi.com.br/api/ibge/municipios/v1/${state}?providers=dados-abertos-br,gov,wikipedia`
    )
      .then((response) => response.json())
      .then((data) => {
        const newData = data.map((city) => {
          return city.nome
            .replace(/\(.+?\)/gi, "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase();
        });
        setCityeOptions(newData);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const getAddressByCEPData = async () => {
    // get address info with cep
    if (cep.length >= 8 && lastCep !== cep) {
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
      getCityOptions();
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
  }, [state]);

  const getCEPByAddress = async () => {
    // get cep with street, city and state info
    if (state !== "" && city !== "" && street !== "" && lastAdress !== street) {
      setLastAddress(street);
      setLoading(true);
      const newStreet = street.toLowerCase().replace("rua ", "");
      fetch(`https://viacep.com.br/ws/${state}/${city}/${newStreet}/json/`)
        .then((response) => {
          response.json().then((data) => {
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
    cep.replace(/\D/g, "");
    CPF.replace(/\D/g, "");

    console.log(addressInfo);
    // setBody({ address: addressInfo });
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
          <div className="relative">
            <input
              required
              className="floating-input-effect peer !w-full border-[1px] rounded-sm"
              value={CEPMask(cep)}
              onChange={handleInputChange}
              onBlur={getAddressByCEPData}
              type="text"
              name="cep"
              placeholder=""
            />
            <label className="floating-label text-lg font-medium" htmlFor="CEP">
              CEP
            </label>
          </div>
          <div className="relative">
            <select
              required
              onChange={handleInputChange}
              value={state}
              name="state"
              className="floating-select peer w-full h-full border-[1px] rounded-sm"
            >
              <option value="" key="placeholder"></option>
              {stateOptions.map((option) => (
                <option key={option.sigla} value={option.sigla}>
                  {option.nome}
                </option>
              ))}
            </select>
            <label className="label text-lg font-medium w-2/5" htmlFor="state">
              Estado
            </label>
          </div>
        </div>
        <div className="relative">
          <select
            required
            onChange={handleInputChange}
            value={city
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toUpperCase()}
            name="city"
            className="floating-select h-full w-full border-[1px] rounded-sm"
            disabled={state === "" ? true : false}
          >
            {state === "" ? (
              <option value="Selecione estado primeiro" key="placeholder">
                Selecione seu estado primeiro...
              </option>
            ) : (
              <option value="" key="placeholder">
              </option>
            )}
            {cityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        <label className="label text-lg font-medium" htmlFor="city">
          Cidade
        </label>
        </div>
        <div className="relative">
          <input
            required
            className="floating-input-effect peer  w-full border-[1px] rounded-sm"
            value={neighborhood}
            onChange={handleInputChange}
            type="text"
            name="neighborhood"
            placeholder=""
          />
          <label
            className="floating-label text-lg font-medium"
            htmlFor="neighborhood"
          >
            Bairro
          </label>
        </div>
        <div className="flex w-full gap-10">
          <div className="relative w-3/4">
            <input
              required
              className="floating-input-effect peer  w-full border-[1px] rounded-sm"
              value={street}
              onChange={handleInputChange}
              onBlur={getCEPByAddress}
              type="text"
              name="street"
              placeholder=""
            />
            <label
              className="floating-label text-lg font-medium"
              htmlFor="street"
            >
              Lougradouro
            </label>
          </div>
          <div className="relative w-1/4">
            <input
              required
              className="floating-input-effect peer  w-full  border-[1px] rounded-sm"
              value={number}
              onChange={handleInputChange}
              type="text"
              name="number"
              placeholder=""
            />
            <label
              className="floating-label text-lg font-medium"
              htmlFor="street"
            >
              Número
            </label>
          </div>
        </div>
        <div className="flex w-full gap-10">
          <div className="relative w-3/4">
            <input
              required
              className=" floating-input-effect peer w-full border-[1px] rounded-sm"
              value={recieverName}
              onChange={handleInputChange}
              type="text"
              name="recieverName"
              placeholder=""
            />
            <label
              className="floating-label text-lg font-medium"
              htmlFor="street"
            >
              Nome do destinatário
            </label>
          </div>
          <div className="relative w-2/5">
            <input
              required
              className=" floating-input-effect peer w-full  border-[1px] rounded-sm"
              value={CPFMask(CPF)}
              onChange={handleInputChange}
              type="text"
              name="CPF"
              maxLength={14}
              placeholder=""
            />
            <label
              className="floating-label text-lg font-medium"
              htmlFor="street"
            >
              CPF
            </label>
          </div>
        </div>
        <div className="relative w-full">
          <input
            className=" floating-input-effect peer w-full  border-[1px] rounded-sm"
            value={nickname}
            onChange={handleInputChange}
            type="text"
            name="nickname"
            placeholder=""
          />
          <label
            className="floating-label text-lg font-medium"
            htmlFor="street"
          >
            Apelido (opcional)
          </label>
        </div>
        <SubmitButton
          onClick={handleSubmit}
          loading={fetching}
          text="Adicionar Endereço"
        />
      </form>
    </div>
  );
};

export default AddressForm;
