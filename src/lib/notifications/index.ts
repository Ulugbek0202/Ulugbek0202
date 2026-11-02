import 'server-only';

import { randomUUID } from 'node:crypto';
import { connect } from 'node:net';

import {
  isEmailConfigured,
  isTelegramConfigured,
  siteUrl,
  smtp,
  telegramBotToken,
  telegramChatId,
} from '@/lib/supabase/env';
import type { Inquiry } from '@/types';

/**
 * ============================================================================
 * NOTIFICATIONS
 * ============================================================================
 * Two channels, both optional. When a channel is unconfigured the code logs the
 * intent and moves on rather than failing the submission — losing a genuine
 * enquiry because a mail server is misconfigured would be far worse than
 * sending no notification at all.
 *
 * Nothing here ever throws. `notify()` resolves regardless of what happened and
 * returns a per-channel report, which the API route logs.
 * ============================================================================
 */

export interface DeliveryReport {
  telegram: 'sent' | 'skipped' | 'failed';
  email: 'sent' | 'skipped' | 'failed';
}

/* -------------------------------------------------------------------------- */
/* Telegram                                                                    */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const TYPE_LABEL: Record<Inquiry['type'], string> = {
  contact: 'Website enquiry',
  partnership: 'Partnership enquiry',
  career: 'Job application',
  tender: 'Tender enquiry',
};

function telegramBody(inquiry: Inquiry): string {
  const lines = [
    `<b>${escapeHtml(TYPE_LABEL[inquiry.type])}</b>`,
    '',
    `<b>Name:</b> ${escapeHtml(inquiry.name)}`,
    `<b>Email:</b> ${escapeHtml(inquiry.email)}`,
  ];

  if (inquiry.phone) lines.push(`<b>Phone:</b> ${escapeHtml(inquiry.phone)}`);
  if (inquiry.company) lines.push(`<b>Organisation:</b> ${escapeHtml(inquiry.company)}`);
  if (inquiry.subject) lines.push(`<b>Subject:</b> ${escapeHtml(inquiry.subject)}`);

  lines.push(`<b>Language:</b> ${inquiry.locale.toUpperCase()}`);
  lines.push('', escapeHtml(inquiry.message.slice(0, 3000)));

  return lines.join('\n');
}

async function sendTelegram(inquiry: Inquiry): Promise<'sent' | 'skipped' | 'failed'> {
  if (!isTelegramConfigured) return 'skipped';

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramBody(inquiry),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) {
      // Log the status only — the response body can echo the bot token back.
      console.error(`[notifications] Telegram responded ${response.status}`);
      return 'failed';
    }

    return 'sent';
  } catch (error) {
    console.error('[notifications] Telegram request failed:', (error as Error).message);
    return 'failed';
  }
}

/* -------------------------------------------------------------------------- */
/* Email                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Sends the notification email over SMTP.
 *
 * SMTP is spoken directly over a raw socket rather than through a dependency,
 * which keeps the install surface small. It intentionally supports only the
 * submission notification — a transactional template system belongs in a
 * dedicated provider integration, and swapping this function for a Resend or
 * Postmark call is a one-file change.
 */
async function sendEmail(inquiry: Inquiry): Promise<'sent' | 'skipped' | 'failed'> {
  if (!isEmailConfigured || !smtp.notificationEmail) return 'skipped';

  try {
    const subject = `[Website] ${TYPE_LABEL[inquiry.type]} — ${inquiry.name}`;
    const body = [
      `Type: ${TYPE_LABEL[inquiry.type]}`,
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      inquiry.phone ? `Phone: ${inquiry.phone}` : null,
      inquiry.company ? `Organisation: ${inquiry.company}` : null,
      inquiry.subject ? `Subject: ${inquiry.subject}` : null,
      `Language: ${inquiry.locale.toUpperCase()}`,
      `Submitted: ${inquiry.createdAt}`,
      `Record: ${siteUrl}/admin/inquiries/${inquiry.id}`,
      '',
      inquiry.message,
    ]
      .filter((line) => line !== null)
      .join('\r\n');

    const message = [
      `From: ${smtp.from}`,
      `To: ${smtp.notificationEmail}`,
      `Reply-To: ${inquiry.email}`,
      `Subject: ${subject}`,
      `Message-ID: <${randomUUID()}@meridian>`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
      '.',
    ].join('\r\n');

    await smtpTransaction(message);
    return 'sent';
  } catch (error) {
    console.error('[notifications] Email delivery failed:', (error as Error).message);
    return 'failed';
  }
}

/** Minimal SMTP conversation: EHLO → AUTH LOGIN → MAIL/RCPT/DATA → QUIT. */
function smtpTransaction(message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = connect({ host: smtp.host!, port: smtp.port });
    socket.setTimeout(15_000);

    let step = 0;
    const advance = () => {
      switch (step) {
        case 0:
          socket.write('EHLO meridian\r\n');
          break;
        case 1:
          socket.write('AUTH LOGIN\r\n');
          break;
        case 2:
          socket.write(`${Buffer.from(smtp.user ?? '').toString('base64')}\r\n`);
          break;
        case 3:
          socket.write(`${Buffer.from(smtp.password ?? '').toString('base64')}\r\n`);
          break;
        case 4:
          socket.write(`MAIL FROM:<${extractAddress(smtp.from)}>\r\n`);
          break;
        case 5:
          socket.write(`RCPT TO:<${smtp.notificationEmail}>\r\n`);
          break;
        case 6:
          socket.write('DATA\r\n');
          break;
        case 7:
          socket.write(`${message}\r\n`);
          break;
        case 8:
          socket.write('QUIT\r\n');
          break;
        default:
          socket.end();
          resolve();
          return;
      }
      step += 1;
    };

    socket.on('data', (chunk) => {
      const code = chunk.toString('utf8').slice(0, 3);
      if (code.startsWith('4') || code.startsWith('5')) {
        socket.destroy();
        reject(new Error(`SMTP rejected at step ${step} with ${code}`));
        return;
      }
      advance();
    });

    socket.on('connect', advance);
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out'));
    });
    socket.on('error', reject);
  });
}

function extractAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from.trim();
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Dispatches every configured notification channel in parallel.
 *
 * Never rejects: a failed notification must not fail the visitor's submission,
 * which has already been persisted by this point.
 */
export async function notify(inquiry: Inquiry): Promise<DeliveryReport> {
  const [telegram, email] = await Promise.all([sendTelegram(inquiry), sendEmail(inquiry)]);

  const report: DeliveryReport = { telegram, email };

  if (telegram === 'skipped' && email === 'skipped') {
    console.info(
      `[notifications] No channel configured. Enquiry ${inquiry.id} (${inquiry.type}) stored only.`,
    );
  } else {
    console.info(
      `[notifications] Enquiry ${inquiry.id}: telegram=${telegram}, email=${email}`,
    );
  }

  return report;
}
