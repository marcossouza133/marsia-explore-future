import { createFileRoute } from "@tanstack/react-router";
import { TerritoryPage } from "@/components/marsia-pages";
export const Route=createFileRoute("/territorio/$territoryId")({head:()=>({meta:[{title:"Território M-042 — MARSIA"},{name:"description",content:"Conheça e registre simbolicamente o território M-042 em Elysium Planitia."},{property:"og:title",content:"Território M-042 — MARSIA"},{property:"og:description",content:"Uma posição rara em Elysium Planitia."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:TerritoryPage});
