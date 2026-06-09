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

export async function sendConfirmation(clientEmail, clientName, type) {
  if (!mailer) return; // silently skip — confirmation is best-effort
  const from = process.env.EMAIL_FROM ?? 'Legend Engineers <onboarding@resend.dev>';

  const isQuote = type === 'quote';
  const heading = isQuote ? 'Your quotation request is on its way!' : 'Your site visit request has been received!';
  const body = isQuote
    ? `Thank you for reaching out, <strong>${clientName}</strong>. We've received your quotation request and our team will review it and get back to you shortly with a detailed quote.`
    : `Thank you for reaching out, <strong>${clientName}</strong>. We've received your site visit booking request and our team will be in touch shortly to confirm the details.`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <div style="background:#1a1a1a;padding:28px 32px">
        <p style="margin:0;color:#c9a84c;font-size:20px;font-weight:700;letter-spacing:1px">LEGEND ENGINEERS</p>
        <p style="margin:4px 0 0;color:#aaa;font-size:12px;letter-spacing:2px;text-transform:uppercase">Under the Enerdge Group</p>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #e5e5e5;border-top:none">
        <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a">${heading}</h2>
        <p style="margin:0 0 24px;line-height:1.6;color:#444">${body}</p>
        <div style="background:#f9f6ef;border-left:4px solid #c9a84c;padding:16px 20px;margin-bottom:24px">
          <p style="margin:0;font-size:14px;color:#555">
            If you have any urgent queries, feel free to reach us directly at
            <a href="mailto:enerdgegroup@gmail.com" style="color:#c9a84c;text-decoration:none">enerdgegroup@gmail.com</a>
            or call <a href="tel:+27738815050" style="color:#c9a84c;text-decoration:none">+27 73 881 5050</a>.
          </p>
        </div>
        <p style="margin:0;font-size:13px;color:#888">We appreciate your trust in Legend Engineers.<br/>— The Legend Engineers Team</p>
      </div>
      <div style="padding:16px 32px;background:#f5f5f5;text-align:center">
        <p style="margin:0;font-size:11px;color:#aaa">Legend Engineers · Mpumalanga, South Africa · legendengineers.co.za</p>
      </div>
    </div>`;

  await mailer.sendMail({ from, to: clientEmail, subject: heading, html });
}
