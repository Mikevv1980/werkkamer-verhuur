import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CalendarDays, Clock, CheckCircle2, Loader2 } from "lucide-react";
import {
  createBooking,
  getAvailability,
  TIME_SLOTS,
  type TimeSlot,
} from "@/lib/bookings.functions";

export const Route = createFileRoute("/boeken")({
  head: () => ({
    meta: [
      { title: "Boek de werkkamer — Werkkamer te Huur" },
      {
        name: "description",
        content:
          "Reserveer eenvoudig een tijdslot voor de werkkamer: ochtend, middag of een hele dag.",
      },
    ],
  }),
  component: BoekenPage,
});

function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function BoekenPage() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [monthCursor, setMonthCursor] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const fetchAvailability = useServerFn(getAvailability);
  const submitBooking = useServerFn(createBooking);
  const qc = useQueryClient();

  const from = fmtDate(startOfMonth(monthCursor));
  const to = fmtDate(endOfMonth(monthCursor));

  const { data: availability } = useQuery({
    queryKey: ["availability", from, to],
    queryFn: () => fetchAvailability({ data: { from, to } }),
  });

  const mutation = useMutation({
    mutationFn: (payload: {
      booking_date: string;
      time_slot: TimeSlot;
      name: string;
      email: string;
      phone: string;
      notes: string;
    }) => submitBooking({ data: payload }),
    onSuccess: ({ id }) => {
      setConfirmedId(id);
      qc.invalidateQueries({ queryKey: ["availability"] });
    },
  });

  const monthName = monthCursor.toLocaleDateString("nl-NL", {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const last = endOfMonth(monthCursor);
    const startWeekday = (first.getDay() + 6) % 7; // Monday=0
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), d));
    }
    return cells;
  }, [monthCursor]);

  const unavailable = availability?.unavailable ?? {};

  const selectedUnavailable = selectedDate ? unavailable[selectedDate] ?? [] : [];

  if (confirmedId) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
        <div className="mx-auto max-w-md text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-terracotta" />
          <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
            Boeking ontvangen!
          </h1>
          <p className="mt-4 text-muted-foreground">
            Bedankt voor je reservering. Je ontvangt zo snel mogelijk een bevestiging op{" "}
            <span className="font-medium text-foreground">{form.email}</span>.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Referentie: {confirmedId.slice(0, 8)}
          </p>
          <button
            onClick={() => {
              setConfirmedId(null);
              setSelectedDate(null);
              setSelectedSlot(null);
              setForm({ name: "", email: "", phone: "", notes: "" });
            }}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Nog een boeking maken
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
            Boek je werkplek
          </span>
          <h1 className="mt-3 font-serif text-3xl font-medium text-foreground sm:text-4xl">
            Reserveer een tijdslot
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Kies een datum, selecteer een ochtend, middag of hele dag en bevestig in een paar
            klikken.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Calendar + slots */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-terracotta" />
                <h2 className="font-serif text-xl font-medium capitalize text-card-foreground">
                  {monthName}
                </h2>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setMonthCursor(
                      new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1),
                    )
                  }
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
                  aria-label="Vorige maand"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setMonthCursor(
                      new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1),
                    )
                  }
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent"
                  aria-label="Volgende maand"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {["ma", "di", "wo", "do", "vr", "za", "zo"].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {days.map((d, i) => {
                if (!d) return <div key={i} />;
                const key = fmtDate(d);
                const isPast = d < today;
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const unavailableSlots = unavailable[key] ?? [];
                const fullyBooked = unavailableSlots.includes("hele_dag");
                const disabled = isPast || isWeekend || fullyBooked;
                const isSelected = selectedDate === key;
                return (
                  <button
                    key={key}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(key);
                      setSelectedSlot(null);
                    }}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : disabled
                          ? "cursor-not-allowed text-muted-foreground/40"
                          : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-terracotta" />
                <h3 className="font-serif text-lg font-medium text-card-foreground">
                  Tijdslot
                </h3>
              </div>
              {!selectedDate ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Kies eerst een datum in de kalender.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {TIME_SLOTS.map((slot) => {
                    const taken = selectedUnavailable.includes(slot.value);
                    const isSelected = selectedSlot === slot.value;
                    return (
                      <button
                        key={slot.value}
                        disabled={taken}
                        onClick={() => setSelectedSlot(slot.value)}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-terracotta bg-terracotta/5 ring-2 ring-terracotta/30"
                            : taken
                              ? "cursor-not-allowed border-border bg-muted/50 opacity-60"
                              : "border-border bg-background hover:border-terracotta/40"
                        }`}
                      >
                        <p className="font-medium text-foreground">{slot.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{slot.time}</p>
                        {taken && (
                          <p className="mt-2 text-xs font-medium text-destructive">Bezet</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-xl font-medium text-card-foreground">
              Jouw gegevens
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We sturen je een bevestiging per e-mail.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedDate || !selectedSlot) return;
                mutation.mutate({
                  booking_date: selectedDate,
                  time_slot: selectedSlot,
                  ...form,
                });
              }}
            >
              <div>
                <label className="block text-sm font-medium text-card-foreground">Naam</label>
                <input
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">E-mail</label>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Telefoon (optioneel)
                </label>
                <input
                  type="tel"
                  maxLength={40}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Opmerkingen (optioneel)
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>

              {selectedDate && selectedSlot && (
                <div className="rounded-lg bg-secondary/60 p-3 text-sm text-foreground">
                  <p className="font-medium">Samenvatting</p>
                  <p className="text-muted-foreground">
                    {new Date(selectedDate).toLocaleDateString("nl-NL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    — {TIME_SLOTS.find((s) => s.value === selectedSlot)?.label}
                  </p>
                </div>
              )}

              {mutation.isError && (
                <p className="text-sm text-destructive">
                  {(mutation.error as Error).message}
                </p>
              )}

              <button
                type="submit"
                disabled={!selectedDate || !selectedSlot || mutation.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Bevestig boeking
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
