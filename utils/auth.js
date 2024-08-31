const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    if(!req.headers["authorization"]) {
        return res.status(403).json({message: "Token in required"});
    }

    try {
        const decoded = jwt.verify(req.headers['authorization'], "full-secret");
        if(!decoded) {
            return res.status(403).json({message: "Invalid Token"});
        }
        next();
    } catch (error) {
        return res.status(403).json({message: "Invalid or Expired Token"});
    }
}

module.exports = {
    ensureAuthenticated
}