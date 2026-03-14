const { Resend } = require('resend');
console.log('Resend type:', typeof Resend);
try {
  const resend = new Resend('re_123');
  console.log('Resend instance created');
} catch (e) {
  console.error('Resend error:', e);
}
