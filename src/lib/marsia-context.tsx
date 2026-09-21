import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export type StructureId = "habitat" | "antena" | "laboratorio" | "estufa";

export type StructureMeta = {
  id: StructureId;
  name: string;
  bonus: string;
  cost: number;
  requiredLevel: number;
};

export const STRUCTURES: StructureMeta[] = [
  { id: "habitat", name: "Habitat", bonus: "+10 defesa", cost: 200, requiredLevel: 1 },
  { id: "antena", name: "Antena", bonus: "+15% produção", cost: 260, requiredLevel: 2 },
  { id: "laboratorio", name: "Laboratório", bonus: "+1 recurso por coleta", cost: 340, requiredLevel: 3 },
  { id: "estufa", name: "Estufa", bonus: "+25% produção", cost: 420, requiredLevel: 4 },
];

export type HistoryEntry = { ts: number; text: string };

export type Territory = {
  id: string;
  code: string;
  name: string;
  region: string;
  area: string;
  rarity: string;
  level: number;
  defense: number;
  production: number;
  structures: StructureId[];
  shieldUntil: number | null;
  lastCollect: number;
  history: HistoryEntry[];
};

export type ResourceItem = { id: string; name: string; amount: number };

export const evolveCost = (level: number) => level * 180;
export const SHIELD_COST = 150;
export const SHIELD_DURATION_MS = 5 * 60 * 1000;
export const ATTACK_COST = 90;

export function effectiveDefense(t: Territory) {
  return t.defense + (t.structures.includes("habitat") ? 10 : 0);
}

export function effectiveProduction(t: Territory) {
  let value = t.production;
  if (t.structures.includes("antena")) value *= 1.15;
  if (t.structures.includes("estufa")) value *= 1.25;
  return Math.round(value);
}

export function pendingCoins(t: Territory, now = Date.now()) {
  const minutes = Math.max(0, (now - t.lastCollect) / 60000);
  return Math.floor(effectiveProduction(t) * minutes);
}

export function shieldActive(t: Territory, now = Date.now()) {
  return t.shieldUntil !== null && t.shieldUntil > now;
}

export type AttackResult = { victory: boolean; delta: number; rival: string };

type MarsiaState = {
  acquired: boolean;
  baseName: string;
  playerName: string;
  territories: Territory[];
  coins: number;
  resources: ResourceItem[];
  acquire: (name: string) => void;
  renameBase: (name: string) => void;
  renameTerritory: (id: string, name: string) => void;
  evolveTerritory: (id: string) => void;
  buildStructure: (id: string, structure: StructureId) => void;
  collectCoins: (id: string) => void;
  activateShield: (id: string) => void;
  attackRival: (rival: string, rivalDefense: number) => AttackResult | null;
  spendCoins: (amount: number) => boolean;
  earnCoins: (amount: number, reason?: string) => void;
};

const MarsiaContext = createContext<MarsiaState | undefined>(undefined);

const GAME_KEY = "marsia-game-v1";
const LEGACY_KEY = "marsia-state";

type PersistedGame = { coins: number; territories: Territory[]; resources: ResourceItem[] };

function makeTerritory(name: string): Territory {
  const now = Date.now();
  return {
    id: `t-${now}`,
    code: "M-042",
    name,
    region: "Elysium Planitia",
    area: "2.500 m²",
    rarity: "Raro",
    level: 1,
    defense: 20,
    production: 12,
    structures: ["habitat"],
    shieldUntil: null,
    lastCollect: now,
    history: [{ ts: now, text: `Território M-042 registrado como ${name}.` }],
  };
}

function loadInitial(): PersistedGame {
  const empty: PersistedGame = { coins: 240, territories: [], resources: [] };
  try {
    const saved = localStorage.getItem(GAME_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<PersistedGame>;
      return {
        coins: typeof parsed.coins === "number" ? parsed.coins : empty.coins,
        territories: Array.isArray(parsed.territories) ? (parsed.territories as Territory[]) : [],
        resources: Array.isArray(parsed.resources) ? (parsed.resources as ResourceItem[]) : [],
      };
    }
    const legacy = sessionStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const value = JSON.parse(legacy) as { acquired?: boolean; baseName?: string };
      if (value.acquired) {
        return { ...empty, territories: [makeTerritory(value.baseName || "Base Aurora")] };
      }
    }
  } catch { /* usa padrões do protótipo */ }
  return empty;
}

