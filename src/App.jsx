import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AdminPanel from './Pages/adminPanel'
import Login from './Pages/loginPage'
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes> 
        <Route path="/" element={<Login/>}/>
        <Route path="/AdminPanel" element={<AdminPanel/>}/>
      </Routes>
    </div>
  )
}

export default App
