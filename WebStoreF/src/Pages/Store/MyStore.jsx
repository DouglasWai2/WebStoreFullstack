import React, { useState, useEffect, useCallback } from "react";
import icon from "../../assets/2099077-200.png";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import TopBarProgress from "react-topbar-progress-indicator";
import ProductCategory from "../../components/Store/MyStore/ProductCategory";
import CarouselStore from "../../components/Store/MyStore/Carousel";
import CarouselPlaceholder1 from "../../assets/carouselplaceholder1.jpg";
import CarouselPlaceholder2 from "../../assets/carouselplaceholder2.png";
import CarouselPlaceholder3 from "../../assets/carouselplaceholder3.svg";
import LikeButton from "../../components/shared/UI/LikeButton";
import Logo from "../../components/Store/MyStore/Logo";
import ShareButton from "../../components/shared/UI/ShareButton";

const MyStore = () => {
  const navigate = useNavigate();

  const { user, refreshUser } = useOutletContext();
  const location = useLocation();

  const [edit, setEdit] = useState(false);
  const [url, setUrl] = useState(null);
  const [meUrl, setMeUrl] = useState(null);
  const [counter, setCounter] = useState(0);
  const [categories, setCategories] = useState([]);
  const [lastTime, setLastTime] = useState(0);
  const [bannerEdit, setBannerEdit] = useState(null);
  const [imageEdit, setImageEdit] = useState(null);
  const [logoBody, setLogoBody] = useState(null);
  const [bannerBody, setBannerBody] = useState(null);

  const headers = { "content-type": "multipart/form-data" };
  const placeholders = [
    CarouselPlaceholder1,
    CarouselPlaceholder2,
    CarouselPlaceholder3,
  ];

  //Fetch store info and products
  const { data, loading, error, refresh } = useFetchApi(url, "GET");

  const { data: bannerResponse, loading: editingBanner } = useFetchApi(
    "/store/change-banner",
    "POST",
    bannerBody,
    headers
  );
  const { data: logoResponse, loading: editingLogo } = useFetchApi(
    "/store/change-image",
    "POST",
    logoBody,
    headers
  );

  useEffect(() => {
    if (logoResponse || bannerResponse) {
      refresh();
      setEdit(false);
    }
  }, [logoResponse, bannerResponse]);

  useEffect(() => {
    if (
      user &&
      user.role !== "Seller" &&
      location.pathname === "/store/my-store"
    )
      navigate("/store");
  }, [user]);

  const handleStoreScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      var now = new Date().getTime(); // Time in milliseconds
      if (now - lastTime < 500) {
        return;
      } else {
        setLastTime(now);
      }
      if (data.categories[counter]) {
        setCategories((categories) => [
          ...categories,
          data?.categories[counter],
        ]);
        setCounter((counter) => counter + 1);
      }
    }
  }, [counter, categories, data, lastTime]);

  useEffect(() => {
    window.addEventListener("scroll", handleStoreScroll);
    return () => window.removeEventListener("scroll", handleStoreScroll);
  }, [handleStoreScroll]);

  useEffect(() => {
      setUrl(`${location.pathname}`);
  }, [location]);

  useFetchApi(meUrl, `GET`);
  const handleMercadoEnviosIntegration = () => {
    setMeUrl(`/frete&storeId=${data._id}`);
  }
  //send edit info to backend
  function handleSubmit() {
    if (bannerEdit) {
      setBannerBody(bannerEdit);
    }
    if (imageEdit) {
      setLogoBody(imageEdit);
    }
  }

  return  <div className="flex flex-col items-center">
      <>
        <CarouselStore
          images={data?.storeBanner}
          edit={edit}
          placeholders={placeholders}
          loading={loading}
          refresh={refresh}
          setBannerEdit={setBannerEdit}
          bannerEdit={bannerEdit}
        />
        <div className="max-w-[1280px] w-full">
          {loading && <TopBarProgress />}
          {error && (
            <div className="absolute top-0 right-0 h-full w-full bg-white z-10 flex items-center justify-center">
              <img src={icon} />
              <div className="text-2xl">
                Loja não encontrada, verifique se digitou o link corretamente
              </div>
            </div>
          )}
          <div className="flex justify-center -mt-10">
            <div
              className="w-full flex flex-col relative py-10 pb-32 justify-between px-6 
              bg-white pickgradient max-sm:flex-col max-sm:pb-44"
            >
              <div className="flex max-sm:flex-col">
                <Logo
                  edit={edit}
                  image={data?.storeImage}
                  refresh={refresh}
                  setImageEdit={setImageEdit}
                  imageEdit={imageEdit}
                  className="h-[150px] mt-[-100px] flex top-[-50%] 
                      items-center justify-center w-[150px] overflow-hidden rounded-full
                       border-white border-4"
                />
                <div>
                  <p className="text-4xl max-sm:text-lg">{data?.storeName}</p>
                  <div className="flex gap-3 ml-4 mt-1">
                    <ShareButton
                      storeName={data?.storeName}
                      storeId={data?._id}
                    />
                    <LikeButton
                      numLikes={data?.likes}
                      storeId={data?._id}
                      user={user?.saved_stores}
                    />
                  </div>
                </div>
              </div>
             <div className="flex gap-1 flex-col items-end py-2">
              <button onClick={handleMercadoEnviosIntegration}>Integrar mercado envio</button>
                {edit ? (
                  <>
                    <button
                      className="bg-blue-600 border-2 border-blue-600 
                        !text-lg text-white px-6 rounded h-fit hover:bg-white 
                        hover:text-blue-600 duration-200 max-sm:w-full"
                      onClick={handleSubmit}
                    >
                      Salvar
                    </button>
                    <button
                      className="bg-red-600 text-white text-sm px-1 
                        rounded h-fit w-full hover:brightness-75 
                        duration-300"
                      onClick={() => {
                        setEdit(false);
                        setBannerEdit(null);
                        setImageEdit(null);
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  user &&
                  location.pathname === "/store/my-store" && (
                    <p
                      className="link h-fit mt-3 w-fit"
                      onClick={() => setEdit(true)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                      Editar
                    </p>
                  )
                )}
              </div>
              <div className="text-justify bg-white z-10 px-10 max-sm:px-0">
                <p className="text-gray-600">Descrição</p>
                <p className="font-medium">{data?.storeDescription}</p>
                {data && data?.storeAddress ? (
                  <p className="font-medium">
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
          <div className="mt-[100px] flex flex-col gap-8 px-6 max-sm:px-0 max-sm:gap-7">
            {data && data.products.length ? (
              <>
                <ProductCategory
                  text="Mais vendidos"
                  queries="sortby=sells&order=desc"
                  storeId={data && data._id}
                />
                <ProductCategory
                  text="Melhores avaliados"
                  queries="sortby=rating&order=desc"
                  storeId={data && data._id}
                />
                {categories.map((item, index) => {
                  return (
                    <ProductCategory
                      key={item + index}
                      text={"Mais produtos em " + item}
                      queries={`category=${item}&order=desc&sortby=sells`}
                      storeId={data && data._id}
                    />
                  );
                })}{" "}
              </>
            ) : (
              !loading && <h1 className="text-3xl py-10">Nenhum produto</h1>
            )}
          </div>
        </div>
      </>
    </div>
};

export default MyStore;
