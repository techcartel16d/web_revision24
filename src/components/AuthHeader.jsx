

import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useDispatch } from 'react-redux';
import { logoutSlice } from '../redux/authSlice';
import { useEffect, useState } from 'react';
import { IoMdHome } from 'react-icons/io';
import { clearUserData } from '../helpers/userStorage';
import { MdDashboard } from 'react-icons/md';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';

const AuthHeader = () => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [auth, setAuth] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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
            showErrorToast(res.message)
        } finally {
            setLogoutLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated();
            setAuth(result);
        };
        checkAuth();
    }, []);

    return (
        <header className="bg-white shadow-md w-full px-4 py-3 md:px-6  relative">
            <div className="flex justify-between items-center">
                {/* Left Side: Logo + Nav */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700">
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => nav('/')}>
                        <img src="/logo.jpeg" alt="Logo" className="w-6 h-6" />
                        <span className="text-sky-500 text-xs md:text-sm lg:text-xl font-bold">Revision24</span>

                    </div>

                    {/* Desktop Nav */}
                    {auth && (
                        <div className="hidden md:flex gap-4 items-center text-gray-700 font-medium ml-6">
                            <Link to="/" className="hover:text-sky-600">Home</Link>
                            <Link to="/user-dashboard" className="hover:text-sky-600"> User Dashboard</Link>

                        </div>
                    )}
                </div>

                {/* Right Side: Subscription + Buttons */}
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    <Link to="/subscription">
                        <img
                            src="/plain-icon.png"
                            alt="icon"
                            className="h-8 sm:h-10 md:h-14 object-cover"
                        />
                    </Link>

                    {auth ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold"
                        >
                            {logoutLoading ? 'Please wait' : 'Log out'}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => nav('/login')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => nav('/register')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Nav (Visible only in mobile) */}
            {menuOpen && (
                <nav className="block md:hidden mt-4 bg-white shadow rounded-md py-4 px-6 space-y-3 text-gray-700 text-base font-medium animate-slide-in">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                        <IoMdHome /> Home
                    </Link>
                    {auth && (
                        <Link className='flex items-center gap-2' to="/user-dashboard" onClick={() => setMenuOpen(false)}>
                            <MdDashboard /> User Dashboard
                        </Link>
                    )}
                </nav>
            )}


        </header>
    );
};

export default AuthHeader;
