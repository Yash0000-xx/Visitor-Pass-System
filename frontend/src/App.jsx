import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import RegisterVisitor from './components/RegisterVisitor';
import Dashboard from './components/Dashboard';
import IssuePass from './components/IssuePass'; 
import AdminRegister from './components/AdminRegister';
import QRScanner from './components/QRScanner';
import EmployeeDashboard from './components/EmployeeDashboard';
import VerifyOTP from './components/VerifyOTP'; 
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: '1rem 2rem', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Visitor Pass System</h2>
          
          <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register-visitor" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/admin-register" style={{ color: 'white', textDecoration: 'none' }}>Admin Register</Link>
            <Link to="/qr-scanner" style={{ color: 'white', textDecoration: 'none' }}>Scan Pass</Link>
            <Link to="/issue-pass" style={{ color: '#00d2d3', textDecoration: 'none' }}>Issue Pass</Link> 
          </div>
        </nav>

        <div style={{ padding: '20px' }}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Login />} />
            <Route path="/register-visitor" element={<RegisterVisitor />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/verify-otp" element={<VerifyOTP />} /> {/* Added this route */}

            {/* PROTECTED ROUTES: Admin & Security */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Security']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/qr-scanner" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Security']}>
                  <QRScanner />
                </ProtectedRoute>
              } 
            />

            {/* PROTECTED ROUTES: Employees */}
            <Route 
              path="/employee-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/issue-pass" 
              element={
                <ProtectedRoute allowedRoles={['Employee', 'Admin']}>
                  <IssuePass />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;