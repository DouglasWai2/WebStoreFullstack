import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = () => {
  return (
    <div className="w-[50%] rounded-md overflow-hidden h-9 flex">
      <input className="w-full" />
      <button className="w-[40px] h-full bg-orange-300 hover:bg-orange-400 transition-colors duration-200">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          style={{ color: "#152128" }}
        />
      </button>
    </div>
  );
};

export default SearchBar;
