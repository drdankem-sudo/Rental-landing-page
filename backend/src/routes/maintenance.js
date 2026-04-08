const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/maintenance — tenant submits a request
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { unitId, category, description, photoUrls } = req.body;

    if (!unitId || !category || !description) {
      return res.status(400).json({ error: 'unitId, category, and description required' });
    }

    // Verify tenant has active tenancy in this unit
    const tenancy = await prisma.tenancy.findFirst({
      where: { unitId, tenantId: req.user.id, status: 'ACTIVE' },
    });
    if (!tenancy) {
      return res.status(403).json({ error: 'No active tenancy in this unit' });
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        unitId,
        requesterId: req.user.id,
        category,
        description,
        photoUrls: photoUrls || [],
      },
    });

    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
});

// GET /api/maintenance/property/:propertyId — all requests for a property
router.get('/property/:propertyId', authenticate, async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { unit: { propertyId: req.params.propertyId } };
    if (status) where.status = status;

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: {
        unit: { select: { unitNumber: true } },
        requester: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ requests });
  } catch (err) {
    next(err);
  }
});

// GET /api/maintenance/tenant — tenant's own requests
router.get('/tenant', authenticate, async (req, res, next) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: { requesterId: req.user.id },
      include: {
        unit: { select: { unitNumber: true, property: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ requests });
  } catch (err) {
    next(err);
  }
});

// PUT /api/maintenance/:id — update request status (landlord/caretaker)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { status, assignedTo, notes } = req.body;

    const data = {};
    if (status) data.status = status;
    if (assignedTo) data.assignedTo = assignedTo;
    if (notes) data.notes = notes;
    if (status === 'COMPLETED') data.completedAt = new Date();

    const request = await prisma.maintenanceRequest.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ request });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
