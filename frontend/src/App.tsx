import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PublicStatusPage } from './pages/PublicStatusPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ServiceIncidentsPage } from './pages/ServiceIncidentsPage'; // Import ServiceIncidentsPage component
import { Layout } from './components/Layout';
import { AuthProvider } from './components/AuthProvider';
import { NotFound } from './pages/NotFound';
import { Navigate } from 'react-router-dom';
import { Login } from './pages/Login'; // Import Login component
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/:orgIdentifier/status" element={<PublicStatusPage />} />
          <Route path="/:orgIdentifier/login" element={<Login />} />
          <Route path="/:orgIdentifier/manage" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/:orgIdentifier/service/:serviceIdentifier/incidents" element={<Layout><ServiceIncidentsPage /></Layout>} />
          <Route path="*" element={<Navigate to="/page-not-found" replace />} />
          <Route path="/page-not-found" element={<NotFound />} />
        </Routes>
        <ToastContainer /> {/* Add ToastContainer */}
      </AuthProvider>
    </Router>
  );
}

export default App;