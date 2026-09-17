import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/components/marsia-messages";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens entre Exploradores — MARSIA" },
      { name: "description", content: "Converse com outros exploradores da MARSIA sobre missões, territórios e negociações do marketplace." },
      { property: "og:title", content: "Mensagens entre Exploradores — MARSIA" },
      { property: "og:description", content: "Canais privados simulados para conversar com exploradores da rede MARSIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MessagesPage,
});
