import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Rating as Star } from "react-simple-star-rating";
import { useFetchApi } from "../hooks/useFetchApi";
import LoadingSpinner from "../components/shared/UI/LoadingSpinner";
import Logo from "../components/Store/MyStore/Logo";

const Rating = () => {
  const { store_id, order_id } = useParams();
  const [ratings, setRatings] = useState([]);
  const [storeRating, setStoreRating] = useState(0);

  const { data, loading, error } = useFetchApi(
    `/order/rate/${store_id}/${order_id}`,
    "GET"
  );

  function handleChange(e) {
    const { name, value, id } = e.target;
    const arr = ratings;
    if (arr[parseInt(id)]) {
      arr[parseInt(id)][name] = value;
    } else {
      arr[parseInt(id)] = {
        [name]: value,
      };
    }

    setRatings(arr);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="bg-white shadow rounded-lg max-w-[1440px] mx-auto px-6 py-6">
      {loading && (
        <div className="flex justify-center">
          <LoadingSpinner size="50px" />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {data && (
          <>
            {data.items[0].products.map((product, index) => (
              <div className="my-4">
                <div className="flex items-center gap-4 max-sm:flex-col">
                    <div className="flex items-center gap-3">
                  <img
                    className="w-20 h-20 object-contain"
                    src={product.product.thumbnail}
                  />
                  <p>{product.product.title}</p>
                  </div>
                  <input
                    step="0.1"
                    max={5}
                    min={0}
                    name="rating"
                    type="number"
                    hidden
                  />
                  <Star
                    allowFraction
                    value={ratings[index]?.rating || 0}
                    onClick={(rate) => {
                      handleChange({
                        target: {
                          name: "rating",
                          value: rate,
                          id: index,
                        },
                      });
                    }}
                  />
                </div>
                <textarea
                  className="w-full border-gray-300 border p-3 
                transition-color duration-200 active:brightness-95"
                  placeholder="Gostei bastante do produto, atendeu as expectativas..."
                  name="comment"
                  value={ratings[index]?.comment}
                  onChange={handleChange}
                  id={index}
                ></textarea>
              </div>
            ))}
            <div className="flex flex-col gap-4 my-4">
              <p>Avalie a loja:</p>
              <div>
                <p>{data.items[0].store.storeName}</p>
                <div className="w-20 h-20 object-contain rounded-full overflow-hidden">
                  <Logo image={data.items[0].store.storeImage} />
                </div>
              </div>
              <Star allowFraction 
                value={storeRating}
                onChange={setStoreRating}
              />
            </div>
          </>
        )}
        <button className="w-full bg-[#18a0fb] text-white font-bold py-2 rounded duration-100 hover:brightness-95" type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Rating;
