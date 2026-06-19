import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const TIME_SLOTS = [
  { value: "ochtend", label: "Ochtend", time: "08:00 – 12:00" },
  { value: "middag", label: "Middag", time: "13:00 – 17:00" },
  { value: "hele_dag", label: "Hele dag", time: "08:00 – 17:00" },
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number]["value"];

export const ROOMS = [
  {
    value: "kamer1",
    label: "Kamer 1",
    tagline: "Ruime werkkamer met groot scherm",
    hourly: 20,
    daily: 120,
  },
  {
    value: "kamer2",
    label: "Kamer 2",
    tagline: "Compacte sfeervolle kamer met uitzicht",
    hourly: 15,
    daily: 75,
  },
] as const;

export type Room = (typeof ROOMS)[number]["value"];

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum");

const createSchema = z.object({
  booking_date: dateSchema,
  time_slot: z.enum(["ochtend", "middag", "hele_dag"]),
  room: z.enum(["kamer1", "kamer2"]).default("kamer1"),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  num_people: z.coerce.number().int().min(1).max(8).optional(),
  room_purpose: z.string().trim().max(80).optional().or(z.literal("")),
  start_time: z.string().trim().max(10).optional().or(z.literal("")),
  end_time: z.string().trim().max(10).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type AvailabilityMap = Record<string, string[]>;

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator((data: { from: string; to: string }) =>
    z.object({ from: dateSchema, to: dateSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("booking_date, time_slot, status, room")
      .gte("booking_date", data.from)
      .lte("booking_date", data.to)
      .neq("status", "cancelled");
    if (error) throw new Error(error.message);

    const perRoom: Record<string, AvailabilityMap> = { kamer1: {}, kamer2: {} };
    for (const r of rows ?? []) {
      const room = (r as { room?: string }).room ?? "kamer1";
      const map = (perRoom[room] ??= {});
      const list = (map[r.booking_date] ??= []);
      if (r.time_slot === "hele_dag") {
        list.push("ochtend", "middag", "hele_dag");
      } else {
        list.push(r.time_slot);
      }
    }
    for (const room of Object.keys(perRoom)) {
      for (const d of Object.keys(perRoom[room])) {
        const s = new Set(perRoom[room][d]);
        if (s.has("ochtend") && s.has("middag")) s.add("hele_dag");
        perRoom[room][d] = Array.from(s);
      }
    }
    return { unavailable: perRoom };
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing, error: checkErr } = await supabaseAdmin
      .from("bookings")
      .select("time_slot, room")
      .eq("booking_date", data.booking_date)
      .eq("room", data.room)
      .neq("status", "cancelled");
    if (checkErr) throw new Error(checkErr.message);

    const taken = new Set((existing ?? []).map((r) => r.time_slot));
    const conflict =
      taken.has("hele_dag") ||
      taken.has(data.time_slot) ||
      (data.time_slot === "hele_dag" && (taken.has("ochtend") || taken.has("middag")));
    if (conflict) {
      throw new Error("Dit tijdslot is helaas net geboekt voor deze kamer. Kies een andere kamer of tijd.");
    }

    const extraLines: string[] = [];
    if (data.num_people) extraLines.push(`Aantal personen: ${data.num_people}`);
    if (data.room_purpose) extraLines.push(`Soort werkruimte: ${data.room_purpose}`);
    if (data.start_time || data.end_time) {
      extraLines.push(
        `Tijden: ${data.start_time || "—"} tot ${data.end_time || "—"}`,
      );
    }
    if (data.notes) extraLines.push(`Extra wensen: ${data.notes}`);
    const composedNotes = extraLines.length ? extraLines.join("\n") : null;

    const { data: inserted, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        booking_date: data.booking_date,
        time_slot: data.time_slot,
        room: data.room,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        notes: composedNotes,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { bookings: data ?? [] };
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
