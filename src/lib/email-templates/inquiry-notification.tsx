import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  email?: string;
  phone?: string;
  subjectLabel?: string;
  message?: string;
}

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const container = { padding: "24px", maxWidth: "560px" };
const label = { color: "#6b7280", fontSize: "12px", margin: "12px 0 2px" };
const value = { color: "#111827", fontSize: "14px", margin: 0, whiteSpace: "pre-wrap" };

function Row({ k, v }: { k: string; v?: string }) {
  if (v === undefined || v === null || v === "") return null;
  return (
    <>
      <Text style={label}>{k}</Text>
      <Text style={value}>{String(v)}</Text>
    </>
  );
}

const InquiryNotification = ({ name, email, phone, subjectLabel, message }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Nieuwe contactaanvraag van {name || "een bezoeker"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={{ color: "#111827", fontSize: "20px" }}>Nieuwe contactaanvraag</Heading>
        <Text style={{ color: "#4b5563", fontSize: "14px" }}>
          Er is een aanvraag binnengekomen via de website. Deze persoon wil nog niets boeken,
          maar wil meer weten of eerst langs komen.
        </Text>
        <Hr />
        <Section>
          <Row k="Naam" v={name} />
          <Row k="E-mail" v={email} />
          <Row k="Telefoon" v={phone} />
          <Row k="Onderwerp" v={subjectLabel} />
        </Section>
        {message ? (
          <>
            <Hr />
            <Row k="Bericht" v={message} />
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: InquiryNotification,
  subject: (d: Record<string, any>) =>
    `Contactaanvraag — ${d.name || "onbekend"} · ${d.subjectLabel || "info"}`,
  displayName: "Contactaanvraag (interne notificatie)",
  to: "info@mikevanvliet.com",
  previewData: {
    name: "Jan Jansen",
    email: "jan@example.com",
    phone: "+31 6 12345678",
    subjectLabel: "Vaste huur",
    message: "Ik wil graag weten welke vaste dagen nog vrij zijn.",
  },
} satisfies TemplateEntry;
