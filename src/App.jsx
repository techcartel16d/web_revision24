import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/authPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import RegisterPage from './pages/authPage/RegisterPage';
import WalletPage from './pages/WalletPage'; // make sure this page exists
import TestPagesPage from './pages/testSeries/TestPagesPage';
import Screen1 from './pages/testSeries/Screen1';
import Screen2 from './pages/testSeries/Screen2';
import Screen3 from './pages/testSeries/Screen3';
import Screen4 from './pages/testSeries/Screen4';
import Screen5 from './pages/testSeries/Screen5';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes with Shared Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="testpakages" element={<TestPagesPage />} />
          <Route path="screen1" element={<Screen1 />} />
          <Route path="screen2" element={<Screen2 />} />
          <Route path="screen3" element={<Screen3 />} />
          <Route path="screen4" element={<Screen4 />} />
          <Route path="screen5" element={<Screen5 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
