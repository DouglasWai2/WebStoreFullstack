import React, { useState, useEffect } from "react";
import icon from "../../assets/2099077-200.png";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useFetchApi } from "../../hooks/useFetchApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import TopBarProgress from "react-topbar-progress-indicator";
import ProductCategory from "../../components/Store/MyStore/ProductCategory";
import CarouselStore from "../../components/Store/MyStore/Carousel";
import CarouselPlaceholder1 from "../../assets/carouselplaceholder1.jpg";
import CarouselPlaceholder2 from "../../assets/carouselplaceholder2.png";
import CarouselPlaceholder3 from "../../assets/carouselplaceholder3.svg";
import LikeButton from "../../components/shared/LikeButton";
import Logo from "../../components/Store/MyStore/Logo";

const MyStore = () => {
  const { user } = useOutletContext();
  const location = useLocation();
  const [edit, setEdit] = useState(false);
  const [method, setMethod] = useState(null);
  const [url, setUrl] = useState(null);
  const placeholders = [
    CarouselPlaceholder1,
    CarouselPlaceholder2,
    CarouselPlaceholder3,
  ];
  useEffect(() => {
    setUrl(`${location.pathname}`);
  }, []);

  const { data, loading, error, refresh } = useFetchApi(url, "GET");
  const { data: products, loading: fetching } = useFetchApi(
    data && "/catalog/all-products/" + data._id,
    "GET"
  );

  // useEffect(() => {
  //   if (banner === "Banner updated" || logo === "Store logo updated") {
  //     window.location.reload();
  //   }
  //   if (error) {
  //   }
  // }, [error]);

  function handleSubmit() {
    setMethod("POST");
  }

  function generateUrl() {
    navigator.clipboard.writeText(
      `http://localhost:3000/store/${data.storeName}/${data._id}`
    );
  }

  return location.pathname !== "/store/my-store/address" ? (
    <div className="flex flex-col items-center">
      <>
        <CarouselStore
          method={method}
          images={data?.storeBanner}
          edit={edit}
          placeholders={placeholders}
          loading={loading}
        />
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
              <div className="flex relative justify-between px-6 shadow bg-white max-sm:flex-col max-sm:py-3">
                <div className="flex max-sm:flex-col">
                  <div className="h-[150px] mt-[-75px] flex top-[-50%] items-center justify-center w-[150px] overflow-hidden rounded-full border-white border-4">
                    <Logo edit={edit} image={data?.storeImage} />
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
                      <LikeButton />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {edit ? (
                    <>
                      <p className="link !text-lg h-fit" onClick={handleSubmit}>
                        Salvar
                      </p>
                      <p
                        className="link !text-red-600 h-fit flex items-center"
                        onClick={() => window.location.reload()}
                      >
                        Cancelar
                      </p>
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
            {products && products.length ? (
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
