// HomePage.jsx
import React, { useEffect, useState } from 'react';
import SwiperSlider from '../components/SwiperSlider';
import HeroBanner from '../components/HeroBanner';
import ExamSelector from '../components/ExamSelector';
import { useDispatch } from 'react-redux';
import { getSubscriptionSlice, homePageSlice } from '../redux/HomeSlice';
import TestSeriesViewer from '../components/TestSeriesViewer';
import SubscriptionModal from '../components/SubscriptionModal';
import AboutUs from '../components/AboutUs';
import SubscriptionPlans from '../components/SubscriptionPlans';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { checkAllEncryptedTestData } from '../helpers/testStorage';
import { getUserDataDecrypted } from '../helpers/userStorage';

const HomePage = () => {

  const dispatch = useDispatch()
  const [homeData, setHomeData] = useState(null)
  const [bannerData, setBannerData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);


  const getHomeData = async (id) => {
    try {
      setLoading(true)
      const res = await dispatch(homePageSlice()).unwrap()
      // console.log("response", res)


      setHomeData(res.data)
      // console.log("home data in home screen", res.data)
      // storage.set('home_category', JSON.stringify(res.data.exam_category))
      // console.log("home data in home screen", res.data.exam_category)
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
    // Call this from a dev tool, admin page, or `useEffect`
    checkAllEncryptedTestData();
  }, [])





  const loadUserData = async () => {
    const user = await getUserDataDecrypted();
    setUserInfo(user);
    // console.log("user", user)
  };

  useEffect(() => {
    loadUserData();
  }, []);




  return (

    <div className='w-full'>
      <Header />
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


{
  userInfo && !userInfo?.subscription_status&&(

    <SubscriptionPlans />
  )
}




      {/* <SubscriptionModal /> */}
      <Footer />
    </div>
  );
};

export default HomePage;