import React from 'react'
import Signup from './components/Signup'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {

  return (
    <div>
      <Routes>
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </div>

  )
}

export default App
