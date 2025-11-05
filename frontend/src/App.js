import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Profile from './pages/Profile';
import ProjectPage from './pages/ProjectPage';
import PortfolioBuilder from './components/Portfolio/PortfolioBuilder';
import PublicPortfolio from './pages/PublicPortfolio';
import Navbar from './components/UI/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith('/u/') ||
    location.pathname.startsWith('/projects/');

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/projects/public/:id" element={<PublicProject />} />
        <Route path="/portfolio" element={<PortfolioBuilder />} />
        <Route path="/u/:username" element={<PublicPortfolio />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router basename="/">
        <Layout />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}
