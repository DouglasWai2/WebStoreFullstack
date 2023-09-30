const LoginCard = () => {
  return (
    <div className="bg-white text-black absolute bottom-[-110px] left-[-160px] w-[300px] p-6 flex flex-col gap-2 items-center">
      <a href="/login" className="bg-yellow-400 w-[100%] cursor-pointer text-center hover:bg-yellow-600 transition-colors duration-200">
        Faça login
      </a>
      <p className="text-sm text-blue-600 cursor-pointer hover:underline">
        Não possui conta? Cadastre-se
      </p>
    </div>
  );
};

export default LoginCard;
