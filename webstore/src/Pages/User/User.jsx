import SideNav from "../../components/User/SideNav";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

const User = () => {
    const navigate = useNavigate()
    const { user, address, fetching, loading } = useOutletContext();


    if(!user && !loading){
      return navigate('/login')
    }

    return (
        <>
            <main className="p-10 h-full">
                <h1 className="text-3xl mb-4">Seu perfil</h1>
                <div className="flex">
                    <SideNav />
                    <div className="w-full flex justify-center px-9">
                        <Outlet context={{user, address, loading, fetching}}/>
                    </div>
                </div>
            </main>
        </>
    );
};

export default User;
