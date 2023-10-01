import Address from './Address'
import SearchBar from './SearchBar'
import Profile from './Profile'
import Cart from './Cart'
import Logo from '../../logo-no-background.svg'
import { UseSelector } from 'react-redux'

const Navbar =  () => {
    return(
        <div className="w-full h-[9vh] bg-[#152128] py-2 px-4 flex items-center gap-12 text-white">
            <img className='h-[40px]' alt='logo' src={Logo} />       
            <Address />
            <SearchBar />
            <Profile />
            <Cart />
        </div>
    )
}

export default Navbar