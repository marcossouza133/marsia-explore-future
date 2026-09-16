import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "@/components/marsia-pages";
export const Route=createFileRoute("/explorar")({head:()=>({meta:[{title:"Explorar Marte — MARSIA"},{name:"description",content:"Explore regiões e territórios conceituais no atlas de Marte."},{property:"og:title",content:"Explorar Marte — MARSIA"},{property:"og:description",content:"Navegue pelo atlas planetário da MARSIA."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:ExplorePage});
