
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import RegisterVisitor from './components/RegisterVisitor';
import Dashboard from './components/Dashboard';
import IssuePass from './components/IssuePass'; 
import AdminRegister from './components/AdminRegister';
import QRScanner from './components/QRScanner';
import EmployeeDashboard from './components/EmployeeDashboard';
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
            <Route path="/" element={<Login />} />
            <Route path="/register-visitor" element={<RegisterVisitor />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qr-scanner" element={<QRScanner />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/issue-pass" element={<IssuePass />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;