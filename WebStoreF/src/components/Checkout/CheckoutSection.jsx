const CheckoutSection = ({ children, index, store }) => {
  return (
    <div
      className="shadow-md py-4 px-2 rounded-lg bg-[#fcfcfc] 
      border-b-[1px] border-[#152128] text-sm lg:px-6"
      key={index}
    >
      {store && <div>Vendido por: {store}</div>}
      {children}
    </div>
  );
};

export default CheckoutSection;
