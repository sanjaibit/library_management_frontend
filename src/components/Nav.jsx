import CardNav from './CardNav'
import Logo from '../assets/book.png'
import { useAuth } from '../auth/AuthContext'
import { href } from 'react-router-dom';

const Nav = () => {
  const {user,logout}=useAuth();
  const items = [
    {
      label: "Library",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Home", ariaLabel: "Hpme page",href:"/" },
        { label: "Books", ariaLabel: "Explore Books", href:"/explore" }
      ]
    },
    
    {
      label: "Profile",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "User info", ariaLabel: "Info",href:"/profile" },
        { label: "Log out", ariaLabel: "Log out",func:()=>{logout(); Navigate("/login")} }
      ]
    }
  ];

  return (
    <CardNav
      logo={Logo}
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
      user = {user}
    />
  );
};

export default Nav;