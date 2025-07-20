import { Menu } from 'lucide-react';
import { ChevronDown, Search } from 'lucide-react';

const Header = ({ toggle }) => {
  return (
    <header className="bg-white shadow-md w-full flex justify-between items-center px-4 py-3 md:px-6">
      {/* Left Section - Logo & Navigation */}
      <div className="flex items-center gap-6">
        {/* Mobile Menu Icon */}
        <button onClick={toggle} className="md:hidden text-gray-700">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="w-6 h-6" />
          <span className="text-sky-500 text-xl font-bold">Revision24</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4 text-gray-600 text-sm font-medium">
          <button className="flex items-center gap-1 hover:text-black">
            Exams <ChevronDown size={14} />
          </button>
          <span className="hover:text-black">SuperCoaching</span>
          <span className="hover:text-black">Test Series</span>
          <span className="hover:text-black">Skill Academy</span>
          <button className="flex items-center gap-1 hover:text-black">
            Pass <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 hover:text-black">
            More <ChevronDown size={14} />
          </button>
        </nav>
      </div>

      {/* Right Section - Search, Translate, Button */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center border rounded-md px-2 py-1 bg-white">
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-sm w-40 md:w-60"
          />
          <Search size={18} className="text-gray-500" />
        </div>

        {/* Google Translate Icon Placeholder */}
        <img src="https://ssl.gstatic.com/translate/favicon.ico" alt="Translate" className="w-5 h-5 hidden md:block" />

        {/* Dropdown Arrow (User/Profile/etc) */}
        <ChevronDown size={18} className="text-gray-500" />

        {/* Get Started Button */}
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
