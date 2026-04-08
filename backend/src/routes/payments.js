const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate, requirePropertyAccess } = require('../middleware/auth');
const { manualMatch } = require('../services/paymentMatcher');

const router = express.Router();

// GET /api/payments/property/:propertyId — list payments for a property
router.get('/property/:propertyId', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    const { status, month, page = 1, limit = 50 } = req.query;

    const where = { propertyId: req.params.propertyId };
    if (status) where.status = status;
    if (month) where.month = month;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          unit: { select: { id: true, unitNumber: true } },
          tenancy: { include: { tenant: { select: { id: true, name: true, phone: true } } } },
        },
        orderBy: { paidAt: 'desc' },
        skip: (page - 1) * limit,
        take: Number(limit),
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({ payments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/payments/unmatched/:propertyId — unmatched payments needing resolution
router.get('/unmatched/:propertyId', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { propertyId: req.params.propertyId, status: 'UNMATCHED' },
      orderBy: { paidAt: 'desc' },
    });

    res.json({ payments });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/match — manually match an unmatched payment
router.post('/match', authenticate, async (req, res, next) => {
  try {
    const { paymentId, unitId, month } = req.body;
    if (!paymentId || !unitId) {
      return res.status(400).json({ error: 'paymentId and unitId required' });
    }

    const payment = await manualMatch(paymentId, unitId, month);
    res.json({ payment });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/manual — manually record a payment (cash, bank, etc.)
router.post('/manual', authenticate, async (req, res, next) => {
  try {
    const { propertyId, unitId, tenancyId, amount, month, notes, mpesaRef } = req.body;

    if (!propertyId || !amount) {
      return res.status(400).json({ error: 'propertyId and amount required' });
    }

    const payment = await prisma.payment.create({
      data: {
        propertyId,
        unitId: unitId || null,
        tenancyId: tenancyId || null,
        amount,
        mpesaRef: mpesaRef || null,
        source: 'MANUAL_ENTRY',
        status: unitId ? 'MANUALLY_MATCHED' : 'UNMATCHED',
        paidAt: new Date(),
        month: month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        notes,
      },
    });

    res.status(201).json({ payment });
  } catch (err) {
    next(err);
  }
});

// GET /api/payments/tenant — payments for authenticated tenant
router.get('/tenant', authenticate, async (req, res, next) => {
  try {
    const tenancies = await prisma.tenancy.findMany({
      where: { tenantId: req.user.id },
      select: { id: true },
    });

    const tenancyIds = tenancies.map((t) => t.id);

    const payments = await prisma.payment.findMany({
      where: { tenancyId: { in: tenancyIds } },
      include: {
        unit: { select: { unitNumber: true } },
        property: { select: { name: true } },
        receipt: { select: { receiptNo: true } },
      },
      orderBy: { paidAt: 'desc' },
      take: 50,
    });

    res.json({ payments });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
