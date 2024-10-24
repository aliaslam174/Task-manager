import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return (
    <>
      <h1 align="center" className='text-3xl font-bold mt-5'>Task Manager Application</h1>
      {/* Other components or content can go here */}
    </>
  );
}

export default Home;
