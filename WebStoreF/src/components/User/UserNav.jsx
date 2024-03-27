import { NavLink } from "react-router-dom";

const UserNav = () => {
  return (
    <aside className="">
      <ul className="flex flex-col bg-white shadow rounded-lg py-8 px-6 gap-4 text-lg w-full 
      overflow-y-hidden h-max max-md:flex-row">

          <NavLink
            className={({ isActive }) =>
              isActive ? "active-li" : "unactive-li"
            }
            to="profile"
          >
            Dados pessoais
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "active-li" : "unactive-li"
            }
            to="security"
          >
            Segurança
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "active-li" : "unactive-li"
            }
            to="address"
          >
            Endereços
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "active-li" : "unactive-li"
            }
            to="payment-methods"
          >
            Formas de pagamento
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "active-li" : "unactive-li"
            }
            to="your-orders"
          >
            Seus pedidos
          </NavLink>
      </ul>
    </aside>
  );
};

export default UserNav;
