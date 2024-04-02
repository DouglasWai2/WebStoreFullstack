import { orderStatus } from "../../../helpers/OrderDictionary";
const TableData = ({ children, th }) => {
  return (
    <td
      className={`group-hover:underline relative group-hover:text-cyan-700 py-2
     after:hidden max-sm:[&:not(:last-of-type)]:after:block after:absolute after:left-0 after:w-full after:h-[1px] after:bg-gray-200 after:bottom-0
      before:hidden max-sm:before:block max-sm:pl-16 max-sm:text-right before:absolute before:left-0 before:content-['${th}']`}
    >
      {children}
    </td>
  );
};

const StoreOrder = ({ item, onClick }) => {
  return (
    <tr
      onClick={() => {
        onClick(`/store/my-store/orders/${item._id}`);
      }}
      className="border-b p-2 border-gray-200 even:bg-gray-100 group cursor-pointer 
      max-sm:shadow max-sm:rounded-lg max-sm:my-1 max-sm:flex max-sm:flex-col max-sm:border max-sm:border-gray-200"
    >
      <TableData th={"ID"}>#{item.order_number}</TableData>
      <TableData th={"Resumo"}>
        {" "}
        {item.items.map((item) =>
          item.products.map((product, i) => (
            <p
              key={i}
              className="line-clamp-1 sm:text-left group-hover:underline group-hover:text-cyan-700"
            >
              {product.quantity} x {product.product.title}
            </p>
          ))
        )}
      </TableData>
      <TableData th={"Usuário"}>
        <p className="line-clamp-1">{item.user.email}</p>
      </TableData>
      <TableData th={"Status"}>
        <span
          className={
            item.items[0].shipment_status
              ? orderStatus[item.items[0].shipment_status].color
              : orderStatus[item.status].color
          }
        >
          {item.items[0].shipment_status
            ? orderStatus[item.items[0].shipment_status].text
            : orderStatus[item.status].text}
        </span>
      </TableData>
      <TableData th={"Data"}>
        {new Date(item.createdAt).toLocaleDateString()}
      </TableData>
    </tr>
  );
};

export default StoreOrder;
