import * as React from 'react'
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
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  phone?: string
  bookingDate?: string
  timeSlot?: string
  room?: string
  numPeople?: number | string
  roomPurpose?: string
  startTime?: string
  endTime?: string
  notes?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const label = { color: '#6b7280', fontSize: '12px', margin: '12px 0 2px' }
const value = { color: '#111827', fontSize: '14px', margin: 0 }

function Row({ k, v }: { k: string; v?: string | number }) {
  if (v === undefined || v === null || v === '') return null
  return (
    <>
      <Text style={label}>{k}</Text>
      <Text style={value}>{String(v)}</Text>
    </>
  )
}

const BookingNotification = ({
  name,
  email,
  phone,
  bookingDate,
  timeSlot,
  room,
  numPeople,
  roomPurpose,
  startTime,
  endTime,
  notes,
}: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Nieuwe boekingsaanvraag van {name || 'een gast'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={{ color: '#111827', fontSize: '20px' }}>
          Nieuwe boekingsaanvraag
        </Heading>
        <Text style={{ color: '#4b5563', fontSize: '14px' }}>
          Er is een nieuwe aanvraag binnengekomen via het boekingsformulier.
        </Text>
        <Hr />
        <Section>
          <Row k="Naam" v={name} />
          <Row k="E-mail" v={email} />
          <Row k="Telefoon" v={phone} />
        </Section>
        <Hr />
        <Section>
          <Row k="Datum" v={bookingDate} />
          <Row k="Kamer" v={room} />
          <Row k="Tijdslot" v={timeSlot} />
          <Row k="Starttijd" v={startTime} />
          <Row k="Eindtijd" v={endTime} />
          <Row k="Aantal personen" v={numPeople} />
          <Row k="Soort werkruimte" v={roomPurpose} />
        </Section>
        {notes ? (
          <>
            <Hr />
            <Row k="Extra wensen" v={notes} />
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BookingNotification,
  subject: (d: Record<string, any>) =>
    `Nieuwe boeking — ${d.name || 'onbekend'} · ${d.bookingDate || ''}`,
  displayName: 'Boekingsaanvraag (interne notificatie)',
  to: 'info@mikevanvliet.com',
  previewData: {
    name: 'Jan Jansen',
    email: 'jan@example.com',
    phone: '+31 6 12345678',
    bookingDate: '2026-07-15',
    timeSlot: 'Ochtend (08:00 – 12:00)',
    room: 'Kamer 1',
    numPeople: 3,
    roomPurpose: 'Teamoverleg',
    startTime: '09:00',
    endTime: '11:30',
    notes: 'Graag koffie klaarzetten.',
  },
} satisfies TemplateEntry
