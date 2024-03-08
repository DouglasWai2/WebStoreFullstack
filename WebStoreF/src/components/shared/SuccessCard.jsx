import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const SuccessCard = ({success, handleClick}) => {
  return (
    <div className="bg-white flex items-center justify-center gap-3 rounded-sm border-[1px] border-green-500 text-green-500 p-4 w-full h-full">
    <FontAwesomeIcon icon={faCircleCheck} style={{color: "#22c55e"}} />
    {success}
    <button onClick={handleClick} className="ml-5">X</button>
</div>
)
  
}

export default SuccessCard