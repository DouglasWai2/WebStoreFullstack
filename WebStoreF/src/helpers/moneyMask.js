export const moneyMask = (value) => {
  let newValue = value;
  const addZeroes = (num) =>
    Number(num).toFixed(Math.max(num.split(".")[1]?.length, 2) || 2);

  if (typeof value === "number") {
    newValue = addZeroes(String(value));
  }

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
