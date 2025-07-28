import React, { useState } from "react";
import ssclog from '/ssc_log.png'
const exams = {
    UPSC: [
        { name: "SSC CHSL", logo: ssclog },
        { name: "SSC CGL", logo: ssclog },
        { name: "SSC MTS", logo: ssclog },
        { name: "SSC GD", logo: ssclog },
        { name: "SBI PO", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1024px-SBI-logo.svg.png" },
        { name: "SBI CLERK", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1024px-SBI-logo.svg.png" },
        { name: "IBPS PO", logo: "https://i.pinimg.com/474x/95/9b/92/959b922fedb8601b8631195cd520fb68.jpg" },
        { name: "IBPS CLERK", logo: "https://i.pinimg.com/474x/95/9b/92/959b922fedb8601b8631195cd520fb68.jpg" },
    ],
};

const categories = [
    "UPSC",
    "SSC",
    "State PSC",
    "Teaching",
    "Railways",
    "Defence",
    "Banking",
    "Police",
    "Insurance",
    "Scholarship",
];

export default function ExamSelector({ category }) {
    // console.log("category", category)
    const [activeCategory, setActiveCategory] = useState("UPSC");
    const [showAll, setShowAll] = useState(false);
    const data = exams[activeCategory] || [];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Exam Category</h2>

            {/* <div className="flex flex-wrap gap-3 mb-6">
                {category && category.map((cate) => (
                    <button
                        key={cate.id}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 ${activeCategory === cate.title
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-blue-100"
                            }`}
                        onClick={() => setActiveCategory(cate.title)}
                    >
                        {cate.title}
                    </button>
                ))}
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAll ? data : data.slice(0, 6)).map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 flex items-center gap-4 hover:shadow-md"
                    >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {/* Replace with actual logo */}
                            <img src={item.logo} />
                        </div>
                        <div className="text-lg font-medium">{item.name}</div>
                    </div>
                ))}
            </div>

            {data.length > 6 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded text-black font-semibold"
                    >
                        {showAll ? "Show Less" : `View ${data.length - 6} More`}
                    </button>
                </div>
            )}
        </div>
    );
}
