const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate, requirePropertyAccess } = require('../middleware/auth');

const router = express.Router();

// POST /api/units — create unit
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { propertyId, unitNumber, floor, bedrooms, rentAmount, depositAmount } = req.body;

    if (!propertyId || !unitNumber || !rentAmount) {
      return res.status(400).json({ error: 'propertyId, unitNumber, and rentAmount required' });
    }

    // Verify property access
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'No access' });
    }

    const unit = await prisma.unit.create({
      data: {
        propertyId,
        unitNumber,
        floor: floor || null,
        bedrooms: bedrooms || null,
        rentAmount,
        depositAmount: depositAmount || null,
      },
    });

    res.status(201).json({ unit });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Unit number already exists in this property' });
    }
    next(err);
  }
});

// POST /api/units/bulk — create multiple units at once
router.post('/bulk', authenticate, async (req, res, next) => {
  try {
    const { propertyId, units } = req.body;
    // units: [{ unitNumber, floor, bedrooms, rentAmount, depositAmount }]

    if (!propertyId || !units || !units.length) {
      return res.status(400).json({ error: 'propertyId and units array required' });
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'No access' });
    }

    const created = await prisma.unit.createMany({
      data: units.map((u) => ({
        propertyId,
        unitNumber: u.unitNumber,
        floor: u.floor || null,
        bedrooms: u.bedrooms || null,
        rentAmount: u.rentAmount,
        depositAmount: u.depositAmount || null,
      })),
      skipDuplicates: true,
    });

    res.status(201).json({ created: created.count });
  } catch (err) {
    next(err);
  }
});

// GET /api/units/:unitId
router.get('/:unitId', authenticate, async (req, res, next) => {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id: req.params.unitId },
      include: {
        property: { select: { id: true, name: true, ownerId: true } },
        tenancies: {
          where: { status: 'ACTIVE' },
          include: { tenant: { select: { id: true, name: true, phone: true } } },
        },
        payments: { orderBy: { paidAt: 'desc' }, take: 10 },
      },
    });

    if (!unit) return res.status(404).json({ error: 'Unit not found' });

    res.json({ unit });
  } catch (err) {
    next(err);
  }
});

// PUT /api/units/:unitId
router.put('/:unitId', authenticate, async (req, res, next) => {
  try {
    const { unitNumber, floor, bedrooms, rentAmount, depositAmount, status } = req.body;

    const unit = await prisma.unit.update({
      where: { id: req.params.unitId },
      data: {
        ...(unitNumber && { unitNumber }),
        ...(floor !== undefined && { floor }),
        ...(bedrooms !== undefined && { bedrooms }),
        ...(rentAmount && { rentAmount }),
        ...(depositAmount !== undefined && { depositAmount }),
        ...(status && { status }),
      },
    });

    res.json({ unit });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
