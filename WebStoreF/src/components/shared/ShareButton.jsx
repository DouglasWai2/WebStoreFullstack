import { faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import generateUrl from '../../helpers/generateUrl'

const ShareButton = ({storeName, storeId}) => {
  return (
    <div
    className="rounded-full w-[30px] h-[30px] cursor-pointer text-gray-400 
   grid justify-center items-center bg-white hover:brightness-90 duration-150"
    onClick={() => generateUrl(storeName, storeId)}
  >
    <FontAwesomeIcon icon={faShareNodes} />
  </div>
  )
}

export default ShareButton