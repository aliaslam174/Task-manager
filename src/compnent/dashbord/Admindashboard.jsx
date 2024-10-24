import React, { useState } from 'react'
import { persistor } from '../../store'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/loginSlice'
import { notification } from 'antd';
import ProfileManagement from './profile/ProfileManagement';
import UserManagement from './usermanagement/UserManagement';
import Profile from './profile/Profile';
import ProjectManagement from './profile/project/ProjectManagement ';
import KanbanBoard from '../kanbanboard/KanbanBoard';

function Admindashboard() {

  const dispatch = useDispatch();  // Hook must be at the top level
  const navigate = useNavigate();

  const [profile, setProfile] = useState(false)
  const [dashbord, setdashbord] = useState(true)
  const [alluser, setAlluser] = useState(false)
  const [projects, setProjects] = useState(false)

  const { isAuthenticated, loading, error, user, totaluser, role } = useSelector((state) => state.auth);


  const handleLogout = async () => {



    try {
      // Step 1: Purge persisted state
      await persistor.purge();
      console.log("Persisted state cleared!");

      // Step 2: Dispatch logout action to update Redux state
      dispatch(logout());

      // Step 3: Redirect to login page


      notification.success({
        message: 'Logout Successful',
        description: 'You have successfully logged out.',
        placement: 'topRight',
        duration: 1,  // Auto-close after 3 seconds
      });

      navigate('/login');








    } catch (error) {
      console.error("Error purging persisted state:", error);
    }

  };
  return (
    <>








      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-gray-800 text-white flex-shrink-0 lg:flex flex-col">

          <div className="p-6">
            <h2 onClick={() => { setdashbord(true), setProfile(false), setAlluser(false), setProjects(false) }} className="text-2xl cursor-pointer font-bold capitalize">{user.role}  Dashboard</h2>
            <p className="font-semibold mt-6 capitalize"> {user.name}  </p> {/* Admin name */}

          </div>
          <nav className="flex-1 mt-6">
            <ul className="space-y-2">

              <li>
                <Link onClick={() => { setProfile(true), setdashbord(false), setAlluser(false), setProjects(false) }} className="block py-2 px-4 hover:bg-gray-700">
                  Profile Management
                </Link>
              </li>
              {role === "admin" ? (<li>
                <Link onClick={() => { setdashbord(false), setProfile(false), setAlluser(true), setProjects(false) }} className="block py-2 px-4 hover:bg-gray-700">
                  User Management
                </Link>
              </li>) : null}
              {role === "admin" ? (<li>
                <Link onClick={() => { setdashbord(false), setProfile(false), setAlluser(false), setProjects(true) }} className="block py-2 px-4 hover:bg-gray-700">
                  Project Management
                </Link>
              </li>) : null}

              {role === "admin" ? (<li>
                <Link className="block py-2 px-4 hover:bg-gray-700">
                  Task Management
                </Link>
              </li>) : null}

            </ul>
          </nav>
        </aside>


        {/* Main Content */}


        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}

          <header className="flex justify-between items-center p-6 bg-white shadow-md">
            <div className="text-lg font-semibold text-center">Task Management Application</div>

            <div className="flex items-center space-x-6">
              {/* Display admin name and email */}
              <div className="text-gray-800">



              </div>

              {/* Notification and Logout buttons */}
              <div className="flex items-center space-x-4">

                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          {role === "admin" ? (<main className="flex-1 overflow-y-auto p-6">
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
          </main>) : null}

          {
            profile ? <Profile setProfile={setProfile}/> : null
          }
          {
            alluser ? <UserManagement /> : null
          }
          {
            projects ? <ProjectManagement /> : null
          }
          {/* <div className='mt-16'>
            {
              role === "user" && dashbord && <KanbanBoard />  
            }

          </div> */}


        </div>


      </div>

    </>


  )
}

export default Admindashboard