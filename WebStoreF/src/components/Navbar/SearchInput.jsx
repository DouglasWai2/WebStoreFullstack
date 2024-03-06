import React, { useEffect, useRef, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [url, setUrl] = useState(null);
  const [search, setSearch] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [searchFull, setSearchFull] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const results = useRef(null);

  const {
    data: result,
    loading: searching,
    error: searchError,
  } = useFetchApi(url, "GET");

  useEffect(() => {
    var delayDebounceFn;``

    let params = new URL(document.location).searchParams;
    if (params.get("search") === search) return;


    if (search) {
      delayDebounceFn = setTimeout(() => {
        setUrl(`/search?search=${search}`);
        setShowResult(true);
      }, 2000);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [search, location]);

  useOutsideAlerter(results, () => {
    setShowResult(false);
    setSearchFull(false);
  });

  return (
    <div
      ref={results}
      className={
        "relative z-40 w-full max-md:w-full text-black " +
        (searchFull && "h-[80px] w-screen !fixed left-0")
      }
    >
      <div
        className={
          "rounded-md max-h-[35px] h-[35px] flex overflow-hidden transition-all duration-200 " +
          (searchFull && "!max-w-full !w-full !max-h-full !h-full rounded-none")
        }
      >
        {searchFull && (
          <button
            onClick={() => {
              setShowResult(false);
              setSearchFull(false);
            }}
            className={"absolute left-0 h-full px-3"}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <input
          className={"h-full px-3 w-full " + (searchFull && "pl-10")}
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            if (window.innerWidth < 640) setSearchFull(true);
            if (search) {
              setShowResult(true);
            }
          }}
        />
        <button
          onClick={() => {
            if (search) {
              navigate(
                `/catalog/products/search/result?search=${search}&sortBy=sells&order=-1`
              );
            }
          }}
          className="w-[40px] h-full bg-orange-300 hover:bg-orange-400 transition-colors duration-200"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ color: "#152128" }}
          />
        </button>
      </div>
      {showResult && (
        <div
          id="results"
          className={
            "absolute w-full top-[100%] h-max bg-white flex flex-col gap-2 max-h-[80vh] overflow-y-scroll"
          }
        >
          {searching ? (
            <div className="h-[50px] py-6 flex items-center justify-center w-full">
              <LoadingSpinner />
            </div>
          ) : (
            result && (
              <>
                <p className="px-3 font-medium">Você quis dizer: </p>
                {result.tags.length > 0 &&
                  result.tags.map((item) => {
                    return (
                      <div
                        onClick={() => {
                          setSearch(item._id);
                          navigate(
                            `/catalog/products/search/result?search=${item._id}`
                          );
                          setShowResult(false);
                          setSearchFull(false);
                        }}
                        className="py-2 px-4 cursor-pointer hover:text-white hover:bg-[#188fa7] 
                      hover:shadow-[inset_-2px_-7px_29px_-18px_rgba(0,0,0,0.75)]"
                      >
                        <p>{item._id}</p>
                      </div>
                    );
                  })}
                <p className="px-3 font-medium">Busca por produtos: </p>
                {result.products.length > 0 ? (
                  result.products.map((item) => {
                    return (
                      <div
                        onClick={() => {
                          navigate(`/catalog/${item.title}/${item._id}`);
                          setShowResult(false);
                          setSearchFull(false);
                        }}
                        className="flex h-[80px] py-2 items-center group bg-white 
                    cursor-pointer hover:bg-[#188fa7] hover:text-white
                    hover:shadow-[inset_-2px_-7px_29px_-18px_rgba(0,0,0,0.75)]"
                      >
                        <div className="w-[50px] h-[50px] mr-2 ml-2 bg-white rounded-full overflow-hidden">
                          <img
                            className="h-full w-full object-contain"
                            src={item.thumbnail}
                            alt={item.title}
                          />
                        </div>
                        <p
                          className="select-none w-fit 
                        pointer-events-none max-lg:text-sm"
                        >
                          {item.title}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-6 w-full">
                    Nenhum resultado encontrado
                  </p>
                )}
                <p className="px-3 font-medium">Busca por lojas: </p>
                <div className="flex flex-wrap">
                  {result.stores.length > 0 ? (
                    result.stores.map((item) => {
                      return (
                        <div
                          onClick={() => {
                            navigate(`/store/${item.storeName}/${item._id}`);
                            setShowResult(false);
                            setSearchFull(false);
                          }}
                          className="flex min-w-[150px] flex-col items-center cursor-pointer 
                          hover:text-white hover:bg-[#188fa7] 
                          hover:shadow-[inset_-2px_-7px_29px_-18px_rgba(0,0,0,0.75)] p-2"
                        >
                          <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                            <img
                              className="h-full object-cover"
                              src={item.storeImage}
                              alt="store logo"
                            />
                          </div>
                          <p>{item.storeName}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center py-6 w-full">
                      Nenhum resultado encontrado
                    </p>
                  )}
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
