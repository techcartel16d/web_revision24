import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTelegram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
   <footer className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 text-gray-300 py-10 px-6  shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <img src="/logo.jpeg" alt="Revision24 Logo" className="w-16 mb-4 rounded-xl" />
            <p className="text-sm">
              Duharia Enterprises Pvt. Ltd.
              <br />
              Address: 284,03, SSB Road, Sri Ganganagar, Rajasthan, India-335001
            </p>
            <p className="mt-3 text-sm">info@revision24.com</p>
            <p className="text-sm">+91- 8306612328</p>
            {/* <p className="text-sm">Office Hours: 10 AM to 7 PM (all 7 days)</p> */}
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="https://forms.gle/u3JHMnuZ7NHHUaBs7" target="_blank" className="hover:underline">Careers <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded ml-1">We are hiring</span></a></li>
              {/* <li><a href="#" className="hover:underline">Teach Online</a></li> */}
              <li><a href="#" className="hover:underline">Media</a></li>
              {/* <li><a href="#" className="hover:underline">Sitemap</a></li> */}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:underline">Test Series</span></li>
              <li><span className="hover:underline">Live Tests & Quizzes</span></li>
              <li><Link to={"/subscription"} className="hover:underline">Revision24 Focus+</Link></li>
              <li><Link to={'https://youtube.com/@revision24official'} target="_blank" className="hover:underline">Online Videos</Link></li>
              <li><span className="hover:underline">Practice</span></li>
              {/* <li><span className="hover:underline">Live Classes</span></li> */}
              <li><Link to={"/blog"} className="hover:underline">Blog</Link></li>
              {/* <li><span className="hover:underline">Refer & Earn</span></li> */}
              {/* <li><span className="hover:underline">Books</span></li> */}
              {/* <li><span className="hover:underline">Exam Calendar</span></li> */}
              {/* <li><span className="hover:underline">GK & CA</span></li> */}
              {/* <li><span className="hover:underline">Teacher Training Program</span></li> */}
              {/* <li><span className="hover:underline">Doubts</span></li> */}
            </ul>
          </div>

          {/* App & Social */}
          <div>
            <h3 className="text-white font-semibold mb-3">Our App</h3>
            <div className="flex gap-3">
              <a href="#"  rel="noreferrer">
                <img src="/googlePay.png" alt="App Store" className="w-8" />
              </a>
              <a href="#"  rel="noreferrer">
                <img src="/app_store.png" alt="Google Play" className="w-8" />
              </a>
            </div>
            <h3 className="text-white font-semibold mt-5 mb-3">Follow us on</h3>
            <div className="flex gap-4 text-xl">
              <a href="https://www.facebook.com/revision24official" target="_blank" className="hover:text-white"><FaFacebookF /></a>
              <a href="https://x.com/theRevision24" target="_blank" className="hover:text-white"><FaTwitter /></a>
              {/* <a href="https://x.com/revision24official" target="_blank" className="hover:text-white"><FaLinkedinIn /></a> */}
              <a href="https://instagram.com/revision24official" target="_blank" className="hover:text-white"><FaInstagram /></a>
              <a href="https://youtube.com/@revision24official" target="_blank" className="hover:text-white"><FaYoutube /></a>
              <a href="https://t.me/revision24official" target="_blank" className="hover:text-white"><FaTelegram /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 border-t border-gray-700 pt-5">
          <p>Copyright © 2025 Revision24. All rights reserved</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            {/* <a href="/user-policy" className="hover:underline">User Policy</a> */}
            <Link to="/terms-of-service" className="hover:underline">Terms</Link>
            <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
