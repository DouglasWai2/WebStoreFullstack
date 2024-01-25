import React, { useState } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { formatDate } from "../../helpers/formatDate";
import { Rating } from "react-simple-star-rating";

const Filters = ({ categories }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(formatDate(new Date()));
  const [fromRating, setFromRating] = useState(0);
  const [toRating, setToRating] = useState(5);
  const [option, setOption] = useState("");

  return (
    <div className="py-10 px-6 animate-expand flex flex-col gap-10">
      <div>
        <p className="text-lg">Data</p>
        <div className="flex gap-3">
          <label htmlFor="date_from" className="flex gap-3">
            De:
            <input
              className="mr-1"
              id="date_from"
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
              }}
            />
          </label>
          <label htmlFor="date_to" className="flex gap-3">
            à:
            <input
              className="mr-1"
              id="date_to"
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
              }}
            />
          </label>
        </div>
      </div>
      <div className="">
        <p className="text-lg">Avaliação</p>
        <div className="flex gap-4">
          <div>
            <label htmlFor="date_from" className="">
              De
            </label>
            <Rating
              onClick={(rate) => {
                setFromRating(rate);
              }}
              initialValue={fromRating}
              size={25}
              allowFraction
            />
            <input
              className="mr-1 bg-gray-200 border-b-2 border-gray-400 text-center w-[30px]"
              id="rating_from"
              type="text"
              value={fromRating}
              onChange={(e) => {
                setFromRating(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="date_to">à</label>
            <Rating
              onClick={(rate) => {
                setToRating(rate);
              }}
              initialValue={toRating}
              size={25}
              allowFraction
            />
            <input
              className="mr-1 bg-gray-200 border-b-2 border-gray-400 text-center w-[30px]"
              id="rating_to"
              type="text"
              value={toRating}
              onChange={(e) => {
                setToRating(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="">
        <p className="text-lg">Categoria</p>

        <select
          className="min-w-[250px]"
          id="categories"
          value={option}
          onChange={(e) => {
            setOption(e.target.value);
          }}
        >
          <option value="">Selecione uma opção</option>
          {categories &&
            categories.map((item, index) => {
              return (
                <option key={item + "-" + index} value={item}>
                  {item}
                </option>
              );
            })}
        </select>
      </div>
      <div className="text-right px-6">
        <button>Aplicar filtros</button>
      </div>
    </div>
  );
};

export default Filters;
