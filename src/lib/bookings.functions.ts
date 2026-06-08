import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const TIME_SLOTS = [
  { value: "ochtend", label: "Ochtend", time: "08:00 – 12:00" },
  { value: "middag", label: "Middag", time: "13:00 – 17:00" },
  { value: "hele_dag", label: "Hele dag", time: "08:00 – 17:00" },
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number]["value"];

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum");

const createSchema = z.object({
  booking_date: dateSchema,
  time_slot: z.enum(["ochtend", "middag", "hele_dag"]),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator((data: { from: string; to: string }) =>
    z.object({ from: dateSchema, to: dateSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("bookings")
      .select("booking_date, time_slot, status")
      .gte("booking_date", data.from)
      .lte("booking_date", data.to)
      .neq("status", "cancelled");
    if (error) throw new Error(error.message);
    // Map date -> Set of unavailable slots
    const map: Record<string, string[]> = {};
    for (const r of rows ?? []) {
      const list = (map[r.booking_date] ??= []);
      if (r.time_slot === "hele_dag") {
        list.push("ochtend", "middag", "hele_dag");
      } else {
        list.push(r.time_slot);
        // if both ochtend & middag taken, hele_dag also unavailable
      }
    }
    for (const d of Object.keys(map)) {
      const s = new Set(map[d]);
      if (s.has("ochtend") && s.has("middag")) s.add("hele_dag");
      map[d] = Array.from(s);
    }
    return { unavailable: map };
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check conflicts (including hele_dag overlap)
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from("bookings")
      .select("time_slot")
      .eq("booking_date", data.booking_date)
      .neq("status", "cancelled");
    if (checkErr) throw new Error(checkErr.message);

    const taken = new Set((existing ?? []).map((r) => r.time_slot));
    const conflict =
      taken.has("hele_dag") ||
      taken.has(data.time_slot) ||
      (data.time_slot === "hele_dag" && (taken.has("ochtend") || taken.has("middag")));
    if (conflict) {
      throw new Error("Dit tijdslot is helaas net geboekt. Kies een ander moment.");
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        booking_date: data.booking_date,
        time_slot: data.time_slot,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        notes: data.notes || null,
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
