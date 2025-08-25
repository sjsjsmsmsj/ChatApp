import './index.css'
import Navbar from '../src/components/Navbar.jsx'
import { Routes, Route } from "react-router-dom"
import HomePage from '../src/pages/HomePage.jsx'
import SignUpPage from '../src/pages/SignUpPage.jsx'
import LoginPage from '../src/pages/LoginPage.jsx'
import SettingsPage from '../src/pages/SettingsPage.jsx'
import ProfilePage from '../src/pages/ProfilePage.jsx'
import { axiosInstance } from './lib/axios.js'
import { useEffect } from 'react'




const App = () => {

  const { authUser } = useAuthStore()

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>



    </div>
  )
}

export default App