import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
    storeBanner: {
      link: "",
      name: "",
    },
  });
  const [edit, setEdit] = useState(false);
  const [method, setMethod] = useState(null);
  const [bannerEdit, setBannerEdit] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [imageEdit, setImageEdit] = useState("");
  const [imageLink, setImageLink] = useState("");
  const { data, loading, error } = useFetchApi("/api/store/my-store", "GET");
  const headers = { "content-type": "multipart/form-data" };
  const { data: banner } = useFetchApi(
    "/api/store/change-banner",
    method,
    bannerEdit,
    headers
  );
  const { data: logo } = useFetchApi(
    "/api/store/change-image",
    method,
    imageEdit,
    headers
  );
  useEffect(() => {
    if (data) {
      setStoreInfo(data);
    }
    if (banner === "Banner updated" || logo === "Store logo updated") {
      window.location.reload();
    }
    if (error) {
      console.log(error);
    }
  }, [data, error, banner, logo]);

  function handleSubmit() {
    setMethod("POST");
  }

  return location.pathname === "/store/my-store" ? (
    <div className="flex justify-center">
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
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setBannerLink(URL.createObjectURL(e.target.files[0]));
                      setBannerEdit({ file: e.target.files[0] });
                    }
                  }}
                  type="file"
                  id="store-banner"
                  name="file"
                  hidden
                />

                <div className="h-full flex justify-center overflow-hidden">
                  <img
                    alt="store banner"
                    className="w-full object-cover"
                    src={!bannerLink ? storeInfo.storeBanner.link : bannerLink}
                  />
                </div>
              </label>
            </>
          ) : (
            <div className="h-full flex justify-center overflow-hidden">
              <img
                alt="store banner"
                className="w-full object-cover"
                src={storeInfo.storeBanner.link}
              />
            </div>
          )}
        </div>
        <div className="flex relative justify-between px-6 shadow">
          {(storeInfo.cnpj && storeInfo.storeAddress) ||
          (storeInfo.cpf && storeInfo.storeAddress) ? (
            ""
          ) : (
            <p className="text-red-500">Conclua seu cadastro</p>
          )}
          <div className="flex">
            {!edit ? (
              <div className="h-[150px] mt-[-75px] flex top-[-50%] items-center justify-center w-[150px] overflow-hidden rounded-full border-white border-4">
                <img
                  alt="store logo"
                  className="h-full w-full object-cover hover:brightness-75 bg-white"
                  src={storeInfo.storeImage.link}
                />
              </div>
            ) : (
              <div
                className="h-[150px] mt-[-75px] flex top-[-50%] items-center justify-center
                  w-[150px] overflow-hidden rounded-full border-white border-4"
              >
                <label className="relative h-full w-full group hover:brightness-75" htmlFor="store-img">
                  <input
                    onChange={(e) => {
                      if (e.target.files[0])
                        setImageLink(URL.createObjectURL(e.target.files[0]));
                      setImageEdit({ file: e.target.files[0] });
                      console.log(imageEdit);
                    }}
                    name="file"
                    type="file"
                    id="store-img"
                    hidden
                  />
                  <p className="absolute text-xs w-full top-[50%] left-[10%] pointer-events-none text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
                    <FontAwesomeIcon icon={faCloudArrowUp} /> Clique para editar
                  </p>
                  <img
                    alt="store logo"
                    className="h-full w-full object-cover bg-white cursor-pointer"
                    src={!imageLink ? storeInfo.storeImage.link : imageLink}
                  />
                </label>
              </div>
            )}
            <p className="text-4xl">{storeInfo.storeName}</p>
          </div>
          {edit ? (
            <div>
              <p className="link !text-lg h-fit" onClick={handleSubmit}>
                Salvar
              </p>
              <p
                className="link !text-red-600 h-fit flex items-center"
                onClick={() => window.location.reload()}
              >
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
            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit
            amet tortor ac elit interdum posuere ac eu arcu. Nulla non porttitor
            leo, tempor maximus nulla. Morbi faucibus quam justo, sit amet
            auctor tellus posuere nec. Sed id nibh et leo dictum porta sit amet
            et nisl. Ut eget nulla a ipsum aliquet faucibus egestas quis nisi.
            Proin molestie placerat tellus in pulvinar. Nulla maximus sed libero
            eu mollis. Fusce sed nulla odio. Vestibulum tempor porta lectus
            porttitor vulputate. Sed varius et orci eget interdum. Morbi
            tincidunt purus mi. In vitae risus elit. Duis euismod, orci et
            accumsan tincidunt, urna dolor ultrices ipsum, iaculis luctus mauris
            sem nec lorem. Sed ullamcorper tellus sit amet elit egestas cursus. */}
            {storeInfo.storeDescription}
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
    </div>
  ) : (
    <Outlet />
  );
};

export default MyStore;
