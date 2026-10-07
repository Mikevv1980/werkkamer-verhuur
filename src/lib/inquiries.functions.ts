import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const INQUIRY_SUBJECTS = [
  { value: "bezichtiging", label: "Rondleiding of bezichtiging" },
  { value: "vaste_huur", label: "Vaste huur" },
  { value: "overig", label: "Overig" },
] as const;

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.enum(["bezichtiging", "vaste_huur", "overig"]).default("bezichtiging"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  // Honeypot: must stay empty for real visitors.
  company: z.string().max(0).optional().or(z.literal("")),
});

export const sendInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    // Bots fill the hidden field — pretend it went through, send nothing.
    if (data.company) return { ok: true as const };

    const [React, { template }, { enqueueOwnerEmail }] = await Promise.all([
      import("react"),
      import("@/lib/email-templates/inquiry-notification"),
      import("./email-notify.server"),
    ]);

    const subjectLabel =
      INQUIRY_SUBJECTS.find((s) => s.value === data.subject)?.label ?? data.subject;
    const templateData = {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subjectLabel,
      message: data.message || undefined,
    };

    try {
      await enqueueOwnerEmail({
        templateName: "inquiry-notification",
        subject:
          typeof template.subject === "function"
            ? template.subject(templateData)
            : template.subject,
        element: React.createElement(template.component, templateData),
        idempotencyKey: `inquiry-${crypto.randomUUID()}`,
        recipient: template.to!,
      });
    } catch (mailErr) {
      console.error("Failed to enqueue inquiry email", mailErr);
      throw new Error("Je aanvraag kon niet worden verstuurd. Probeer het opnieuw.");
    }

    return { ok: true as const };
  });
