// OLD CODE
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './pages/authPage/LoginPage';
import RegisterPage from './pages/authPage/RegisterPage';
import RegisterOtpVerifyPage from './pages/authPage/RegisterOtpVerifyPage';
import UserDetailsPage from './pages/authPage/UserDetailsPage';
import RegisterSetPasswordPage from './pages/authPage/RegisterSetPaswordPage';

import WalletPage from './pages/WalletPage';
import TestPagesPage from './pages/testSeries/TestPagesPage';
import Screen1 from './pages/testSeries/Screen1';
import Screen2 from './pages/testSeries/Screen2';
import Screen3 from './pages/testSeries/Screen3';
import Screen4 from './pages/testSeries/Screen4';
import Screen5 from './pages/testSeries/Screen5';
import Screen6 from './pages/testSeries/Screen6';
import Screen7 from './pages/testSeries/Screen7';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './utils/PublicRoute';

import AboutUsPage from './pages/AboutUsPage';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage';
import TestSeriesPage from './pages/testSeries/TestSeriesPage';
import PaymentSuccess from './pages/PaymentSuccess';
import UserDashboard from './pages/UserDashboard';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ForgotPasswordPage from './pages/authPage/forgotpage/ForgotPasswordPage';
import ForgotPasswordOtpPage from './pages/authPage/forgotpage/ForgotPasswordOtpPage';
import SetNewPasswordPage from './pages/authPage/forgotpage/SetNewPasswordPage';
import PrivacyPolicy from './pages/PrivacyPolicyPage';
import RefundPolicy from './pages/RefundPolicyPage';
import Clarity from '@microsoft/clarity';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';
import CashfreeCheckoutPage from './pages/CashfreeCheckoutPage';
import AppPaymentResponse from './pages/AppPaymentResponse';
import SubscriptionCheckout from './pages/app_pages/SubscriptionCheckout';
import SubscriptionRespose from './pages/app_pages/SubscriptionRespose';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ALWAYS ACCESSIBLE ROUTE */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/test-series" element={<TestSeriesPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />


        {/* PUBLIC ONLY ROUTES */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<RegisterOtpVerifyPage />} />
          <Route path="/user-details" element={<UserDetailsPage />} />
          <Route path="/user-set-password" element={<RegisterSetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password-verify-otp" element={<ForgotPasswordOtpPage />} />
          <Route path="/reset-password" element={<SetNewPasswordPage />} />
          <Route path="/cashfree-payment" element={<CashfreeCheckoutPage />} />
          <Route path="/app-payment-response" element={<AppPaymentResponse />} />
          <Route path="/app-subscription-checkout" element={<SubscriptionCheckout />} />
          <Route path="/app-subscription-response" element={<SubscriptionRespose />} />

        </Route>

        {/* PROTECTED ROUTES */}
        {/* <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/testpakages" element={<TestPagesPage />} />
          <Route path="/system-info" element={<Screen1 />} />
          <Route path="/test-login" element={<Screen2 />} />
          <Route path="/instructions" element={<Screen3 />} />
          <Route path="/symbols" element={<Screen4 />} />
          <Route path="/analysis" element={<Screen6 />} />
          <Route path="/test-solutions" element={<Screen7 />} />
        </Route> */}

        <Route path="/payment-response" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/user-dashboard" element={<ProtectedRoute> <UserDashboard /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/testpakages" element={<ProtectedRoute><TestPagesPage /></ProtectedRoute>} />
        <Route path="/system-info" element={<ProtectedRoute><Screen1 /></ProtectedRoute>} />
        <Route path="/test-login" element={<ProtectedRoute><Screen2 /></ProtectedRoute>} />
        <Route path="/instructions" element={<ProtectedRoute><Screen3 /></ProtectedRoute>} />
        <Route path="/symbols" element={<ProtectedRoute><Screen4 /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><Screen6 /></ProtectedRoute>} />
        <Route path="/scc-mock-test" element={<ProtectedRoute><Screen5 /></ProtectedRoute>} />
        <Route path="/test-solutions" element={<ProtectedRoute><Screen7 /></ProtectedRoute>} />

        {/* ❗️ Catch-all route outside PublicRoute */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}

export default App;




// NEW CODE 

// import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// import LoginPage from './pages/authPage/LoginPage';
// import RegisterPage from './pages/authPage/RegisterPage';
// import RegisterOtpVerifyPage from './pages/authPage/RegisterOtpVerifyPage';
// import UserDetailsPage from './pages/authPage/UserDetailsPage';
// import RegisterSetPasswordPage from './pages/authPage/RegisterSetPaswordPage';

// import WalletPage from './pages/WalletPage';
// import TestPagesPage from './pages/testSeries/TestPagesPage';
// import Screen1 from './pages/testSeries/Screen1';
// import Screen2 from './pages/testSeries/Screen2';
// import Screen3 from './pages/testSeries/Screen3';
// import Screen4 from './pages/testSeries/Screen4';
// import Screen5 from './pages/testSeries/Screen5';
// import Screen6 from './pages/testSeries/Screen6';
// import Screen7 from './pages/testSeries/Screen7';

// import Layout from './components/Layout';
// import ProtectedRoute from './components/ProtectedRoute';
// import PublicRoute from './utils/PublicRoute';

// import AboutUsPage from './pages/AboutUsPage';
// import HomePage from './pages/HomePage';
// import SubscriptionPage from './pages/SubscriptionPage';
// import TestSeriesPage from './pages/testSeries/TestSeriesPage';
// import PaymentSuccess from './pages/PaymentSuccess';
// import UserDashboard from './pages/UserDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* ALWAYS ACCESSIBLE ROUTE */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/about" element={<AboutUsPage />} />
//         <Route path="/subscription" element={<SubscriptionPage />} />
//         <Route path="/test-series" element={<TestSeriesPage />} />

//         {/* PUBLIC ONLY ROUTES */}
//         <Route element={<PublicRoute />}>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/verify-otp" element={<RegisterOtpVerifyPage />} />
//           <Route path="/user-details" element={<UserDetailsPage />} />
//           <Route path="/user-set-password" element={<RegisterSetPasswordPage />} />
//         </Route>

//         {/* PROTECTED ROUTES */}
//         <Route path="/payment-response" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
//         <Route path="/user-dashboard" element={<ProtectedRoute> <UserDashboard /></ProtectedRoute>} />
//         <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
//         <Route path="/testpakages" element={<ProtectedRoute><TestPagesPage /></ProtectedRoute>} />
//         <Route path="/system-info" element={<ProtectedRoute><Screen1 /></ProtectedRoute>} />
//         <Route path="/test-login" element={<ProtectedRoute><Screen2 /></ProtectedRoute>} />
//         <Route path="/instructions" element={<ProtectedRoute><Screen3 /></ProtectedRoute>} />
//         <Route path="/symbols" element={<ProtectedRoute><Screen4 /></ProtectedRoute>} />
//         <Route path="/scc-mock-test" element={<ProtectedRoute><Screen5 /></ProtectedRoute>} />
//         <Route path="/analysis" element={<ProtectedRoute><Screen6 /></ProtectedRoute>} />
//         <Route path="/test-solutions" element={<ProtectedRoute><Screen7 /></ProtectedRoute>} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;









