export const CEPMask = (value) => {

  if (!value) return "";
  if (typeof value !== "string") return;
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value;
};
