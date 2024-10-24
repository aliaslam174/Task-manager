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


function App() {
  

  return (
    <>



      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<AuthGurd><Admindashboard /></AuthGurd>}>
          <Route index element={<Maindashcontent />} /> {/* Default content */}
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="project-management" element={<ProjectManagement />} /> {/* Example of nested route */}
        </Route>

        {/* You can define the user dashboard similarly */}
        <Route path='/userdashboard' element={<Userdashboard />} />

        {/* Redirect to home if no route matches */}
        <Route path='*' element={<Navigate to='/' />} />

      </Routes>
    </>
  )
}

export default App
