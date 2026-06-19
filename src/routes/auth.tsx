import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import cozyTable from "@/assets/uploads/6.jpg.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Inloggen — Werkkamer Bakkum" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-6 py-12 sm:py-16">
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-6xl overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden lg:block">
          <img
            src={cozyTable.url}
            alt="Ronde tafel in de werkkamer met laptop en koffie"
            width={1200}
            height={1400}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">Beheer</p>
            <p className="mt-3 max-w-sm font-serif text-3xl leading-tight">
              Beheer boekingen vanuit dezelfde warme huisstijl als de website.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 sm:p-10">
          <div className="w-full max-w-sm">
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl bg-terracotta/10 p-3 text-terracotta">
                <Lock className="h-5 w-5" />
              </div>
            </div>
            <h1 className="mt-4 text-center font-serif text-2xl font-medium text-card-foreground">
              Beheerderslogin
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "Log in om boekingen te beheren." : "Maak een beheerderaccount aan."}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">Wachtwoord</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Inloggen" : "Account aanmaken"}
              </button>
            </form>
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              {mode === "signin"
                ? "Nog geen account? Account aanmaken"
                : "Al een account? Inloggen"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
