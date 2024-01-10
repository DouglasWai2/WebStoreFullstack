import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ErrorCard = ({invalid, handleClick}) => {
  return (
    <div className="bg-white rounded-sm border-[1px] border-red-500 text-red-500 p-4 w-full h-full">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {invalid}
          <button onClick={handleClick} className="ml-5">X</button>
    </div>
  )
}

export default ErrorCard