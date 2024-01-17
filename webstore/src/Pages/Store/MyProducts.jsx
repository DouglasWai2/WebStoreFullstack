import React from 'react'
import { useFetchApi } from '../../helpers/useFetchApi'
import { useOutletContext } from 'react-router-dom';

const MyProducts = () => {
    const { user } = useOutletContext();
    useFetchApi('/api/catalog/all-products/')


  return (
    <div className='w-full h-full flex justify-center'>
        <h1 className='text-2xl'>Meus produtos</h1>
        <div></div>
    </div>
  )
}

export default MyProducts