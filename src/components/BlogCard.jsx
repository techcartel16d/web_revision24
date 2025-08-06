import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ data }) => {
    // console.log("data print ", data)
    return (
        <Link
            to={`/blog/${data.slug}`}
            className="bg-white rounded-xl shadow hover:shadow-md p-4 flex flex-col transition"
        >
            <img
                src={data.image}
                alt={data.title}
                className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="text-blue-700 font-bold text-lg line-clamp-2">{data.title}</div>
            <div className="text-gray-500 text-sm mt-2">
                {data.date ? new Date(data.date).toLocaleDateString() : ''}
            </div>
            <p
                className="text-gray-600 mt-2 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{
                    __html: data.short_description_hindi || data.short_description_english,
                }}
            ></p>

        </Link>
        
    );
};

export default BlogCard;
