import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../presentation/pages/home/HomePage'
import LoginPage from '../presentation/pages/login/LoginPage'
import RegisterPage from '../presentation/pages/register/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
