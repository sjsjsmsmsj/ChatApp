import './index.css'
import Navbar from '../src/components/Navbar.jsx'
import { Routes, Route } from "react-router-dom"
import HomePage from '../src/pages/HomePage.jsx'
import SignUpPage from '../src/pages/SignUpPage.jsx'
import LoginPage from '../src/pages/LoginPage.jsx'
import SettingsPage from '../src/pages/SettingsPage.jsx'
import ProfilePage from '../src/pages/ProfilePage.jsx'
import { useEffect } from 'react'
import { useAuthStore } from '../src/store/useAuthStore.js'
import { Loader } from 'lucide-react'
import { Navigate } from 'react-router-dom'


const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({ authUser })

  if (isCheckingAuth && !authUser) {
    return <div>
      <Loader />
    </div>
  }

  if (!authUser)


    return (
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

        </Routes>



      </div>
    )
}

export default App