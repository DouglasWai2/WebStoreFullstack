export function formatPhoneNumber(numero) {
  var telefoneFormatado;
    telefoneFormatado =
      "(" +
      numero.substring(0, 2) +
      ")" +
      numero.substring(2, 7) +
      "-" +
      numero.substring(7, 11);
    return telefoneFormatado;
}
