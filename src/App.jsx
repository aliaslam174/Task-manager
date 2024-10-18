import { useState } from 'react'

import './App.css'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Login from './compnent/Login'
import Signup from './compnent/Signup'


function App() {

  const count = useSelector((state) => state)
  console.log(count)
  return (
    <>
      <h1 align="center" className='text-3xl'>Task Manager App </h1>


      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App
