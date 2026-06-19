ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room text NOT NULL DEFAULT 'kamer1';
CREATE INDEX IF NOT EXISTS bookings_room_date_idx ON public.bookings(room, booking_date);