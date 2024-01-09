export function formatPhoneNumber(numero) {
  if (!numero) return "";
  if (typeof numero !== "string") return;
  numero = numero.replace(/\D/g, "");
  numero = numero.replace(/(\d{2})(\d)/, "($1)$2");
  numero = numero.replace(/(\d{5})(\d)/, "$1-$2");
  return numero;
}
