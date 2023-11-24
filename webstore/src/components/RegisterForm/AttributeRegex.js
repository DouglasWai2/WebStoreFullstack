import { useEffect, useState } from "react";

const AttributeRegex = ({ text, regex, password }) => {
  const [pass, setPass] = useState(regex);

  useEffect(() => {
    const regexAttribute = new RegExp(regex);
    if (regexAttribute.test(password)) {
      setPass(true);
    } else {
      setPass(false);
    }
  }, [password]);

  return (
    <li key={regex} className={pass ? "text-green-500" : "text-red-500"}>
      {text}
    </li>
  );
};

export default AttributeRegex;
