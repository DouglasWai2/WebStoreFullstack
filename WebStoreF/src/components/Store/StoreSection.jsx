import React from "react";

const StoreSection = ({ children, className }) => {
  return (
    <section className={"w-full h-full flex items-center justify-center " + className}>
      <div className="shadow w-fit px-5">{children}</div>
    </section>
  );
};

export default StoreSection;
