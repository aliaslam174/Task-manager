import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Home({children}) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to dashboard if authenticated
  return <Navigate to="/dashboard" />;
}

export default Home;
