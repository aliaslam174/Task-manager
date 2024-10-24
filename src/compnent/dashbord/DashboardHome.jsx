import React from 'react'
import { useSelector } from 'react-redux';


function DashboardHome() {
  const { isAuthenticated, loading, error, user, totaluser, role } = useSelector((state) => state.auth);
  return (
  <>

  {
    role==="admin"?(  <main className="flex-1 overflow-y-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard Cards */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="mt-2 text-gray-600">{totaluser}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold">Active Projects</h3>
          <p className="mt-2 text-gray-600">8</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold">Pending Tasks</h3>
          <p className="mt-2 text-gray-600">45</p>
        </div>
      </div>
    </main>):null
  }
  
  
  </>
  )
}

export default DashboardHome