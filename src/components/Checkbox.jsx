import React from 'react';
import { Link } from 'react-router-dom';

const Checkbox = ({ id, label, checked, onChange, disabled = false, links = [] }) => {
    return (
        <label
            htmlFor={id}
            className={`flex items-center gap-2 cursor-pointer  ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 "
            />
            <span className="text-sm text-gray-700  flex gap-1">

                {label}
                {
                    links.length > 0 && (
                        links.map((item, i) => {
                            return (
                                <Link className='text-blue-600' key={i} to={item.link}>{item.link_name}</Link>
                            )
                        }
                        )
                    )
                }
            </span>
        </label>
    );
};

export default Checkbox;
