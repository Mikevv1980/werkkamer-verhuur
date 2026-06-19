import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-sans text-xl font-semibold text-foreground">Pagina niet gevonden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-sans text-xl font-semibold tracking-tight text-foreground">
          Deze pagina kon niet worden geladen
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Er is iets misgegaan. Je kunt het opnieuw proberen of terug naar de homepagina gaan.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Opnieuw proberen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Werkkamer Bakkum — Lichte werkkamer voor overleg en workshop" },
      {
        name: "description",
        content:
          "Boek een lichte werkkamer in Bakkum voor overleg, brainstorm of workshop. Tot 4 personen, vanaf 20 euro per uur op landgoed Dijk en Duin.",
      },
      { name: "author", content: "Werkkamer Bakkum" },
      { property: "og:title", content: "Werkkamer Bakkum — Lichte werkkamer voor overleg" },
      {
        property: "og:description",
        content: "Een rustige, inspirerende werkkamer op landgoed Dijk en Duin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-serif text-base font-semibold tracking-tight text-foreground">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            wb
          </span>
          Werkkamer Bakkum
        </Link>
        <div className="hidden items-center gap-8 sm:flex">
          <a href="/#tarief" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
            Tarief
          </a>
          <a href="/#kamers" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
            Kamers
          </a>
          <a href="/#omgeving" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
            Omgeving
          </a>
          <a
            href="/#aanvraag"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Aanvragen
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-forest-dark text-background/80">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center">
        <p className="font-serif text-base text-background">Werkkamer Bakkum</p>
        <p className="text-xs">Dijk en Duin 11, Bakkum</p>
        <p className="text-xs">Vrijwillig project &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
}
