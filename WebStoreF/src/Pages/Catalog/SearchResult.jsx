import React, { useEffect, useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import ProductCard from "../../components/shared/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import SearchResultSkeleton from "../../components/Catalog/SearchResultSkeleton";

const SearchResult = () => {
  const location = useLocation();
  const [url, setUrl] = useState(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const { data, loading, error } = useFetchApi(url, "GET");


  useEffect(() => {
    setUrl(location.pathname + location.search + `&page=${page}`);
  }, [location, page]);

  useEffect(() => {
    if (data)
      setPageCount(
        Array.from(
          {
            length: Math.ceil(data.countQuery / 30),
          },
          (_, i) => i + 1
        )
      );
  }, [data]);

  return (
    <div className="flex flex-col gap-4 items-center w-full px-2">
      <h1 className="text-left w-full max-w-[1440px]">
        Total de resultados: {data?.countQuery}
      </h1>
      <div className="max-w-[1440px] flex flex-wrap gap-3 w-full">
        {loading ? (
          <SearchResultSkeleton />
        ) : (
          data &&
          data?.products.map((product) => (
            <ProductCard item={product} className="w-1/4" key={product._id} />
          ))
        )}
      </div>

      <div className="w-full max-w-[1440px] justify-center gap-1 flex">
        <div
          onClick={() => page > 1 && setPage(page - 1)}
          className="px-3 py-1 cursor-pointer"
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </div>
        {pageCount.map((item, index) => {
          if (
            (page + 3 >= item && page - 3 <= item) ||
            index === 0 ||
            index === pageCount.length - 1
          ) {
            return (
              <div
                className={
                  "bg-[#9dbbae] cursor-pointer px-3 py-1 " +
                  (page === item && "!bg-white")
                }
                onClick={() => setPage(item)}
              >
                <p>{item}</p>
              </div>
            );
          } else if (index === page + 3 || index === page - 5) {
            return <div> ... </div>;
          } else {
            return null;
          }
        })}
        <div
          onClick={() => page < pageCount.length && setPage(page + 1)}
          className="px-3 py-1 cursor-pointer"
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
