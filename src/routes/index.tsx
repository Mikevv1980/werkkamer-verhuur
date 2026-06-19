import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import roomHero from "@/assets/uploads/5.jpg.asset.json";
import coffeeMachine from "@/assets/uploads/1.jpg.asset.json";
import valuesCards from "@/assets/uploads/2.jpg.asset.json";
import kitchenette from "@/assets/uploads/3.jpg.asset.json";
import windowPlants from "@/assets/uploads/4.jpg.asset.json";
import cozyTable from "@/assets/uploads/6.jpg.asset.json";
import naturePath from "@/assets/uploads/7.jpg.asset.json";
import landgoedPath from "@/assets/uploads/8.jpg.asset.json";
import cupBuilding from "@/assets/uploads/9.jpg.asset.json";
import sunnyAvenue from "@/assets/uploads/10.jpg.asset.json";
// Kamer 2 foto's
import k2Wide from "@/assets/room2/IMG_4542.jpg.asset.json";

import k2Frames from "@/assets/room2/IMG_4545.jpg.asset.json";
import k2Window from "@/assets/room2/IMG_4546.jpg.asset.json";
import k2Door from "@/assets/room2/IMG_4547.jpg.asset.json";
import k2Coffee from "@/assets/room2/IMG_4549.jpg.asset.json";

import k2Chair from "@/assets/room2/IMG_4560.jpg.asset.json";
import k2Shelf from "@/assets/room2/IMG_4563.jpg.asset.json";
import sfeerOverview from "@/assets/sfeer/mk17.jpg.asset.json";
import sfeerKitchen from "@/assets/sfeer/mk18.jpg.asset.json";
import sfeerNotes from "@/assets/sfeer/mk16.jpg.asset.json";

