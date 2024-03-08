import { NavLink } from "react-router-dom";

const SideNav = () => {
  return (
    <aside className="">
      <ul className="flex flex-col gap-4 text-lg w-full border-r-2 border-gray-200 
      overflow-y-hidden h-max max-md:flex-row max-md:border-r-0 max-md:border-b-2">

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
            to="your-purchases"
          >
            Seus pedidos
          </NavLink>
      </ul>
    </aside>
  );
};

export default SideNav;
