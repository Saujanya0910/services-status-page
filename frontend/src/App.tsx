import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PublicStatusPage } from './pages/PublicStatusPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ServiceIncidentsPage } from './pages/ServiceIncidentsPage';
import { Layout } from './components/Layout';
import { AuthProvider } from './components/AuthProvider';
import { NotFound } from './pages/NotFound';
import { Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './pages/Home';
import { ServiceManagement } from './pages/ServiceManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:orgIdentifier/status" element={<PublicStatusPage />} />
          <Route path="/:orgIdentifier/service/:serviceIdentifier/incidents" element={<Layout><ServiceIncidentsPage /></Layout>} />
          <Route path="/:orgIdentifier/login" element={<Login />} />
          <Route path="/:orgIdentifier/manage" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/:orgIdentifier/manage/service/:serviceIdentifier" element={<Layout><ServiceManagement /></Layout>} />
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
          <Route path="/page-not-found" element={<NotFound />} />
        </Routes>
        <ToastContainer /> {/* Add ToastContainer */}
      </AuthProvider>
    </Router>
  );
}

export default App;