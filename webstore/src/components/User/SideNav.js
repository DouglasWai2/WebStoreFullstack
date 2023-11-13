import { NavLink } from "react-router-dom";

const SideNav = () => {
  return (
    <aside>
      <ul className="flex flex-col gap-4 text-lg w-full">
        <NavLink
          className={({ isActive }) => (isActive ? "active-li" : "unactive-li")}
          to="profile"
        >
          Dados pessoais
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-li" : "unactive-li")}
          to="security"
        >
          Segurança
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-li" : "unactive-li")}
          to="address"
        >
          Endereços
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-li" : "unactive-li")}
          to="payment-methods"
        >
          Formas de pagamento
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-li" : "unactive-li")}
          to="your-purchases"
        >
          Seus pedidos
        </NavLink>
      </ul>
    </aside>
  );
};

export default SideNav;
