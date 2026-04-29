const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth');
const sms = require('../services/sms');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/request-otp
// Send OTP to phone number
router.post('/request-otp', async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    // Normalize Kenyan phone: 0712... -> 254712...
    const normalized = normalizePhone(phone);

    // Find or note user
    let user = await prisma.user.findUnique({ where: { phone: normalized } });

    // Generate 6-digit OTP (dev mode uses fixed code 123456)
    const isDev = !process.env.AT_API_KEY || process.env.AT_USERNAME === 'sandbox';
    const code = isDev ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (user) {
      await prisma.otpCode.create({
        data: { userId: user.id, code, expiresAt },
      });
    } else {
      // Store OTP temporarily — user will be created on verify
      // We create a placeholder user
      user = await prisma.user.create({
        data: { phone: normalized, name: '', role: 'TENANT' },
      });
      await prisma.otpCode.create({
        data: { userId: user.id, code, expiresAt },
      });
    }

    // Send SMS
    await sms.send(normalized, `Your Base verification code: ${code}`);

    res.json({ message: 'OTP sent', phone: normalized });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
// Verify OTP and return JWT
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code required' });

    const normalized = normalizePhone(phone);
    const user = await prisma.user.findUnique({ where: { phone: normalized } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) return res.status(401).json({ error: 'Invalid or expired OTP' });

    // Mark OTP as used
    await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    // Generate JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        idVerified: user.idVerified,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
// Update user profile (name, role upgrade, etc.)
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    // Allow role upgrade from TENANT to OWNER (first time setup)
    if (role === 'OWNER' && req.user.role === 'TENANT') data.role = 'OWNER';

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, phone: true, name: true, email: true, role: true, idVerified: true },
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const { id, phone, name, email, role, idVerified } = req.user;
  res.json({ user: { id, phone, name, email, role, idVerified } });
});

function normalizePhone(phone) {
  let p = phone.replace(/[\s\-\+]/g, '');
  if (p.startsWith('0')) p = '254' + p.slice(1);
  if (p.startsWith('+')) p = p.slice(1);
  return p;
}

module.exports = router;
