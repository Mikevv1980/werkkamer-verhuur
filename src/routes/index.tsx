import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wifi,
  Coffee,
  Sun,
  Monitor,
  Printer,
  Armchair,
  MapPin,
  Calendar,
  Clock,
  Check,
} from "lucide-react";
import heroKamer from "../assets/hero-kamer.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Werkkamer te Huur — Productieve werkplek in hartje stad" },
      { name: "description", content: "Huur een rustige, inspirerende werkkamer met natuurlijk licht, snel wifi en alle faciliteiten die je nodig hebt." },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Wifi,
    title: "Snel WiFi",
    description: "Glasvezel internet tot 500 Mbps voor naadloos videobellen en cloudwerken.",
  },
  {
    icon: Sun,
    title: "Natuurlijk licht",
    description: "Grote ramen op het zuiden zorgen de hele dag voor prettig daglicht.",
  },
  {
    icon: Monitor,
    title: "Extra scherm",
    description: "Gebruik van een 27-inch 4K-monitor inbegrepen bij de huur.",
  },
  {
    icon: Coffee,
    title: "Koffie & thee",
    description: "Onbeperkt versgemalen koffie, thee en versnaperingen beschikbaar.",
  },
  {
    icon: Printer,
    title: "Printen & scannen",
    description: "Professionele printer/scanner voor al je documenten.",
  },
  {
    icon: Armchair,
    title: "Ergonmische stoel",
    description: "Herman Miller bureaustoel voor optimaal zitcomfort de hele dag.",
  },
];

const pricingOptions = [
  {
    name: "Dagpass",
    price: "35",
    period: "per dag",
    description: "Ideaal voor incidenteel werken of een projectdag.",
    features: ["8 uur toegang", "WiFi & koffie", "Monitor gebruik", "Printen (tot 20 pagina's)"],
    highlighted: false,
  },
  {
    name: "Weekpas",
    price: "140",
    period: "per week",
    description: "Perfect voor een productieve werkweek zonder thuisafleiding.",
    features: [
      "5 dagen toegang",
      "WiFi & koffie",
      "Monitor gebruik",
      "Onbeperkt printen",
      "Eigen opbergkastje",
    ],
    highlighted: true,
  },
  {
    name: "Maandpas",
    price: "450",
    period: "per maand",
    description: "Je vaste werkplek met alle gemakken voor de serieuze ondernemer.",
    features: [
      "Maandag t/m vrijdag",
      "WiFi & koffie",
      "Monitor gebruik",
      "Onbeperkt printen",
      "Eigen opbergkastje",
      "Facturatie mogelijk",
    ],
    highlighted: false,
  },
];

function Index() {
  return (
    <main>
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <span className="inline-block rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
              Werkplek te huur
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-tight font-medium text-foreground sm:text-5xl lg:text-6xl">
              Jouw inspirerende
              <br />
              <span className="text-terracotta">werkkamer</span> wacht op je
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Een rustige, lichte werkplek in hartje stad — compleet met snel wifi,
              ergonomisch meubilair en onbeperkt koffie. De perfecte omgeving om gefocust te werken.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
              >
                Plan een bezichtiging
              </Link>
              <a
                href="#prijzen"
                className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Bekijk tarieven
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-terracotta" />
                <span>Centrum, 5 min van station</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-terracotta" />
                <span>Ma-vr 08:00-18:00</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={heroKamer}
                alt="Lichte, moderne werkkamer met houten bureau, ergonomische stoel en grote ramen"
                width={1280}
                height={720}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Alles inbegrepen
            </span>
            <h2 className="mt-3 font-serif text-3xl font-medium text-foreground sm:text-4xl">
              Alles wat je nodig hebt om productief te zijn
            </h2>
            <p className="mt-4 text-muted-foreground">
              Geen gedoe met kabels of voorbereiding. Kom binnen, zet je laptop open en begin met werken.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-terracotta/30 hover:shadow-lg hover:shadow-terracotta/5"
              >
                <div className="inline-flex rounded-xl bg-terracotta/10 p-3 text-terracotta transition-colors group-hover:bg-terracotta group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-medium text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Over de ruimte */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={heroKamer}
                alt="Detailopname van de werkkamer"
                width={1280}
                height={720}
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                De ruimte
              </span>
              <h2 className="mt-3 font-serif text-3xl font-medium text-foreground sm:text-4xl">
                Een plek waar je graag werkt
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Deze werkkamer is met zorg ingericht voor focus en comfort. De ruimte van
                18 m² biedt genoeg plaats voor je werksetup, met voldoende bewegingsruimte
                en een zitje bij het raam voor een frisse gedachte.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                De kamer bevindt zich op de eerste verdieping van een karakteristiek
                pand in het centrum. Er is een gedeelde keuken met koelkast en magnetron,
                en een nette toiletvoorziening op de gang.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: "Oppervlakte", value: "18 m²" },
                  { label: "Zitplaatsen", value: "1-2" },
                  { label: "Verwarming", value: "Individueel" },
                  { label: "Ventilatie", value: "Raam + mechanisch" },
                  { label: "Veiligheid", value: "Brandmelder" },
                  { label: "Toegang", value: "Sleutel" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-1 font-medium text-card-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prijzen */}
      <section id="prijzen" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Transparante tarieven
            </span>
            <h2 className="mt-3 font-serif text-3xl font-medium text-foreground sm:text-4xl">
              Kies wat bij je past
            </h2>
            <p className="mt-4 text-muted-foreground">
              Geen verborgen kosten. Je betaalt alleen voor de tijd die je gebruikt.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingOptions.map((option) => (
              <div
                key={option.name}
                className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
                  option.highlighted
                    ? "border-terracotta bg-card shadow-xl shadow-terracotta/10"
                    : "border-border bg-card"
                }`}
              >
                {option.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Meest gekozen
                  </span>
                )}
                <h3 className="font-serif text-lg font-medium text-card-foreground">
                  {option.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="font-serif text-4xl font-semibold text-foreground">
                    €{option.price}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">{option.period}</span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {option.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
                    option.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-input bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  Plan een bezichtiging
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Calendar className="mx-auto h-10 w-10 text-terracotta" />
          <h2 className="mt-6 font-serif text-3xl font-medium text-foreground sm:text-4xl">
            Kom langs en ervaar het zelf
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Ik nodig je graag uit voor een rondleiding. Je kunt de ruimte bekijken,
            de sfeer proeven en direct beslissen of dit je nieuwe werkplek wordt.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
          >
            Plan een bezichtiging
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Geheel vrijblijvend, geen verplichtingen
          </p>
        </div>
      </section>
    </main>
  );
}
