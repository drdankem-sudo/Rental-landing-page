const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate, requireRole, requirePropertyAccess } = require('../middleware/auth');

const router = express.Router();

// GET /api/properties — list user's properties
router.get('/', authenticate, async (req, res, next) => {
  try {
    const owned = await prisma.property.findMany({
      where: { ownerId: req.user.id },
      include: { _count: { select: { units: true, payments: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const managed = await prisma.propertyManager.findMany({
      where: { userId: req.user.id },
      include: {
        property: {
          include: { _count: { select: { units: true, payments: true } } },
        },
      },
    });

    res.json({
      owned,
      managed: managed.map((m) => ({ ...m.property, managerRole: m.role })),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/properties — create new property
router.post('/', authenticate, requireRole('OWNER'), async (req, res, next) => {
  try {
    const { name, type, address, county, town, totalUnits, paybillNumber, tillNumber } = req.body;

    if (!name || !type || !address || !county || !town || !totalUnits) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const property = await prisma.property.create({
      data: {
        name,
        type,
        address,
        county,
        town,
        totalUnits,
        paybillNumber: paybillNumber || null,
        tillNumber: tillNumber || null,
        ownerId: req.user.id,
      },
    });

    res.status(201).json({ property });
  } catch (err) {
    next(err);
  }
});

// GET /api/properties/:propertyId
router.get('/:propertyId', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.propertyId },
      include: {
        units: { include: { tenancies: { where: { status: 'ACTIVE' }, include: { tenant: { select: { id: true, name: true, phone: true } } } } } },
        _count: { select: { units: true, payments: true } },
      },
    });

    res.json({ property });
  } catch (err) {
    next(err);
  }
});

// PUT /api/properties/:propertyId
router.put('/:propertyId', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    const { name, type, address, county, town, totalUnits, paybillNumber, tillNumber } = req.body;

    const property = await prisma.property.update({
      where: { id: req.params.propertyId },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(address && { address }),
        ...(county && { county }),
        ...(town && { town }),
        ...(totalUnits && { totalUnits }),
        ...(paybillNumber !== undefined && { paybillNumber }),
        ...(tillNumber !== undefined && { tillNumber }),
      },
    });

    res.json({ property });
  } catch (err) {
    next(err);
  }
});

// POST /api/properties/:propertyId/daraja — save Daraja credentials
router.post('/:propertyId/daraja', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    // Only owner can set Daraja creds
    if (req.property.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the owner can configure Daraja' });
    }

    const { consumerKey, consumerSecret, shortcode, passkey } = req.body;

    const property = await prisma.property.update({
      where: { id: req.params.propertyId },
      data: {
        darajaConsumerKey: consumerKey,
        darajaConsumerSecret: consumerSecret,
        darajaShortcode: shortcode,
        darajaPasskey: passkey,
      },
    });

    res.json({ message: 'Daraja credentials saved', propertyId: property.id });
  } catch (err) {
    next(err);
  }
});

// POST /api/properties/:propertyId/managers — add manager/caretaker
router.post('/:propertyId/managers', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    if (req.property.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the owner can add managers' });
    }

    const { phone, role, canViewPayments, canManageTenants, canManageUnits } = req.body;
    if (!phone || !role) return res.status(400).json({ error: 'Phone and role required' });

    // Find or create user
    const normalized = phone.replace(/[\s\-\+]/g, '').replace(/^0/, '254');
    let user = await prisma.user.findUnique({ where: { phone: normalized } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone: normalized, name: '', role: role },
      });
    }

    const manager = await prisma.propertyManager.create({
      data: {
        propertyId: req.params.propertyId,
        userId: user.id,
        role,
        canViewPayments: canViewPayments !== false,
        canManageTenants: canManageTenants !== false,
        canManageUnits: canManageUnits || false,
      },
    });

    res.status(201).json({ manager });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
