import { useState } from "react";
import EditButton from "../../components/User/EditButton";

const Security = () => {
  const [securityInfo, setSecurityInfo] = useState({
    Senha: "*************",
  });

  return (
    <div className="w-[80%] h-fit border-[2px] rounded-md overflow-hidden shadow-md">
      <table className="w-full">
        <tbody className="w-full">
          {Object.keys(securityInfo).map((item) => {
            return (
              <tr key={item} className="flex border-b-[1px] p-10 w-full">
                <th className="flex w-[20%]">{item}:</th>
                <td className="w-full flex justify-between">
                  <span className="ml-5">{securityInfo[item]}</span>
                  <EditButton />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Security;
