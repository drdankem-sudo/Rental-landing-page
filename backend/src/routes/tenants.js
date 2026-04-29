const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth');
const sms = require('../services/sms');

const router = express.Router();

// POST /api/tenants/assign — assign tenant to unit (creates tenancy)
router.post('/assign', authenticate, async (req, res, next) => {
  try {
    const { unitId, tenantPhone, tenantName, rentAmount, depositPaid, startDate, leaseDocUrl } = req.body;

    if (!unitId || !tenantPhone || !rentAmount) {
      return res.status(400).json({ error: 'unitId, tenantPhone, and rentAmount required' });
    }

    // Verify unit exists and user has access
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { property: true },
    });
    if (!unit) return res.status(404).json({ error: 'Unit not found' });
    if (unit.property.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'No access to this property' });
    }

    // Find or create tenant user
    const normalized = tenantPhone.replace(/[\s\-\+]/g, '').replace(/^0/, '254');
    let tenant = await prisma.user.findUnique({ where: { phone: normalized } });
    if (!tenant) {
      tenant = await prisma.user.create({
        data: { phone: normalized, name: tenantName || '', role: 'TENANT' },
      });
    }

    // Create tenancy
    const tenancy = await prisma.tenancy.create({
      data: {
        unitId,
        tenantId: tenant.id,
        rentAmount,
        depositPaid: depositPaid || 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        leaseDocUrl: leaseDocUrl || null,
      },
    });

    // Update unit status
    await prisma.unit.update({
      where: { id: unitId },
      data: { status: 'OCCUPIED' },
    });

    // Notify tenant via SMS
    await sms.send(
      normalized,
      `Welcome to ${unit.property.name}, Unit ${unit.unitNumber}. Your rent of KES ${rentAmount} is managed via Base. You'll receive payment confirmations here.`
    );

    res.status(201).json({ tenancy, tenant: { id: tenant.id, phone: tenant.phone, name: tenant.name } });
  } catch (err) {
    next(err);
  }
});

// GET /api/tenants/property/:propertyId — list tenants for a property
router.get('/property/:propertyId', authenticate, async (req, res, next) => {
  try {
    const tenancies = await prisma.tenancy.findMany({
      where: {
        unit: { propertyId: req.params.propertyId },
        status: { in: ['ACTIVE', 'NOTICE_GIVEN'] },
      },
      include: {
        tenant: { select: { id: true, name: true, phone: true, idVerified: true } },
        unit: { select: { id: true, unitNumber: true, rentAmount: true } },
      },
      orderBy: { unit: { unitNumber: 'asc' } },
    });

    res.json({ tenancies });
  } catch (err) {
    next(err);
  }
});

// POST /api/tenants/move-out — end tenancy
router.post('/move-out', authenticate, async (req, res, next) => {
  try {
    const { tenancyId, endDate } = req.body;
    if (!tenancyId) return res.status(400).json({ error: 'tenancyId required' });

    const tenancy = await prisma.tenancy.update({
      where: { id: tenancyId },
      data: {
        status: 'ENDED',
        endDate: endDate ? new Date(endDate) : new Date(),
      },
      include: { unit: true },
    });

    // Mark unit as vacant
    await prisma.unit.update({
      where: { id: tenancy.unitId },
      data: { status: 'VACANT' },
    });

    res.json({ tenancy });
  } catch (err) {
    next(err);
  }
});

// POST /api/tenants/give-notice
router.post('/give-notice', authenticate, async (req, res, next) => {
  try {
    const { tenancyId } = req.body;
    if (!tenancyId) return res.status(400).json({ error: 'tenancyId required' });

    const tenancy = await prisma.tenancy.update({
      where: { id: tenancyId },
      data: { status: 'NOTICE_GIVEN', noticeDate: new Date() },
      include: { unit: true },
    });

    await prisma.unit.update({
      where: { id: tenancy.unitId },
      data: { status: 'NOTICE_GIVEN' },
    });

    res.json({ tenancy });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
