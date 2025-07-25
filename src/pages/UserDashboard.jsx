import React, { useEffect, useState } from "react";
import { getUserDataDecrypted } from "../helpers/userStorage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaPhoneSquareAlt, FaUserAlt, FaWhatsappSquare } from "react-icons/fa";
import { getTransactionSlice } from "../redux/HomeSlice";
import { useDispatch } from "react-redux";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  const loadUserData = async () => {
    const user = await getUserDataDecrypted();
    setUserInfo(user);
    // console.log("userinfon in dashboard", user)
    setLoading(false);
  };

  const getTransactionDescription = (item) => {
    switch (item.transaction_type) {
      case "Package":
        return item.subscription?.name || "Package Purchase";
      case "Wallet":
        return "Wallet Recharge";
      case "Test":
        return "Test Purchase";
      case "Material":
        return "Study Material Purchase";
      case "Course":
        return "Course Purchase";
      default:
        return item.transaction_type || "Transaction";
    }
  };

  const getMyTransaction = async () => {
    try {
      const res = await dispatch(getTransactionSlice()).unwrap();
      console.log(res.data);
      const data = res.data ?? [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Transaction fetch error", error);
    }
  };

  useEffect(() => {
    getMyTransaction();
    loadUserData();
  }, []);

  useEffect(() => {
    if (!userInfo?.subscription_details?.expiry_date) return;

    const expiry = new Date(
      userInfo.subscription_details.expiry_date
    ).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiry - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [userInfo]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Loading/Error */}
          {loading ? (
            <div className="text-center text-gray-500">
              Loading user data...
            </div>
          ) : !userInfo ? (
            <div className="text-center text-red-500">No user info found.</div>
          ) : (
            <>
              {/* Subscription Status */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    📦 Subscription Status
                  </h2>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      userInfo.subscription_status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {userInfo.subscription_status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    👤 User Information
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border">
                      <tbody>
                        <tr className="border-b">
                          <th className="p-2 w-40">Profile</th>
                          <td className="p-2">
                            {userInfo.profile ? (
                              <img
                                src={userInfo.profile}
                                alt="User"
                                className="h-20 w-20 object-cover rounded-full border"
                              />
                            ) : (
                              <div className="h-20 w-20 object-cover rounded-full border flex items-center justify-center overflow-hidden bg-blue-800">
                                <FaUserAlt className="text-6xl text-white" />
                              </div>
                            )}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">Name</th>
                          <td className="p-2">{userInfo.name}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">Email</th>
                          <td className="p-2">{userInfo.email}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">Mobile</th>
                          <td className="p-2">{userInfo.mobile}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">City</th>
                          <td className="p-2">{userInfo.city}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">State</th>
                          <td className="p-2">{userInfo.state}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">Gender</th>
                          <td className="p-2">{userInfo.gender}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">DOB</th>
                          <td className="p-2">{userInfo.dob}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">Wallet Balance</th>
                          <td className="p-2">₹{userInfo.wallet_balance}</td>
                        </tr>
                        <tr className="border-b">
                          <th className="p-2">Status</th>
                          <td className="p-2 capitalize">{userInfo.status}</td>
                        </tr>
                        {/* <tr className="border-b"><th className="p-2">Referral Code</th><td className="p-2">{userInfo.my_referral_code || '-'}</td></tr>
                                                <tr className="border-b"><th className="p-2">Referred By</th><td className="p-2">{userInfo.referral_by || '-'}</td></tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                  {userInfo.subscription_details ? (
                    <div className="bg-[#0f172a] text-white p-3 rounded-md shadow-xl w-full relative max-h-[280px] min-h-[250px]">
                      {/* Popular Tag */}
                      <span className="absolute top-4 right-4 bg-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                        ACTIVE
                      </span>

                      {/* Icon and Title */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-300 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                          {userInfo.subscription_details.subscription_name[0]}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold capitalize">
                            {userInfo.subscription_details.subscription_name}
                          </h2>
                          <p className="text-gray-300 text-sm">
                            ₹{userInfo.subscription_details.offer_price}
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="text-sm text-gray-200 space-y-2 mb-6">
                        <li>
                          ✅ <span className="font-semibold">Duration:</span>{" "}
                          {userInfo.subscription_details.duration} months
                        </li>
                        <li>
                          💰{" "}
                          <span className="font-semibold">Original Price:</span>{" "}
                          ₹{userInfo.subscription_details.price}
                        </li>
                        <li>
                          🏷️ <span className="font-semibold">Offer Price:</span>{" "}
                          ₹{userInfo.subscription_details.offer_price}
                        </li>
                        <li>
                          📅 <span className="font-semibold">Purchase:</span>{" "}
                          {new Date(
                            userInfo.subscription_details.purchase_date
                          ).toLocaleDateString("en-GB")}
                        </li>

                        <li>
                          ⏲️ <span className="font-semibold">Expiry:</span>{" "}
                          {new Date(
                            userInfo.subscription_details.expiry_date
                          ).toLocaleDateString("en-GB")}
                        </li>
                        <li className="px-3 py-2 bg-amber-500 rounded-sm font-bold text-black">
                          ⏳ <span className="font-semibold">Time Left:</span>{" "}
                          {timeLeft ? (
                            timeLeft.days > 3 ? (
                              `${timeLeft.days} Days Left`
                            ) : (
                              `${timeLeft.days} Days ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                            )
                          ) : (
                            <span className="text-red-500 font-semibold">
                              Expired
                            </span>
                          )}
                        </li>
                      </ul>

                      {/* Action Button */}
                      {/* <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-lg text-sm">
                                            Manage Plan →
                                        </button> */}
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
                      No subscription details available.
                    </div>
                  )}

                  <div className="rounded-lg shadow-md mt-4 p-4 bg-white">
                    {/* Title */}
                    <div className="w-full font-bold text-center mb-3">
                      <h3 className="text-lg">Contact Your Mentor</h3>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-around">
                      {/* 📞 Call Button */}
                      <a
                        href="tel:+917822936229"
                        className="px-4 py-2 rounded-lg font-semibold flex justify-center items-center gap-2 w-1/2 bg-blue-500 text-white"
                      >
                        <FaPhoneSquareAlt /> Call
                      </a>

                      {/* 💬 WhatsApp Button */}
                      <a
                        href="https://wa.me/917822936229"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg font-semibold flex justify-center items-center gap-2 w-1/2 bg-green-500 text-white"
                      >
                        <FaWhatsappSquare /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  💰 Transaction History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Order Id</th>
                        <th className="p-2 border">Payment Id</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td className="p-2 border text-center" colSpan="4">
                            No Transactions Found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((item, index) => (
                          <tr key={item.id}>
                            <td className="p-2 border">{index + 1}</td>
                            <td className="p-2 border">
                              {new Date(item.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </td>
                            <td className="p-2 border">{item.order_id}</td>
                            <td className="p-2 border"> {item.payment_id}</td>
                            <td className="p-2 border text-green-600 font-bold">
                              ₹{parseFloat(item.amount).toFixed(2)}
                            </td>
                            <td className="p-2 border">
                              {getTransactionDescription(item)}
                            </td>
                            <td className={"p-2 border"}>
                              <div
                                className={
                                  item.paying_status === "true"
                                    ? "p-2 text-white text-center bg-green-500 rounded-sm"
                                    : "p-2 text-white text-center bg-red-500 rounded-sm"
                                }
                              >
                                {item.paying_status === "true"
                                  ? "Success"
                                  : "Failed"}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
