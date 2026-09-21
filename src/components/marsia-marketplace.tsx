import { useState } from "react";
import { toast } from "sonner";
import { Gem, Hexagon, Mountain, Plus, Rocket, Store, Tag, Wrench, X, type LucideIcon } from "lucide-react";
import { Eyebrow, PageHeader, Panel, Stat } from "@/components/ui";
import { MarketplaceCard, type MarketplaceCardItem } from "@/components/marketplace-card";
import marsMap from "@/assets/mars-map.jpg";
import { useMarsia } from "@/lib/marsia-context";

type Category = "Território" | "Estrutura" | "Recurso";
type Listing = {
  id: string;
  code: string;
  title: string;
  category: Category;
  region: string;
  price: string;
  seller: string;
  rarity: string;
  desc: string;
  image: string;
  imagePosition?: string;
  icon: LucideIcon;
  mine?: boolean;
};

type InventoryItem = {
  id: string;
  title: string;
  category: Category;
  region: string;
  description: string;
  image: string;
  imagePosition?: string;
  icon: LucideIcon;
  rarity: string;
};
type Proposal = { id: string; buyer: string; amount: string; message: string };
type SentProposal = { id: string; item: string; seller: string; amount: string; status: string };
type SaleRecord = { id: string; item: string; buyer: string; amount: string; soldAt: string };
const profileOpen = false;
const setProfileOpen = (_open: boolean) => undefined;
const profileTab = "items";
const setProfileTab = (_tab: "items" | "sales" | "proposals") => undefined;

const playerInventory: InventoryItem[] = [
  { id: "inv-m042", title: "Território M-042", category: "Território", region: "Elysium", description: "Território registrado na sua base com relevo estável para expansão.", image: marsMap, imagePosition: "50% 50%", icon: Mountain, rarity: "Seu território" },
  { id: "inv-st07", title: "Antena de Longo Alcance", category: "Estrutura", region: "Elysium", description: "Módulo de comunicação orbital disponível para transferência.", image: marsMap, imagePosition: "36% 42%", icon: Wrench, rarity: "Inventário" },
  { id: "inv-rs14", title: "Amostra de Basalto Gale", category: "Recurso", region: "Gale", description: "Amostra mineral catalogada durante a expedição MX-07.", image: marsMap, imagePosition: "72% 45%", icon: Gem, rarity: "Inventário" },
];

const initialListings: Listing[] = [
  { id: "l1", code: "M-118", title: "Cratera Norte", category: "Território", region: "Gale", price: "R$149", seller: "Luna", rarity: "Épico", desc: "Setor elevado com dois pontos de interesse mapeados.", image: "https://clickpetroleoegas.com.br/wp-content/uploads/2026/03/VIDA-EM-MARTE.jpg", imagePosition: "18% 38%", icon: Mountain },
  { id: "l2", code: "ST-04", title: "Módulo de Antena", category: "Estrutura", region: "Elysium", price: "R$79", seller: "Kai", rarity: "Raro", desc: "Amplia o alcance de sinal orbital da sua base.", image: "https://s2-g1.glbimg.com/jRkxu2mWDAivOBxH48V8am-A9DA=/0x0:3000x2400/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2018/R/8/9gxgoSTeuiEDRFEClpQQ/opportunity.jpg", imagePosition: "36% 42%", icon: Wrench },
  { id: "l3", code: "RS-22", title: "Cristais de Hematita", category: "Recurso", region: "Valles Marineris", price: "R$39", seller: "Nova", rarity: "Comum", desc: "Lote coletado durante a expedição MX-07.", image: "https://mudmisticas.com.br/wp-content/uploads/2024/02/Hematita.jpg", imagePosition: "52% 58%", icon: Gem },
  { id: "l4", code: "M-207", title: "Planalto Utopia", category: "Território", region: "Utopia", price: "R$189", seller: "Orion", rarity: "Lendário", desc: "Território amplo com relevo estável para grandes bases.", image: "https://revistaoeste.com/oestegeral/wp-content/uploads/2026/04/oceano-em-Marte-1024x576.jpg", imagePosition: "72% 32%", icon: Mountain },
  { id: "l5", code: "ST-11", title: "Estufa Hidropônica", category: "Estrutura", region: "Hellas", price: "R$119", seller: "Vega", rarity: "Épico", desc: "Cultivo autossustentável para longas expedições.", image: "https://static.vecteezy.com/ti/fotos-gratis/t2/48010484-uma-futurista-representacao-do-agricultura-mostra-cultivo-e-agricultura-dentro-vidro-recintos-em-a-superficie-do-marte-dentro-espaco-destacando-inovacao-e-sustentabilidade-esforcos-dentro-espaco-foto.jpg", imagePosition: "83% 62%", icon: Wrench },
  { id: "l6", code: "RS-08", title: "Núcleo de Gelo", category: "Recurso", region: "Olympus Mons", price: "R$59", seller: "Sol", rarity: "Raro", desc: "Amostra profunda extraída da encosta oeste.", image: "https://img.odcdn.com.br/wp-content/uploads/2025/10/cpsula-do-tempo-gelo-marte-1-scaled.jpeg", imagePosition: "8% 55%", icon: Gem },
  { id: "l7", code: "ST-19", title: "Gerador de Oxigênio", category: "Estrutura", region: "Gale", price: "R$139", seller: "Astra", rarity: "Épico", desc: "Unidade compacta de suporte para habitats remotos.", image: "https://img.odcdn.com.br/wp-content/uploads/2023/04/rover-perseverance.jpg", imagePosition: "62% 72%", icon: Wrench },
  { id: "l8", code: "RS-31", title: "Liga de Basalto", category: "Recurso", region: "Hellas", price: "R$49", seller: "Atlas", rarity: "Comum", desc: "Composto resistente para reforço de estruturas externas.", image: "https://revistacenarium.com.br/wp-content/uploads/2021/09/xrochas-martejpgpagespeedic17m2a88pg6.jpg", imagePosition: "92% 44%", icon: Gem },
];

