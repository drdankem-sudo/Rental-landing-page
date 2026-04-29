// SMS service using Africa's Talking
// In development/sandbox mode, messages are logged instead of sent

const AT_API_KEY = process.env.AT_API_KEY;
const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_SENDER_ID = process.env.AT_SENDER_ID || 'BASE';

async function send(phone, message) {
  // Ensure phone has + prefix for AT
  const to = phone.startsWith('+') ? phone : `+${phone}`;

  if (!AT_API_KEY || AT_USERNAME === 'sandbox') {
    console.log(`[SMS-DEV] To: ${to} | ${message}`);
    return { status: 'dev-logged', to, message };
  }

  try {
    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey: AT_API_KEY,
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        username: AT_USERNAME,
        to,
        message,
        from: AT_SENDER_ID,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('[SMS-ERROR]', err.message);
    return { status: 'error', error: err.message };
  }
}

// Send to multiple recipients
async function sendBulk(phones, message) {
  return Promise.all(phones.map((phone) => send(phone, message)));
}

module.exports = { send, sendBulk };
