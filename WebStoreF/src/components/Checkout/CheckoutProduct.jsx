import { moneyMask } from "../../helpers/moneyMask";

const CheckoutProduct = ({
  price,
  discount,
  title,
  thumbnail,
  quantity,
  index,
}) => {
  return (
    <div
      key={index}
      className="flex justify-between items-center border-b-[1px] border-gray-300 text-sm py-2 mx-1"
    >
      <div className="flex gap-3 items-center">
        <div className="h-[80px] w-[80px] object-contain flex justify-center flex-shrink-0">
          <img className="h-full object-contain" src={thumbnail} />
        </div>
        <div className="line-clamp-3">{title}</div>
      </div>
      <div className="w-max flex justify-self-end">
        <div className="mx-2 w-max">{quantity}x</div>
        <div>
          {discount > 0 && (
            <p className="strikethrough mr-2 text-nowrap h-min text-xs">
              {moneyMask(price)}
            </p>
          )}
          <p className="text-nowrap">
            {moneyMask((price - price * discount).toFixed(2))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
