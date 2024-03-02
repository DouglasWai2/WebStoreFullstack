import React, { useEffect, useRef, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../shared/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [url, setUrl] = useState(null);
  const [search, setSearch] = useState("");
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const results = useRef(null);

  const {
    data: result,
    loading: searching,
    error: searchError,
  } = useFetchApi(url, "GET");

  useEffect(() => {
    var delayDebounceFn;
    if (search) {
      delayDebounceFn = setTimeout(() => {
        setUrl(`/search?search=${search}`);
        setShowResult(true);
      }, 2000);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useOutsideAlerter(results, () => setShowResult(false));

  return (
    <div
      ref={results}
      className="relative z-40 w-full h-9 max-md:w-1/2 text-black"
    >
      <div className="rounded-md h-full flex overflow-hidden">
        <input
          className="w-full px-3"
          id="search"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            if (search) {
              setShowResult(true);
            }
          }}
        />
        <button className="w-[40px] h-full bg-orange-300 hover:bg-orange-400 transition-colors duration-200">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ color: "#152128" }}
          />
        </button>
      </div>
      {showResult && (
        <div
          id="results"
          className="absolute w-full top-[102%] h-max bg-white flex flex-col gap-2"
        >
          {searching ? (
            <div className="h-[50px] py-6 flex items-center justify-center w-full">
              <LoadingSpinner />
            </div>
          ) : (
            result && (
              <>
                <p className="px-3">Você quis dizer: </p>
                {result.tags.length > 0 &&
                  result.tags.map((item) => {
                    return (
                      <div className="py-2 px-4 cursor-pointer hover:text-white hover:bg-[#188fa7] hover:shadow-[inset_-2px_-7px_29px_-18px_rgba(0,0,0,0.75)]">
                        <p>{item._id}</p>
                      </div>
                    );
                  })}
                <p className="px-3">Busca por produtos: </p>
                {result.products.length > 0 ? (
                  result.products.map((item) => {
                    return (
                      <div
                        onClick={() => {
                          navigate(`/catalog/${item.title}/${item._id}`);
                          setShowResult(false);
                        }}
                        className="flex py-2 px-4 items-center gap-2 group bg-white 
                    cursor-pointer hover:bg-[#188fa7] 
                    hover:shadow-[inset_-2px_-7px_29px_-18px_rgba(0,0,0,0.75)]"
                      >
                        <div className="h-[50px] w-[50px] bg-white flex rounded-full overflow-hidden">
                          <img
                            className="w-full object-contain"
                            src={item.thumbnail}
                            alt={item.title}
                          />
                        </div>
                        <p className="select-none pointer-events-none group-hover:text-white">
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
                <p className="px-3">Busca por lojas: </p>
                <div className="flex flex-wrap">
                  {result.stores.length > 0 ? (
                    result.stores.map((item) => {
                      return (
                        <div
                          onClick={() => {
                            navigate(`/store/${item.storeName}/${item._id}`);
                            setShowResult(false);
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
