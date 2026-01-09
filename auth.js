import jwt from 'jsonwebtoken'


export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    try {
            const decoded = jwt.verify(token, 'secret');
            console.log(decoded)
        req.user = decoded;
        req.userId = decoded.userId;
        const role = req.user.role
        if(role === 'admin'){
            next();
        }
        else{
            res.status(401).json({
                message:"you are not Admin"
            })
        }
    } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(401).json({ error: 'Invalid token' });
    }
};