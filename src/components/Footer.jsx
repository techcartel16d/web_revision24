import React from "react";
import { FaFacebookSquare, FaInstagram, FaTelegram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-700 py-10">
      <div className="container mx-auto px-4">

        {/* Contact Boxes */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">

          {/* Phone Box */}
          <a href="tel:+917822936229" className="w-full md:w-1/3">
            <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-md transition hover:scale-105">
              <img
                src="https://revision24.com/website/images/phone.png"
                alt="Phone"
                className="w-12 h-12"
              />
              <div>
                <h5 className="text-lg font-semibold text-gray-800">Any query call us</h5>
                <p className="text-base text-gray-700">+91 78229-36229</p>
              </div>
            </div>
          </a>

          {/* Email Box */}
          <a href="mailto:revision24@yahoo.com" className="w-full md:w-1/3">
            <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-md transition hover:scale-105">
              <img
                src="https://revision24.com/website/images/email.png"
                alt="Email"
                className="w-12 h-12"
              />
              <div>
                <h5 className="text-lg font-semibold text-gray-800">Any suggestion mail us</h5>
                <p className="text-base text-gray-700">revision24@yahoo.com</p>
              </div>
            </div>
          </a>

          {/* Social Media Icons */}
          <div className="w-full md:w-1/3">
            <div className="bg-blue-600 rounded-xl p-4 flex justify-around items-center h-full">
              <a href="https://www.facebook.com/revision24official/" target="_blank" rel="noopener noreferrer">
                <FaFacebookSquare className="text-white text-3xl" />
              </a>
              <a href="https://www.youtube.com/@revision24official" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="text-white text-3xl" />
              </a>
              <a href="https://www.instagram.com/revision24official" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-white text-3xl" />
              </a>
              <a href="https://t.me/revision24official" target="_blank" rel="noopener noreferrer">
                <FaTelegram className="text-white text-3xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-white mb-6" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white text-sm">
          <div className="mb-2 md:mb-0">
            &copy; 2024-2025 Revision24. All Rights Reserved.
          </div>
          <ul className="flex gap-4">
            <li>
              <Link to="/about" className="hover:underline">About Us</Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:underline">Terms & Conditions</Link>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            </li>
            <li>
              <a href="/refund-policy" className="hover:underline">Refund Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
