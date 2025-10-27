// import React, { useEffect, useState } from "react";
// import { getUserDataDecrypted } from "../helpers/userStorage";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { FaPhoneSquareAlt, FaUserAlt, FaWhatsappSquare } from "react-icons/fa";
// import { getTransactionSlice } from "../redux/HomeSlice";
// import { useDispatch } from "react-redux";
// import DataTable from "react-data-table-component";
// import { IoLogoWhatsapp } from "react-icons/io";
// import { IoCall } from "react-icons/io5";
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Calendar, 
//   Wallet, 
//   CreditCard, 
//   Package, 
//   Clock, 
//   CheckCircle2, 
//   XCircle, 
//   Star,
//   TrendingUp,
//   Activity,
//   Shield,
//   Gift
// } from "lucide-react";
// import { motion } from "framer-motion";

// const UserDashboard = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [userInfo, setUserInfo] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const perPage = 10;

//   const loadUserData = async () => {
//     const user = await getUserDataDecrypted();
//     setUserInfo(user);
//     setLoading(false);
//   };

//   const getTransactionDescription = (item) => {
//     switch (item.transaction_type) {
//       case "Package":
//         return item.subscription?.name || "Package Purchase";
//       case "Wallet":
//         return "Wallet Recharge";
//       case "Test":
//         return "Test Purchase";
//       case "Material":
//         return "Study Material Purchase";
//       case "Course":
//         return "Course Purchase";
//       default:
//         return item.transaction_type || "Transaction";
//     }
//   };

//   const getMyTransaction = async () => {
//     try {
//       const res = await dispatch(getTransactionSlice()).unwrap();
//       const data = res.data ?? [];
//       setTransactions(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Transaction fetch error", error);
//     }
//   };

//   useEffect(() => {
//     getMyTransaction();
//     loadUserData();
//   }, []);

//   useEffect(() => {
//     if (!userInfo?.subscription_details?.expiry_date) return;

//     const expiry = new Date(userInfo.subscription_details.expiry_date).getTime();

//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = expiry - now;

//       if (distance <= 0) {
//         clearInterval(interval);
//         setTimeLeft(null);
//         return;
//       }

//       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       setTimeLeft({ days, hours, minutes, seconds });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [userInfo]);

//   // DataTable columns
//   const columns = [
//     {
//       name: '#',
//       cell: (row, index, column, id) => (
//         <div className="font-semibold text-gray-600">
//           {(currentPage - 1) * perPage + index + 1}
//         </div>
//       ),
//       width: '60px',
//     },
//     {
//       name: 'Date',
//       selector: row =>
//         new Date(row.created_at).toLocaleDateString('en-IN', {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//         }),
//       sortable: true,
//       cell: row => (
//         <div className="font-medium text-gray-700">
//           {new Date(row.created_at).toLocaleDateString('en-IN')}
//         </div>
//       )
//     },
//     {
//       name: 'Order ID',
//       selector: row => row.order_id,
//       sortable: true,
//       cell: row => (
//         <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//           {row.order_id}
//         </div>
//       )
//     },
//     {
//       name: 'Payment ID',
//       selector: row => row.payment_id,
//       sortable: true,
//       cell: row => (
//         <div className="font-mono text-sm text-blue-600 truncate max-w-[120px]">
//           {row.payment_id}
//         </div>
//       )
//     },
//     {
//       name: 'Amount',
//       selector: row => `₹${parseFloat(row.amount).toFixed(2)}`,
//       sortable: true,
//       cell: row => (
//         <div className={`font-bold text-lg ${
//           row.paying_status === 'true' ? 'text-green-600' : 'text-red-600'
//         }`}>
//           ₹{parseFloat(row.amount).toFixed(2)}
//         </div>
//       ),
//     },
//     {
//       name: 'Description',
//       selector: row => getTransactionDescription(row),
//       cell: row => (
//         <div className="text-gray-700 font-medium">
//           {getTransactionDescription(row)}
//         </div>
//       )
//     },
//     {
//       name: 'Status',
//       selector: row => row.paying_status,
//       cell: row => (
//         <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
//           row.paying_status === 'true' 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'
//         }`}>
//           {row.paying_status === 'true' ? (
//             <><CheckCircle2 size={14} /> Success</>
//           ) : (
//             <><XCircle size={14} /> Failed</>
//           )}
//         </div>
//       ),
//       sortable: true,
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex flex-col h-screen w-full">
//         <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (!userInfo) {
//     return (
//       <div className="flex flex-col h-screen w-full">
//         <main className="flex-grow bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
//           <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
//             <XCircle size={64} className="text-red-500 mx-auto mb-4" />
//             <p className="text-red-600 text-lg font-semibold">No user information found</p>
//             <p className="text-gray-500 mt-2">Please try logging in again</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
//       <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto space-y-8">
//           {/* Header Stats */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="grid grid-cols-1 md:grid-cols-4 gap-6"
//           >
//             {/* Subscription Status */}
//             <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-green-100 text-sm font-medium">Subscription</p>
//                   <p className="text-2xl font-bold">
//                     {userInfo.subscription_status ? 'Active' : 'Inactive'}
//                   </p>
//                 </div>
//                 <Shield size={32} className="text-green-200" />
//               </div>
//             </div>

