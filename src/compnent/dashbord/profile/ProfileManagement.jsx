// src/components/ProfileManagement.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Profile from './Profile';

const ProfileManagement = () => {

    const { isAuthenticated, loading, error,user } = useSelector((state) => state.auth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  return (
   
    <Profile/>
  );
};

export default ProfileManagement;
