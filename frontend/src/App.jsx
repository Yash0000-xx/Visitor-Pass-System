// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import RegisterVisitor from './components/RegisterVisitor';
import Dashboard from './components/Dashboard';
import IssuePass from './components/IssuePass'; // <-- 1. Import the final component

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav style={{ padding: '1rem 2rem', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Visitor Pass System</h2>
          
          <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register-visitor" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            {/* Added the final link */}
            <Link to="/issue-pass" style={{ color: '#00d2d3', textDecoration: 'none' }}>Issue Pass</Link> 
          </div>
        </nav>

        {/* Page Routing */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register-visitor" element={<RegisterVisitor />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* 2. Connect the route */}
            <Route path="/issue-pass" element={<IssuePass />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;