import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WarningCard = ({ warning, handleClick }) => {
  return (
    <div className="bg-white flex items-center justify-center gap-3 rounded-sm border-[1px] border-yellow-500 text-yellow-500 p-4 w-full h-full">
      <FontAwesomeIcon icon={faCircleExclamation} />
      <p className="text-center">{warning}</p>
      <button onClick={handleClick} className="ml-5">
        X
      </button>
    </div>
  );
};

export default WarningCard;
