const prisma = require('../utils/prisma');

const DARAJA_BASE = process.env.DARAJA_BASE_URL || 'https://sandbox.safaricom.co.ke';

// Get OAuth token for a property's Daraja credentials
async function getAccessToken(property) {
  const auth = Buffer.from(
    `${property.darajaConsumerKey}:${property.darajaConsumerSecret}`
  ).toString('base64');

  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await res.json();
  if (!data.access_token) throw new Error('Failed to get Daraja access token');
  return data.access_token;
}

// Register C2B confirmation & validation URLs for a property
async function registerC2BUrls(property, callbackBaseUrl) {
  const token = await getAccessToken(property);

  const res = await fetch(`${DARAJA_BASE}/mpesa/c2b/v1/registerurl`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ShortCode: property.darajaShortcode,
      ResponseType: 'Completed',
      ConfirmationURL: `${callbackBaseUrl}/callbacks/c2b/confirm/${property.id}`,
      ValidationURL: `${callbackBaseUrl}/callbacks/c2b/validate/${property.id}`,
    }),
  });

  const data = await res.json();

  if (data.ResponseCode === '0') {
    await prisma.property.update({
      where: { id: property.id },
      data: { darajaCallbackRegistered: true },
    });
  }

  return data;
}

module.exports = { getAccessToken, registerC2BUrls };
