import Navbar from "../components/Navbar/index";
import PersonalData from "../components/ProfilePage/PersonalData";

const ProfilePage = () => {
  const isVerified = window.localStorage.getItem("verified");

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
            <ul className="flex flex-col gap-4 text-lg max-w-sm">
                <li className="border-b-[1px] border-black">
                    Dados pessoais
                </li>
                <li className="border-b-[1px] border-black">
                    Segurança
                </li>
                <li className="border-b-[1px] border-black">
                    Endereços
                </li>
                <li className="border-b-[1px] border-black">
                    Formas de pagamento
                </li>
                <li className="border-b-[1px] border-black">
                    Seus pedidos
                </li>
            </ul>
            <div className="w-full flex justify-center px-9">
            <PersonalData />
            </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
