import Navbar from "../../components/Navbar";
import SideNav from "../../components/User/SideNav";
import { Outlet } from "react-router-dom";

const User = () => {
    return (
        <>
            <Navbar />
            <main className="p-10 h-full">
                <h1 className="text-3xl mb-4">Seu perfil</h1>
                <div className="flex">
                    <SideNav />
                    <div className="w-full flex justify-center px-9">
                        <Outlet />
                    </div>
                </div>
            </main>
        </>
    );
};

export default User;
