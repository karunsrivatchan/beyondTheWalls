"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { seasons } from "@/data/seasons";
import { SeasonOverlay } from "./season-overlay";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function SeasonExplorer() {
    const [selected, setSelected] = useState(null);
    const root = useRef(null);
    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.from(".season-entry", { y: 24, opacity: 0, duration: .7, stagger: .08, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 80%", toggleActions: "play none none reverse" } });
        });
        return () => mm.revert();
    }, { scope: root });
    return <section ref={root} id="chronicle" className="chronicle" aria-labelledby="chronicle-heading"><div className="section-wrap"><div className="chronicle-header"><div className="section-heading"><p className="eyebrow">THE CHRONICLE</p><h2 id="chronicle-heading" tabIndex={-1}>A story that<br /><em>changes everything.</em></h2></div><p>Follow the journey, one chapter at a time. Each season opens with a spoiler-free introduction.</p></div><div className="season-list">{seasons.map((season, index) => <button className="season-entry" key={season.id} onClick={event => { const image = event.currentTarget.querySelector("img"); const box = image.getBoundingClientRect(); setSelected({ season, origin: { x: box.left, y: box.top, width: box.width, element: image } }); }} aria-haspopup="dialog"><span className="season-number">{String(index + 1).padStart(2, "0")}</span><Image src={season.image} alt={`${season.title} official poster`} width={684} height={963} sizes="(max-width: 600px) 96px, (max-width: 900px) 125px, 160px"/><div><h3>{season.title}</h3><small>{season.years} &nbsp; / &nbsp; {season.format}</small></div></button>)}</div></div>{selected && <SeasonOverlay season={selected.season} origin={selected.origin} close={() => setSelected(null)}/>}</section>;
}
