import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";
import img from "../../assets/teste.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCloudArrowUp,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

const MyStore = () => {
  const location = useLocation();
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    storeDescription: "",
    storeImage: { link: "", name: "" },
    storeCategory: "",
    storeAddress: {
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "",
    },
  });
  const [body, setBody] = useState(null);
  const [edit, setEdit] = useState(false);
  const [bannerEdit, setBannerEdit] = useState("");
  const file = useRef(null);
  const { data, loading, error } = useFetchApi("/api/store/my-store", "GET");
  const headers =  {"content-type": "multipart/form-data"}
  const { data: response } = useFetchApi("/api/store/change-banner", "POST", body, headers);

  useEffect(() => {
    if (data) {
      setStoreInfo(data);
    }
    if (response === "Store id updated") {
      window.location.reload();
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, response]);

  function handleSubmit(){
      setBody({file: file.current.files})
  }

  return location.pathname === "/store/my-store" ? (
    <main className="flex justify-center">
      <div className="w-[1546px] bg-white">
        <div className="group relative w-full h-[423px] bg-white hover:brightness-75 duration-300">
          {edit ? (
            <>
              <p className="absolute bottom-[10%] right-[50%] pointer-events-none text-gray-500 opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
                <FontAwesomeIcon icon={faCloudArrowUp} /> Você pode clicar para
                fazer upload do banner ou arrastar o arquivo até esta área
              </p>
              <label className="cursor-pointer" htmlFor="store-banner">
                <input
                  ref={file}
                  onChange={(e) =>
                    setBannerEdit(URL.createObjectURL(e.target.files[0]))
                  }
                  type="file"
                  id="store-banner"
                  name="file"
                  hidden
                />

                <div className="h-full flex justify-center overflow-hidden">
                  <img
                    className="w-full object-none"
                    src={
                      !bannerEdit
                        ? "https://i.pinimg.com/originals/a9/97/51/a99751ac6e165b94030b86c62fa00294.jpg"
                        : bannerEdit
                    }
                  />
                </div>
              </label>
            </>
          ) : (
            <div className="h-full flex justify-center overflow-hidden">
              <img
                className="w-full object-none"
                src="https://i.pinimg.com/originals/a9/97/51/a99751ac6e165b94030b86c62fa00294.jpg"
              />
            </div>
          )}
        </div>
        <div className="flex relative justify-between ml-6">
          {(storeInfo.cnpj && storeInfo.storeAddress) ||
          (storeInfo.cpf && storeInfo.storeAddress) ? (
            ""
          ) : (
            <p className="text-red-500">Conclua seu cadastro</p>
          )}
          <div className="flex">
            <div className="h-[150px] mt-[-75px] flex top-[-50%] items-center justify-center w-[150px] overflow-hidden rounded-full border-white border-4">
              <img
                className="h-full w-full object-cover"
                src={
                  "https://marketplace.canva.com/EAFYecj_1Sc/1/0/1600w/canva-cream-and-black-simple-elegant-catering-food-logo-2LPev1tJbrg.jpg"
                }
                // {storeInfo.storeImage.link}
              />
            </div>
            <p className="text-4xl">{storeInfo.storeName}</p>
          </div>
          {edit ? (
            <div>
              <p className="link !text-lg h-fit" onClick={handleSubmit}>Salvar</p>
              <p
                className="link !text-red-600 h-fit flex items-center"
                onClick={() => window.location.reload()}
              >
                <FontAwesomeIcon icon={faBan} size="xs" className="mr-1" />
                Cancelar
              </p>
            </div>
          ) : (
            <p className="link h-fit mt-3" onClick={() => setEdit(true)}>
              <FontAwesomeIcon icon={faPenToSquare} />
              Editar
            </p>
          )}
        </div>
        <div className="text-justify">
          <p className="text-gray-600">Descrição</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit
            amet tortor ac elit interdum posuere ac eu arcu. Nulla non porttitor
            leo, tempor maximus nulla. Morbi faucibus quam justo, sit amet
            auctor tellus posuere nec. Sed id nibh et leo dictum porta sit amet
            et nisl. Ut eget nulla a ipsum aliquet faucibus egestas quis nisi.
            Proin molestie placerat tellus in pulvinar. Nulla maximus sed libero
            eu mollis. Fusce sed nulla odio. Vestibulum tempor porta lectus
            porttitor vulputate. Sed varius et orci eget interdum. Morbi
            tincidunt purus mi. In vitae risus elit. Duis euismod, orci et
            accumsan tincidunt, urna dolor ultrices ipsum, iaculis luctus mauris
            sem nec lorem. Sed ullamcorper tellus sit amet elit egestas cursus.
            {/* {storeInfo.storeDescription} */}
          </p>
          {Object.keys(storeInfo.storeAddress).length === 0 ? (
            <Link to="address">Adicione o endereço da sua loja</Link>
          ) : (
            <p className="">
              {storeInfo.storeAddress.street} - {storeInfo.storeAddress.number}{" "}
              - {storeInfo.storeAddress.city} / {storeInfo.storeAddress.state}
            </p>
          )}
        </div>
      </div>
    </main>
  ) : (
    <Outlet />
  );
};

export default MyStore;
