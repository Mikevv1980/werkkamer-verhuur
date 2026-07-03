import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Uitschrijven — Werkkamer Huren" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnsubscribePage,
});

type State = "loading" | "confirm" | "already" | "invalid" | "success" | "error";

function UnsubscribePage() {
  const [state, setState] = useState<State>("loading");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) {
      setState("invalid");
      return;
    }
    setToken(t);
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setState("confirm");
        else if (d.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, []);

  const confirm = async () => {
    if (!token) return;
    setState("loading");
    try {
      const r = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      if (d.success) setState("success");
      else if (d.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-serif text-2xl text-foreground">Uitschrijven</h1>
        <div className="mt-4 text-sm text-muted-foreground">
          {state === "loading" && <p>Bezig met controleren…</p>}
          {state === "confirm" && (
            <>
              <p>Weet je zeker dat je geen e-mails meer wilt ontvangen?</p>
              <button
                onClick={confirm}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ja, uitschrijven
              </button>
            </>
          )}
          {state === "success" && (
            <p>Je bent uitgeschreven. Je ontvangt geen e-mails meer.</p>
          )}
          {state === "already" && <p>Dit adres is al uitgeschreven.</p>}
          {state === "invalid" && <p>Deze uitschrijflink is ongeldig of verlopen.</p>}
          {state === "error" && (
            <p>Er ging iets mis. Probeer het later opnieuw.</p>
          )}
        </div>
      </div>
    </main>
  );
}
