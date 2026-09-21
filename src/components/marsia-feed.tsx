import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUp, Globe2, Heart, MessageSquare, Radio, Rocket, Send, Star, Users, type LucideIcon } from "lucide-react";
import { Eyebrow, Panel } from "@/components/ui";

type Reply = { id: string; author: string; text: string; time: string };
type Post = {
  id: string;
  icon: LucideIcon;
  author: string;
  handle: string;
  time: string;
  text: string;
  meta?: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
};

let seq = 0;
const uid = () => `p-${Date.now()}-${seq++}`;

const initialPosts: Post[] = [
  { id: "p1", icon: Users, author: "Rede Elysium", handle: "@elysium.net", time: "AGORA", text: "18 exploradores estão em Elysium.", meta: "Atividade regional em alta", likes: 24, liked: false, replies: [{ id: "r1", author: "Kai", text: "Estou a caminho do setor norte.", time: "AGORA" }] },
  { id: "p2", icon: Rocket, author: "Mission Control", handle: "@control", time: "04 MIN", text: "Uma nova expedição foi criada.", meta: "Expedição Olympus // MX-12", likes: 41, liked: false, replies: [] },
  { id: "p3", icon: Star, author: "Luna", handle: "@luna.pathfinder", time: "18 MIN", text: "Luna completou sua 20ª missão.", meta: "Conquista: Veteran Pathfinder", likes: 63, liked: true, replies: [{ id: "r2", author: "Nova", text: "Impressionante, parabéns!", time: "12 MIN" }] },
  { id: "p4", icon: Globe2, author: "Elysium Explorers", handle: "@ely.team", time: "36 MIN", text: "Elysium Explorers descobriu uma nova área.", meta: "Setor classificado como ELY-X09", likes: 18, liked: false, replies: [] },
];

const incoming: Post[] = [
  { id: "i1", icon: Radio, author: "Sonda Vigil", handle: "@vigil.probe", time: "AGORA", text: "Tempestade de poeira detectada em Utopia Planitia.", meta: "Alerta atmosférico // nível 2", likes: 7, liked: false, replies: [] },
  { id: "i2", icon: Users, author: "Olympus Crew", handle: "@olympus", time: "AGORA", text: "Três exploradores entraram no canal Olympus Expedition.", meta: "Mars Comms", likes: 5, liked: false, replies: [] },
  { id: "i3", icon: Star, author: "Kai", handle: "@kai.orbit", time: "AGORA", text: "Registrei um novo ponto de interesse perto da minha base.", meta: "Coordenadas ELY-4471", likes: 11, liked: false, replies: [] },
];

export function CommunityFeed({ onOpenProfile, className = "" }: { onOpenProfile?: (name: string) => void; className?: string }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [pending, setPending] = useState<Post[]>([]);
  const [openReply, setOpenReply] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const queue = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (queue.current >= incoming.length) return;
      const next = incoming[queue.current++]!;
      setPending((list) => [{ ...next, id: uid() }, ...list]);
    }, 14000);
    return () => clearInterval(timer);
  }, []);

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    setPosting(true);
    setTimeout(() => {
      setPosts((list) => [{ id: uid(), icon: Rocket, author: "Marcos Almeida", handle: "@marcos.pioneer", time: "AGORA", text, meta: "Transmitido de Base Aurora // Elysium", likes: 0, liked: false, replies: [] }, ...list]);
      setDraft("");
      setPosting(false);
      toast.success("Transmissão publicada", { description: "Sua mensagem está visível na rede MARSIA." });
    }, 550);
  };

  const toggleLike = (id: string) => setPosts((list) => list.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));

  const sendReply = (id: string) => {
    const text = replyDraft.trim();
    if (!text) return;
    setPosts((list) => list.map((p) => (p.id === id ? { ...p, replies: [...p.replies, { id: uid(), author: "Marcos Almeida", text, time: "AGORA" }] } : p)));
    setReplyDraft("");
    setOpenReply(null);
    toast.success("Resposta enviada");
  };

  const loadPending = () => {
    setPosts((list) => [...pending, ...list]);
    setPending([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Panel className="p-5">
        <div className="flex items-center justify-between">
          <Eyebrow>Transmitir para a rede</Eyebrow>
          <span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">{draft.length}/240</span>
        </div>
        <textarea
          value={draft}
          maxLength={240}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="O que está acontecendo em Marte?"
          rows={3}
          className="mars-input mt-4 resize-none"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[.14em] text-muted-foreground">Base Aurora // Elysium</span>
          <button className="action-button" disabled={posting || !draft.trim()} onClick={publish}>
            {posting ? "Transmitindo…" : "Publicar"}<Send size={14} />
          </button>
        </div>
      </Panel>

      {pending.length > 0 && (
        <button onClick={loadPending} className="flex w-full items-center justify-center gap-2 border border-primary/40 bg-primary/10 py-3 font-mono text-[10px] uppercase tracking-[.18em] text-primary transition-colors hover:bg-primary/20">
          <ArrowUp size={13} />{pending.length} nova{pending.length > 1 ? "s" : ""} atividade{pending.length > 1 ? "s" : ""} no feed
        </button>
      )}

      {posts.map(({ id, icon: Icon, author, handle, time, text, meta, likes, liked, replies }) => (
        <Panel key={id} className="p-5 transition-colors hover:border-primary/40">
          <div className="flex gap-4">
            <div className="grid size-10 shrink-0 place-items-center border border-border bg-muted"><Icon size={17} className="text-primary" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {onOpenProfile ? <button className="block truncate text-left font-display text-sm uppercase transition-colors hover:text-primary" onClick={() => onOpenProfile(author)}>{author}</button> : <span className="block truncate font-display text-sm uppercase">{author}</span>}
                  <span className="font-mono text-[9px] text-muted-foreground">{handle}</span>
                </div>
                <span className="shrink-0 font-mono text-[9px] text-muted-foreground">{time}</span>
              </div>
              <p className="mt-3 text-sm leading-6">{text}</p>
              {meta && <div className="mt-2 text-xs text-muted-foreground">{meta}</div>}

              <div className="mt-4 flex items-center gap-5 border-t border-border pt-3">
                <button onClick={() => toggleLike(id)} className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] transition-colors ${liked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                  <Heart size={14} fill={liked ? "currentColor" : "none"} />{likes}
                </button>
                <button onClick={() => { setOpenReply(openReply === id ? null : id); setReplyDraft(""); }} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-primary">
                  <MessageSquare size={14} />{replies.length} resposta{replies.length === 1 ? "" : "s"}
                </button>
              </div>

              {replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l border-border pl-4">
                  {replies.map((r) => (
                    <div key={r.id}>
                      <div className="flex items-center gap-2">
                        {onOpenProfile ? <button className="font-display text-xs uppercase transition-colors hover:text-primary" onClick={() => onOpenProfile(r.author)}>{r.author}</button> : <span className="font-display text-xs uppercase">{r.author}</span>}
                        <span className="font-mono text-[9px] text-muted-foreground">{r.time}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {openReply === id && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input value={replyDraft} maxLength={180} onChange={(e) => setReplyDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendReply(id); }} placeholder="Responder a esta transmissão…" className="mars-input mt-0 flex-1" />
                  <button className="action-button" disabled={!replyDraft.trim()} onClick={() => sendReply(id)}>Enviar</button>
                </div>
              )}
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
