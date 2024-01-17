import React, { useState, useEffect } from "react";
import icon from "../../assets/2099077-200.png";
import {
  Link,
  Outlet,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useFetchApi } from "../../helpers/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import TopBarProgress from "react-topbar-progress-indicator";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ProductCategory from "../../components/Store/ProductCategory";
import CarouselStore from "../../components/Store/Carousel";

const MyStore = () => {
  const { user } = useOutletContext();
  const location = useLocation();
  const [edit, setEdit] = useState(false);
  const [method, setMethod] = useState(null);
  const [bannerEdit, setBannerEdit] = useState([]);
  const [bannerLink, setBannerLink] = useState("");
  const [imageEdit, setImageEdit] = useState({});
  const [imageLink, setImageLink] = useState("");
  const [url, setUrl] = useState(null);
  const { storeName, storeId } = useParams();
  useEffect(() => {
    setUrl(`/api${location.pathname}`);
  }, []);
  const { data, loading, error } = useFetchApi(url, "GET");
  useFetchApi(`/api/store/categories/${storeName}/${storeId}`, "GET");

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
    if (banner === "Banner updated" || logo === "Store logo updated") {
      window.location.reload();
    }
    if (error) {
    }
  }, [error, banner, logo]);

  useEffect(() => {
    const array = Array.from(bannerEdit).map((item) =>
      URL.createObjectURL(item)
    );
    if (array.length > 0) {
      setBannerLink(array);
    }
  }, [bannerEdit]);

  function handleChange(e) {
    setBannerEdit(e.target.files);
  }

  function handleSubmit() {
    setMethod("POST");
  }

  return location.pathname !== "/store/address" ? (
    <div className="flex flex-col items-center">
      <>
        {edit ? (
          <label
            className="cursor-pointer hover:brightness-75 relative group"
            htmlFor="store-banner"
          >
            <input
              className="absolute w-full h-full opacity-0"
              onChange={handleChange}
              type="file"
              id="store-banner"
              name="files"
              multiple
            />
            <div className="w-screen h-[40vh]">
              <CarouselStore
                images={!bannerLink ? data.storeBanner : bannerLink}
              />
            </div>
            <p className="absolute bottom-[10%] right-[50%] pointer-events-none text-gray-500 opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
              <FontAwesomeIcon icon={faCloudArrowUp} /> Você pode clicar para
              fazer upload do banner ou arrastar o arquivo até esta área
            </p>
          </label>
        ) : (
          <div className="w-screen h-[40vh] overflow-hidden ">
            {!data ? (
              <div className="w-full h-full flex justify-center items-center">
                <LoadingSpinner />
              </div>
            ) : (
              <CarouselStore images={data.storeBanner} />
            )}
          </div>
        )}

        <div className="max-w-[1280px] w-full">
          {loading && <TopBarProgress />}
          {error?.response.status === 404 && (
            <div className="absolute top-0 right-0 h-full w-full bg-white z-10 flex items-center justify-center">
              <img src={icon} />
              <div className="text-2xl">
                Loja não encontrada, verifique se digitou o link corretamente
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <div className="w-full flex flex-col">
              <div className="flex relative justify-between px-6 shadow bg-white">
                <div className="flex">
                  <div className="h-[150px] mt-[-75px] flex top-[-50%] items-center justify-center w-[150px] overflow-hidden rounded-full border-white border-4">
                  {!edit ? (
                      !data ? (
                        <div className="w-full h-full flex justify-center items-center bg-black opacity-60">
                          <LoadingSpinner />
                        </div>
                      ) : (
                        <img
                          alt="store logo"
                          className="h-full w-full object-cover hover:brightness-75 bg-white"
                          src={data.storeImage}
                        />
                      )
  
                  ) : (

                      <label
                        className="relative h-full w-full group hover:brightness-75"
                        htmlFor="store-img"
                      >
                        <input
                          onChange={(e) => {
                            if (e.target.files[0])
                              setImageLink(
                                URL.createObjectURL(e.target.files[0])
                              );
                            setImageEdit({ file: e.target.files[0] });
                          }}
                          name="file"
                          type="file"
                          id="store-img"
                          hidden
                        />

                        <p className="absolute text-xs w-full top-[50%] left-[10%] pointer-events-none text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100 z-10">
                          <FontAwesomeIcon icon={faCloudArrowUp} /> Clique para
                          editar
                        </p>

                        <img
                          alt="store logo"
                          className="h-full w-full object-cover bg-white cursor-pointer"
                          src={!imageLink ? data.storeImage : imageLink}
                        />
                      </label>
                  )}
                  </div>
                  <p className="text-4xl">{data?.storeName}</p>
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
                  user &&
                  location.pathname === "/store/my-store" && (
                    <p
                      className="link h-fit mt-3"
                      onClick={() => setEdit(true)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                      Editar
                    </p>
                  )
                )}
              </div>
              <div className="text-justify bg-white z-10 px-10">
                {data &&
                ((data?.cnpj && data?.storeAddress) ||
                  (data?.cpf && data?.storeAddress)) ? (
                  ""
                ) : (
                  <p className="text-red-500">Conclua seu cadastro</p>
                )}
                <p className="text-gray-600">Descrição</p>
                <p>{data?.storeDescription}</p>
                {data && Object.keys(data?.storeAddress).length === 0 ? (
                  <Link to="address">Adicione o endereço da sua loja</Link>
                ) : (
                  data && (
                    <p className="">
                      {data?.storeAddress.street} - {data?.storeAddress.number}{" "}
                      - {data?.storeAddress.city} / {data?.storeAddress.state}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="mt-[100px] px-6">
            <ProductCategory
              text="Mais vendidos"
              queries="sortby=sells&order=desc"
              from={0}
              to={10}
              storeId={data && data._id}
            />
            <ProductCategory
              text="Melhores avaliados"
              queries="sortby=rating&order=desc"
              from={0}
              to={10}
              storeId={data && data._id}
            />
          </div>
        </div>
      </>
    </div>
  ) : (
    <Outlet />
  );
};

export default MyStore;