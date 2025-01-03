import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
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
import { CreateOrJoinOrg } from './pages/CreateOrJoinOrg';
import { AuthCallback } from './pages/AuthCallback';
import { SettingsPage } from './pages/SettingsPage';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { checkHealth } from './services/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkServiceHealth = async () => {
      const isHealthy = await checkHealth();
      if (isHealthy) {
        setIsLoading(false);
        return;
      }

      // retry after 3 seconds if the service is not healthy
      setTimeout(() => setIsLoading(false), 3000);
    };

    checkServiceHealth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <>
                <Helmet>
                  <title>Status Page - Home</title>
                  <meta name="description" content="Monitor and manage service status pages" />
                </Helmet>
                <Home />
              </>
            } />
            <Route path="/:orgIdentifier/status" element={
              <>
                <Helmet>
                  <title>Service Status Dashboard</title>
                  <meta name="description" content="View current status of all services" />
                </Helmet>
                <PublicStatusPage />
              </>
            } />
            <Route path="/:orgIdentifier/service/:serviceIdentifier/incidents" element={
              <Layout>
                <Helmet>
                  <title>Service Incidents History</title>
                  <meta name="description" content="View service incident history and updates" />
                </Helmet>
                <ServiceIncidentsPage />
              </Layout>
            } />
            <Route path="/:orgIdentifier/login" element={
              <>
                <Helmet>
                  <title>Login - Status Page</title>
                  <meta name="description" content="Log in to manage your services" />
                </Helmet>
                <Login />
              </>
            } />
            <Route path="/signup" element={
              <>
                <Helmet>
                  <title>Sign Up - Status Page</title>
                  <meta name="description" content="Create a new account" />
                </Helmet>
                <Login />
              </>
            } />
            <Route path="/create-or-join-org" element={
              <>
                <Helmet>
                  <title>Create or Join Organization</title>
                  <meta name="description" content="Create a new organization or join an existing one" />
                </Helmet>
                <CreateOrJoinOrg />
              </>
            } />
            <Route path="/:orgIdentifier/manage" element={
              <Layout>
                <Helmet>
                  <title>Service Management Dashboard</title>
                  <meta name="description" content="Manage your services and incidents" />
                </Helmet>
                <AdminDashboard />
              </Layout>
            } />
            <Route path="/:orgIdentifier/manage/service/:serviceIdentifier" element={
              <Layout>
                <Helmet>
                  <title>Service Incident Management</title>
                  <meta name="description" content="Manage service incidents and updates" />
                </Helmet>
                <ServiceManagement />
              </Layout>
            } />
            <Route path="/:orgIdentifier/manage/settings" element={
              <Layout>
                <Helmet>
                  <title>Organization Settings</title>
                  <meta name="description" content="Manage organization settings and users" />
                </Helmet>
                <SettingsPage />
              </Layout>
            } />
            <Route path="/callback" element={
              <>
                <Helmet>
                  <title>Authenticating...</title>
                </Helmet>
                <AuthCallback />
              </>
            } />
            <Route path="/page-not-found" element={
              <>
                <Helmet>
                  <title>404 - Page Not Found</title>
                </Helmet>
                <NotFound />
              </>
            } />
            <Route path="*" element={<Navigate to="/page-not-found" replace />} />
          </Routes>
          <ToastContainer />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;