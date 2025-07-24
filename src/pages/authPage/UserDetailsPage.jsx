import React, { useState } from 'react';
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from 'react-country-state-city';

import 'react-country-state-city/dist/react-country-state-city.css';
import { useDispatch } from 'react-redux';
import { updateProfileSlice } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const UserDetailsPage = () => {
  const dispatch = useDispatch()
  const nav = useNavigate()

  const [selectedCountryId, setSelectedCountryId] = useState(101);
  const [selectedStateId, setSelectedStateId] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
    category: '',
    state: '',
    city: '',
    profile: '',

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.state == '' || formData.city == '') return alert("Please fill all inputs")
    try {
      const res = await dispatch(updateProfileSlice(formData)).unwrap();
      if (res.status_code == 200) {
        // console.log("res", res)
        // return
        localStorage.setItem("user", JSON.stringify(res.data))
        nav('/', { replace: true })
      }
    } catch (error) {
      // console.log("error in update profile", error)
    }

  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-xl font-semibold text-center mb-4">User Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1">Gender</label>
          <select
            name="gender"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            <option>GEN</option>
            <option>EWS</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
          </select>
        </div>

        {/* Country */}
        {/* <div>
          <label className="block mb-1">Country</label>
          <CountrySelect
            onChange={(val) => {
              // console.log("vale", val)
              setSelectedCountryId(val.id);
              setFormData(prev => ({
                ...prev,
                country: val.name,
                state: '',
                city: ''
              }));
              setSelectedStateId(0); // reset stateId
            }}
            placeHolder="Select Country"
          />
        </div> */}

        {/* State */}
        <div>
          <label className="block mb-1">State</label>
          <StateSelect
            countryid={selectedCountryId}
            onChange={(val) => {
              setSelectedStateId(val.id);
              setFormData(prev => ({
                ...prev,
                state: val.name,
                city: ''
              }));
            }}
            placeHolder="Select State"
          />
        </div>

        {/* City */}
        <div>
          <label className="block mb-1">City</label>
          <CitySelect
            countryid={selectedCountryId}
            stateid={selectedStateId}
            onChange={(val) => {
              setFormData(prev => ({
                ...prev,
                city: val.name
              }));
            }}
            placeHolder="Select City"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserDetailsPage;
