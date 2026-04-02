import { useState } from 'react'
import { Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {

  return (
    
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover bg-center min-h-screen" >
    <Routes>
      <Route path = '/' element = {<Home />} />
      <Route path ='/login' element = {<Login />} />
      <Route path ='/profile' element = {<Profile />} />
    </Routes>
    </div>
    
  )
}

export default App
