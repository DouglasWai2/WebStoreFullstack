import React from 'react'

const NewProduct = () => {
  return (
    <main>
        <label for='title'>Título
            <input name='title' type='text'/>
        </label>
        <label for='description'>Descrição do produto
            <input name='description' type='text'/>
        </label>
        <label for='features'>Características
            <input name='features' type='text'/>
        </label>
        <label for='features'>Imagens
            <input name='features' type='text'/>
        </label>
    </main>
  )
}

export default NewProduct