//             {/* Wallet Balance */}
//             <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-blue-100 text-sm font-medium">Wallet Balance</p>
//                   <p className="text-2xl font-bold">₹{userInfo.wallet_balance}</p>
//                 </div>
//                 <Wallet size={32} className="text-blue-200" />
//               </div>
//             </div>

//             {/* Total Transactions */}
//             <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-purple-100 text-sm font-medium">Transactions</p>
//                   <p className="text-2xl font-bold">{transactions.length}</p>
//                 </div>
//                 <TrendingUp size={32} className="text-purple-200" />
//               </div>
//             </div>

//             {/* Account Status */}
//             <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-orange-100 text-sm font-medium">Account Status</p>
//                   <p className="text-2xl font-bold capitalize">{userInfo.status}</p>
//                 </div>
//                 <Activity size={32} className="text-orange-200" />
//               </div>
//             </div>
//           </motion.div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* User Profile - Left Column */}
//             <motion.div 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//                 <div className="text-center mb-8">
//                   <div className="relative mx-auto w-32 h-32 mb-6">
//                     {userInfo.profile ? (
//                       <img
//                         src={userInfo.profile}
//                         alt="User"
//                         className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-lg"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
//                         <User size={48} className="text-white" />
//                       </div>
//                     )}
//                     <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
//                       <div className="w-3 h-3 bg-white rounded-full"></div>
//                     </div>
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-800 mb-2">{userInfo.name}</h2>
//                   <p className="text-gray-500 font-medium">{userInfo.email}</p>
//                 </div>

//                 {/* User Details */}
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Mail size={20} className="text-blue-600" />
//                     <div>
//                       <p className="text-sm text-gray-500">Email</p>
//                       <p className="font-medium text-gray-800">{userInfo.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Phone size={20} className="text-green-600" />
//                     <div>
//                       <p className="text-sm text-gray-500">Mobile</p>
//                       <p className="font-medium text-gray-800">{userInfo.mobile}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <MapPin size={20} className="text-red-600" />
//                     <div>
//                       <p className="text-sm text-gray-500">Location</p>
//                       <p className="font-medium text-gray-800">{userInfo.city}, {userInfo.state}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <Calendar size={20} className="text-purple-600" />
//                     <div>
//                       <p className="text-sm text-gray-500">Date of Birth</p>
//                       <p className="font-medium text-gray-800">{userInfo.dob}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Mentor */}
//                 <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
//                   <h3 className="text-white font-bold text-lg mb-4 text-center">Contact Your Mentor</h3>
//                   <div className="flex gap-3">
//                     <a
//                       href="tel:+917822936229"
//                       className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-zinc-700 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
//                     >
//                       <IoCall size={20} />
//                       Call
//                     </a>
//                     <a
//                       href="https://wa.me/917822936229"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-zinc-700 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
//                     >
//                       <IoLogoWhatsapp size={20} />
//                       WhatsApp
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Subscriptions - Right Column */}
//             <motion.div 
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
//                 <div className="p-6 border-b border-gray-100">
//                   <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
//                     <Package className="text-blue-600" />
//                     My Subscriptions
//                   </h3>
//                 </div>

//                 <div className="p-6">
//                   {userInfo?.subscription_details?.length > 0 ? (
//                     <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
//                       {userInfo.subscription_details.map((sub, index) => {
//                         const expiry = new Date(sub.expiry_date);
//                         const now = new Date();
//                         const timeDiff = expiry - now;
//                         const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//                         const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
//                         const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
//                         const seconds = Math.floor((timeDiff / 1000) % 60);
//                         const isExpired = timeDiff <= 0;

