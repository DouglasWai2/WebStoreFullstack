import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import LoginCard from "./LoginCard";
import { useState } from "react";

const Profile = () => {
  const [toggleCard, setToggleCard] = useState(false);

  return (
    <div className="flex items-center gap-1 relative p-2 hover-border">
      <div
        onClick={() => {
          setToggleCard(!toggleCard);
        }}
        className="flex items-center gap-1 cursor-pointer"
      >
        <img />
        <p>Olá, faça login</p>
        <FontAwesomeIcon icon={faCaretDown} style={{ color: "#94989e" }} />
      </div>
      {toggleCard ? <LoginCard /> : ""}
    </div>
  );
};

export default Profile;
