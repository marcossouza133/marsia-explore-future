import { Link } from "@tanstack/react-router";
import { Home, Map, Rocket, Users, Orbit, Fingerprint, Menu, X, Hexagon, Radio } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { MarsiaProvider } from "@/lib/marsia-context";

const navigation = [
  { to: "/", label: "Início", icon: Home },
  { to: "/explorar", label: "Explorar Marte", icon: Map },
  { to: "/missoes", label: "Missões", icon: Rocket },
  { to: "/comunidade", label: "Comunidade", icon: Users },
  { to: "/minha-base", label: "Minha Base", icon: Orbit },
  { to: "/passaporte", label: "Meu Passaporte", icon: Fingerprint },
] as const;

export function MarsiaShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <MarsiaProvider><div className="min-h-screen bg-background text-foreground selection:bg-primary/30"><div className="scanlines" aria-hidden="true" />
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}><Hexagon className="text-primary" size={25}/><span className="font-display text-2xl uppercase">MARSIA</span><span className="hidden border-l border-border pl-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">Mars Social<br/>Exploration</span></Link>
        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:flex"><span className="status-dot"/>Sistema online <span className="ml-3 text-foreground">SOL 0451</span></div>
        <button aria-label={open ? "Fechar menu" : "Abrir menu"} className="grid size-10 place-items-center border border-border md:hidden" onClick={() => setOpen(!open)}>{open ? <X size={18}/> : <Menu size={18}/>}</button>
      </div>
    </header>
    <aside className={`fixed bottom-0 left-0 top-16 z-40 w-64 border-r border-border bg-background/95 p-5 backdrop-blur-xl transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-5 px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Navegação / 01</div>
      <nav className="space-y-1">{navigation.map(({to,label,icon:Icon}) => <Link key={to} to={to} onClick={()=>setOpen(false)} activeOptions={{exact:to==="/"}} className="nav-link" activeProps={{className:"nav-link nav-link-active"}}><Icon size={16}/><span>{label}</span></Link>)}</nav>
      <div className="absolute bottom-6 left-5 right-5 border border-border bg-card/60 p-4"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-signal"><Radio size={12}/>Link orbital</div><div className="mt-3 flex items-end justify-between"><span className="text-xs text-muted-foreground">Latência</span><span className="font-mono text-sm">12m 42s</span></div></div>
    </aside>
    <main className="min-h-screen pt-16 md:pl-64"><div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 md:py-10">{children}<footer className="mt-16 border-t border-border py-6 text-[10px] leading-5 text-muted-foreground">Os territórios representados nesta plataforma possuem finalidade conceitual e simbólica e não constituem propriedade imobiliária reconhecida sobre Marte.</footer></div></main>
    <Toaster theme="dark" position="top-right" toastOptions={{classNames:{toast:"!bg-card !border-border !text-foreground",description:"!text-muted-foreground"}}}/>
  </div></MarsiaProvider>
}