//                         return (
//                           <motion.div
//                             key={index}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
//                           >
//                             {/* Background Pattern */}
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full -translate-y-16 translate-x-16"></div>
                            
//                             {/* Active Badge */}
//                             <div className="absolute top-4 right-4">
//                               <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
//                                 <CheckCircle2 size={12} />
//                                 ACTIVE
//                               </span>
//                             </div>

//                             {/* Header */}
//                             <div className="flex items-center gap-4 mb-6 relative">
//                               <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
//                                 <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-xl" />
//                               </div>
//                               <div>
//                                 <h4 className="text-xl font-bold capitalize">{sub.subscription_name}</h4>
//                                 <p className="text-slate-300 text-lg font-semibold">₹{sub.offer_price}</p>
//                               </div>
//                             </div>

//                             {/* Details Grid */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//                               <div className="flex items-center gap-2 text-slate-300">
//                                 <Clock size={16} />
//                                 <span className="text-sm">Duration: <strong className="text-white">{sub.duration} months</strong></span>
//                               </div>
//                               <div className="flex items-center gap-2 text-slate-300">
//                                 <CreditCard size={16} />
//                                 <span className="text-sm">Original: <strong className="text-white line-through">₹{sub.price}</strong></span>
//                               </div>
//                               <div className="flex items-center gap-2 text-slate-300">
//                                 <Gift size={16} />
//                                 <span className="text-sm">You Saved: <strong className="text-green-400">₹{sub.price - sub.offer_price}</strong></span>
//                               </div>
//                               <div className="flex items-center gap-2 text-slate-300">
//                                 <Calendar size={16} />
//                                 <span className="text-sm">Expires: <strong className="text-white">{new Date(sub.expiry_date).toLocaleDateString("en-GB")}</strong></span>
//                               </div>
//                             </div>

//                             {/* Time Remaining */}
//                             <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-xl">
//                               <div className="flex items-center justify-between">
//                                 <span className="font-bold text-white">Time Remaining:</span>
//                                 <div className="text-white font-bold">
//                                   {!isExpired ? (
//                                     days > 3 ? (
//                                       <span className="text-xl">{days} Days Left</span>
//                                     ) : (
//                                       <span className="text-lg">{days}d {hours}h {minutes}m {seconds}s</span>
//                                     )
//                                   ) : (
//                                     <span className="text-red-300 text-xl">Expired</span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <Package size={64} className="text-gray-300 mx-auto mb-4" />
//                       <h4 className="text-xl font-semibold text-gray-600 mb-2">No Active Subscriptions</h4>
//                       <p className="text-gray-500">Subscribe to access premium content and features</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Transaction History */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white rounded-2xl shadow-xl border border-gray-100"
//           >
//             <div className="p-6 border-b border-gray-100">
//               <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
//                 <CreditCard className="text-green-600" />
//                 Transaction History
//               </h3>
//             </div>
//             <div className="p-6">
//               <DataTable
//                 columns={columns}
//                 data={transactions}
//                 pagination
//                 highlightOnHover
//                 onChangePage={(page) => setCurrentPage(page)}
//                 striped
//                 noDataComponent={
//                   <div className="text-center py-12">
//                     <CreditCard size={64} className="text-gray-300 mx-auto mb-4" />
//                     <p className="text-gray-500 text-lg">No transactions found</p>
//                   </div>
//                 }
//                 customStyles={{
//                   table: {
//                     style: {
//                       borderRadius: '12px',
//                     },
//                   },
//                   headRow: {
//                     style: {
//                       backgroundColor: '#f8fafc',
//                       borderRadius: '12px 12px 0 0',
//                     },
//                   },
//                   headCells: {
//                     style: {
//                       fontWeight: '600',
//                       color: '#374151',
//                     },
//                   },
//                   rows: {
//                     style: {
//                       '&:hover': {
//                         backgroundColor: '#f8fafc',
//                       },
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;


