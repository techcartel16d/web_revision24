import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, toggle }) => {
    return (
        <div
            className={clsx(
                'bg-gray-800 text-white w-64 h-full fixed top-0 left-0 z-50 transition-transform transform md:translate-x-0',
                {
                    '-translate-x-full': !isOpen, // hide on mobile
                    'translate-x-0': isOpen,     // show on toggle
                }
            )}
        >
            <div className="p-5 flex justify-between items-center border-b border-gray-700">
                <span className="text-xl font-bold">My App</span>
                <button onClick={toggle} className="md:hidden">
                    <X size={24} />
                </button>
            </div>
            <nav className="p-2">
                <ul className="flex flex-col gap-5">
                    <li className="w-full">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                clsx(
                                    'block w-full px-4 py-2 rounded',
                                    {
                                        'bg-blue-600 text-white font-semibold': isActive,
                                        'hover:bg-gray-700 text-gray-300': !isActive,
                                    }
                                )
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="w-full">
                        <NavLink
                            to="/wallet"
                            className={({ isActive }) =>
                                clsx(
                                    'block w-full px-4 py-2 rounded',
                                    {
                                        'bg-blue-600 text-white font-semibold': isActive,
                                        'hover:bg-gray-700 text-gray-300': !isActive,
                                    }
                                )
                            }
                        >
                            Wallet
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;