const LoggedIn = () => {
    function logOut(){
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('name')
        window.localStorage.setItem('LoggedIn', false)
        window.location.reload()
    }

    return(
        <div className="bg-white text-black absolute bottom-[-110px] left-[-160px] w-[300px] p-6 flex flex-col gap-2 items-center">
            <a href="/login" className="text-sm text-blue-600 cursor-pointer hover:underline">
                Meu cadastro
            </a>
            <a onClick={logOut}><p className="text-sm text-blue-600 cursor-pointer hover:underline">
                Sair
            </p></a>
      </div>
    )
}

export default LoggedIn