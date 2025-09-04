import { Link, NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  GraduationCap,
  Calendar,
  FileText,
  RefreshCcw,
  HelpCircle,
  CheckCircle,
  Award,
  Calculator,
  User2,
  BadgeIndianRupee,
  LucideSave,
  HelpCircleIcon,
  Settings,
  X,
  Menu,
  Home
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { clearUserData } from '../helpers/userStorage';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
import { logoutSlice } from '../redux/authSlice';
import { sidebarToggle } from '../redux/globleSlice';

const Sidebar = () => {
  const nav = useNavigate()
  const { isSideBar } = useSelector((state) => state.toggleSlice);
  const dispatch = useDispatch()
  const [lougoutLoading, setLogoutLoading] = useState(false)
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const res = await dispatch(logoutSlice()).unwrap();
      await clearUserData();
      nav('/login');
      showSuccessToast(res.message)
    } catch (error) {
      await clearUserData();
      nav('/login');
      showErrorToast(error.message)
    } finally {
      setLogoutLoading(false);
    }
  };

  const menu = [
    {
      section: '',
      items: [
        { name: 'Home', icon: <Home size={18} />, path: '/' },
        // { name: 'Skill Academy', icon: <GraduationCap size={18} />, path: '/skill-academy' },
      ],
    },
    {
      section: 'LEARN',
      items: [
        // { name: 'Calculation Booster', icon: <Calculator size={18} />, path: '#' },
        { name: 'Live Classes', icon: <Calendar size={18} />, path: '/live-classes', badge: 'FREE' },
        // { name: 'Skill Academy', icon: <GraduationCap size={18} />, path: '/skill-academy' },
      ],
    },
    {
      section: 'TESTS',
      items: [
        { name: 'Test Series', icon: <FileText size={18} />, path: '/test-series' },
        { name: 'Live Tests & Quizzes', icon: <Calendar size={18} />, path: '/live-quiz-test' },
        { name: 'Previous Year Papers', icon: <FileText size={18} />, path: '/previous-papers' },
        { name: 'Practice', icon: <RefreshCcw size={18} />, path: '/practice', badge:'FREE' },
        { name: 'Free Quizzes', icon: <HelpCircle size={18} />, path: '/free-quizzes', badge: 'NEW' },
        { name: 'Attempted Tests', icon: <CheckCircle size={18} />, path: '/attempted-tests' },
        { name: 'Focus+', icon: <Award size={18} />, path: '/subscription', badge: 'NEW' },
        { name: 'Exams Blog', icon: <FileText size={18} />, path: '/blog' },
        // { name: 'Exams', icon: <FileText size={18} />, path: '/exams' },
        // { name: 'Pass Pro', icon: <Award size={18} />, path: '/pass-pro' },
        // { name: 'Pass Elite', icon: <Award size={18} />, path: '/pass-elite' },
        // { name: 'Rank Predictor', icon: <Award size={18} />, path: '/rank-predictor', badge: 'NEW' },
      ],
    },
    {
      section: 'MISCELLANEOUS',
      items: [
        { name: 'My Profile', icon: <User2 size={18} />, path: '/user-dashboard' },
        { name: 'My Transactions', icon: <BadgeIndianRupee size={18} />, path: '/my-transaction' },
        { name: 'My Saved Items', icon: <LucideSave size={18} />, path: '/saved-items' },
        { name: 'Support', icon: <HelpCircleIcon size={18} />, path: '/help-support' },
        { name: 'Setting', icon: <Settings size={18} />, path: '/exams' },
      ],
    },
  ];

  const toggleSidebar = () => {
    dispatch(sidebarToggle())

  }

  return (
    <div
      className={clsx(
        "bg-slate-100 border-r-2 text-gray-300 w-80 h-screen overflow-y-auto sidebar fixed top-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 md:static",
        {
          "-translate-x-full": !isSideBar, // hide in small screen
          "translate-x-0": isSideBar,      // show in small screen
        }
      )}
    >
      <button onClick={() => {
        // setMenuOpen(!menuOpen)
        toggleSidebar()
      }} className="md:hidden text-gray-800 w-full  flex items-center justify-end p-2 cursor-pointer">
        <X size={24} />
      </button>
      <Link to={'/'}>
        <div className="p-5 flex justify-items-center items-center border-b gap-1 border-gray-700">
          <img src="/logo.jpeg" alt="Logo" className="w-8 h-8" />
          <span className="text-sky-500 text-2xl font-bold">Revision24</span>
        </div>
      </Link>

      <nav className="p-2">
        {menu.map((section) => (
          <div key={section.section}>
            <p className="text-xs text-gray-500 font-semibold px-4 mb-2">{section.section}</p>
            <ul className="flex flex-col gap-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center justify-between w-full px-4 py-2 rounded hover:text-white  hover:bg-blue-600',
                        {
                          'bg-blue-600 text-white font-semibold': isActive,
                          'text-gray-800': !isActive,
                        }
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={clsx(
                          'text-xs font-bold px-2 py-0.5 rounded-full',
                          item.badge === 'FREE'
                            ? 'bg-green-500 text-white'
                            : 'bg-orange-400 text-white'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

          </div>
        ))}
        <div className=' my-2 rounded-xl bg-red-600 flex items-center justify-center '>
          {
            lougoutLoading ? (
              <button className='cursor-pointer w-full h-9'>Please waite</button>

            ) : (

              <button className='cursor-pointer w-full h-9' onClick={handleLogout}>Logoout</button>
            )
          }
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
