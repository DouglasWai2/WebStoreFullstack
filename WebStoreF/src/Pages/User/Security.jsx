import { useState } from "react";
import EditButton from "../../components/User/EditButton";

const Security = () => {
  const [securityInfo, setSecurityInfo] = useState({
    Senha: "*************",
  });

  return (
    <div className="w-full max-w-[1000px] h-fit border-[2px] rounded-md overflow-hidden shadow-md">
      <table className="w-full bg-white">
        <tbody className="w-full">
          {Object.keys(securityInfo).map((item) => {
            return (
              <tr
                key={item}
                className="flex rounded-lg border-b-[1px] p-10 w-full max-sm:flex-col max-sm:px-0"
              >
                <th className="flex w-[20%] max-sm:w-full max-sm:justify-center">
                  {item}:
                </th>
                <td className="w-full flex justify-between max-sm:justify-normal max-sm:gap-3 max-sm:items-center max-sm:flex-col">
                  <span className="ml-5 max-sm:ml-0">{securityInfo[item]}</span>
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
