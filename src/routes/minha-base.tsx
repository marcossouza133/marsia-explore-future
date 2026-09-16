import { createFileRoute } from "@tanstack/react-router";
import { BasePage } from "@/components/marsia-secondary-pages";
export const Route=createFileRoute("/minha-base")({head:()=>({meta:[{title:"Minha Base — MARSIA"},{name:"description",content:"Gerencie sua base conceitual e acompanhe sua evolução em Marte."},{property:"og:title",content:"Minha Base — MARSIA"},{property:"og:description",content:"Seu centro de exploração em Elysium."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:BasePage});
