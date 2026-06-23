const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        let authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(403).json({ error: "No token provided, access denied" });
        }

        let actualToken = authHeader;
        
        if (authHeader.includes('Bearer')) {
            actualToken = authHeader.split(' ')[1];
        }

        let decodedData = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        req.user = decodedData;
        
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: "Token is invalid or expired" });
    }
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        let currentUser = req.user;

        if (!currentUser) {
            return res.status(403).json({ error: "User not found in request" });
        }

        let hasPermission = allowedRoles.includes(currentUser.role);

        if (!hasPermission) {
            return res.status(403).json({ error: "You don't have the right permissions for this" });
        }

        next();
    };
};

module.exports = { verifyToken, checkRole };