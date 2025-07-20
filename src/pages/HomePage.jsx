// HomePage.jsx
import React, { useEffect, useState } from 'react';
import SwiperSlider from '../components/SwiperSlider';
import HeroBanner from '../components/HeroBanner';
import ExamSelector from '../components/ExamSelector';
import { useDispatch } from 'react-redux';
import { homePageSlice } from '../redux/HomeSlice';
import TestSeriesViewer from '../components/TestSeriesViewer';

const HomePage = () => {
  const dispatch = useDispatch()
  const [homeData, setHomeData] = useState(null)
  const [bannerData, setBannerData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const getHomeData = async (id) => {
    try {
      setLoading(true)
      const res = await dispatch(homePageSlice()).unwrap()


      setHomeData(res.data)
      console.log("home data in home screen", res.data)
      // storage.set('home_category', JSON.stringify(res.data.exam_category))
      console.log("home data in home screen", res.data.exam_category)
      setBannerData(res.data.banner)
      setLoading(false)
      setRefreshing(false)
    } catch (error) {
      setLoading(false)
      setRefreshing(false)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }

  }

  useEffect(() => {
    getHomeData()
  }, [])




  return (
    <div className='w-full'>
      {
        homeData && (

          <HeroBanner banner={homeData?.banner} />
        )
      }
      {
        homeData && (
          <ExamSelector category={homeData?.exam_category} />

        )
      }
      {/* {
        homeData && (
          <TestSeriesViewer testSeriesData={homeData?.test_series_free} />

        )
      } */}
      {
        homeData && (
          <TestSeriesViewer testSeriesData={homeData?.test_series_paid} />

        )
      }

    </div>
  );
};

export default HomePage;