import { render } from "react-email";
import type { ReactElement } from "react";

const OWNER_EMAIL = "info@mikevanvliet.com";
const SENDER = "Werkkamer Huren <noreply@werkkamerhuren.nl>";
const SENDER_DOMAIN = "notify.werkkamerhuren.nl";

type EmailAdmin = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: Record<string, string | null> | null }>;
      };
    };
    insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
    upsert: (
      row: Record<string, unknown>,
      opts?: { onConflict?: string; ignoreDuplicates?: boolean },
    ) => Promise<{ error: unknown }>;
  };
  rpc: (fn: string, args: unknown) => Promise<{ error: unknown }>;
};

/**
 * Queue a notification email to the site owner through the transactional
 * email queue: suppression check, unsubscribe token, send log and enqueue.
 */
export async function enqueueOwnerEmail({
  templateName,
  subject,
  element,
  idempotencyKey,
  recipient = OWNER_EMAIL,
}: {
  templateName: string;
  subject: string;
  element: ReactElement;
  idempotencyKey: string;
  recipient?: string;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as unknown as EmailAdmin;

  const html = await render(element);
  const text = await render(element, { plainText: true });
  const messageId = crypto.randomUUID();
  const normalized = recipient.toLowerCase();

  // Skip if the address is suppressed
  const { data: suppressed } = await admin
    .from("suppressed_emails")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();
  if (suppressed) {
    await admin.from("email_send_log").insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: recipient,
      status: "suppressed",
    });
    return { sent: false as const, messageId };
  }

  // Get or create unsubscribe token (required by the email API)
  const { data: existingToken } = await admin
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalized)
    .maybeSingle();
  let unsubscribeToken: string | undefined = existingToken?.token ?? undefined;
  if (!existingToken) {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const newToken = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    await admin
      .from("email_unsubscribe_tokens")
      .upsert({ token: newToken, email: normalized }, { onConflict: "email", ignoreDuplicates: true });
    const { data: stored } = await admin
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalized)
      .maybeSingle();
    unsubscribeToken = stored?.token ?? undefined;
  }
  if (!unsubscribeToken) throw new Error("Missing unsubscribe token");

  await admin.from("email_send_log").insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: recipient,
    status: "pending",
  });

  const { error: enqueueError } = await admin.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: recipient,
      from: SENDER,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });
  if (enqueueError) throw enqueueError;

  return { sent: true as const, messageId };
}
