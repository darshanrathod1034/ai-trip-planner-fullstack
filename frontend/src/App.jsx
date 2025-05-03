import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import ViewTrip from './pages/ViewTrip'
import ProtectedRoute from './components/ProtectedRoute'
import PostFeed from './components/PostFeed'
import CreatePost from './components/CreatePost'
import AccountPage from './pages/AccountPage'
import { LoadScript } from '@react-google-maps/api'

const App = () => {
  return (
    <>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/create-trip' element={<CreateTrip />} />
            <Route path='/view-trip' element={<ViewTrip />} />
            <Route path='/createpost' element={<CreatePost />} />
            <Route path='/explore' element={<PostFeed />} />
            <Route path='/account' element={<AccountPage />} />
          </Route>
        </Routes>
      </LoadScript>
    </>
  )
}

export default App
