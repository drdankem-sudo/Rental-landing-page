const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate, requirePropertyAccess } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/:propertyId — main dashboard stats
router.get('/:propertyId', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Run all queries in parallel
    const [
      totalUnits,
      occupiedUnits,
      activeTenancies,
      monthPayments,
      allPaymentsThisMonth,
      unmatchedCount,
      recentPayments,
      monthlyCollections,
    ] = await Promise.all([
      // Total units
      prisma.unit.count({ where: { propertyId } }),

      // Occupied units
      prisma.unit.count({ where: { propertyId, status: 'OCCUPIED' } }),

      // Active tenancies with rent amounts
      prisma.tenancy.findMany({
        where: { unit: { propertyId }, status: 'ACTIVE' },
        select: { rentAmount: true },
      }),

      // Matched payments this month
      prisma.payment.aggregate({
        where: {
          propertyId,
          month: currentMonth,
          status: { in: ['MATCHED', 'MANUALLY_MATCHED', 'PARTIAL', 'OVERPAYMENT'] },
        },
        _sum: { amount: true },
        _count: true,
      }),

      // All payments this month (for on-time calc)
      prisma.payment.count({
        where: { propertyId, month: currentMonth },
      }),

      // Unmatched payments
      prisma.payment.count({
        where: { propertyId, status: 'UNMATCHED' },
      }),

      // Recent payments (for feed)
      prisma.payment.findMany({
        where: {
          propertyId,
          status: { in: ['MATCHED', 'MANUALLY_MATCHED'] },
        },
        include: {
          unit: { select: { unitNumber: true } },
          tenancy: { include: { tenant: { select: { name: true, phone: true } } } },
        },
        orderBy: { paidAt: 'desc' },
        take: 10,
      }),

      // Last 6 months collection totals
      getMonthlyCollections(propertyId, 6),
    ]);

    const expectedRent = activeTenancies.reduce((sum, t) => sum + t.rentAmount, 0);
    const collectedRent = monthPayments._sum.amount || 0;
    const collectionRate = expectedRent > 0 ? Math.round((collectedRent / expectedRent) * 100) : 0;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    res.json({
      overview: {
        totalUnits,
        occupiedUnits,
        vacantUnits: totalUnits - occupiedUnits,
        occupancyRate,
        expectedRent,
        collectedRent,
        collectionRate,
        unmatchedPayments: unmatchedCount,
        currentMonth,
      },
      recentPayments,
      monthlyCollections,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard/:propertyId/arrears — tenants with outstanding balances
router.get('/:propertyId/arrears', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get all active tenancies
    const tenancies = await prisma.tenancy.findMany({
      where: { unit: { propertyId }, status: 'ACTIVE' },
      include: {
        tenant: { select: { id: true, name: true, phone: true } },
        unit: { select: { id: true, unitNumber: true } },
      },
    });

    // For each tenancy, check if they've paid this month
    const arrears = [];
    for (const tenancy of tenancies) {
      const paid = await prisma.payment.aggregate({
        where: {
          tenancyId: tenancy.id,
          month: currentMonth,
          status: { in: ['MATCHED', 'MANUALLY_MATCHED', 'PARTIAL'] },
        },
        _sum: { amount: true },
      });

      const paidAmount = paid._sum.amount || 0;
      const owing = tenancy.rentAmount - paidAmount;

      if (owing > 0) {
        arrears.push({
          tenant: tenancy.tenant,
          unit: tenancy.unit,
          rentAmount: tenancy.rentAmount,
          paidAmount,
          owing,
        });
      }
    }

    res.json({ arrears, month: currentMonth });
  } catch (err) {
    next(err);
  }
});

// Helper: get monthly collection totals for last N months
async function getMonthlyCollections(propertyId, months) {
  const results = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    const agg = await prisma.payment.aggregate({
      where: {
        propertyId,
        month,
        status: { in: ['MATCHED', 'MANUALLY_MATCHED', 'PARTIAL', 'OVERPAYMENT'] },
      },
      _sum: { amount: true },
    });

    results.push({ month, total: agg._sum.amount || 0 });
  }

  return results;
}

module.exports = router;
