import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Lock, Radio, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">{children}</div>;
}

export function Progress({ value }: { value: number }) {
  return <div className="h-1 overflow-hidden bg-muted"><div className="h-full bg-primary transition-all duration-700" style={{ width: `${value}%` }} /></div>;
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return <div className="border-l border-border pl-4"><div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div><div className="mt-1 font-display text-xl uppercase text-foreground">{value}</div>{sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}</div>;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`hud-panel ${className}`}>{children}</section>;
}

export function PageHeader({ code, title, description }: { code: string; title: string; description: string }) {
  return <header className="page-header mb-8 grid gap-4 border-b border-border pb-7 lg:grid-cols-[1fr_auto] lg:items-end"><div><Eyebrow>{code}</Eyebrow><h1 className="mt-3 font-display text-4xl uppercase leading-none text-foreground md:text-6xl">{title}</h1></div><p className="max-w-md text-sm leading-6 text-muted-foreground lg:text-right">{description}</p></header>
}

export function ActionLink({ to, children }: { to: "/explorar" | "/missoes" | "/comunidade" | "/minha-base" | "/passaporte" | "/territorio/$territoryId"; children: ReactNode }) {
  const props = to === "/territorio/$territoryId" ? { to, params: { territoryId: "M-042" } } : { to };
  return <Link {...props} className="action-button">{children}<ArrowUpRight size={15} /></Link>
}

export function ActivityDot() { return <span className="relative inline-flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-70"/><span className="relative inline-flex size-2 rounded-full bg-signal"/></span> }

export function Structure({ icon: Icon, name, detail, locked = false }: { icon: LucideIcon; name: string; detail: string; locked?: boolean }) {
  return <div className={`group border border-border bg-card/50 p-5 transition-colors ${locked ? "opacity-45" : "hover:border-primary/50"}`}><div className="flex items-start justify-between"><Icon size={21} className="text-primary"/>{locked && <Lock size={14} className="text-muted-foreground"/>}</div><div className="mt-8 font-display text-lg uppercase">{name}</div><div className="mt-1 text-xs text-muted-foreground">{detail}</div></div>
}

export function CommsRoom({ name, count, onOpen, active = false }: { name: string; count: number; onOpen: () => void; active?: boolean }) {
  return <button type="button" onClick={onOpen} aria-label={`Abrir sala ${name}`} className={`group flex w-full items-center gap-4 border-b border-border py-4 text-left transition-colors hover:text-primary ${active ? "text-primary" : ""}`}><span className="grid size-9 place-items-center border border-border bg-muted"><Radio size={15}/></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{name}</span><span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Sala simulada</span></span><span className="font-mono text-xs text-signal">{count} online</span></button>
}
