import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";
import meetingRoom from "@/assets/uploads/3.jpg.asset.json";
import plantsView from "@/assets/uploads/4.jpg.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Werkkamer Bakkum" },
      {
        name: "description",
        content:
          "Neem contact op om beschikbaarheid op te vragen of meer informatie te krijgen over de werkkamer in Bakkum.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "dagpass",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
        <div className="mx-auto max-w-md text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-terracotta" />
          <h1 className="mt-6 font-serif text-3xl font-medium text-foreground">
            Bedankt voor je aanvraag!
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ik neem zo snel mogelijk contact met je op om de mogelijkheden te bespreken.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Terug naar home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={meetingRoom.url}
              alt="Warme koffiehoek en vergadertafel in de werkkamer"
              width={1400}
              height={900}
              className="h-72 w-full object-cover sm:h-80"
            />
          </div>
          <div className="overflow-hidden rounded-3xl">
            <img
              src={plantsView.url}
              alt="Planten in de vensterbank met uitzicht op het groene landgoed"
              width={900}
              height={900}
              className="h-72 w-full object-cover sm:h-80"
            />
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Neem contact op
            </span>
            <h1 className="mt-3 font-serif text-3xl font-medium text-foreground sm:text-4xl">
              Vraag beschikbaarheid aan
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Vul het formulier in en je krijgt zo snel mogelijk een reactie. We denken graag
              mee over dagdeel, workshop, overleg of coachsessie.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex rounded-xl bg-terracotta/10 p-3 text-terracotta">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Locatie</p>
                  <p className="mt-1 text-sm text-muted-foreground">Landgoed Dijk en Duin, Bakkum</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="inline-flex rounded-xl bg-terracotta/10 p-3 text-terracotta">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">E-mail</p>
                  <p className="mt-1 text-sm text-muted-foreground">info@werkkamerbakkum.nl</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="inline-flex rounded-xl bg-terracotta/10 p-3 text-terracotta">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Telefoon</p>
                  <p className="mt-1 text-sm text-muted-foreground">+31 6 12 34 56 78</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="inline-flex rounded-xl bg-terracotta/10 p-3 text-terracotta">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Beschikbaarheid</p>
                  <p className="mt-1 text-sm text-muted-foreground">Op aanvraag, per tijdslot of hele dag</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-card-foreground">
                  Naam
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                  placeholder="Jouw naam"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                    placeholder="jouw@email.nl"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-card-foreground">
                    Telefoon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                    placeholder="+31 6 ..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-card-foreground">
                  Type aanvraag
                </label>
                <select
                  id="interest"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                >
                  <option value="dagpass">Dagdeel</option>
                  <option value="weekpas">Hele dag</option>
                  <option value="maandpas">Workshop of sessie</option>
                  <option value="onbekend">Ik wil overleggen</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-card-foreground">
                  Bericht (optioneel)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                  placeholder="Vertel iets over je gewenste datum of type sessie..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
              >
                <Send className="h-4 w-4" />
                Verstuur aanvraag
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
