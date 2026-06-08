import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import heroVergaderkamer from "@/assets/hero-vergaderkamer.jpg";
import galleryPresentatie from "@/assets/gallery-presentatie.jpg";
import galleryKoffie from "@/assets/gallery-koffie.jpg";
import galleryDijkenduin from "@/assets/gallery-dijkenduin.jpg";
import natureBos from "@/assets/nature-bos.jpg";
import natureUitzicht from "@/assets/nature-uitzicht.jpg";
import {
  createBooking,
  getAvailability,
  TIME_SLOTS,
  type TimeSlot,
} from "@/lib/bookings.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Werkkamer Bakkum — Lichte werkkamer voor overleg, brainstorm en workshop",
      },
      {
        name: "description",
        content:
          "Boek een rustige lichte werkkamer op landgoed Dijk en Duin in Bakkum. Tot 4 personen, vanaf 20 euro per uur. Ideaal voor overleg, brainstorm en workshop.",
      },
      {
        property: "og:title",
        content: "Werkkamer Bakkum — Lichte werkkamer voor overleg",
      },
      {
        property: "og:description",
        content:
          "Een lichte werkkamer op landgoed Dijk en Duin in Bakkum. Boek per uur of voor een hele dag.",
      },
    ],
  }),
  component: Index,
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

const stats = [
  { value: "4 personen", label: "ronde tafel voor overleg en sessies" },
  { value: "7 dagen", label: "in de week beschikbaar in overleg" },
  { value: "20 euro / uur", label: "of 120 euro voor een hele dag" },
  { value: "Dijk en Duin", label: "rustige plek in Bakkum" },
];

const featurePoints = [
  {
    title: "Presenteren zonder gedoe",
    body: "Groot tv-scherm met Apple-TV voor presentaties. Sluit je apparaat aan, klaar.",
  },
  {
    title: "Koffie en kraanwater",
    body: "Een kleine keuken met Nespresso-koffie, thee, kraanwater en een mooi servies.",
  },
  {
    title: "Rust in de duinen",
    body: "Het uitzicht op het landgoed, de paden en het bos werkt verrassend ontspannend.",
  },
];

const gallery = [
  {
    src: galleryPresentatie,
    alt: "Werkruimte met scherm voor overleg en presentaties",
    caption: "Alles wat je nodig hebt voor overleg en presentatie.",
  },
  {
    src: galleryKoffie,
    alt: "Nespresso koffie-apparaat met capsules",
    caption: "Nespresso-koffie naar keuze.",
  },
  {
    src: galleryDijkenduin,
    alt: "Historisch wit gebouw op landgoed Dijk en Duin in Bakkum",
    caption: "Gelegen op landgoed Dijk en Duin.",
  },
];

