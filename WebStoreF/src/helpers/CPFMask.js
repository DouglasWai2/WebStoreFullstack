export const CPFMask = (value) => {
  if (!value) return "";
  console.log(value.length)
  if (value.length > 15) return;
  if (typeof value !== "string") return ``;
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1-$2");
  return value;
};
