import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestSeriesViewer = ({ testSeriesData }) => {
    const nav = useNavigate()
    
    const categories = Object.keys(testSeriesData);
    const [selectedCategory, setSelectedCategory] = useState(categories[1] || null);
    console.log(categories)

    return (
        <div className="p-6 bg-gray-50 min-h-screen cursor-pointer" >
            {/* Category Tabs */}
            {/* <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border 
              ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        {category}
                    </button>
                ))}
            </div> */}

            {/* <button
                className={`px-4 py-2 rounded-full text-sm font-medium border  bg-blue-600 text-white`}
            >
                {categories[1]}
            </button> */}


            {/* Series Cards */}
            {selectedCategory && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">{selectedCategory} - Test Series</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {testSeriesData[selectedCategory].map((item, index) => (
                            <div
                                onClick={() => nav('testpakages', { state: item })}
                                key={index}
                                className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
                            >
                                {/* <div className="mb-3">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-40 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div> */}
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">Tests: {item.total_assign_test}</p>
                                <p className="text-gray-800 font-semibold">
                                    Price: ₹{item.offer_price || 'Free'}
                                </p>
                                <p className={`text-sm font-medium ${item.purchase_or_not ? 'text-green-600' : 'text-red-500'}`}>
                                    {item.purchase_or_not ? 'Purchased' : 'Not Purchased'}
                                </p>

                                {/* Action Button */}
                                {/* <div className="flex justify-end mt-4">
                                    {item.offer_price === "0" || item.offer_price === 0 ? (
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                                            Start
                                        </button>
                                    ) : (
                                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm">
                                            Unlock
                                        </button>
                                    )}
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestSeriesViewer;
