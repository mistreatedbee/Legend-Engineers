import nodemailer from 'nodemailer';

const mailer = process.env.RESEND_API_KEY
  ? nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    })
  : null;

export function rowHtml(label, value) {
  return `<tr><td style="padding:6px 12px;font-weight:600;background:#f5f5f5;white-space:nowrap">${label}</td><td style="padding:6px 12px">${value || '—'}</td></tr>`;
}

export async function sendMail(subject, htmlRows) {
  if (!mailer) throw new Error('Email is not configured (RESEND_API_KEY missing)');
  const from = process.env.EMAIL_FROM ?? 'Legend Engineers <onboarding@resend.dev>';
  await mailer.sendMail({
    from,
    to: 'enerdgegroup@gmail.com',
    cc: 'egengineers88@gmail.com',
    subject,
    html: `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">${htmlRows}</table>`,
  });
}
