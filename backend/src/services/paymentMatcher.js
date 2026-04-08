const prisma = require('../utils/prisma');
const sms = require('./sms');

/**
 * Payment Matching Engine
 *
 * When an M-Pesa C2B payment comes in, we try to match it to a tenant + unit.
 * Matching strategy (in order):
 * 1. Account reference contains unit number → match to unit
 * 2. Phone number matches a tenant with an active tenancy in this property
 * 3. Both combined for higher confidence
 * 4. Falls back to UNMATCHED for manual resolution
 */
async function matchPayment(paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { property: true },
  });

  if (!payment || payment.status !== 'UNMATCHED') return;

  const propertyId = payment.propertyId;

  // Strategy 1: Match by phone number → active tenancy
  let tenancy = null;
  if (payment.mpesaPhone) {
    tenancy = await prisma.tenancy.findFirst({
      where: {
        tenant: { phone: payment.mpesaPhone },
        unit: { propertyId },
        status: 'ACTIVE',
      },
      include: { unit: true, tenant: true },
    });
  }

  // Strategy 2: Match by account reference → unit number
  if (!tenancy && payment.accountReference) {
    const ref = payment.accountReference.trim().toUpperCase();
    const unit = await prisma.unit.findFirst({
      where: {
        propertyId,
        unitNumber: { equals: ref, mode: 'insensitive' },
      },
    });

    if (unit) {
      tenancy = await prisma.tenancy.findFirst({
        where: { unitId: unit.id, status: 'ACTIVE' },
        include: { unit: true, tenant: true },
      });
    }
  }

  if (!tenancy) return; // Stays UNMATCHED

  // Determine payment status
  let status = 'MATCHED';
  if (payment.amount < tenancy.rentAmount) status = 'PARTIAL';
  if (payment.amount > tenancy.rentAmount) status = 'OVERPAYMENT';

  // Determine which month this payment covers
  const paidAt = new Date(payment.paidAt);
  const month = `${paidAt.getFullYear()}-${String(paidAt.getMonth() + 1).padStart(2, '0')}`;

  // Update payment
  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      unitId: tenancy.unitId,
      tenancyId: tenancy.id,
      status,
      month,
    },
  });

  // Generate receipt
  const receiptNo = await generateReceiptNumber();
  await prisma.receipt.create({
    data: {
      paymentId: updated.id,
      receiptNo,
      tenantPhone: tenancy.tenant.phone,
      landlordPhone: null, // Filled from property owner
      amount: payment.amount,
    },
  });

  // Send SMS confirmations
  const unitLabel = `${payment.property.name} - Unit ${tenancy.unit.unitNumber}`;

  // To tenant
  if (tenancy.tenant.phone) {
    await sms.send(
      tenancy.tenant.phone,
      `Keja: KES ${payment.amount.toLocaleString()} received for ${unitLabel}. Ref: ${payment.mpesaRef}. Receipt: ${receiptNo}`
    );
    await prisma.payment.update({ where: { id: paymentId }, data: { receiptSentTenant: true } });
  }

  // To landlord
  const owner = await prisma.user.findUnique({ where: { id: payment.property.ownerId } });
  if (owner) {
    await sms.send(
      owner.phone,
      `Keja: KES ${payment.amount.toLocaleString()} received from ${tenancy.tenant.name || 'tenant'} for ${unitLabel}. Ref: ${payment.mpesaRef}`
    );
    await prisma.payment.update({ where: { id: paymentId }, data: { receiptSentLandlord: true } });
  }

  return updated;
}

// Manually match an unmatched payment
async function manualMatch(paymentId, unitId, month) {
  const unit = await prisma.unit.findUnique({ where: { id: unitId } });
  if (!unit) throw new Error('Unit not found');

  const tenancy = await prisma.tenancy.findFirst({
    where: { unitId, status: 'ACTIVE' },
  });

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      unitId,
      tenancyId: tenancy ? tenancy.id : null,
      status: 'MANUALLY_MATCHED',
      month: month || null,
    },
  });

  return payment;
}

async function generateReceiptNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.receipt.count();
  return `KJ-${year}-${String(count + 1).padStart(5, '0')}`;
}

module.exports = { matchPayment, manualMatch };
