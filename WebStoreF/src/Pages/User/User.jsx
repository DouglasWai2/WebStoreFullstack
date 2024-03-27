import UserNav from "../../components/User/UserNav";
import { Outlet, useOutletContext } from "react-router-dom";

const User = () => {
    const { user, address, fetching, loading, refreshUser } = useOutletContext();

    return (
        <>
            <div className="p-10 h-full max-sm:px-4">
                <h1 className="text-3xl mb-4">Seu perfil</h1>
                <div className="flex gap-3 max-md:flex-col">
                    <UserNav />
                    <div className="w-full h-full flex justify-center max-md:px-2 max-md:py-9">
                        <Outlet context={{user, address, loading, fetching, refreshUser}}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
