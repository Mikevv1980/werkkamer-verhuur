import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Mail, Phone, MessageSquare } from "lucide-react";
import { listBookings, updateBookingStatus, TIME_SLOTS } from "@/lib/bookings.functions";
import { supabase } from "@/integrations/supabase/client";
import roomBanner from "@/assets/uploads/9.jpg.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Boekingen" }] }),
  component: AdminPage,
});

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-muted text-muted-foreground line-through",
};

const statusLabel: Record<string, string> = {
  pending: "In afwachting",
  confirmed: "Bevestigd",
  cancelled: "Geannuleerd",
};

function AdminPage() {
  const navigate = useNavigate();
  const fetchBookings = useServerFn(listBookings);
  const updateStatus = useServerFn(updateBookingStatus);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => fetchBookings({}),
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string; status: "pending" | "confirmed" | "cancelled" }) =>
      updateStatus({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const bookings = data?.bookings ?? [];

  return (
    <main className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
          <img
            src={roomBanner.url}
            alt="Kopje op tafel in de werkkamer met uitzicht op het landgoed"
            width={1600}
            height={520}
            className="h-52 w-full object-cover sm:h-64"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-between gap-4 p-6 sm:p-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Beheer
              </span>
              <h1 className="mt-2 font-serif text-3xl font-medium text-white sm:text-4xl">
                Boekingen
              </h1>
              <p className="mt-2 text-sm text-white/80">
                Overzicht van alle reserveringen in een rustige beheeromgeving.
              </p>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
              Uitloggen
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          {isLoading && <p className="text-muted-foreground">Laden…</p>}
          {!isLoading && bookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Nog geen boekingen.
            </div>
          )}
          {bookings.map((b) => {
            const slotLabel = TIME_SLOTS.find((s) => s.value === b.time_slot)?.label ?? b.time_slot;
            return (
              <div
                key={b.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-serif text-lg font-medium text-card-foreground">
                        {new Date(b.booking_date).toLocaleDateString("nl-NL", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {(b as { room?: string }).room === "kamer2" ? "Kamer 2" : "Kamer 1"}
                      </span>
                      <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-xs font-medium text-terracotta">
                        {slotLabel}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[b.status]}`}
                      >
                        {statusLabel[b.status]}
                      </span>
                    </div>
                    <p className="mt-2 font-medium text-foreground">{b.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        <a href={`mailto:${b.email}`} className="hover:text-foreground">
                          {b.email}
                        </a>
                      </span>
                      {b.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {b.phone}
                        </span>
                      )}
                    </div>
                    {b.notes && (
                      <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{b.notes}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {b.status !== "confirmed" && (
                      <button
                        onClick={() => mutation.mutate({ id: b.id, status: "confirmed" })}
                        disabled={mutation.isPending}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Bevestigen
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => mutation.mutate({ id: b.id, status: "cancelled" })}
                        disabled={mutation.isPending}
                        className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent"
                      >
                        Annuleren
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
