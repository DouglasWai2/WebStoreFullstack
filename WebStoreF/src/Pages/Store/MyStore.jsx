import React, { useState, useEffect } from "react";
import icon from "../../assets/2099077-200.png";
import {
  Link,
  Outlet,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faHeart,
  faPenToSquare,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import TopBarProgress from "react-topbar-progress-indicator";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ProductCategory from "../../components/Store/MyStore/ProductCategory";
import CarouselStore from "../../components/Store/MyStore/Carousel";
import CarouselPlaceholder1 from "../../assets/carouselplaceholder1.jpg";
import CarouselPlaceholder2 from "../../assets/carouselplaceholder2.png";
import CarouselPlaceholder3 from "../../assets/carouselplaceholder3.svg";
import { useApi } from "../../hooks/useApi";

const MyStore = () => {
  const { user, refreshUser } = useOutletContext();
  const api = useApi();
  const location = useLocation();
  const [edit, setEdit] = useState(false);
  const [likes, setLikes] = useState(0);
  const [method, setMethod] = useState(null);
  const [bannerEdit, setBannerEdit] = useState([]);
  const [bannerLink, setBannerLink] = useState("");
  const [imageEdit, setImageEdit] = useState({});
  const [imageLink, setImageLink] = useState("");
  const [url, setUrl] = useState(null);
  const placeholders = [
    CarouselPlaceholder1,
    CarouselPlaceholder2,
    CarouselPlaceholder3,
  ];
  useEffect(() => {
    setUrl(`${location.pathname}`);
  }, []);

  const { data, loading, error } = useFetchApi(url, "GET");
  const headers = { "content-type": "multipart/form-data" };
  const { data: banner } = useFetchApi(
    "/store/change-banner",
    method,
    bannerEdit,
    headers
  );
  const { data: logo } = useFetchApi(
    "/store/change-image",
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

  function generateUrl() {
    navigator.clipboard.writeText(
      `http://localhost:3000/store/${data.storeName}/${data._id}`
    );
  }

  function saveStore(e) {
    e.preventDefault();
    api
      .post(
        import.meta.env.VITE_API_URL + "/user/like_store",
        { storeId: data._id },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        refreshUser();
      })
      .catch((err) => console.log(err));
    if (e.target.children[0].checked) {
      console.log('checked')
      setLikes(data?.likes - 1);
    } else {
      console.log('unchecked')
      setLikes(data?.likes + 1);
    }
  }

  return location.pathname !== "/store/my-store/address" ? (
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
              <CarouselStore
                images={
                  !data.storeBanner.length ? placeholders : data.storeBanner
                }
              />
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

                        <p
                          className="absolute text-xs w-full top-[50%] 
                        left-[10%] pointer-events-none text-gray-400 opacity-0 
                        transition-all duration-300 group-hover:opacity-100 z-10"
                        >
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
                  <div>
                    <p className="text-4xl">{data?.storeName}</p>
                    <div className="flex gap-3 ml-4 mt-1">
                      <div
                        className="rounded-full w-[30px] h-[30px] cursor-pointer text-gray-400 
                       grid justify-center items-center bg-white hover:brightness-90 duration-150"
                        onClick={generateUrl}
                      >
                        <FontAwesomeIcon icon={faShareNodes} />
                      </div>
                      <div className="flex items-center text-gray-400 ">
                        <label
                          htmlFor="likes"
                          className="rounded-full w-[30px] h-[30px] cursor-pointer  
                      grid justify-center items-center bg-white hover:brightness-90 duration-150 has-[:checked]:!text-red-600"
                          onClick={saveStore}
                        >
                          <input
                            name="likes"
                            id="likes"
                            hidden
                            type="checkbox"
                            checked={user?.saved_stores.indexOf(data?._id) >= 0}
                            onChange={(e) => {}}
                          />
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="pointer-events-none"
                          />
                        </label>
                        <span>{likes === 0 ? data?.likes : likes}</span>
                      </div>
                    </div>
                  </div>
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
                <p className="text-gray-600">Descrição</p>
                <p>{data?.storeDescription}</p>
                {data && data?.storeAddress ? (
                  <p className="">
                    {data?.storeAddress.street} - {data?.storeAddress.number} -{" "}
                    {data?.storeAddress.city} / {data?.storeAddress.state}
                  </p>
                ) : (
                  !loading && (
                    <>
                      <p className="text-red-500">Conclua seu cadastro</p>
                      <Link to="address" className="link">
                        Adicione o endereço da sua loja
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="mt-[100px] px-6">
            {data && data.products.length ? (
              <>
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
              </>
            ) : (
              !loading && (
                <h1 className="text-3xl">Adicione produtos à sua loja</h1>
              )
            )}
          </div>
        </div>
      </>
    </div>
  ) : (
    <div className="w-full h-[70vh] py-28 flex justify-center items-center">
      <Outlet />
    </div>
  );
};

export default MyStore;
