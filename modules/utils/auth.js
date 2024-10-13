const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    if(!req.headers["authorization"]) {
        return res.status(400).json({success : false, message: "token-required"});
    }

    try {
        const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET);
        if(!decoded) {
            return res.status(403).json({ success : false, message: "invalid-token"});
        }

        next();
    } catch (error) {
        return res.status(403).json({ success : false, message: "expired-token", data : error });
    }
}

const ensureAdmin = (req, res, next) => {
    console.log(req.params.reviewId);
    if(!req.headers["authorization"]) {
        return res.status(400).json({success : false, message: "token-required"});
    }

    try {
        const superAdmin = jwt.verify(req.headers['authorization'], process.env.SUPER_ADMIN_SECRET);
        if(!superAdmin) {
            const admin = jwt.verify(req.headers['authorization'], process.env.ADMIN_SECRET);
            if(!admin) {
                const moderator = jwt.verify(req.headers['authorization'], process.env.MODERATOR_SECRET);
                if(!moderator) {
                    return res.status(403).json({ success : false, message: "fake-token" });    
                }
            }
        }

        next();
    } catch (error) {
        return res.status(403).json({ success : false, message: "expired-token", data : error });
    }
}

const ensureAdminPower = (req, res, next) => {
    if(!req.headers["authorization"]) {
        return res.status(400).json({success : false, message: "token-required"});
    }

    try {
        const superAdmin = jwt.verify(req.headers['authorization'], process.env.SUPER_ADMIN_SECRET);
        if(!superAdmin) {
            const admin = jwt.verify(req.headers['authorization'], process.env.ADMIN_SECRET);
            if(!admin) {
                res.status(404).json({ success: false, message: "power-not-found" });
            }
        }

        next();
    } catch (error) {
        return res.status(403).json({ success : false, message: "expired-token", data : error });
    }
}





module.exports = {
    ensureAuthenticated, ensureAdmin, ensureAdminPower
}