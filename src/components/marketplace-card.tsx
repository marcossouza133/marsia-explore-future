import type { LucideIcon } from "lucide-react";
import { Panel } from "@/components/ui";

export type MarketplaceCardItem = {
  id: string;
  code: string;
  title: string;
  category: string;
  region: string;
  price: string;
  seller: string;
  rarity: string;
  description: string;
  image: string;
  imagePosition?: string;
  icon: LucideIcon;
  mine?: boolean;
};

type MarketplaceCardProps = {
  item: MarketplaceCardItem;
  onManage?: (item: MarketplaceCardItem) => void;
  onBuy?: (item: MarketplaceCardItem) => void;
  onPropose?: (item: MarketplaceCardItem) => void;
};

export function MarketplaceCard({ item, onManage, onBuy, onPropose }: MarketplaceCardProps) {
  const Icon = item.icon;

  return (
    <Panel
      className={`group flex min-h-[440px] flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-cyan/70 hover:shadow-[0_0_28px_rgba(34,211,238,0.24)] ${item.mine ? "border-primary/40" : ""}`}
    >
      <div className="relative h-40 overflow-hidden border-b border-border bg-muted sm:h-44">
        <img
          src={item.image}
          alt={`Imagem de ${item.title}`}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ objectPosition: item.imagePosition }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 grid size-9 place-items-center border border-cyan/50 bg-background/80 text-cyan backdrop-blur-sm">
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] text-cyan">ID {item.code}</span>
          <span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">
            {item.rarity}
          </span>
        </div>
        <div className="mt-5 text-[10px] uppercase tracking-[.16em] text-muted-foreground">
          {item.category} // {item.region}
        </div>
        <h2 className="mt-2 font-display text-2xl uppercase">{item.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
            <span className="min-w-0 text-xs text-muted-foreground">
              Vendedor <b className="block truncate text-foreground sm:inline">{item.seller}</b>
            </span>
            <span className="shrink-0 font-display text-xl text-primary">{item.price}</span>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button className="action-button flex-1" onClick={() => item.mine ? onManage?.(item) : onBuy?.(item)}>
              {item.mine ? "Gerenciar anúncio" : "Comprar"}
            </button>
            {!item.mine && <button className="secondary-button flex-1" onClick={() => onPropose?.(item)}>Enviar proposta</button>}
          </div>
        </div>
      </div>
    </Panel>
  );
}