function Index() {
  return (
    <main>
      <Hero />
      <Stats />
      <Ruimte />
      <Gallery />
      <Omgeving />
      <Tarief />
      <Aanvraag />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-6 sm:pt-12">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={heroVergaderkamer}
            alt="Lichte werkkamer met ronde donkere tafel en zachte stoelen, uitkijkend op een groen landgoed"
            width={1600}
            height={1100}
            className="h-[68vh] min-h-[460px] w-full object-cover sm:h-[78vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-12 lg:p-16">
            <div className="max-w-xl text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Een productieve dag in Bakkum
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                Een lichte werkkamer voor overleg, brainstorm en workshop.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Rustige, lichte werkruimte voor maximaal vier personen, midden op landgoed
                Dijk en Duin. Inclusief groot scherm met Apple-TV, koffie en een kop soep
                tussendoor.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#aanvraag"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/30 transition-all hover:bg-primary/90"
                >
                  Vraag beschikbaarheid aan
                </a>
                <a
                  href="#ruimte"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Bekijk de ruimte
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.value} className="bg-background px-6 py-6">
            <p className="font-serif text-xl text-foreground sm:text-2xl">{s.value}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ruimte() {
  return (
    <section id="ruimte" className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
            De ruimte
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Compact genoeg voor focus, ruim genoeg voor goede gesprekken.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            De werkkamer is ingericht voor max. vier personen rond een ronde tafel. Geen
            kantoorgevoel, geen sterke akoestische hardheid — wel daglicht, plantjes en een
            hoek voor een korte pauze. Voor wie even uit het kantoor wil zonder thuis te
            werken.
          </p>
        </div>
        <ul className="space-y-3">
          {featurePoints.map((f) => (
            <li
              key={f.title}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6"
            >
              <div className="flex gap-4">
                <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-serif text-base text-card-foreground">{f.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="pb-20 sm:pb-24">
      <div className="mx-auto grid max-w-6xl gap-3 px-6 sm:grid-cols-3">
        {gallery.map((g) => (
          <figure key={g.caption} className="relative overflow-hidden rounded-2xl">
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              width={900}
              height={700}
              className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-80"
            />
            <figcaption className="absolute bottom-3 left-3 right-3 rounded-full bg-background/90 px-3 py-1.5 text-center text-xs font-medium text-foreground backdrop-blur-sm">
              {g.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Omgeving() {
  return (
    <section id="omgeving" className="bg-accent">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="grid grid-cols-2 gap-4">
          <img
            src={natureBos}
            alt="Duinbos vlakbij Werkkamer Bakkum"
            loading="lazy"
            width={700}
            height={900}
            className="h-full max-h-[440px] w-full rounded-2xl object-cover"
          />
          <img
            src={natureUitzicht}
            alt="Uitzicht door de bomen op het landgoed"
            loading="lazy"
            width={700}
            height={900}
            className="mt-12 h-full max-h-[440px] w-full rounded-2xl object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
            Omgeving
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Een plek waar een sessie ook buiten de kamer verder werkt.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            De fijnste ideeën komen vaak tijdens een rondje wandelen. Onder de mooie bomen
            van het landgoed, langs het oude historische gebouw of via een natuurpad richting
            de duinen, krijg je een nieuw perspectief, ook letterlijk.
          </p>
          <p className="mt-5 text-sm font-semibold text-primary">
            Gesprek, lunch of diner bij je aanvraag.
          </p>
        </div>
      </div>
    </section>
  );
}

function Tarief() {
  return (
    <section id="tarief" className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
            Transparante tarieven
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Reserveer per uur of kies direct voor een hele dag.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Geen vaste abonnementen, geen lange contracten. Boek zoals het past, en alles is
            inbegrepen — schoonmaak, koffie, water en het uitzicht.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Per uur
            </p>
            <p className="mt-4 font-serif text-4xl text-card-foreground">
              20 <span className="text-2xl">euro</span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Min. 2 uur dagdeel. Bedoeld voor korte sessies.
            </p>
          </div>
          <div className="rounded-2xl bg-forest-dark p-7 text-background shadow-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">
              Hele dag
            </p>
            <p className="mt-4 font-serif text-4xl">
              120 <span className="text-2xl">euro</span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-background/80">
              Voor workshops, brainstorm of trainingsdag.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------- BOEKINGSFORMULIER ------- */

function Aanvraag() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [monthCursor, setMonthCursor] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    num_people: "2",
    room_purpose: "Brainstormsessie",
    start_time: "",
    end_time: "",
    notes: "",
  });
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
    mutationFn: () =>
      submitBooking({
        data: {
          booking_date: selectedDate!,
          time_slot: selectedSlot!,
          name: form.name,
          email: form.email,
          phone: form.phone,
          num_people: form.num_people ? Number(form.num_people) : undefined,
          room_purpose: form.room_purpose,
          start_time: form.start_time,
          end_time: form.end_time,
          notes: form.notes,
        },
      }),
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
    const startWeekday = (first.getDay() + 6) % 7;
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), d));
    }
    return cells;
  }, [monthCursor]);

  const unavailable = availability?.unavailable ?? {};
  const selectedUnavailable = selectedDate ? (unavailable[selectedDate] ?? []) : [];

  return (
    <section id="aanvraag" className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="lg:pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
            Aanvraag
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Vraag eenvoudig beschikbaarheid aan.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Vul je gegevens in en je krijgt zo snel mogelijk een reactie via e-mail of
            telefoon. We bevestigen datum, tijd en eventuele wensen.
          </p>
          <div className="mt-6 rounded-2xl border border-accent bg-accent/60 p-5 text-sm leading-relaxed text-foreground">
            <p className="font-semibold">Gunstige actie</p>
            <p className="mt-1 text-muted-foreground">
              Met max. vier personen, een hele dag, lunch en een wandeling bij Dijk en Duin
              vanaf 200 euro / dag.
            </p>
          </div>
        </div>

        {confirmedId ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <h3 className="mt-5 font-serif text-2xl text-card-foreground">
              Aanvraag ontvangen!
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Je krijgt een bevestiging op{" "}
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
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Nog een aanvraag
            </button>
          </div>
        ) : (
          <form
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedDate || !selectedSlot) return;
              mutation.mutate();
            }}
          >
            <Field label="Naam">
              <input
                required
                maxLength={120}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="E-mailadres">
              <input
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Telefoon">
              <input
                type="tel"
                maxLength={40}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
              />
            </Field>

            {/* Calendar */}
            <div className="mt-6 rounded-xl bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <p className="font-serif text-sm capitalize text-card-foreground">
                  {monthName}
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setMonthCursor(
                        new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1),
                      )
                    }
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background"
                    aria-label="Vorige maand"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMonthCursor(
                        new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1),
                      )
                    }
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background"
                    aria-label="Volgende maand"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {["ma", "di", "wo", "do", "vr", "za", "zo"].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const key = fmtDate(d);
                  const isPast = d < today;
                  const unavailableSlots = unavailable[key] ?? [];
                  const fullyBooked = unavailableSlots.includes("hele_dag");
                  const disabled = isPast || fullyBooked;
                  const isSelected = selectedDate === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setSelectedDate(key);
                        setSelectedSlot(null);
                      }}
                      className={`aspect-square rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : disabled
                            ? "cursor-not-allowed text-muted-foreground/30"
                            : "text-foreground hover:bg-background"
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {TIME_SLOTS.map((slot) => {
                  const taken = selectedUnavailable.includes(slot.value);
                  const isSelected = selectedSlot === slot.value;
                  const disabled = !selectedDate || taken;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedSlot(slot.value)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow"
                          : disabled
                            ? "cursor-not-allowed border border-border text-muted-foreground/50"
                            : "border border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      {slot.label}
                      {taken && " (bezet)"}
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Datum">
              <input
                type="text"
                readOnly
                value={
                  selectedDate
                    ? new Date(selectedDate).toLocaleDateString("nl-NL", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""
                }
                placeholder="dd-mm-jjjj"
                className={inputCls}
              />
            </Field>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Starttijd">
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Eindtijd">
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Aantal personen">
              <select
                value={form.num_people}
                onChange={(e) => setForm({ ...form, num_people: e.target.value })}
                className={inputCls}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "persoon" : "personen"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Soort werkruimte">
              <select
                value={form.room_purpose}
                onChange={(e) => setForm({ ...form, room_purpose: e.target.value })}
                className={inputCls}
              >
                <option>Werkoverleg</option>
                <option>Brainstormsessie</option>
                <option>Workshop</option>
                <option>Coachgesprek</option>
                <option>Anders</option>
              </select>
            </Field>

            <Field label="Extra wensen">
              <textarea
                rows={3}
                maxLength={1000}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Bijvoorbeeld lunch of een goede maaltijd, technische wensen of geweren opstelling."
                className={inputCls}
              />
            </Field>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Indicatie:{" "}
                {selectedSlot === "hele_dag"
                  ? "€120"
                  : selectedSlot
                    ? "€80 per dagdeel"
                    : "—"}
              </span>
              {!selectedDate || !selectedSlot ? (
                <span>Vul datum en tijden in</span>
              ) : (
                <span className="font-medium text-primary">Klaar om te versturen</span>
              )}
            </div>

            {mutation.isError && (
              <p className="mt-3 text-sm text-destructive">
                {(mutation.error as Error).message}
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedDate || !selectedSlot || mutation.isPending}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Aanvraag maken
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

const inputCls =
  "mt-1.5 block w-full border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-0";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
