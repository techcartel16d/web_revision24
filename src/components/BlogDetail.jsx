import { Link } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const BlogDetail = ({ data, relatedBlogs }) => {
    const nav = useNavigate();
    const [selectLeng, setSelectLeng] = useState('hi')
    const htmlContent = selectLeng === 'hi' ? data.description : data.description_english;

    // console.log("daata=>>>>>>>>>>>>>>>>>>>", data)
    // console.log("Related daata=>>>>>>>>>>>>>>>>>>>", relatedBlogs)
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Language Selector */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                
                <p className="font-bold text-gray-800">
                    <span onClick={() => nav('/')} className='hover:underline cursor-pointer text-red-500'>Home </span>/ <span onClick={() => nav('/blog')} className='hover:underline cursor-pointer text-red-500'> Blog</span> / {data.title}
                </p>
               
                <div>
                    <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Language
                    </label>
                    <div className="relative inline-block w-48">
                        <select
                            id="language-select"
                            name="language"
                            value={selectLeng}
                            onChange={(e) => setSelectLeng(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Content and Sidebar */}
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Blog Content */}
                <div className="w-full lg:w-3/4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-snug">
                        {selectLeng === 'hi' ? data.title : data.title_english}
                    </h1>

                    {data.image && (
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-auto object-cover rounded-md mb-6 shadow"
                        />
                    )}

                    <div className="bg-slate-200 px-4 py-1 mb-6 inline-block rounded text-sm sm:text-base text-black font-medium">
                        {data.date ? new Date(data.date).toLocaleDateString() : ''}
                    </div>

                    <div
                        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-justify blog-detail"
                        dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
                    ></div>
                </div>

                {/* Related Blogs */}
                <aside className="w-full lg:w-1/3 h-full lg:max-h-[calc(100vh-100px)] overflow-y-auto sticky top-10 hide-scrollbar">
                    <div className="bg-blue-50 p-4 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-blue-900  border-b pb-2">Related Blogs</h2>
                        <div className="space-y-4">
                            {relatedBlogs && relatedBlogs.length > 0 ? (
                                relatedBlogs.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => nav(`/blog/${item.id}`)}
                                        className="cursor-pointer bg-white p-3 rounded-md shadow hover:shadow-md transition"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(item.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No related blogs found.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </main>



    );
};

export default BlogDetail;
