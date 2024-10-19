import { useEffect, useState } from 'react'

import './App.css'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './compnent/Login'
import Signup from './compnent/Signup'
import Dashbord from './compnent/dashbord/Dashbord'
import AuthGurd from './compnent/Authgurd'
import Home from './compnent/Home'


function App() {
  // const { isAuthenticated } = useSelector((state) => state.auth);
  // const navigate = useNavigate()
  // if (isAuthenticated) {
  //   useEffect(()=>{
  //       navigate("/dashbord")
  //   },[]);
  // }
  return (
    <>
   


      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        
        <Route path='/dashbord' element={<AuthGurd> <Dashbord /></AuthGurd>
          }
        />
      </Routes>
    </>
  )
}

export default App
