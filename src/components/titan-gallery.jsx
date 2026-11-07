"use client";
import { useState } from "react";
import Image from "next/image";
import { titanCatalogue } from "@/data/titan-catalogue";
import { TitanDossier, titanDisplayTitle } from "./titan-dossier";
export function TitanGallery() {
    const [filter, setFilter] = useState("All forms");
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const matches = titanCatalogue.filter(item => (filter === "All forms" || item.type === filter) && `${titanDisplayTitle(item)} ${item.type} ${item.sizeLabel}`.toLowerCase().includes(query.trim().toLowerCase()));
    const founder = matches.find(item => item.id === "founding");
    const figures = matches.filter(item => item.id !== "founding").sort((a, b) => b.displayHeight - a.displayHeight);
    return <div className="titan-atlas section-wrap">
    <div className="titan-atlas-controls">
      <div className="titan-atlas-filters" role="group" aria-label="Filter Titan forms">{["All forms", "Shifter", "Pure Titan", "Abnormal"].map(type => <button key={type} aria-pressed={filter === type} onClick={() => setFilter(type)}>{type === "Shifter" ? "Shifters" : type === "Pure Titan" ? "Pure Titans" : type === "Abnormal" ? "Abnormals" : type}</button>)}</div>
      <label className="titan-search"><span className="sr-only">Find a Titan</span><input type="search" placeholder="Find a Titan…" value={query} onChange={event => setQuery(event.target.value)}/></label>
    </div>
    <p className="titan-atlas-count" role="status">{matches.length} of {titanCatalogue.length} forms <span>Relative scale adapted for screen</span></p>
    {founder && <div className="titan-founder-stage">
      <button className="titan-founder-figure" onClick={() => setSelected(founder)} aria-label="Explore Founding Titan, skeletal form" aria-haspopup="dialog">
        <Image src={founder.image} alt="Skeletal Founding Titan spanning the page" width={1400} height={1000} sizes="100vw" priority/>
        <span className="titan-founder-label"><strong>Founding Titan</strong><span>Skeletal form</span></span>
      </button>
    </div>}
    <div className="titan-atlas-field">{figures.map(item => <button key={item.id} className={`titan-figure ${item.wide ? "titan-figure-wide" : ""}`} style={{ "--figure-height": `${item.displayHeight}px` }} onClick={() => setSelected(item)} aria-label={`Explore ${titanDisplayTitle(item)}, ${item.sizeLabel}`} aria-haspopup="dialog">
      <span className="titan-figure-art"><Image src={item.image} alt={titanDisplayTitle(item)} width={1400} height={1100} sizes="(max-width: 600px) 48vw, (max-width: 1000px) 32vw, 25vw"/></span>
      <span className="titan-figure-caption"><strong>{titanDisplayTitle(item)}</strong><span>{item.type}</span><small>{item.sizeLabel}</small></span>
    </button>)}</div>
    {!matches.length && <p className="titan-no-results">No Titans match this search. Try a Titan name or form.</p>}
    <p className="archive-note">Full-body illustrations of distinct Titan forms. Similar depictions are grouped; forms without complete artwork are omitted. Some additional forms use illustrated reconstructions. Display sizes emphasize relative scale rather than exact measurements.</p>
    {selected && <TitanDossier titan={selected} close={() => setSelected(null)}/>}
  </div>;
}
