import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import NavbarVariant2 from './components/NavbarVariant2';
import FooterVariant2 from './components/FooterVariant2';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/HomePaletteTeal';
import About from './pages/About';
import Research from './pages/Research';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import BlogEditor from './pages/BlogEditor';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ScrollToTop from './components/ScrollToTop';

function PublicLayout() {
  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#DCF4F1', color: '#062926', '--tw-prose-body': '#1C3835' }}>
      <NavbarVariant2 />
      <div className="flex-grow">
        <Outlet />
      </div>
      <FooterVariant2 />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/research" element={<Research />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute minRole="REVIEWER" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/blog/new" element={<BlogEditor />} />
            <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
