import { useState } from "react";
import Navbar from "../components/Navbar/index";
import PersonalData from "../components/ProfilePage/PersonalData";
import Security from "../components/ProfilePage/Security";
import Address from "../components/ProfilePage/Address";
import PaymentMethods from "../components/ProfilePage/PaymentMethods";
import YourPurchases from "../components/ProfilePage/YourPurchases";
import AddressForm from "../components/ProfilePage/AddressForm";

const ProfilePage = () => {
  const isVerified = window.localStorage.getItem("verified");
  const [currentPage, setCurrentPage] = useState('Personal Data');
  const [form, setForm] = useState(false)
  const handleClick = () => {
    setForm(true)
  }

  return (
    <>
      <header>
        <Navbar />
        {isVerified === "false" ? (
          <h3 className="text-xl font-bold bg-red-100">
            Enviamos um link de verificação para seu e-mail. Por favor verifique
            sua caixa de entrada.
          </h3>
        ) : (
          ""
        )}
      </header>
      <main className="p-10">
        <h1 className="text-3xl mb-4">Seu perfil</h1>
        <div className="flex">
          <ul onClick={()=> {setForm(false)}} className="flex flex-col gap-4 text-lg w-1/4">
            <li
              onClick={() => setCurrentPage("Personal Data")}
              className={
                currentPage === "Personal Data" ? "active-li" : "unactive-li"
              }
            >
              Dados pessoais
            </li>
            <li
              onClick={() => setCurrentPage("Security")}
              className={
                currentPage === "Security" ? "active-li" : "unactive-li"
              }
            >
              Segurança
            </li>
            <li
              onClick={() => setCurrentPage("Address")}
              className={
                currentPage === "Address" ? "active-li" : "unactive-li"
              }
            >
              Endereços
            </li>
            <li
              onClick={() => setCurrentPage("Payment Methods")}
              className={
                currentPage === "Payment Methods" ? "active-li" : "unactive-li"
              }
            >
              Formas de pagamento
            </li>
            <li
              onClick={() => setCurrentPage("Your Purchases")}
              className={
                currentPage === "Your Purchases" ? "active-li" : "unactive-li"
              }
            >
              Seus pedidos
            </li>
          </ul>
          <div className="w-full flex justify-center px-9">
            {currentPage === "Personal Data" ? (
              <PersonalData />
            ) : currentPage === "Security" ? (
              <Security />
            ) : currentPage === "Address" ? ( form ? <AddressForm /> :
              <Address handleClick={handleClick} />
            ) : currentPage === "Payment Methods" ? (
              <PaymentMethods />
            ) : currentPage === "Your Purchases" ? (
              <YourPurchases />
            ) : (
              ""
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
