import nodemailer from 'nodemailer';

const mailer = process.env.EMAIL_USER
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  : null;

export function rowHtml(label, value) {
  return `<tr><td style="padding:6px 12px;font-weight:600;background:#f5f5f5;white-space:nowrap">${label}</td><td style="padding:6px 12px">${value || '—'}</td></tr>`;
}

export async function sendMail(subject, htmlRows) {
  if (!mailer) throw new Error('Email is not configured (EMAIL_USER/EMAIL_PASS missing)');
  await mailer.sendMail({
    from: `"Legend Engineers Website" <${process.env.EMAIL_USER}>`,
    to: 'enerdgegroup@gmail.com',
    cc: 'egengineers88@gmail.com',
    subject,
    html: `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">${htmlRows}</table>`,
  });
}
