import { Link, useLocation } from "@tanstack/react-router";
import { Home, Map, Rocket, Users, Orbit, Fingerprint, Hexagon, Radio, Store, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { MarsiaProvider } from "@/lib/marsia-context";
import { useEffect, useRef, useState } from "react";
import { hasSeenMarsiaIntro, MarsiaIntro } from "@/components/marsia-intro";

const navigation = [
  { to: "/", label: "Início", icon: Home },
  { to: "/explorar", label: "Explorar Marte", icon: Map },
  { to: "/missoes", label: "Missões", icon: Rocket },
  { to: "/comunidade", label: "Comunidade", icon: Users },
  { to: "/marketplace", label: "Marketplace", icon: Store },
  { to: "/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/minha-base", label: "Minha Base", icon: Orbit },
  { to: "/passaporte", label: "Meu Passaporte", icon: Fingerprint },
] as const;

const mobileNavigation = [
  { to: "/", label: "Início", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Map },
  { to: "/missoes", label: "Missões", icon: Rocket },
  { to: "/marketplace", label: "Mercado", icon: Store },
  { to: "/comunidade", label: "Rede", icon: Users },
  { to: "/minha-base", label: "Minha Base", icon: Orbit },
] as const;

export function MarsiaShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const audioContext = useRef<AudioContext | null>(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (pathname === "/" && !hasSeenMarsiaIntro()) setShowIntro(true);
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    playInterfaceTone("navigate");
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("button")) return;
      if (showIntro) return;
      playInterfaceTone("click");
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showIntro]);

  const playInterfaceTone = async (kind: "click" | "navigate") => {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = audioContext.current ?? new AudioContextClass();
    audioContext.current = context;
    if (context.state === "suspended") {
      try { await context.resume(); } catch { return; }
    }
    if (context.state !== "running") return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(kind === "navigate" ? 440 : 620, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "navigate" ? 660 : 480, context.currentTime + 0.08);
    gain.gain.setValueAtTime(0.025, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  };

  return <MarsiaProvider><div className="min-h-screen bg-background text-foreground selection:bg-primary/30"><div className="scanlines" aria-hidden="true" />
    <MarsiaIntro active={showIntro} onComplete={() => setShowIntro(false)} />
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3"><Hexagon className="text-primary" size={25}/><span className="font-display text-2xl uppercase">MARSIA</span><span className="hidden border-l border-border pl-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">Mars Social<br/>Exploration</span></Link>
        <div className="flex items-center gap-4"><div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:flex"><span className="status-dot"/>Sistema online <span className="ml-3 text-foreground">SOL 0451</span></div><Link to="/mensagens" aria-label="Mensagens" className="relative grid size-10 place-items-center border border-border bg-card/60 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"><MessageSquare size={17}/><span className="absolute -right-1 -top-1 size-2 rounded-full bg-signal"/></Link></div>
      </div>
    </header>
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 border-r border-border bg-background/95 p-5 backdrop-blur-xl md:block">
      <div className="mb-5 px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Navegação / 01</div>
      <nav className="space-y-1">{navigation.map(({to,label,icon:Icon}) => <Link key={to} to={to} activeOptions={{exact:to==="/"}} className="nav-link" activeProps={{className:"nav-link nav-link-active"}}><Icon size={16}/><span>{label}</span></Link>)}</nav>
      <div className="absolute bottom-6 left-5 right-5 border border-border bg-card/60 p-4"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-signal"><Radio size={12}/>Link orbital</div><div className="mt-3 flex items-end justify-between"><span className="text-xs text-muted-foreground">Latência</span><span className="font-mono text-sm">12m 42s</span></div></div>
    </aside>
    <main className="min-h-screen pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-16 md:pb-0 md:pl-64"><div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 md:py-10">{children}<footer className="mt-16 border-t border-border py-6 text-[10px] leading-5 text-muted-foreground">Os territórios representados nesta plataforma possuem finalidade conceitual e simbólica e não constituem propriedade imobiliária reconhecida sobre Marte.</footer></div></main>
    <nav aria-label="Navegação principal móvel" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-6 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_color-mix(in_oklab,var(--background)_72%,transparent)] backdrop-blur-xl md:hidden">
      {mobileNavigation.map(({ to, label, icon: Icon }) => {
        const isActive = to === "/" ? pathname === "/" : pathname === to || (to === "/explorar" && pathname.startsWith("/territorio/"));
        return <Link key={to} to={to} aria-current={isActive ? "page" : undefined} className={`mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`}><Icon size={19} strokeWidth={isActive ? 2.2 : 1.7}/><span>{label}</span></Link>;
      })}
    </nav>
    <Toaster theme="dark" position="top-right" toastOptions={{classNames:{toast:"!bg-card !border-border !text-foreground",description:"!text-muted-foreground"}}}/>
  </div></MarsiaProvider>
}
