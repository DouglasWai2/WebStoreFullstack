export const moneyMask = (value) => {

    value = value.replace('.', '').replace(',', '').replace(/\D/g, '')

    const options = { minimumFractionDigits: 2 }
    const result = new Intl.NumberFormat('pt-BR', options).format(
        parseFloat(value) / 100
    )


    if (result === 'NaN') {
        return 'R$ 0,00'
    }

    return 'R$ ' + result
}