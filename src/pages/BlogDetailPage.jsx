// BlogDetailPage.js
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogDetail from '../components/BlogDetail';
import { useDispatch } from 'react-redux';
import { getBlogDetailSlice } from '../redux/HomeSlice';
import { useParams } from 'react-router-dom';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const res = await dispatch(getBlogDetailSlice(id)).unwrap();
            // console.log("res===============>" ,res)
            if (res.status_code == 200) {
                setBlog(res.data.blog);
                setRelatedBlogs(res.data.related);
            } else {
                console.error('Blog detail fetch error', res);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [id]);

    return (
        <>
            <Header />
            <section className="py-10 px-4 bg-gray-100 min-h-[70vh]">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : blog ? (
                    <BlogDetail data={blog} relatedBlogs={relatedBlogs} />
                ) : (
                    <p className="text-center text-red-500">Blog not found</p>
                )}
            </section>
            <Footer />
        </>
    );
};

export default BlogDetailPage;
