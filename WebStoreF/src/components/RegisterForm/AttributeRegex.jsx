import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <li
      key={regex}
      className={"mt-2 " + (pass ? "text-green-500" : "text-red-500")}
    >
      {pass ? (
        <FontAwesomeIcon className="mr-2" icon={faCheck} />
      ) : (
        <FontAwesomeIcon icon={faX} />
      )}{" "}
      {text}
    </li>
  );
};

export default AttributeRegex;
