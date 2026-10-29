import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET || 'skillvault-dev-secret',
    { expiresIn: '7d' }
  );
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'skillvault-dev-secret');
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission for this action' });
    }
    next();
  };
}
