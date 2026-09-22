import { useEffect, useState } from "react";
import { Antenna, Bot, ChevronLeft, ChevronRight, Coins, FlaskConical, Leaf, Shield, ShieldCheck, Swords, type LucideIcon } from "lucide-react";
import {
  ATTACK_COST,
  SHIELD_COST,
  STRUCTURES,
  effectiveDefense,
  effectiveProduction,
  evolveCost,
  pendingCoins,
  shieldActive,
  useMarsia,
  type StructureId,
  type Territory,
} from "@/lib/marsia-context";
import { ActionLink, Eyebrow, PageHeader, Panel, Progress, Stat } from "@/components/ui";

const structureIcons: Record<StructureId, LucideIcon> = { habitat: Bot, antena: Antenna, laboratorio: FlaskConical, estufa: Leaf };

type Rival = { name: string; sector: string; defense: number };
const rivals: Rival[] = [
  { name: "Luna", sector: "Setor Gale", defense: 45 },
  { name: "Kai", sector: "Setor Elysium", defense: 60 },
  { name: "Nova", sector: "Setor Valles", defense: 80 },
  { name: "Orion", sector: "Setor Utopia", defense: 105 },
];

function timeAgo(ts: number) {
  const minutes = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  return `há ${Math.round(minutes / 60)} h`;
}

function TerritoryOps({ territory }: { territory: Territory }) {
  const { coins, evolveTerritory, buildStructure, collectCoins, activateShield } = useMarsia();
  const [, forceTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => forceTick((n) => n + 1), 15000);
    return () => window.clearInterval(timer);
  }, []);
  const pending = pendingCoins(territory);
  const shielded = shieldActive(territory);
  const cost = evolveCost(territory.level);
  return (
    <Panel className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-primary">{territory.code}</span>
        <span className={`font-mono text-[9px] uppercase tracking-[.14em] ${shielded ? "text-signal" : "text-muted-foreground"}`}>{shielded ? "Escudo ativo" : "Sem escudo"}</span>
      </div>
      <h3 className="mt-5 font-display text-2xl uppercase">{territory.name}</h3>
      <p className="mt-1 text-[10px] uppercase tracking-[.16em] text-muted-foreground">{territory.region} // {territory.area}</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat label="Nível" value={String(territory.level).padStart(2, "0")} />
        <Stat label="Defesa" value={String(effectiveDefense(territory))} />
        <Stat label="Produção" value={`${effectiveProduction(territory)}/min`} />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[.14em] text-muted-foreground"><span>Evolução</span><span className="font-mono text-primary">{cost} moedas</span></div>
        <Progress value={Math.min(100, (coins / cost) * 100)} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {STRUCTURES.map((meta) => {
          const Icon = structureIcons[meta.id];
          const built = territory.structures.includes(meta.id);
          return (
            <button
              key={meta.id}
              disabled={built}
              onClick={() => buildStructure(territory.id, meta.id)}
              title={built ? meta.bonus : `${meta.cost} moedas · exige nível ${meta.requiredLevel}`}
              className={`flex items-center gap-2 border px-3 py-2 text-[10px] uppercase tracking-[.12em] transition-colors ${built ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
            >
              <Icon size={13} />{meta.name}{built ? " ✓" : ` · ${meta.cost}`}
            </button>
          );
        })}
      </div>
      <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-3">
        <button className="action-button" onClick={() => collectCoins(territory.id)}><Coins size={14} />Coletar{pending > 0 ? ` +${pending}` : ""}</button>
        <button className="secondary-button" onClick={() => evolveTerritory(territory.id)}>Evoluir</button>
        <button className="secondary-button" disabled={shielded} onClick={() => activateShield(territory.id)}>{shielded ? <ShieldCheck size={14} /> : <Shield size={14} />}{shielded ? "Protegida" : `Escudo ${SHIELD_COST}`}</button>
      </div>
    </Panel>
  );
}

export function ConquestGame({ onBack }: { onBack: () => void }) {
  const { acquired, territories, coins, attackRival } = useMarsia();
  const history = territories.flatMap((t) => t.history.map((h) => ({ ...h, territory: t.name }))).sort((a, b) => b.ts - a.ts).slice(0, 14);

  if (!acquired) {
    return <>
      <PageHeader code="Conquista de Setores / 04-C" title="Conquista de Setores" description="Evolua sua base, produza moedas e dispute setores contra rivais simulados." />
      <div className="mb-5"><button className="secondary-button" onClick={onBack}><ChevronLeft size={14} />Voltar aos modos</button></div>
      <Panel className="grid min-h-[340px] place-items-center p-8 text-center">
        <div>
          <Swords className="mx-auto text-primary" size={34} />
          <h2 className="mt-6 font-display text-3xl uppercase">Nenhum setor sob seu comando</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Adquira o território M-042 em Explorar Marte para iniciar sua campanha de conquista.</p>
          <div className="mt-7"><ActionLink to="/explorar">Explorar Marte</ActionLink></div>
        </div>
      </Panel>
    </>;
  }

  return <>
    <PageHeader code="Conquista de Setores / 04-C" title="Conquista de Setores" description="Evolua sua base, produza moedas e dispute setores contra rivais simulados da rede." />
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <button className="secondary-button" onClick={onBack}><ChevronLeft size={14} />Voltar aos modos</button>
      <span className="flex items-center gap-2 border border-border bg-card/60 px-4 py-2 font-mono text-xs text-primary"><Coins size={14} />{coins} moedas</span>
    </div>

    <div className="grid gap-5 lg:grid-cols-2">
      {territories.map((t) => <TerritoryOps key={t.id} territory={t} />)}
    </div>

    <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <Panel className="p-6">
        <div className="flex items-center justify-between"><div><Eyebrow>Rivais simulados</Eyebrow><h2 className="mt-2 font-display text-2xl uppercase">Setores em disputa</h2></div><Swords size={18} className="text-primary" /></div>
        <div className="mt-5 space-y-3">
          {rivals.map((rival) => (
            <div key={rival.name} className="flex flex-wrap items-center gap-3 border border-border p-4">
              <span className="grid size-10 place-items-center border border-primary/30 bg-primary/10 font-display">{rival.name[0]}</span>
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm uppercase">{rival.name}</div>
                <div className="text-[10px] text-muted-foreground">{rival.sector} // Defesa {rival.defense}</div>
              </div>
              <button className="action-button" onClick={() => attackRival(rival.name, rival.defense)}><Swords size={14} />Atacar · {ATTACK_COST}</button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] leading-4 text-muted-foreground">Combates e recompensas são simulados localmente. Cada ataque custa {ATTACK_COST} moedas; vitórias saqueiam o rival, derrotas custam 40 moedas extras.</p>
      </Panel>

      <Panel className="p-6">
        <div className="flex items-center justify-between"><div><Eyebrow>Registro de operações</Eyebrow><h2 className="mt-2 font-display text-2xl uppercase">Histórico</h2></div><ChevronRight size={16} className="text-primary" /></div>
        <div className="mt-5 space-y-3">
          {history.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma operação registrada ainda.</p>}
          {history.map((entry, index) => (
            <div key={`${entry.ts}-${index}`} className="border-l border-border pl-4">
              <div className="text-xs leading-5">{entry.text}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">{entry.territory} · {timeAgo(entry.ts)}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  </>;
}
