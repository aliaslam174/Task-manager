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


function App() {
  const { isAuthenticated,role } = useSelector((state) => state.auth);

  return (
    <>
   


      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/admin/profile' element={<ProfileManagement/>}/>
        
        <Route path='/dashbord' element={<AuthGurd> 
          {role==="admin"?<Admindashboard />:<Userdashboard/>}
          
          </AuthGurd>
          }
        />
      </Routes>
    </>
  )
}

export default App
