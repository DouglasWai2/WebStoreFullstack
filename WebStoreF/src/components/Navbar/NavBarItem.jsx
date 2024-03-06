import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBarItem = ({to, icon, text, onClick}) => {
  return (
    <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => (isActive ? "group actived" : "")}
  >
    <p className="px-2 border-b-[1px] mx-2 py-4 rounded-md animate-appear sidenav">
      <FontAwesomeIcon className="mr-2" icon={icon} />
      <span className='' >{text}</span>
    </p>
  </NavLink>
  )
}

export default NavBarItem