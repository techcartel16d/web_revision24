import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestSeriesViewer = ({ testSeriesData }) => {
  const nav = useNavigate();
  const categories = Object.keys(testSeriesData);
  const [selectedCategory, setSelectedCategory] = useState(categories[1] || null);

  return (
    <div className="p-6 bg-gray-50" id="testseries">
      {/* Test Series Grid */}
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-4">{selectedCategory} - Test Series</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testSeriesData[selectedCategory].map((item, index) => (
              <div
                key={index}
                onClick={() => nav('testpakages', { state: { item, testId: item.id } })}
                className="bg-white rounded-xl shadow hover:shadow-lg transition border cursor-pointer overflow-hidden"
              >
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-white to-blue-100 px-4 py-3 relative">
                  <img
                    src={item.logo || '/logo.jpeg'} // use fallback if logo missing
                    alt="Logo"
                    className="w-15 h-15  object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white text-yellow-500 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    ⚡ {item.purchase_or_not ? '' : 'paid'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                    {item.title || 'Mock Test Series'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {item.total_assign_test} Total Tests{' '}
                    <span className="text-green-600 font-semibold">| {item.free_test || 4} Free Tests</span>
                  </p>

                  <p className="text-xs text-blue-600 mb-2">
                    {item.language || 'English,Hindi'}
                  </p>

                  {/* Features */}
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    {item.live_tests && <li>• {item.live_tests} 🔴 AI-Generated Ultimate Live Test</li>}
                    {item.ai_tests && <li>• {item.ai_tests} AI-Generated Test</li>}
                    {item.previous_papers && <li>• {item.previous_papers} SSC PYQs</li>}
                    {item.more_tests && (
                      <li className="text-green-600 font-medium">
                        +{item.more_tests} more tests
                      </li>
                    )}
                  </ul>

                  <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 text-sm rounded-md font-semibold">
                    View Test Series
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSeriesViewer;
