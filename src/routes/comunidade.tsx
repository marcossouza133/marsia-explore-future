import { createFileRoute } from "@tanstack/react-router";
import { CommunityPage } from "@/components/marsia-secondary-pages";
export const Route=createFileRoute("/comunidade")({head:()=>({meta:[{title:"Comunidade — MARSIA"},{name:"description",content:"Descubra equipes, atividades e transmissões da comunidade marciana."},{property:"og:title",content:"Comunidade — MARSIA"},{property:"og:description",content:"Conheça outros exploradores de Marte."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:CommunityPage});
