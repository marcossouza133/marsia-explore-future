import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/marsia-marketplace";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace Orbital — MARSIA" },
      { name: "description", content: "Veja e anuncie territórios, estruturas e recursos marcianos no marketplace conceitual da MARSIA." },
      { property: "og:title", content: "Marketplace Orbital — MARSIA" },
      { property: "og:description", content: "Negocie territórios, estruturas e recursos com outros exploradores da rede MARSIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketplacePage,
});
