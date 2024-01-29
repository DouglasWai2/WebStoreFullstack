import SideNav from "../../components/User/SideNav";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

const User = () => {
    const navigate = useNavigate()
    const { user, address, fetching, loading } = useOutletContext();

    return (
        <>
            <div className="p-10 h-full">
                <h1 className="text-3xl mb-4">Seu perfil</h1>
                <div className="flex">
                    <SideNav />
                    <div className="w-full flex justify-center px-9">
                        <Outlet context={{user, address, loading, fetching}}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