const filters = ["Todos", "Meus anúncios", "Território", "Estrutura", "Recurso"] as const;

export function MarketplacePage() {
  const { playerName } = useMarsia();
  const firstName = playerName.split(" ")[0];
  const [listings, setListings] = useState(initialListings);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [manageListing, setManageListing] = useState<Listing | null>(null);
  const [proposalListing, setProposalListing] = useState<Listing | null>(null);
  const [proposalAmount, setProposalAmount] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [editForm, setEditForm] = useState({ price: "", desc: "" });
  const [proposals, setProposals] = useState<Record<string, Proposal[]>>({});
  const [sentProposals, setSentProposals] = useState<SentProposal[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [euOpen, setEuOpen] = useState(false);
  const [form, setForm] = useState({ inventoryId: "", category: "Território" as Category, region: "Elysium", price: "", desc: "" });

  const visible = filter === "Todos" ? listings : filter === "Meus anúncios" ? listings.filter((l) => l.mine) : listings.filter((l) => l.category === filter);

  const submit = () => {
    const inventoryItem = playerInventory.find((item) => item.id === form.inventoryId);
    if (!inventoryItem || !form.price.trim()) { toast.error("Selecione um item do inventário e informe o valor"); return; }
    setSaving(true);
    setTimeout(() => {
      const seq = listings.length + 1;
      const newListing: Listing = {
        id: `mine-${Date.now()}`,
        code: `AN-${String(seq).padStart(3, "0")}`,
        title: inventoryItem.title,
        category: inventoryItem.category,
        region: inventoryItem.region,
        price: form.price.trim().startsWith("R$") ? form.price.trim() : `R$${form.price.trim()}`,
        seller: "Marcos Almeida",
        rarity: inventoryItem.rarity,
        desc: inventoryItem.description,
        image: inventoryItem.image,
        imagePosition: inventoryItem.imagePosition ?? "50% 50%",
        icon: inventoryItem.icon,
        mine: true,
      };
      setListings((list) => [newListing, ...list]);
      setProposals((current) => ({ ...current, [newListing.id]: [{ id: `proposal-${Date.now()}`, buyer: "Luna", amount: "R$ 135", message: "Tenho interesse em concluir esta aquisição." }] }));
      setSaving(false);
      setOpen(false);
      setFilter("Todos");
      setForm({ inventoryId: "", category: "Território", region: "Elysium", price: "", desc: "" });
      toast.success("Anúncio publicado", { description: "Seu item já aparece no marketplace." });
    }, 600);
  };

  return <>
    <div className="flex items-start justify-between gap-4"><PageHeader code="Mercado orbital / 07" title="Marketplace" description="Negocie territórios, estruturas e recursos com outros exploradores da rede MARSIA." /><button aria-label={`Abrir perfil de ${firstName}`} className={`secondary-button shrink-0 ${euOpen ? "border-primary bg-primary/10 text-primary" : ""}`} onClick={() => setEuOpen((open) => !open)}><Rocket size={15}/>{firstName}</button></div>

    {!euOpen && <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[.14em] transition-colors ${filter === f ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{f}</button>)}
      </div>
      <button className="action-button" onClick={() => setOpen(true)}><Plus size={14} />Anunciar item</button>
    </div>}

    {!euOpen && <Panel className="mb-6 grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
      <Stat label="Anúncios ativos" value={String(listings.length)} />
      <Stat label="Territórios" value={String(listings.filter((l) => l.category === "Território").length)} />
      <Stat label="Seus anúncios" value={String(listings.filter((l) => l.mine).length)} />
      <Stat label="Volume do ciclo" value="R$ 12.4k" />
    </Panel>}

    {euOpen ? <div className="space-y-5"><button className="secondary-button" onClick={() => setEuOpen(false)}><Rocket size={15}/>Voltar ao Marketplace</button><div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><Panel className="p-6"><Eyebrow>Perfil // {firstName}</Eyebrow><h2 className="mt-2 font-display text-3xl uppercase">Meu inventário</h2><div className="mt-6 grid gap-3">{playerInventory.map((item) => { const listing = listings.find((entry) => entry.mine && entry.title === item.title); return <div key={item.id} className="border border-border bg-card/50 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-xl uppercase">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.category} // {item.region}</p></div><span className="font-mono text-[10px] text-signal">{listing ? "ANUNCIADO" : "DISPONÍVEL"}</span></div>{listing && <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs"><span>{listing.price}</span><button className="secondary-button" onClick={() => { setManageListing(listing); setEditForm({ price: listing.price, desc: listing.desc }); }}>Gerenciar</button></div>}</div>; })}</div></Panel><div className="grid gap-5"><Panel className="p-6"><Eyebrow>Vendas registradas</Eyebrow><div className="mt-5 grid gap-3">{sales.map((sale) => <div key={sale.id} className="border border-border p-4"><div className="flex justify-between gap-3"><span className="font-display text-lg uppercase">{sale.item}</span><span className="text-primary">{sale.amount}</span></div><p className="mt-2 text-xs text-muted-foreground">Comprador: {sale.buyer} // {sale.soldAt}</p></div>)}{sales.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma venda finalizada ainda.</p>}</div></Panel><Panel className="p-6"><Eyebrow>Propostas enviadas</Eyebrow><div className="mt-5 grid gap-3">{sentProposals.map((proposal) => <div key={proposal.id} className="border border-border p-4"><div className="flex justify-between gap-3"><span className="font-display text-lg uppercase">{proposal.item}</span><span className="text-primary">{proposal.amount}</span></div><p className="mt-2 text-xs text-muted-foreground">Vendedor: {proposal.seller} // {proposal.status}</p></div>)}{sentProposals.length === 0 && <p className="text-sm text-muted-foreground">Você ainda não enviou propostas.</p>}</div></Panel></div></div></div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visible.map((listing) => (
        <MarketplaceCard
          key={listing.id}
          item={{ ...listing, description: listing.desc } satisfies MarketplaceCardItem}
          onManage={(item) => { const listingItem = listings.find((entry) => entry.id === item.id); if (!listingItem) return; setManageListing(listingItem); setEditForm({ price: listingItem.price, desc: listingItem.desc }); }}
          onBuy={(item) => { setListings((current) => current.filter((entry) => entry.id !== item.id)); toast.success("Compra concluída", { description: `${item.title} foi adicionado à sua base.` }); }}
          onPropose={(item) => { const listingItem = listings.find((entry) => entry.id === item.id); if (!listingItem) return; setProposalListing(listingItem); setProposalAmount(item.price); setProposalMessage(""); }}
        />
      ))}
    </div>}

    {filter === "Meus anúncios" && visible.length === 0 && <Panel className="grid min-h-[220px] place-items-center p-8 text-center"><div><Eyebrow>Seus anúncios</Eyebrow><h2 className="mt-3 font-display text-3xl uppercase">Nenhum anúncio publicado</h2><p className="mt-3 text-sm text-muted-foreground">Crie seu primeiro anúncio para acompanhar seus itens nesta aba.</p><button className="action-button mt-6" onClick={() => setOpen(true)}><Plus size={14}/>Anunciar item</button></div></Panel>}

    <p className="mt-8 text-[10px] leading-4 text-muted-foreground">Marketplace conceitual: valores e negociações são simulados e não geram cobrança ou transferência real.</p>

    {manageListing && <div className="modal-backdrop" onClick={() => setManageListing(null)}><div className="w-full max-w-2xl border border-border bg-card p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><Eyebrow>Gestão do anúncio</Eyebrow><h2 className="mt-3 font-display text-3xl uppercase">{manageListing.title}</h2></div><button onClick={() => setManageListing(null)} className="text-muted-foreground hover:text-foreground"><X size={18}/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Categoria</label><input value={manageListing.category} readOnly className="mars-input"/></div><div><label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Região</label><input value={manageListing.region} readOnly className="mars-input"/></div></div><div className="mt-4"><label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Preço</label><input value={editForm.price} onChange={(event) => setEditForm({ ...editForm, price: event.target.value })} className="mars-input"/></div><div className="mt-4"><label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Descrição</label><textarea value={editForm.desc} onChange={(event) => setEditForm({ ...editForm, desc: event.target.value })} rows={3} className="mars-input resize-none !text-base !normal-case"/></div><div className="mt-7 border-t border-border pt-6"><div className="flex items-center justify-between"><div><Eyebrow>Propostas recebidas</Eyebrow><p className="mt-2 text-xs text-muted-foreground">Escolha uma proposta para finalizar a venda.</p></div><span className="font-mono text-xs text-primary">{(proposals[manageListing.id] ?? []).length} recebida(s)</span></div><div className="mt-4 space-y-3">{(proposals[manageListing.id] ?? []).map((proposal) => <div key={proposal.id} className="border border-border bg-muted/20 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-sm font-medium">{proposal.buyer}</div><div className="mt-1 text-xs text-muted-foreground">{proposal.message}</div></div><span className="font-display text-xl text-primary">{proposal.amount}</span></div><button className="action-button mt-4 w-full" onClick={() => { setSales((current) => [{ id: `sale-${Date.now()}`, item: manageListing.title, buyer: proposal.buyer, amount: proposal.amount, soldAt: "Agora" }, ...current]); setListings((current) => current.filter((entry) => entry.id !== manageListing.id)); setManageListing(null); toast.success("Venda finalizada", { description: `${manageListing.title} foi vendido para ${proposal.buyer}.` }); }}>Finalizar venda</button></div>)}{(proposals[manageListing.id] ?? []).length === 0 && <p className="border border-dashed border-border p-4 text-xs text-muted-foreground">Nenhuma proposta recebida até o momento.</p>}</div></div><div className="mt-7 flex flex-col gap-2 sm:flex-row"><button className="secondary-button flex-1" onClick={() => setManageListing(null)}>Cancelar</button><button className="action-button flex-1" onClick={() => { setListings((current) => current.map((entry) => entry.id === manageListing.id ? { ...entry, price: editForm.price, desc: editForm.desc } : entry)); setManageListing(null); toast.success("Anúncio atualizado"); }}>Salvar alterações</button></div></div></div>}

    {proposalListing && <div className="modal-backdrop" onClick={() => setProposalListing(null)}><div className="w-full max-w-lg border border-border bg-card p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><Eyebrow>Nova proposta</Eyebrow><h2 className="mt-3 font-display text-3xl uppercase">{proposalListing.title}</h2></div><button onClick={() => setProposalListing(null)} className="text-muted-foreground hover:text-foreground"><X size={18}/></button></div><p className="mt-4 text-sm text-muted-foreground">Vendedor: {proposalListing.seller}</p><div className="mt-6"><label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Valor da proposta</label><input value={proposalAmount} onChange={(event) => setProposalAmount(event.target.value)} className="mars-input" placeholder="R$129"/></div><div className="mt-4"><label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Mensagem ao vendedor</label><textarea value={proposalMessage} onChange={(event) => setProposalMessage(event.target.value)} rows={3} className="mars-input resize-none !text-base !normal-case" placeholder="Explique sua proposta"/></div><div className="mt-7 flex gap-2"><button className="secondary-button flex-1" onClick={() => setProposalListing(null)}>Cancelar</button><button className="action-button flex-1" disabled={!proposalAmount.trim()} onClick={() => { const sent = { id: `proposal-${Date.now()}`, item: proposalListing.title, seller: proposalListing.seller, amount: proposalAmount, status: "Aguardando resposta" }; setSentProposals((current) => [sent, ...current]); setProposalListing(null); toast.success("Proposta enviada", { description: `O vendedor de ${proposalListing.title} recebeu sua proposta.` }); }}>Enviar proposta</button></div></div></div>}

    {profileOpen && <div className="modal-backdrop" onClick={() => setProfileOpen(false)}><div className="w-full max-w-3xl border border-border bg-card p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><Eyebrow>Perfil do mercado</Eyebrow><h2 className="mt-3 font-display text-3xl uppercase">EU</h2></div><button onClick={() => setProfileOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={18}/></button></div><div className="mt-7 flex flex-wrap gap-2 border-b border-border pb-4">{[["items", "Meus itens"], ["sales", "Vendas registradas"], ["proposals", "Propostas enviadas"]].map(([value, label]) => <button key={value} className={`border px-3 py-2 font-mono text-[10px] uppercase ${profileTab === value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`} onClick={() => setProfileTab(value as typeof profileTab)}>{label}</button>)}</div>{profileTab === "items" && <div className="mt-6 space-y-3">{listings.filter((item) => item.mine).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border border-border p-4"><div><div className="font-display text-xl uppercase">{item.title}</div><div className="mt-1 text-xs text-muted-foreground">{item.category} // {item.region} // {item.price}</div></div><span className="font-mono text-[10px] text-signal">ATIVO</span></div>)}{listings.filter((item) => item.mine).length === 0 && <p className="text-sm text-muted-foreground">Você não possui anúncios ativos.</p>}</div>}{profileTab === "sales" && <div className="mt-6 space-y-3">{sales.map((sale) => <div key={sale.id} className="border border-border p-4"><div className="flex justify-between gap-3"><span className="font-display text-xl uppercase">{sale.item}</span><span className="text-primary">{sale.amount}</span></div><div className="mt-2 text-xs text-muted-foreground">Comprador: {sale.buyer} // Registrado: {sale.soldAt}</div></div>)}{sales.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma venda finalizada ainda.</p>}</div>}{profileTab === "proposals" && <div className="mt-6 space-y-3">{sentProposals.map((proposal) => <div key={proposal.id} className="border border-border p-4"><div className="flex justify-between gap-3"><span className="font-display text-xl uppercase">{proposal.item}</span><span className="text-primary">{proposal.amount}</span></div><div className="mt-2 text-xs text-muted-foreground">Vendedor: {proposal.seller} // {proposal.status}</div></div>)}{sentProposals.length === 0 && <p className="text-sm text-muted-foreground">Você ainda não enviou propostas.</p>}</div>}</div></div>}

    {open && (
      <div className="modal-backdrop" onClick={() => !saving && setOpen(false)}>
        <div className="w-full max-w-lg border border-border bg-card p-7" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between">
            <div><Eyebrow>Novo anúncio</Eyebrow><h2 className="mt-3 font-display text-3xl uppercase">Anunciar no mercado</h2></div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground transition-colors hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Item do inventário</label>
              <select value={form.inventoryId} onChange={(e) => { const item = playerInventory.find((entry) => entry.id === e.target.value); setForm({ ...form, inventoryId: e.target.value, category: item?.category ?? form.category, region: item?.region ?? form.region, desc: item?.description ?? form.desc }); }} className="mars-input">
                <option value="">Selecione um item ou terreno</option>
                {playerInventory.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
              <p className="mt-2 text-[10px] text-muted-foreground">Somente itens já registrados no seu inventário podem ser anunciados.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Categoria</label>
                <select value={form.category} disabled className="mars-input"><option value={form.category}>{form.category}</option></select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Região</label>
                <select value={form.region} disabled className="mars-input"><option value={form.region}>{form.region}</option></select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Valor simulado</label>
              <input value={form.price} maxLength={10} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mars-input" placeholder="R$129" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Descrição do inventário</label>
              <textarea value={form.desc} readOnly rows={3} className="mars-input resize-none !text-base !normal-case" placeholder="Selecione um item para carregar a descrição" />
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <button className="secondary-button flex-1" onClick={() => setOpen(false)}>Cancelar</button>
            <button className="action-button flex-1" disabled={saving} onClick={submit}>{saving ? "Publicando…" : "Publicar anúncio"}</button>
          </div>
        </div>
      </div>
    )}
  </>;
}

export function MarketplaceBadge() {
  return <span className="inline-flex items-center gap-2 border border-border bg-muted/40 px-3 py-2 text-xs"><Store size={14} className="text-primary" />Marketplace</span>;
}

export const marketplaceIcons = { Hexagon, Tag };
