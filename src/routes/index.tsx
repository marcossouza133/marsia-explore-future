import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/marsia-pages";
export const Route=createFileRoute("/")({head:()=>({meta:[{title:"Centro de Comando — MARSIA"},{name:"description",content:"Acompanhe sua base, nível e missões na plataforma MARSIA."},{property:"og:title",content:"Centro de Comando — MARSIA"},{property:"og:description",content:"Seu primeiro território em outro mundo."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:DashboardPage});
