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
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/';
    };

    return (
        <Router>
            <div style={{ fontFamily: 'Arial, sans-serif' }}>
                <nav style={{ padding: '15px 20px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Smart Visitor System</h2>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register-visitor" style={{ color: 'white', textDecoration: 'none' }}>Pre-Register</Link>
                        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Admin Dashboard</Link>
                        <Link to="/employee-dashboard" style={{ color: 'white', textDecoration: 'none' }}>Staff Dashboard</Link>
                        <Link to="/qr-scanner" style={{ color: 'white', textDecoration: 'none' }}>Security Scanner</Link>
                        <Link to="/issue-pass" style={{ color: '#00d2d3', textDecoration: 'none', fontWeight: 'bold' }}>Issue Pass</Link> 
                        
                        <button 
                            onClick={handleLogout} 
                            style={{ padding: '6px 12px', marginLeft: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Logout
                        </button>
                    </div>
                </nav>

                <div style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register-visitor" element={<RegisterVisitor />} />
                        <Route path="/admin-register" element={<AdminRegister />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />

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