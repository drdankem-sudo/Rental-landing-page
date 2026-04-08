const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token
async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Check role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Check property access (owner or manager)
async function requirePropertyAccess(req, res, next) {
  const propertyId = req.params.propertyId || req.body.propertyId;
  if (!propertyId) return res.status(400).json({ error: 'Property ID required' });

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return res.status(404).json({ error: 'Property not found' });

  // Owner has full access
  if (property.ownerId === req.user.id) {
    req.property = property;
    return next();
  }

  // Check if user is a manager/caretaker
  const manager = await prisma.propertyManager.findUnique({
    where: { propertyId_userId: { propertyId, userId: req.user.id } },
  });

  if (!manager) return res.status(403).json({ error: 'No access to this property' });

  req.property = property;
  req.managerRole = manager;
  next();
}

module.exports = { authenticate, requireRole, requirePropertyAccess };
