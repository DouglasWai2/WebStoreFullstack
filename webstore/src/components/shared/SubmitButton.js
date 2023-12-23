import React, { useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

const SubmitButton = ({loading, text, onClick}) => {

    useEffect(() => {
        console.log(loading)

    }, [])
  return (
    <button
    onClick={onClick}
    className={"button-login flex justify-center items-center" + (loading && ' brightness-75')} type="submit">
            {loading ? <LoadingSpinner /> : text}
          </button>
  )
}

export default SubmitButton