import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rating as Star } from "react-simple-star-rating";
import { useFetchApi } from "../hooks/useFetchApi";
import LoadingSpinner from "../components/shared/UI/LoadingSpinner";
import Logo from "../components/Store/MyStore/Logo";
import FormInput from "../components/Store/NewProduct/FormInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Rating = () => {
  const navigate = useNavigate();
  const { store_id, order_id } = useParams();
  const [ratings, setRatings] = useState([]);
  const [storeRating, setStoreRating] = useState();
  const [body, setBody] = useState(null);

  const { data, loading, error } = useFetchApi(
    `/order/rate/${store_id}/${order_id}`,
    "GET"
  );
  const {
    data: rate,
    loading: submiting,
    error: rateError,
    refresh,
  } = useFetchApi("/rating", "POST", body);

  useEffect(() => {
    if (rate) {
      setTimeout(() => {
        navigate(-1, { replace: true });
      }, 2000);
    }
  }, [rate]);

  function handleChange(e) {
    const { name, value, id } = e.target;
    const arr = ratings;
    if (arr[parseInt(id)]) {
      arr[parseInt(id)][name] = value;
    } else {
      arr[parseInt(id)] = {
        product: data.items[0].products[parseInt(id)].product._id,
        [name]: value,
      };
    }

    setRatings(arr);
  }

  function handleSubmit(e) {
    e.preventDefault();

    setBody({
      ratings,
      storeRating,
      storeId: data.items[0].store._id,
      orderId: data._id,
    });
    if (rateError) refresh();
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
              <div className="my-4" key={index}>
                <div className="flex items-center gap-4 max-sm:flex-col">
                  <div className="flex items-center gap-3 my-4">
                    <img
                      className="w-20 h-20 object-contain"
                      src={product.product.thumbnail}
                    />
                    <p>{product.product.title}</p>
                  </div>
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
                <FormInput
                  name="title"
                  id={index}
                  label="Título"
                  value={ratings[index]?.title}
                  handleChange={handleChange}
                  type="text"
                />
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
              <Star
                allowFraction
                value={storeRating || 0}
                fillColor="#188fa7"
                onClick={(rate) => setStoreRating(rate)}
              />
            </div>
          </>
        )}
        <button
          disabled={submiting}
          className={
            "w-full flex items-center justify-center px-4 text-white font-bold py-2 rounded transition-height  duration-200 hover:brightness-95 " +
            (rate ? "bg-green-500 h-24" : "bg-[#18a0fb] h-10")
          }
          type="submit"
        >
          {submiting ? (
            <LoadingSpinner color="white" />
          ) : rate ? (
            <>
              <FontAwesomeIcon className="mr-2" icon={faCircleCheck} />{" "}
              Avaliação enviada com sucesso. Obrigado por avaliar!
              Redirecionando...
            </>
          ) : (
            "Enviar"
          )}
        </button>
      </form>
    </div>
  );
};

export default Rating;
