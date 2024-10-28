import React, { useState } from 'react';
import { persistor } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../features/loginSlice';
import { notification } from 'antd';
import menueicon from "../../image/menu.svg"
import closeicon from "../../image/closeicon.svg"
function Admindashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, role } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await persistor.purge();
      dispatch(logout());
      notification.success({
        message: 'Logout Successful',
        description: 'You have successfully logged out.',
        placement: 'topRight',
        duration: 1,
      });
      navigate('/login');
    } catch (error) {
      console.error("Error purging persisted state:", error);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Sidebar Drawer */}
      <aside className={`fixed inset-0 z-10 bg-gray-800 lg:mt-0 mt-20 text-white transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-64`}>
        <div className="p-6">
          <Link to="/dashboard">
          <h2 className="text-2xl font-bold capitalize">{user?.role} Dashboard</h2></Link>
         
          <p className="font-semibold mt-6 capitalize">{user?.name}</p>

        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard/profile" className="block py-2 px-4 hover:bg-gray-700" onClick={closeDrawer}>
                Profile Management
              </Link>
            </li>
            {role === "admin" && (
              <>
                <li>
                  <Link to="/dashboard/user-management" className="block py-2 px-4 hover:bg-gray-700" onClick={closeDrawer}>
                    User Management
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/project-management" className="block py-2 px-4 hover:bg-gray-700" onClick={closeDrawer}>
                    Project Management
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
  <header className="flex justify-between items-center p-6 bg-white shadow-md">
   <Link to="/dashboard">
   <div className="text-lg font-semibold" onClick={closeDrawer}>Task Management Application</div>
   </Link>
   
    <div className="flex items-center space-x-4">
      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
    <button
      className="lg:hidden"
      onClick={() => setIsDrawerOpen(!isDrawerOpen)}
    >
      <img 
        src={isDrawerOpen ? closeicon : menueicon} // Use different icons for open/close
        alt={isDrawerOpen ? 'Close Menu' : 'Open Menu'} 
        width={24} // Adjust the size as needed
        height={24}
      />
    </button>
  </header>

  {/* Main Dashboard Content */}
  <main className="flex-1 overflow-y-auto p-6">
    <Outlet />
  </main>
</div>

    </div>
  );
}

export default Admindashboard;
