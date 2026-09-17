import { useState } from "react";
import { toast } from "sonner";
import { Gem, Hexagon, Mountain, Plus, Store, Tag, Wrench, X, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Eyebrow, PageHeader, Panel, Stat } from "@/components/ui";

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
  icon: LucideIcon;
  mine?: boolean;
};

const icons: Record<Category, LucideIcon> = { "Território": Mountain, "Estrutura": Wrench, "Recurso": Gem };

const initialListings: Listing[] = [
  { id: "l1", code: "M-118", title: "Cratera Norte", category: "Território", region: "Gale", price: "R$149", seller: "Luna", rarity: "Épico", desc: "Setor elevado com dois pontos de interesse mapeados.", icon: Mountain },
  { id: "l2", code: "ST-04", title: "Módulo de Antena", category: "Estrutura", region: "Elysium", price: "R$79", seller: "Kai", rarity: "Raro", desc: "Amplia o alcance de sinal orbital da sua base.", icon: Wrench },
  { id: "l3", code: "RS-22", title: "Cristais de Hematita", category: "Recurso", region: "Valles Marineris", price: "R$39", seller: "Nova", rarity: "Comum", desc: "Lote coletado durante a expedição MX-07.", icon: Gem },
  { id: "l4", code: "M-207", title: "Planalto Utopia", category: "Território", region: "Utopia", price: "R$189", seller: "Orion", rarity: "Lendário", desc: "Território amplo com relevo estável para grandes bases.", icon: Mountain },
  { id: "l5", code: "ST-11", title: "Estufa Hidropônica", category: "Estrutura", region: "Hellas", price: "R$119", seller: "Vega", rarity: "Épico", desc: "Cultivo autossustentável para longas expedições.", icon: Wrench },
  { id: "l6", code: "RS-08", title: "Núcleo de Gelo", category: "Recurso", region: "Olympus Mons", price: "R$59", seller: "Sol", rarity: "Raro", desc: "Amostra profunda extraída da encosta oeste.", icon: Gem },
];

const filters = ["Todos", "Território", "Estrutura", "Recurso"] as const;

export function MarketplacePage() {
  const [listings, setListings] = useState(initialListings);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Território" as Category, region: "Elysium", price: "", desc: "" });

  const visible = filter === "Todos" ? listings : listings.filter((l) => l.category === filter);

  const submit = () => {
    if (!form.title.trim() || !form.price.trim()) { toast.error("Informe título e valor do anúncio"); return; }
    setSaving(true);
    setTimeout(() => {
      const seq = listings.length + 1;
      setListings((list) => [{
        id: `mine-${Date.now()}`,
        code: `AN-${String(seq).padStart(3, "0")}`,
        title: form.title.trim(),
        category: form.category,
        region: form.region,
        price: form.price.trim().startsWith("R$") ? form.price.trim() : `R$${form.price.trim()}`,
        seller: "Marcos Almeida",
        rarity: "Seu anúncio",
        desc: form.desc.trim() || "Anúncio publicado por você na rede MARSIA.",
        icon: icons[form.category],
        mine: true,
      }, ...list]);
      setSaving(false);
      setOpen(false);
      setFilter("Todos");
      setForm({ title: "", category: "Território", region: "Elysium", price: "", desc: "" });
      toast.success("Anúncio publicado", { description: "Seu item já aparece no marketplace." });
    }, 600);
  };

  return <>
    <PageHeader code="Mercado orbital / 07" title="Marketplace" description="Negocie territórios, estruturas e recursos com outros exploradores da rede MARSIA." />

    <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[.14em] transition-colors ${filter === f ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{f}</button>)}
      </div>
      <button className="action-button" onClick={() => setOpen(true)}><Plus size={14} />Anunciar item</button>
    </div>

    <Panel className="mb-6 grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
      <Stat label="Anúncios ativos" value={String(listings.length)} />
      <Stat label="Territórios" value={String(listings.filter((l) => l.category === "Território").length)} />
      <Stat label="Seus anúncios" value={String(listings.filter((l) => l.mine).length)} />
      <Stat label="Volume do ciclo" value="R$ 12.4k" />
    </Panel>

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visible.map(({ id, code, title, category, region, price, seller, rarity, desc, icon: Icon, mine }) => (
        <Panel key={id} className={`flex min-h-[320px] flex-col p-6 transition-colors hover:border-primary/40 ${mine ? "border-primary/40" : ""}`}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-primary">{code}</span>
            <span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">{rarity}</span>
          </div>
          <Icon className="mt-8 text-primary" size={26} />
          <div className="mt-6 text-[10px] uppercase tracking-[.16em] text-muted-foreground">{category} // {region}</div>
          <h2 className="mt-2 font-display text-2xl uppercase">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p>
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">Anunciante <b className="text-foreground">{seller}</b></span>
              <span className="font-display text-xl text-primary">{price}</span>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button className="action-button flex-1" onClick={() => toast.success("Proposta enviada", { description: `${title} — negociação simulada com ${seller}.` })}>Negociar</button>
              <Link to="/mensagens" className="secondary-button flex-1">Mensagem</Link>
            </div>
          </div>
        </Panel>
      ))}
    </div>

    <p className="mt-8 text-[10px] leading-4 text-muted-foreground">Marketplace conceitual: valores e negociações são simulados e não geram cobrança ou transferência real.</p>

    {open && (
      <div className="modal-backdrop" onClick={() => !saving && setOpen(false)}>
        <div className="w-full max-w-lg border border-border bg-card p-7" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between">
            <div><Eyebrow>Novo anúncio</Eyebrow><h2 className="mt-3 font-display text-3xl uppercase">Anunciar no mercado</h2></div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground transition-colors hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Título do item</label>
              <input value={form.title} maxLength={32} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mars-input" placeholder="Cratera Sul" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Categoria</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="mars-input">
                  <option value="Território">Território</option>
                  <option value="Estrutura">Estrutura</option>
                  <option value="Recurso">Recurso</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Região</label>
                <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="mars-input">
                  {["Elysium", "Olympus Mons", "Valles Marineris", "Utopia", "Gale", "Hellas"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Valor simulado</label>
              <input value={form.price} maxLength={10} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mars-input" placeholder="R$129" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Descrição</label>
              <textarea value={form.desc} maxLength={140} rows={3} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="mars-input resize-none !text-base !normal-case" placeholder="Detalhes do item anunciado" />
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
