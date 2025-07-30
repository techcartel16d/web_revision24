import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { getUserDataDecrypted } from '../helpers/userStorage';
import { useDispatch } from 'react-redux';
import { getBlogSlice } from '../redux/HomeSlice';
import BlogCard from '../components/BlogCard';


const BlogPage = () => {
    const [blogList, setBlogList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });

    const dispatch = useDispatch();

    const fetchBlogs = async (page = 1) => {
        try {
            setLoading(true);
            const res = await dispatch(getBlogSlice(page)).unwrap();
            if (res.status_code == 200) {
                setBlogList(res.data.data); // list of blogs
                setPagination({
                    current_page: res.data.current_page,
                    last_page: res.data.last_page,
                });
            } else {
                console.error('Blog fetch error', res);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBlogs(1); // load first page initially
    }, []);

    return (
        <>
            <Header />
            <section className="py-10 px-4 bg-gray-100 min-h-[70vh]">
                <h2 className="text-center text-3xl font-bold text-blue-600 mb-10">Our Blogs</h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

                        {
                            blogList.length > 0 ? (

                                blogList.map((blog, idx) => (
                                    <BlogCard key={idx} data={blog} />
                                ))

                            ) : (
                                <div>
                                    Data Not Found
                                </div>
                            )
                        }


                    </div>


                )}
                <div className="flex justify-center mt-10 gap-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                        disabled={pagination.current_page === 1}
                        onClick={() => fetchBlogs(pagination.current_page - 1)}
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 mt-2">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => fetchBlogs(pagination.current_page + 1)}
                    >
                        Next
                    </button>
                </div>

            </section>
            <Footer />
        </>
    );
};

export default BlogPage;