import {
  createBooking,
  getAvailability,
  TIME_SLOTS,
  ROOMS,
  type TimeSlot,
  type Room,
} from "@/lib/bookings.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Werkkamer Bakkum — Twee lichte werkkamers voor overleg, brainstorm en workshop",
      },
      {
        name: "description",
        content:
          "Boek een rustige werkkamer op landgoed Dijk en Duin in Bakkum. Kies uit Kamer 1 (vanaf 20 euro p/u) of Kamer 2 (vanaf 15 euro p/u). Ideaal voor overleg, brainstorm en workshop.",
      },
      {
        property: "og:title",
        content: "Werkkamer Bakkum — Twee lichte werkkamers voor overleg",
      },
      {
        property: "og:description",
        content:
          "Twee sfeervolle werkkamers op landgoed Dijk en Duin in Bakkum. Boek per uur of voor een hele dag.",
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
  { value: "2 kamers", label: "kies de kamer die bij je sessie past" },
  { value: "7 dagen", label: "in de week beschikbaar in overleg" },
  { value: "vanaf €15 / uur", label: "of vanaf 75 euro voor een hele dag" },
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

const kamers = [
  {
    value: "kamer1" as const,
    name: "Kamer 1",
    tagline: "Ruime werkkamer met groot scherm",
    description:
      "Onze grootste werkkamer. Ronde tafel voor maximaal vier personen, een groot tv-scherm met Apple-TV en veel daglicht. Ideaal voor presentaties, workshops en langere sessies.",
    hourly: 20,
    daily: 120,
    image: roomHero.url,
    features: ["Max. 4 personen", "Groot scherm met Apple-TV", "Eigen koffiehoek"],
  },
  {
    value: "kamer2" as const,
    name: "Kamer 2",
    tagline: "Compacte sfeervolle kamer met uitzicht",
    description:
      "Een knus, persoonlijk ingerichte kamer met ovalen houten tafel, comfortabele stoelen en uitzicht op het groen van Dijk en Duin. Perfect voor een gesprek, coachsessie of geconcentreerd overleg met 2 tot 3 personen.",
    hourly: 15,
    daily: 75,
    image: k2Wide.url,
    features: ["2–3 personen", "Veel daglicht en groen uitzicht", "Rustige, warme sfeer"],
  },
];

const gallery = [
  { src: sfeerOverview.url, alt: "Warme werkkamer met ovalen tafel en daglicht", caption: "Veel daglicht en een warme, rustige sfeer.", room: "Kamer 1" },
  { src: sfeerKitchen.url, alt: "Kitchenette met planten en koffie", caption: "Eigen koffiehoek met verse koffie en thee.", room: "Kamer 1" },
  { src: sfeerNotes.url, alt: "Aantekeningen maken in een notitieboek", caption: "Ruimte om te denken, schrijven en reflecteren.", room: "Kamer 1" },
];

function Index() {
  return (
    <main>
      <Hero />
      <Stats />
      <Ruimte />
      <Kamers />
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
            src={roomHero.url}
            alt="Ronde houten tafel met zachte stoelen in een warme lichte werkkamer"
            width={1600}
            height={1100}
            className="h-[68vh] min-h-[460px] w-full object-cover sm:h-[78vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-12 lg:p-16">
            <div className="max-w-xl text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Een productieve dag in Bakkum
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                Twee lichte werkkamers voor overleg, brainstorm en workshop.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Kies de kamer die past bij je sessie — een ruime werkkamer met scherm, of een
                knusse kamer met uitzicht op het landgoed. Inclusief koffie en een wandeling
                door de duinen.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#aanvraag"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/30 transition-all hover:bg-primary/90"
                >
                  Vraag beschikbaarheid aan
                </a>
                <a
                  href="#kamers"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Bekijk beide kamers
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
            Geen kantoorgevoel, geen harde sfeer — wel daglicht, planten, warme materialen en
            een hoek voor een korte pauze. Voor wie even uit het kantoor wil zonder thuis te
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

function Kamers() {
  return (
    <section id="kamers" className="bg-accent/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
            Twee kamers
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Kies de kamer die past bij je sessie.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Beide kamers zijn warm en persoonlijk ingericht en kijken uit op het groen van
            landgoed Dijk en Duin.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {kamers.map((k) => (
            <article
              key={k.value}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <img
                src={k.image}
                alt={`Overzichtsfoto van ${k.name}`}
                width={1200}
                height={800}
                className="h-72 w-full object-cover"
                loading="lazy"
              />
              <div className="p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl text-card-foreground">{k.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                    €{k.hourly} p/u · €{k.daily} dag
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">{k.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {k.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {k.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#aanvraag"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Boek {k.name}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              Sfeer van beide kamers
            </p>
            <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
              Warm, rustig en persoonlijk ingericht.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Een doorkijk in Kamer 1 en Kamer 2: zachte materialen, koffie, groen en het
            historische karakter van Dijk en Duin.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((g) => (
            <figure key={g.src} className="overflow-hidden rounded-2xl border border-border/70 bg-card/60">
              <div className="relative">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  width={900}
                  height={700}
                  className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
                  {g.room}
                </span>
              </div>
              <figcaption className="px-4 py-3 text-sm text-foreground">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Omgeving() {
  return (
    <section id="omgeving" className="bg-accent/70">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
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
          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src={naturePath.url}
              alt="Natuurpad en bomen rondom de werkkamer in Bakkum"
              loading="lazy"
              width={800}
              height={900}
              className="h-72 w-full rounded-2xl object-cover sm:h-[420px]"
            />
            <div className="grid gap-4">
              <img
                src={landgoedPath.url}
                alt="Pad langs het historische gebouw op landgoed Dijk en Duin"
                loading="lazy"
                width={800}
                height={500}
                className="h-52 w-full rounded-2xl object-cover"
              />
              <img
                src={sunnyAvenue.url}
                alt="Zonnige laan en historisch gebouw in de buurt van de werkkamer"
                loading="lazy"
                width={800}
                height={500}
                className="h-52 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tarief() {
  return (
    <section id="tarief" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
            Transparante tarieven
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Reserveer per uur of kies direct voor een hele dag.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Geen vaste abonnementen, geen lange contracten. Boek zoals het past, en alles is
            inbegrepen — schoonmaak, koffie, water en het uitzicht.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kamers.flatMap((k) => [
            <div key={`${k.value}-uur`} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {k.name} · per uur
              </p>
              <p className="mt-3 font-serif text-4xl text-card-foreground">
                {k.hourly} <span className="text-2xl">euro</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Min. 2 uur. Bedoeld voor korte sessies.
              </p>
            </div>,
            <div key={`${k.value}-dag`} className="rounded-2xl bg-forest-dark p-6 text-background shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">
                {k.name} · hele dag
              </p>
              <p className="mt-3 font-serif text-4xl">
                {k.daily} <span className="text-2xl">euro</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-background/80">
                Voor workshops, brainstorm of trainingsdag.
              </p>
            </div>,
          ])}
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
  const [selectedRoom, setSelectedRoom] = useState<Room>("kamer1");
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
          room: selectedRoom,
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

  const roomUnavailable = availability?.unavailable?.[selectedRoom] ?? {};
  const selectedUnavailable = selectedDate ? (roomUnavailable[selectedDate] ?? []) : [];

  const currentRoom = ROOMS.find((r) => r.value === selectedRoom)!;
  const indicatie =
    selectedSlot === "hele_dag"
      ? `€${currentRoom.daily}`
      : selectedSlot
        ? `€${currentRoom.hourly * 4} per dagdeel`
        : "—";

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
            Kies de kamer, datum en tijd. Je krijgt zo snel mogelijk een reactie via e-mail of
            telefoon ter bevestiging.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/60">
            <img
              src={selectedRoom === "kamer1" ? cupBuilding.url : k2Wide.url}
              alt={`Sfeerbeeld van ${currentRoom.label}`}
              loading="lazy"
              width={900}
              height={640}
              className="h-56 w-full object-cover"
            />
            <div className="p-5 text-sm leading-relaxed text-foreground">
              <p className="font-semibold">{currentRoom.label}</p>
              <p className="mt-1 text-muted-foreground">
                €{currentRoom.hourly} per uur · €{currentRoom.daily} hele dag.
              </p>
            </div>
          </div>
        </div>

        {confirmedId ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <h3 className="mt-5 font-serif text-2xl text-card-foreground">
              Aanvraag ontvangen!
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Je krijgt een bevestiging op <span className="font-medium text-foreground">{form.email}</span>.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Referentie: {confirmedId.slice(0, 8)}</p>
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
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Kies een kamer
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {ROOMS.map((r) => {
                  const active = r.value === selectedRoom;
                  return (
                    <button
                      type="button"
                      key={r.value}
                      onClick={() => {
                        setSelectedRoom(r.value);
                        setSelectedSlot(null);
                      }}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-serif text-sm text-foreground">{r.label}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        €{r.hourly} p/u · €{r.daily} dag
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

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

            <div className="mt-6 rounded-xl bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <p className="font-serif text-sm capitalize text-card-foreground">{monthName}</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))
                    }
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background"
                    aria-label="Vorige maand"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))
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
                  const unavailableSlots = roomUnavailable[key] ?? [];
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
                placeholder="Bijvoorbeeld lunch of een goede maaltijd, technische wensen of gewenste opstelling."
                className={inputCls}
              />
            </Field>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>Indicatie: {indicatie}</span>
              {!selectedDate || !selectedSlot ? (
                <span>Vul datum en tijden in</span>
              ) : (
                <span className="font-medium text-primary">Klaar om te versturen</span>
              )}
            </div>

            {mutation.isError && (
              <p className="mt-3 text-sm text-destructive">{(mutation.error as Error).message}</p>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
