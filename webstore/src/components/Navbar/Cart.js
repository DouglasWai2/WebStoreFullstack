import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Cart = () => {
    return(
        <div className="cursor-pointer p-2 hover-border">Seu carrinho <FontAwesomeIcon icon={faCartShopping} style={{color: "#94989e"}}/></div>
    )
}

export default Cart