// src/components/ProfileManagement.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Assuming you're using Redux
import { notification } from 'antd'; // For notifications
import { useUpdateUserMutation, useGetUserQuery } from '../../api/Profileupdateapi';
import { Navigate, useNavigate } from 'react-router-dom'; // For navigation after update
import { updateUserState } from '../../../features/Loginslice';
import axios from 'axios';

const Profile = ({ setProfile }) => {

  const { data: userData, error: fetchError, isLoading: isFetching } = useGetUserQuery(); // Fetch user data

  const navigate = useNavigate(); // Use navigate for redirection
  const { user, token } = useSelector((state) => state.auth); // Get user data from Redux
 
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // Local state for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation(); // API hook

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  const fetchUsers = async () => {
  
    setLoading(true); // Start loading state
  
    try {
      const response = await axios.get('https://task-manager.codionslab.com/api/v1/profile', {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });
  console.log(response.data.data)
      // Dispatch fetched user data to Redux
  
      dispatch(updateUserState(response?.data?.data)); // Assuming response.data contains user info
  navigate("/dashboard")
      // Optionally, you could set the fetched data to local state if needed
      // setUsers(response.data); // If you want to keep a local copy of users
    } catch (error) {
      console.error('Failed to fetch users:', error);
      notification.error({
        message: 'Fetch Users Failed',
        description: error?.response?.data?.message || 'An error occurred while fetching user data.',
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  
  // Set form fields with user data
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the API request
      const updatedUser = await updateUser({ name, email, password }).unwrap();
      console.log( "update",updatedUser);
      fetchUsers()
      // Dispatch updated user data to Redux
    //  dispatch(updateUserState(userData.data));

      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        placement: 'topRight',
        duration: 1,  // Auto-close after 1 second
      });
     
      // Clear password field after submission
      setPassword('');

      // Redirect to dashboard after update
      
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      notification.error({
        message: 'Profile Update Failed',
        description: error?.data?.message || 'An error occurred during profile update.',
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  if (isFetching) return <div>Loading user data...</div>; // Handle loading state
  if (fetchError) return <div>Error fetching user data: {fetchError.message}</div>; // Handle fetch error

  return (
    <div className="w-[90%] mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile Management</h2>
      
      {/* Display User Role */}
      <div className="flex items-center justify-center mb-4">
        <span className="capitalize text-lg font-semibold">{user?.role}</span>
      </div>

      {/* Profile Form */}
      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300"
          disabled={isUpdating} // Disable button while updating
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