import React, { useEffect, useState, useRef } from "react";
import { getUserDataDecrypted, saveUserDataEncrypted } from "../helpers/userStorage";
import { getTransactionSlice } from "../redux/HomeSlice";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { 
  User, Mail, Phone, MapPin, Calendar, Wallet, CreditCard, Package, 
  Clock, CheckCircle2, XCircle, TrendingUp, Activity, Shield, Gift,
  Camera, Loader2, X, Upload, Edit, Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showSuccessToast, showErrorToast } from "../utils/ToastUtil";
import { updateProfileSlice } from "../redux/authSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Profile Edit States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    state: '',
    city: '',
    dob: ''
  });
  
  const perPage = 10;

  const loadUserData = async () => {
    const user = await getUserDataDecrypted();
    setUserInfo(user);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      gender: user?.gender || '',
      state: user?.state || '',
      city: user?.city || '',
      dob: user?.dob || ''
    });
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

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Image Selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showErrorToast('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showErrorToast('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = () => {
    setFormData({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      mobile: userInfo?.mobile || '',
      gender: userInfo?.gender || '',
      state: userInfo?.state || '',
      city: userInfo?.city || '',
      dob: userInfo?.dob || ''
    });
    setImagePreview(userInfo?.profile || null);
    setSelectedImage(null);
    setShowEditModal(true);
  };

  // Close Edit Modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = async () => {
    // Validation
    if (!formData.name.trim()) {
      showErrorToast('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      showErrorToast('Email is required');
      return;
    }
    if (!formData.mobile.trim()) {
      showErrorToast('Mobile is required');
      return;
    }

    setEditLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('dob', formData.dob);
      
      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('profile', selectedImage);
      }

      const res = await dispatch(updateProfileSlice(formDataToSend)).unwrap();

      if (res.status_code === 200 || res.success) {
        showSuccessToast('Profile updated successfully!');
        
        // Update local user data
        const updatedUser = {
          ...userInfo,
          ...formData,
          profile: res.data?.profile || imagePreview || userInfo.profile
        };
        
        await saveUserDataEncrypted(updatedUser);
        setUserInfo(updatedUser);
        
        handleCloseEditModal();
      } else {
        showErrorToast(res.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showErrorToast(error.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  // DataTable columns
  const columns = [
    {
      name: '#',
      cell: (row, index) => (
        <div className="font-semibold text-gray-600">
          {(currentPage - 1) * perPage + index + 1}
        </div>
      ),
      width: '60px',
    },
    {
      name: 'Date',
      selector: row => new Date(row.created_at).toLocaleDateString('en-IN'),
      sortable: true,
      cell: row => (
        <div className="font-medium text-gray-700">
          {new Date(row.created_at).toLocaleDateString('en-IN')}
        </div>
      )
    },
    {
      name: 'Order ID',
      selector: row => row.order_id,
      sortable: true,
      cell: row => (
        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {row.order_id}
        </div>
      )
    },
    {
      name: 'Payment ID',
      selector: row => row.payment_id,
      sortable: true,
      cell: row => (
        <div className="font-mono text-sm text-blue-600 truncate max-w-[120px]">
          {row.payment_id}
        </div>
      )
    },
    {
      name: 'Amount',
      selector: row => `₹${parseFloat(row.amount).toFixed(2)}`,
      sortable: true,
      cell: row => (
        <div className={`font-bold text-lg ${
          row.paying_status === 'true' ? 'text-green-600' : 'text-red-600'
        }`}>
          ₹{parseFloat(row.amount).toFixed(2)}
        </div>
      ),
    },
    {
      name: 'Description',
      selector: row => getTransactionDescription(row),
      cell: row => (
        <div className="text-gray-700 font-medium">
          {getTransactionDescription(row)}
        </div>
      )
    },
    {
      name: 'Status',
      selector: row => row.paying_status,
      cell: row => (
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
          row.paying_status === 'true' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.paying_status === 'true' ? (
            <><CheckCircle2 size={14} /> Success</>
          ) : (
            <><XCircle size={14} /> Failed</>
          )}
        </div>
      ),
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full">
        <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col h-screen w-full">
        <main className="flex-grow bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-semibold">No user information found</p>
            <p className="text-gray-500 mt-2">Please try logging in again</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Subscription</p>
                  <p className="text-2xl font-bold">
                    {userInfo.subscription_status ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <Shield size={32} className="text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Wallet Balance</p>
                  <p className="text-2xl font-bold">₹{userInfo.wallet_balance}</p>
                </div>
                <Wallet size={32} className="text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
                <TrendingUp size={32} className="text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Account Status</p>
                  <p className="text-2xl font-bold capitalize">{userInfo.status}</p>
                </div>
                <Activity size={32} className="text-orange-200" />
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile - Left Column */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="relative mx-auto w-32 h-32 mb-6">
                    {userInfo.profile ? (
                      <img
                        src={userInfo.profile}
                        alt="User"
                        className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <User size={48} className="text-white" />
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{userInfo.name}</h2>
                  <p className="text-gray-500 font-medium">{userInfo.email}</p>
                  
                  {/* Edit Profile Button */}
                  <button
                    onClick={handleOpenEditModal}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{userInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="font-medium text-gray-800">{userInfo.mobile}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={20} className="text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">{userInfo.city}, {userInfo.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar size={20} className="text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-800">{userInfo.dob}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Mentor */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">Contact Your Mentor</h3>
                  <div className="flex gap-3">
                    <a
                      href="tel:+917822936229"
                      className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-black py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <IoCall size={20} />
                      Call
                    </a>
                    <a
                      href="https://wa.me/917822936229"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-black py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <IoLogoWhatsapp size={20} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Subscriptions - Right Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Package className="text-blue-600" />
                    My Subscriptions
                  </h3>
                </div>

                <div className="p-6">
                  {userInfo?.subscription_details?.length > 0 ? (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                      {userInfo.subscription_details.map((sub, index) => {
                        const expiry = new Date(sub.expiry_date);
                        const now = new Date();
                        const timeDiff = expiry - now;
                        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                        const isExpired = timeDiff <= 0;

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full -translate-y-16 translate-x-16"></div>
                            
                            <div className="absolute top-4 right-4">
                              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                ACTIVE
                              </span>
                            </div>

                            <div className="flex items-center gap-4 mb-6 relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <Package size={32} className="text-white" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold capitalize">{sub.subscription_name}</h4>
                                <p className="text-slate-300 text-lg font-semibold">₹{sub.offer_price}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center gap-2 text-slate-300">
                                <Clock size={16} />
                                <span className="text-sm">Duration: <strong className="text-white">{sub.duration} months</strong></span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <CreditCard size={16} />
                                <span className="text-sm">Original: <strong className="text-white line-through">₹{sub.price}</strong></span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Gift size={16} />
                                <span className="text-sm">You Saved: <strong className="text-green-400">₹{sub.price - sub.offer_price}</strong></span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Calendar size={16} />
                                <span className="text-sm">Expires: <strong className="text-white">{new Date(sub.expiry_date).toLocaleDateString("en-GB")}</strong></span>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-xl">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white">Time Remaining:</span>
                                <div className="text-white font-bold">
                                  {!isExpired ? (
                                    days > 3 ? (
                                      <span className="text-xl">{days} Days Left</span>
                                    ) : (
                                      <span className="text-lg">{days}d {hours}h {minutes}m</span>
                                    )
                                  ) : (
                                    <span className="text-red-300 text-xl">Expired</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package size={64} className="text-gray-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-600 mb-2">No Active Subscriptions</h4>
                      <p className="text-gray-500">Subscribe to access premium content and features</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Transaction History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <CreditCard className="text-green-600" />
                Transaction History
              </h3>
            </div>
            <div className="p-6">
              <DataTable
                columns={columns}
                data={transactions}
                pagination
                highlightOnHover
                onChangePage={(page) => setCurrentPage(page)}
                striped
                noDataComponent={
                  <div className="text-center py-12">
                    <CreditCard size={64} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No transactions found</p>
                  </div>
                }
                customStyles={{
                  table: { style: { borderRadius: '12px' } },
                  headRow: { style: { backgroundColor: '#f8fafc', borderRadius: '12px 12px 0 0' } },
                  headCells: { style: { fontWeight: '600', color: '#374151' } },
                  rows: { style: { '&:hover': { backgroundColor: '#f8fafc' } } },
                }}
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit className="text-blue-600" />
                  Edit Profile
                </h3>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={editLoading}
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Profile Photo Section */}
              <div className="mb-6 text-center">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <Camera size={18} />
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">Click camera icon to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your state"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your city"
                  />
                </div>

                {/* Date of Birth */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCloseEditModal}
                  disabled={editLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileUpdate}
                  disabled={editLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
