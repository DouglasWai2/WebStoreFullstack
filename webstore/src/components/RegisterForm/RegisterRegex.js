import { useEffect, useState } from "react";
import AttributeRegex from "./AttributeRegex";

const RegisterRegex = ({ password }) => {
  const passwordStrength = [
    {
      attribute: "A senha deve conter pelo menos 8 caracteres",
      regex: "(?=.{8,})",
    },
    {
      attribute: "A senha deve conter pelo menos uma letra maiúscula (A-Z)",
      regex: "(?=.*[A-Z])",
    },
    {
      attribute: "A senha deve conter pelo menos uma letra minúscula (a-z)",
      regex: "(?=.*[a-z])",
    },
    {
      attribute: "A senha deve conter pelo menos um dígito (0-9)",
      regex: "(?=.*[0-9])",
    },
    {
      attribute:
        "A senha deve conter pelo menos um caractere especial (@,#,/...)",
      regex: "(?=.*[^A-Za-z0-9])",
    },
  ];

  return (
    <ul>
      {passwordStrength.map((element) => {
        return (
          <AttributeRegex
            password={password}
            regex={element.regex}
            text={element.attribute}
          />
        );
      })}
    </ul>
  );
};

export default RegisterRegex;
