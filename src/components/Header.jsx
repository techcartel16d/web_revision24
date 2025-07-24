import { Menu } from 'lucide-react';
import { ChevronDown, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useDispatch } from 'react-redux';
import { logoutSlice } from '../redux/authSlice';
import { useState } from 'react';
import { IoMdHome } from 'react-icons/io';

const Header = ({ toggle }) => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [logoutLoading, setLogoutLogin] = useState(false)

  const handleLogout = async () => {

    try {
      setLogoutLogin(true)
      const res = await dispatch(logoutSlice()).unwrap();
      if (res.status_code == 200) {
        nav('/login')
      } else {
        console.log("response==>", res)
      }

      setLogoutLogin(false)
    } catch (error) {
      console.log("Error in logout api", error)
      setLogoutLogin(false)
    } finally {
      setLogoutLogin(false)

    }
  }




  
  return (
    <header className="bg-white shadow-md w-full flex justify-between items-center px-4 py-3 md:px-6">
      {/* Left Section - Logo & Navigation */}
      <div className="flex items-center gap-6">
        {/* Mobile Menu Icon */}
        {/* <button onClick={toggle} className="md:hidden text-gray-700">
          <Menu size={24} />
        </button> */}

        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => nav('/')}>
          <img src="/logo.jpeg" alt="Logo" className="w-6 h-6" />
          <span className="text-sky-500 text-xl font-bold ">Revision24</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4 text-gray-600 text-sm font-medium">
          <Link to="/" className="flex items-center gap-1 hover:text-black">
            <IoMdHome />  Home 
          </Link>
        
          {/* <Link to="/test-series" >
            <span className="hover:text-black">Test Series</span>
          </Link> */}
          {/* <span className="hover:text-black">Skill Academy</span> */}
          {/* <button className="flex items-center gap-1 hover:text-black">
            Pass <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 hover:text-black">
            More <ChevronDown size={14} />
          </button> */}
        </nav>
      </div>

      {/* Right Section - Search, Translate, Button */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        {/* <div className="hidden md:flex items-center border rounded-md px-2 py-1 bg-white">
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-sm w-40 md:w-60"
          />
          <Search size={18} className="text-gray-500" />
         
        </div> */}

           <Link to="/subscription">
          <span className=" text-sm bg-amber-600 text-white p-2 rounded-sm font-bold">Revision24 Plus</span>
          </Link>

        {/* Google Translate Icon Placeholder */}
        {/* <img src="https://ssl.gstatic.com/translate/favicon.ico" alt="Translate" className="w-5 h-5 hidden md:block" /> */}

        {/* Dropdown Arrow (User/Profile/etc) */}
        {/* <ChevronDown size={18} className="text-gray-500" /> */}
        {
          isAuthenticated() && (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-md text-sm font-semibold">
              {logoutLoading ? "please waite" : " Log out"}
            </button>
          )
        }

      </div>
    </header>
  );
};

export default Header;
