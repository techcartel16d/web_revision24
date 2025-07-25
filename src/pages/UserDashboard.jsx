import React, { useEffect, useState } from 'react';
import { getUserDataDecrypted } from '../helpers/userStorage';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    const loadUserData = async () => {
        const user = await getUserDataDecrypted();
        setUserInfo(user);
        // console.log("userinfon in dashboard", user)
        setLoading(false);
    };

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-100 py-8 px-4">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Loading/Error */}
                    {loading ? (
                        <div className="text-center text-gray-500">Loading user data...</div>
                    ) : !userInfo ? (
                        <div className="text-center text-red-500">No user info found.</div>
                    ) : (
                        <>
                            {/* Subscription Status */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-800">📦 Subscription Status</h2>
                                    <span
                                        className={`text-sm font-medium px-3 py-1 rounded-full ${userInfo.subscription_status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {userInfo.subscription_status ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* User Info */}
                                <div className="bg-white p-6 rounded-xl shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">👤 User Information</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left border">
                                            <tbody>
                                                <tr className="border-b">
                                                    <th className="p-2 w-40">Profile</th>
                                                    <td className="p-2">
                                                        <img
                                                            src={userInfo.profile}
                                                            alt="User"
                                                            className="h-20 w-20 object-cover rounded-full border"
                                                        />
                                                    </td>
                                                </tr>
                                                <tr className="border-b"><th className="p-2">Name</th><td className="p-2">{userInfo.name}</td></tr>
                                                <tr className="border-b"><th className="p-2">Email</th><td className="p-2">{userInfo.email}</td></tr>
                                                <tr className="border-b"><th className="p-2">Mobile</th><td className="p-2">{userInfo.mobile}</td></tr>
                                                <tr className="border-b"><th className="p-2">City</th><td className="p-2">{userInfo.city}</td></tr>
                                                <tr className="border-b"><th className="p-2">State</th><td className="p-2">{userInfo.state}</td></tr>
                                                <tr className="border-b"><th className="p-2">Gender</th><td className="p-2">{userInfo.gender}</td></tr>
                                                <tr className="border-b"><th className="p-2">DOB</th><td className="p-2">{userInfo.dob}</td></tr>
                                                <tr className="border-b"><th className="p-2">Wallet Balance</th><td className="p-2">₹{userInfo.wallet_balance}</td></tr>
                                                <tr className="border-b"><th className="p-2">Status</th><td className="p-2 capitalize">{userInfo.status}</td></tr>
                                                {/* <tr className="border-b"><th className="p-2">Referral Code</th><td className="p-2">{userInfo.my_referral_code || '-'}</td></tr>
                                                <tr className="border-b"><th className="p-2">Referred By</th><td className="p-2">{userInfo.referral_by || '-'}</td></tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Subscription Details */}
                                {userInfo.subscription_details ? (
                                    <div className="bg-[#0f172a] text-white p-3 rounded-2xl shadow-xl w-full relative max-h-[200px] min-h-[250px]">
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
                                                <p className="text-gray-300 text-sm">₹{userInfo.subscription_details.offer_price} / user</p>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <ul className="text-sm text-gray-200 space-y-2 mb-6">
                                            <li>
                                                ✅ <span className="font-semibold">Duration:</span>{' '}
                                                {userInfo.subscription_details.duration} months
                                            </li>
                                            <li>
                                                💰 <span className="font-semibold">Original Price:</span>{' '}
                                                ₹{userInfo.subscription_details.price}
                                            </li>
                                            <li>
                                                🏷️ <span className="font-semibold">Offer Price:</span>{' '}
                                                ₹{userInfo.subscription_details.offer_price}
                                            </li>
                                            <li>
                                                📅 <span className="font-semibold">Purchase:</span>{' '}
                                                {userInfo.subscription_details.purchase_date}
                                            </li>
                                            <li>
                                                ⏲️ <span className="font-semibold">Expiry:</span>{' '}
                                                {userInfo.subscription_details.expiry_date}
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
                            </div>

                            {/* Transaction History */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">💰 Transaction History</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left border">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2 border">#</th>
                                                <th className="p-2 border">Date</th>
                                                <th className="p-2 border">Amount</th>
                                                <th className="p-2 border">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Static data for now */}
                                            <tr>
                                                <td className="p-2 border">1</td>
                                                <td className="p-2 border">2025-07-24</td>
                                                <td className="p-2 border text-green-600">₹299.00</td>
                                                <td className="p-2 border">Yearly Plus Subscription</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border">2</td>
                                                <td className="p-2 border">2025-06-15</td>
                                                <td className="p-2 border text-green-600">₹445.45</td>
                                                <td className="p-2 border">Wallet Recharge</td>
                                            </tr>
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
