// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// This function acts as a digital bouncer for your API routes
const verifyToken = (req, res, next) => {
    try {
        // 1. Check if the user sent a token in their request headers
        let token = req.header('Authorization');

        if (!token) {
            return res.status(403).json({ message: 'Access Denied. No token provided.' });
        }

        // 2. Clean up the token string (remove the word "Bearer ")
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        // 3. Verify the token using your secret key from the .env file
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the verified user data to the request and let them pass
        req.user = verified;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = { verifyToken };