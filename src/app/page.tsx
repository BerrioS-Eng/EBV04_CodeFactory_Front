'use client'

import Link from "next/link";
import GridBackground from "@/components/GridBackground";
import { FaCode } from "react-icons/fa6";
import { BsTerminal } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <GridBackground colorMode="green" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Brand />
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:text-brand"
          >
            Regístrate
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="flex flex-col items-center pt-20 pb-24 text-center sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
            <span className="font-mono">Developer Collaboration Network</span>
          </div>

          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            La red donde los desarrolladores{" "}
            <span className="font-mono text-brand">construyen</span>, en
            conjunto.
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Comparte tus proyectos, debate sobre tecnologías y conecta con
            colaboradores que hablan tu mismo lenguaje técnico.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand px-8 text-sm font-bold uppercase tracking-wider text-background transition-all hover:brightness-110 sm:w-auto"
            >
              Únete ahora
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 w-full items-center justify-center rounded-md border border-border bg-surface px-8 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:text-brand sm:w-auto"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="features-heading"
          className="grid gap-6 md:grid-cols-3"
        >
          <h2 id="features-heading" className="sr-only">
            Funcionalidades de la plataforma
          </h2>
          <FeatureCard
            icon={<FaCode className="h-5 w-5" />}
            title="Comparte proyectos"
            body="Publica tus repos, recibe feedback de la comunidad y muestra en qué estás trabajando."
          />
          <FeatureCard
            icon={<BsTerminal className="h-5 w-5" />}
            title="Discute tecnologías"
            body="Conversaciones técnicas reales: arquitecturas, stacks, decisiones de diseño y debugging."
          />
          <FeatureCard
            icon={<FiUsers className="h-5 w-5" />}
            title="Encuentra colaboradores"
            body="Conecta con devs que complementan tus skills para llevar tus ideas a producción."
          />
        </section>
      </main>
    </div>
  );
}

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-md bg-brand font-mono text-base font-bold text-background"
      >
        {">_"}
      </span>
      <span className="font-mono text-lg font-bold tracking-tight text-brand">
        DevCollab
      </span>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-brand/30">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand transition-colors group-hover:bg-brand/15">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
