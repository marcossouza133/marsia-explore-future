import { createFileRoute } from "@tanstack/react-router";
import { PassportPage } from "@/components/marsia-secondary-pages";
export const Route=createFileRoute("/passaporte")({head:()=>({meta:[{title:"Passaporte de Explorador — MARSIA"},{name:"description",content:"Sua identidade digital, territórios e conquistas na MARSIA."},{property:"og:title",content:"Passaporte de Explorador — MARSIA"},{property:"og:description",content:"Identidade digital de exploração marciana."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:PassportPage});
