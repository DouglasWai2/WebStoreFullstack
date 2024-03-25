import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const ErrorCard = ({invalid, handleClick}) => {
  return (
    <div className="bg-white flex items-center justify-center gap-3 rounded-sm border-[1px] border-red-500 text-red-500 p-4 w-full h-full">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <p className='text-center'>{invalid}</p>
          <button onClick={handleClick} className="ml-5">X</button>
    </div>
  )
}

export default ErrorCard