import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const StoreSection = ({ children, className, done, first, last, ...props }) => {

  return (
    <section
      {...props}
      className={"max-w-[1280px] mx-auto h-full p-4 max-sm:p-1 max-sm:py-4 "}
    >
      <div
        className={
          "shadow-md rounded-lg bg-[#fcfcfc] h-full grid place-items-center p-12 " +
          "grid-rows-1 gap-12 grid-flow-col auto-cols-auto " +
          "max-sm:grid-cols-1 max-sm:items-start max-sm:p-4 " +
          className +
          (done && " !bg-green-100/10")
        }
      >
        {!first && (
          <FontAwesomeIcon
            className="w-fit max-sm:row-start-2 max-sm:row-end-2 
            max-sm:col-start-1 justify-self-start"
            icon={faArrowLeft}
          />
        )}
        <div className="w-full">{children}</div>
        {!last && (
          <FontAwesomeIcon
            className="w-fit max-sm:row-start-2 max-sm:row-end-2 
            max-sm:col-start-1 justify-self-end"
            icon={faArrowRight}
          />
        )}
      </div>
    </section>
  );
};

export default StoreSection;
