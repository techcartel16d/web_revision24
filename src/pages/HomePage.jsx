// HomePage.jsx
import React, { useEffect, useState } from "react";
import SwiperSlider from "../components/SwiperSlider";
import HeroBanner from "../components/HeroBanner";
import ExamSelector from "../components/ExamSelector";
import { useDispatch } from "react-redux";
import {
  getSubscriptionSlice,
  getUserInfoSlice,
  homePageSlice,
} from "../redux/HomeSlice";
import TestSeriesViewer from "../components/TestSeriesViewer";
import SubscriptionModal from "../components/SubscriptionModal";
import AboutUs from "../components/AboutUs";
import SubscriptionPlans from "../components/SubscriptionPlans";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { checkAllEncryptedTestData } from "../helpers/testStorage";
import {
  getUserDataDecrypted,
  saveUserDataEncrypted,
} from "../helpers/userStorage";
import AdBanner from "../components/AdBanner";
import Sidebar from "../components/Sidebar";
import { secureSet } from "../helpers/storeValues";






const HomePage = () => {
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState(null);
  const [bannerData, setBannerData] = useState([]);
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [ad, setAd] = useState(null);

  const getHomeData = async (id) => {
    try {
      setLoading(true);
      const res = await dispatch(homePageSlice()).unwrap();

      setCategory(res.data.category)
      // setAd(res.data.popup.image);
      let previousStr = JSON.stringify(res.data.previous_year_exam)

      setHomeData(res.data);
      setBannerData(res.data.banner);
      secureSet("previouseYearTest", previousStr)
      // console.log("home data in home screen", res.data)

      // storage.set('home_category', JSON.stringify(res.data.exam_category))
      // console.log("home data in home screen", res.data.exam_category)
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUserData = async () => {
    const user = await getUserDataDecrypted();
    setUserInfo(user);
    // console.log("user", user)
  };

  const getUserDetails = async () => {
    try {
      const res = await dispatch(getUserInfoSlice()).unwrap();
      if (res.status_code == 200) {
        // console.log("response==>", res)
        const userInfo = {
          ...res.data, // user info
          token: res.token, // add token manually if needed
          subscription_status: res.subscription_status,
          subscription_details: res.subscription_details,
        };

        await saveUserDataEncrypted(userInfo);
      } else {
      }

      // console.log("response user info==> ", res)
    } catch (error) {
      // console.log("error in get user profile", error);
    }
  };

  

  useEffect(() => {
    getHomeData();
    // Call this from a dev tool, admin page, or `useEffect`
    checkAllEncryptedTestData();
    getUserDetails();
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);


  return loading ? (
    <div className="p-4-400  w-full flex items-center justify-center">
      <div className="fading-spinner">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`bar bar${i + 1}`}></div>
        ))}
      </div>
    </div>
  ) : (
    <>
      <div className="w-full flex h-screen">
        <Sidebar />
        <div className="w-full h-screen overflow-y-auto">

          {/* <Header /> */}
          {bannerData && <HeroBanner banner={bannerData} data={homeData?.test_series_paid} />}

          {/* <AdBanner imageUrl={ad} linkUrl="/subscription" /> */}
          {category.length > 0 && (
            <TestSeriesViewer category={category} testSeriesData={homeData?.test_series_paid} />
          )}




          {/* {homeData && <ExamSelector category={homeData?.exam_category} />} */}
          {

          // homeData && (
          //   <TestSeriesViewer testSeriesData={homeData?.test_series_free} />
  
          // )

          }

          {userInfo && !userInfo?.subscription_status && <SubscriptionPlans />}

          {/* <SubscriptionModal /> */}
        </div>
        {/* <Footer /> */}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default HomePage;
