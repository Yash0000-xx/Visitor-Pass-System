import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    let savedToken = localStorage.getItem('token');
    let currentRole = localStorage.getItem('userRole');

    if (!savedToken) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        let hasPermission = allowedRoles.includes(currentRole);
        
        if (!hasPermission) {
            if (currentRole === 'Employee') {
                return <Navigate to="/employee-dashboard" replace />;
            } else {
                return <Navigate to="/dashboard" replace />;
            }
        }
    }

    return children;
}

export default ProtectedRoute;