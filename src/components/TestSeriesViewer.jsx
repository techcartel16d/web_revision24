import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineGTranslate } from 'react-icons/md';

const TestSeriesViewer = ({ testSeriesData, category }) => {
  const nav = useNavigate();

  if (!Array.isArray(category) || category.length === 0) {
    return <p className="text-gray-600 p-4">No categories available to show test series.</p>;
  }

  return (
    <div className="p-6 bg-gray-50" id="testseries">
      {category.map((cat) => {
        const series = testSeriesData?.[cat.title] || [];
        // console.log(cat)

        if (series.length === 0) return null; // Skip if no test series

        return (
          <div key={cat.id} className="mb-10">
            <div className='flex items-center justify-start mb-5 gap-3'>

              <img className='h-8 w-8 rounded-sm' src={cat.icon} />
              <h2 className="text-xl font-semibold">{cat.title} - Test Series </h2>
              <span className='bg-green-300 px-4 py-1 text-slate-800 text-xs rounded-md'>Free {cat.free}</span>
              <span className='bg-blue-300 px-4 py-1 text-slate-800 text-xs  rounded-md' >Paid {cat.paid}</span>
              <span className='bg-yellow-300 px-4 py-1 text-slate-800 text-xs  rounded-md' >total {cat.totalSeries}</span>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {series.map((item, index) => (
                <div
                  key={index}
                  onClick={() => nav('/testpakages', { state: { item, testId: item.id } })}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition border cursor-pointer overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-white to-blue-100 px-4 py-3 relative">
                    <img
                      src={item.logo || '/logo.jpeg'}
                      alt="Logo"
                      className="w-16 h-16 object-contain"
                    />
                    <span className="absolute top-3 right-3 bg-white text-yellow-500 text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                      ⚡
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                      {item.title || 'Mock Test Series'}
                    </h3>

                    <p className="text-sm text-gray-600 mb-1">
                      {item.total_assign_test || 0} Total Tests
                    </p>

                    <p className="text-xs text-blue-600 flex items-center gap-2">
                      <MdOutlineGTranslate className="text-xl" />
                      {item.language || 'English, Hindi'}
                    </p>

                    <ul className="text-sm text-gray-700 space-y-1 mb-4 mt-2">
                      {item.live_tests && <li>• {item.live_tests} 🔴 AI-Generated Live Tests</li>}
                      {item.ai_tests && <li>• {item.ai_tests} AI Tests</li>}
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
        );
      })}
    </div>
  );
};

export default TestSeriesViewer;
