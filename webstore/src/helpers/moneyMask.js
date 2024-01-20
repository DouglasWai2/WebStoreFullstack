export const moneyMask = (value) => {
  let newValue = value;
  if (typeof value === "number") newValue = value.toString();
  if (!newValue.split(".")[1]) newValue += "00";
//   if (newValue.split(".")[1].length === 1) newValue += "0";
  newValue = newValue.replace(".", "").replace(",", "").replace(/\D/g, "");

  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat("pt-BR", options).format(
    parseFloat(newValue) / 100
  );

  if (result === "NaN") {
    return "R$ 0,00";
  }

  return "R$ " + result;
};