export function MarsiaProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<PersistedGame>({ coins: 240, territories: [], resources: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setGame(loadInitial());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(GAME_KEY, JSON.stringify(game));
      if (game.territories.length > 0) {
        sessionStorage.setItem(LEGACY_KEY, JSON.stringify({ acquired: true, baseName: game.territories[0].name }));
      }
    } catch { /* armazenamento indisponível */ }
  }, [game, loaded]);

  const updateTerritory = (id: string, fn: (t: Territory) => Territory) => {
    setGame((g) => ({ ...g, territories: g.territories.map((t) => (t.id === id ? fn(t) : t)) }));
  };

  const log = (t: Territory, text: string): Territory => ({
    ...t,
    history: [{ ts: Date.now(), text }, ...t.history].slice(0, 40),
  });

  const acquire: MarsiaState["acquire"] = (name) => {
    const finalName = name.trim() || "Base Aurora";
    setGame((g) => {
      if (g.territories.some((t) => t.code === "M-042")) return g;
      return { ...g, territories: [makeTerritory(finalName), ...g.territories] };
    });
    toast.success("Território M-042 registrado", { description: `${finalName} agora faz parte da sua jornada.` });
  };

  const renameTerritory: MarsiaState["renameTerritory"] = (id, name) => {
    const finalName = name.trim();
    if (!finalName) return;
    updateTerritory(id, (t) => log({ ...t, name: finalName }, `Base renomeada para ${finalName}.`));
    toast.success("Identificação da base atualizada");
  };

  const evolveTerritory: MarsiaState["evolveTerritory"] = (id) => {
    const target = game.territories.find((t) => t.id === id);
    if (!target) return;
    const cost = evolveCost(target.level);
    if (game.coins < cost) {
      toast.error("Moedas insuficientes", { description: `Evoluir para o nível ${target.level + 1} custa ${cost} moedas.` });
      return;
    }
    setGame((g) => ({
      ...g,
      coins: g.coins - cost,
      territories: g.territories.map((t) =>
        t.id === id
          ? log({ ...t, level: t.level + 1, defense: t.defense + 6, production: t.production + 4 }, `Base evoluída para o nível ${t.level + 1}.`)
          : t,
      ),
    }));
    toast.success("Base evoluída", { description: `${target.name} alcançou o nível ${target.level + 1}.` });
  };

  const buildStructure: MarsiaState["buildStructure"] = (id, structure) => {
    const meta = STRUCTURES.find((s) => s.id === structure);
    const target = game.territories.find((t) => t.id === id);
    if (!meta || !target) return;
    if (target.structures.includes(structure)) return;
    if (target.level < meta.requiredLevel) {
      toast.error("Nível insuficiente", { description: `${meta.name} exige base nível ${meta.requiredLevel}.` });
      return;
    }
    if (game.coins < meta.cost) {
      toast.error("Moedas insuficientes", { description: `${meta.name} custa ${meta.cost} moedas.` });
      return;
    }
    setGame((g) => ({
      ...g,
      coins: g.coins - meta.cost,
      territories: g.territories.map((t) =>
        t.id === id ? log({ ...t, structures: [...t.structures, structure] }, `Estrutura construída: ${meta.name}.`) : t,
      ),
    }));
    toast.success("Estrutura construída", { description: `${meta.name} ativa em ${target.name}.` });
  };

  const collectCoins: MarsiaState["collectCoins"] = (id) => {
    const target = game.territories.find((t) => t.id === id);
    if (!target) return;
    const gained = pendingCoins(target);
    if (gained <= 0) {
      toast.info("Produção em andamento", { description: "Aguarde o próximo ciclo para coletar." });
      return;
    }
    const bonusResource = target.structures.includes("laboratorio");
    setGame((g) => ({
      ...g,
      coins: g.coins + gained,
      resources: bonusResource
        ? (() => {
            const existing = g.resources.find((r) => r.id === "amostra-regolito");
            if (existing) return g.resources.map((r) => (r.id === existing.id ? { ...r, amount: r.amount + 1 } : r));
            return [...g.resources, { id: "amostra-regolito", name: "Amostra de Regolito", amount: 1 }];
          })()
        : g.resources,
      territories: g.territories.map((t) =>
        t.id === id ? log({ ...t, lastCollect: Date.now() }, `Coleta concluída: +${gained} moedas.`) : t,
      ),
    }));
    toast.success("Coleta concluída", { description: `+${gained} moedas de ${target.name}.` });
  };

  const activateShield: MarsiaState["activateShield"] = (id) => {
    const target = game.territories.find((t) => t.id === id);
    if (!target) return;
    if (shieldActive(target)) {
      toast.info("Escudo já ativo", { description: "Aguarde o ciclo atual terminar." });
      return;
    }
    if (game.coins < SHIELD_COST) {
      toast.error("Moedas insuficientes", { description: `Ativar o escudo custa ${SHIELD_COST} moedas.` });
      return;
    }
    setGame((g) => ({
      ...g,
      coins: g.coins - SHIELD_COST,
      territories: g.territories.map((t) =>
        t.id === id ? log({ ...t, shieldUntil: Date.now() + SHIELD_DURATION_MS }, "Escudo defensivo ativado por 5 minutos.") : t,
      ),
    }));
    toast.success("Escudo ativado", { description: `${target.name} protegida por 5 minutos.` });
  };

  const attackRival: MarsiaState["attackRival"] = (rival, rivalDefense) => {
    const attacker = [...game.territories].sort((a, b) => effectiveDefense(b) + b.level * 8 - (effectiveDefense(a) + a.level * 8))[0];
    if (!attacker) {
      toast.error("Nenhum território disponível", { description: "Adquira um território antes de atacar." });
      return null;
    }
    if (game.coins < ATTACK_COST) {
      toast.error("Moedas insuficientes", { description: `Um ataque custa ${ATTACK_COST} moedas.` });
      return null;
    }
    const power = effectiveDefense(attacker) + attacker.level * 8 + Math.random() * 30;
    const victory = power >= rivalDefense;
    const delta = victory ? 120 + attacker.level * 20 : -40;
    setGame((g) => ({
      ...g,
      coins: Math.max(0, g.coins - ATTACK_COST + delta),
      territories: g.territories.map((t) =>
        t.id === attacker.id
          ? log(t, victory ? `Ataque vitorioso contra ${rival}: saque de ${delta} moedas.` : `Ataque repelido por ${rival}: perda de 40 moedas.`)
          : t,
      ),
    }));
    if (victory) {
      toast.success("Ataque bem-sucedido", { description: `Saque de ${delta} moedas de ${rival}.` });
    } else {
      toast.error("Ataque repelido", { description: `${rival} defendeu o setor. Perda de 40 moedas.` });
    }
    return { victory, delta, rival };
  };

  const spendCoins: MarsiaState["spendCoins"] = (amount) => {
    if (game.coins < amount) return false;
    setGame((g) => ({ ...g, coins: g.coins - amount }));
    return true;
  };

  const earnCoins: MarsiaState["earnCoins"] = (amount, reason) => {
    setGame((g) => ({ ...g, coins: g.coins + amount }));
    if (reason) toast.success("Moedas recebidas", { description: `+${amount} — ${reason}` });
  };

  const acquired = game.territories.length > 0;
  const baseName = game.territories[0]?.name ?? "Base Aurora";

  return (
    <MarsiaContext.Provider value={{
      acquired,
      baseName,
      playerName: "Marcos Almeida",
      territories: game.territories,
      coins: game.coins,
      resources: game.resources,
      acquire,
      renameBase: (name) => { const first = game.territories[0]; if (first) renameTerritory(first.id, name); },
      renameTerritory,
      evolveTerritory,
      buildStructure,
      collectCoins,
      activateShield,
      attackRival,
      spendCoins,
      earnCoins,
    }}>
      {children}
    </MarsiaContext.Provider>
  );
}

export function useMarsia() {
  const context = useContext(MarsiaContext);
  if (!context) throw new Error("useMarsia requires MarsiaProvider");
  return context;
}
