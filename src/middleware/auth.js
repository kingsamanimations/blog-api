import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    // Token Verification
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        // For checking token expiry or copy error syntax
        // console.log('JWT error:', err.name, '-', err.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}