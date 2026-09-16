import { createFileRoute } from "@tanstack/react-router";
import { MissionsPage } from "@/components/marsia-secondary-pages";
export const Route=createFileRoute("/missoes")({head:()=>({meta:[{title:"Missões — MARSIA"},{name:"description",content:"Participe de expedições e amplie sua presença marciana."},{property:"og:title",content:"Missões — MARSIA"},{property:"og:description",content:"Expedições coletivas em Marte."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:MissionsPage});
