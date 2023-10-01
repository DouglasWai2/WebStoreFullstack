import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import LoginCard from "./LoginCard";
import { useState } from "react";
import LoggedIn from "./LoggedIn.";

const Profile = () => {
  const [toggleCard, setToggleCard] = useState(false);
  const loggedIn = window.localStorage.getItem('LoggedIn')
  const name = window.localStorage.getItem('name')

  return (
    <div className="flex items-center gap-1 relative p-2 hover-border">
      <div
        onClick={() => {
          setToggleCard(!toggleCard);
        }}
        className="flex items-center gap-1 cursor-pointer"
      >
        <img />
        {loggedIn === 'true' ? <p>Olá, {name}</p> : <p>Olá, faça login</p>}      
        <FontAwesomeIcon icon={faCaretDown} style={{ color: "#94989e" }} />
      </div>
      {toggleCard && loggedIn === 'false' ? 
      <LoginCard /> : toggleCard && loggedIn === 'true' ? <LoggedIn /> : ''}
    </div>
  );
};

export default Profile;
