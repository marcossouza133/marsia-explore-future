import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { Eyebrow, PageHeader, Panel } from "@/components/ui";

type Message = { id: string; mine: boolean; text: string; time: string };
type Conversation = { id: string; name: string; handle: string; status: string; online: boolean; messages: Message[] };

let seq = 0;
const uid = () => `m-${Date.now()}-${seq++}`;
const now = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const initialConversations: Conversation[] = [
  { id: "c1", name: "Luna", handle: "@luna.pathfinder", status: "Elysium Planitia", online: true, messages: [
    { id: "m1", mine: false, text: "Vi que você registrou o M-042. Bem-vindo a Elysium!", time: "20:14" },
    { id: "m2", mine: true, text: "Obrigado! Já estou montando a base.", time: "20:16" },
    { id: "m3", mine: false, text: "Se quiser, te levo na próxima expedição Olympus.", time: "20:18" },
  ] },
  { id: "c2", name: "Kai", handle: "@kai.orbit", status: "Olympus Mons", online: true, messages: [
    { id: "m4", mine: false, text: "Tenho um módulo de antena anunciado no marketplace, interessa?", time: "19:02" },
  ] },
  { id: "c3", name: "Nova", handle: "@nova.geo", status: "Valles Marineris", online: false, messages: [
    { id: "m5", mine: true, text: "Consegue enviar as coordenadas do cânion?", time: "17:41" },
    { id: "m6", mine: false, text: "Envio hoje à noite, estou em descida técnica.", time: "17:55" },
  ] },
  { id: "c4", name: "Elysium Explorers", handle: "@ely.team", status: "Canal de equipe // 23 membros", online: true, messages: [
    { id: "m7", mine: false, text: "Reunião de expedição no Sol 0452, às 08h.", time: "16:30" },
  ] },
];

const autoReplies = ["Recebido, explorador.", "Combinado, te chamo pelo Mars Comms.", "Anotado nas coordenadas da missão.", "Perfeito, seguimos assim."];

export function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState("c1");
  const [draft, setDraft] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const active = conversations.find((c) => c.id === activeId)!;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [active.messages.length, activeId]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const id = activeId;
    setConversations((list) => list.map((c) => (c.id === id ? { ...c, messages: [...c.messages, { id: uid(), mine: true, text, time: now() }] } : c)));
    setDraft("");
    setTimeout(() => {
      setConversations((list) => list.map((c) => (c.id === id ? { ...c, messages: [...c.messages, { id: uid(), mine: false, text: autoReplies[Math.floor(Math.random() * autoReplies.length)]!, time: now() }] } : c)));
    }, 1400);
  };

  return <>
    <PageHeader code="Canal privado / 08" title="Mensagens" description="Converse diretamente com outros exploradores sobre missões, territórios e negociações." />
    <div className="grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
      <Panel className={`p-5 ${mobileOpen ? "hidden lg:block" : ""}`}>
        <Eyebrow>Exploradores conectados</Eyebrow>
        <div className="mt-5 space-y-1">
          {conversations.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return <button key={c.id} onClick={() => { setActiveId(c.id); setMobileOpen(true); }} className={`flex w-full items-center gap-3 border p-3 text-left transition-colors ${c.id === activeId ? "border-primary/50 bg-primary/10" : "border-transparent hover:border-border"}`}>
              <span className="relative grid size-10 shrink-0 place-items-center border border-border bg-muted font-display text-sm">{c.name.slice(0, 1)}{c.online && <span className="absolute -right-1 -top-1 size-2 rounded-full bg-signal" />}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2"><span className="truncate font-display text-sm uppercase">{c.name}</span><span className="shrink-0 font-mono text-[9px] text-muted-foreground">{last?.time}</span></span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">{last?.text}</span>
              </span>
            </button>;
          })}
        </div>
      </Panel>

      <Panel className={`flex min-h-[520px] flex-col p-0 ${mobileOpen ? "" : "hidden lg:flex"}`}>
        <div className="flex items-center gap-3 border-b border-border p-5">
          <button className="text-muted-foreground transition-colors hover:text-foreground lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Voltar para conversas"><ArrowLeft size={18} /></button>
          <div className="grid size-10 place-items-center border border-border bg-muted font-display text-sm">{active.name.slice(0, 1)}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-lg uppercase">{active.name}</div>
            <div className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">{active.status}</div>
          </div>
          <span className={`font-mono text-[9px] uppercase tracking-[.14em] ${active.online ? "text-signal" : "text-muted-foreground"}`}>{active.online ? "Online" : "Offline"}</span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {active.messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] border px-4 py-3 ${m.mine ? "border-primary/40 bg-primary/12" : "border-border bg-muted/40"}`}>
                <p className="text-sm leading-6">{m.text}</p>
                <span className="mt-1 block font-mono text-[9px] text-muted-foreground">{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="flex flex-col gap-2 border-t border-border p-4 sm:flex-row">
          <input value={draft} maxLength={220} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Escreva uma mensagem…" className="mars-input mt-0 flex-1 !text-base !normal-case" />
          <button className="action-button" disabled={!draft.trim()} onClick={send}>Enviar<Send size={14} /></button>
        </div>
      </Panel>
    </div>
    <p className="mt-8 text-[10px] leading-4 text-muted-foreground">Conversas simuladas para demonstração do protótipo, sem envio real de mensagens.</p>
  </>;
}

export function notifyUnavailable() { toast.info("Recurso simulado neste protótipo"); }
