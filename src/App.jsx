import { useEffect, useState } from 'react'

import './App.css'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './compnent/Login'
import Signup from './compnent/Signup'
import Admindashboard from './compnent/dashbord/Admindashboard'
import AuthGurd from './compnent/Authgurd'
import Home from './compnent/Home'
import Userdashboard from './compnent/dashbord/Userdashboard'
import ProfileManagement from './compnent/dashbord/profile/ProfileManagement'
import Maindashcontent from './compnent/dashbord/DashboardHome'
import UserManagement from './compnent/dashbord/usermanagement/UserManagement'
import ProjectManagement from './compnent/dashbord/profile/project/ProjectManagement '
import AssignedProjects from './compnent/dashbord/user/AssignedProjects '


function App() {
  const { user, role } = useSelector((state) => state.auth);

  return (
    <>



      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path="/dashboard" element={<AuthGurd><Admindashboard /></AuthGurd>}>
      <Route index element={<Maindashcontent />} />
      <Route path="profile" element={<ProfileManagement />} />
      {role === 'admin' && (
        <>
          <Route path="user-management" element={<UserManagement />} />
          <Route path="project-management" element={<ProjectManagement />} />
        </>
      )}
    
      {/* Redirect to home if no route matches */}
      <Route path='*' element={<Navigate to='/dashboard' />} />
    </Route>

      </Routes>
    </>
  )
}

export default App
