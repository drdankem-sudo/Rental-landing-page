const express = require('express');
const prisma = require('../utils/prisma');
const { matchPayment } = require('../services/paymentMatcher');
const { registerC2BUrls } = require('../services/daraja');
const { authenticate, requirePropertyAccess } = require('../middleware/auth');

const router = express.Router();

/**
 * M-Pesa C2B Validation Callback
 * POST /callbacks/c2b/validate/:propertyId
 *
 * Called BEFORE the transaction completes.
 * Return { ResultCode: 0 } to accept, or { ResultCode: 1 } to reject.
 * We always accept — we're just observing, not gatekeeping.
 */
router.post('/c2b/validate/:propertyId', async (req, res) => {
  console.log(`[DARAJA-VALIDATE] Property: ${req.params.propertyId}`, JSON.stringify(req.body));

  // Always accept — we don't block payments
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

/**
 * M-Pesa C2B Confirmation Callback
 * POST /callbacks/c2b/confirm/:propertyId
 *
 * Called AFTER the transaction completes.
 * This is where we ingest the payment data.
 *
 * Payload from Safaricom:
 * {
 *   TransactionType: "Pay Bill",
 *   TransID: "SHK7X9M2LP",
 *   TransTime: "20260403143200",
 *   TransAmount: "15000.00",
 *   BusinessShortCode: "174379",
 *   BillRefNumber: "4B",        // Account reference (often unit number)
 *   InvoiceNumber: "",
 *   OrgAccountBalance: "49500.00",
 *   ThirdPartyTransID: "",
 *   MSISDN: "254712345678",     // Payer phone
 *   FirstName: "JAMES",
 *   MiddleName: "",
 *   LastName: "MWANGI"
 * }
 */
router.post('/c2b/confirm/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const body = req.body;

    console.log(`[DARAJA-CONFIRM] Property: ${propertyId}`, JSON.stringify(body));

    // Verify property exists
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      console.error(`[DARAJA] Property not found: ${propertyId}`);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // Parse transaction time
    const transTime = body.TransTime; // "20260403143200"
    const paidAt = new Date(
      `${transTime.slice(0, 4)}-${transTime.slice(4, 6)}-${transTime.slice(6, 8)}T${transTime.slice(8, 10)}:${transTime.slice(10, 12)}:${transTime.slice(12, 14)}`
    );

    // Normalize phone
    const phone = String(body.MSISDN).replace(/^\+/, '');

    // Build payer name
    const mpesaName = [body.FirstName, body.MiddleName, body.LastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        propertyId,
        amount: Math.round(parseFloat(body.TransAmount)),
        mpesaRef: body.TransID,
        mpesaPhone: phone,
        mpesaName: mpesaName || null,
        accountReference: body.BillRefNumber || null,
        source: 'MPESA_C2B',
        status: 'UNMATCHED',
        paidAt,
        month: `${paidAt.getFullYear()}-${String(paidAt.getMonth() + 1).padStart(2, '0')}`,
      },
    });

    // Run payment matching (async — don't block callback response)
    matchPayment(payment.id).catch((err) => {
      console.error(`[MATCH-ERROR] Payment ${payment.id}:`, err.message);
    });

    // Always respond success to Safaricom
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('[DARAJA-ERROR]', err);
    // Still respond success — we don't want Safaricom to retry
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// POST /api/properties/:propertyId/register-callbacks
// Triggered by landlord to register Daraja C2B URLs
router.post('/register/:propertyId', authenticate, requirePropertyAccess, async (req, res, next) => {
  try {
    const property = req.property;

    if (!property.darajaConsumerKey || !property.darajaShortcode) {
      return res.status(400).json({ error: 'Daraja credentials not configured' });
    }

    const callbackBaseUrl = req.body.callbackBaseUrl || `https://${req.headers.host}`;
    const result = await registerC2BUrls(property, callbackBaseUrl);

    res.json({ result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
