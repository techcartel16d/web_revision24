import React from "react";
import { FaChartLine, FaFileAlt, FaLanguage } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutUsPage = () => {
  return (
    <>
    <Header />
     <section id="about" className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">

        {/* Title Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 mb-4">
            <strong>Revision24</strong>, a platform by <strong>Duharia Enterprises Private Limited</strong>, is your trusted companion in preparing for competitive government exams across India. We specialize in providing high-quality practice test papers tailored for exams like SSC, RPSC, Railways, Banking, and more.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Our mission is to empower aspirants with the right tools and resources to improve their exam readiness and boost confidence. Every practice paper is crafted by experts based on the latest patterns and syllabus.
          </p>
          <p className="text-lg text-gray-600">
            At Revision24, we believe consistent practice is the key to success. That’s why we offer more than just questions — you get full learning insights, explanations, and performance analytics to help focus where it matters most.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          {/* Feature 1 */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300">
            <div className="text-blue-600 text-4xl mb-4 flex justify-center">
              <FaFileAlt />
            </div>
            <h5 className="text-xl font-semibold mb-2">Excellence Question Paper</h5>
            <p className="text-gray-600">
              Carefully curated papers to challenge your knowledge and sharpen your skills. Aim high, practice smart!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300">
            <div className="text-blue-600 text-4xl mb-4 flex justify-center">
              <FaLanguage />
            </div>
            <h5 className="text-xl font-semibold mb-2">All Test in Hindi/English</h5>
            <p className="text-gray-600">
              Take tests in your preferred language! Available in both Hindi and English for better understanding.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300">
            <div className="text-blue-600 text-4xl mb-4 flex justify-center">
              <FaChartLine />
            </div>
            <h5 className="text-xl font-semibold mb-2">All India Ranking Graph</h5>
            <p className="text-gray-600">
              See where you stand among thousands of aspirants and stay motivated with real-time ranking insights.
            </p>
          </div>

        </div>
      </div>
    </section>
    <Footer />
    </>
   
  );
};

export default AboutUsPage;
