

import './App.css'
import Header from './components/shared-ui/Header.tsx'
import Login from './pages/Authentication/Login'
// import LandingPage from './pages/landingPage/LandingPage.tsx'
import { Routes, Route } from 'react-router-dom'

function App(){

  return (
    <>
    <Header />
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/login" element={<Login />} />

      </Routes></>
  )
}
export default App
