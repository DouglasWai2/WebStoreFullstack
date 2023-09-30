import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Address = () => {
    return(
        <div className="flex items-center gap-2 cursor-pointer hover-border p-2">
            <FontAwesomeIcon icon={faLocationDot} style={{color: "#94989e",}}/>
            <p className="flex flex-col items-start text-[#94989e]">Olá, <span className="text-white">selecione seu endereço</span></p>
            </div>
    )
}

export default Address