"use client";
import { useState } from "react";
import Image from "next/image";
import { characterCatalogue } from "@/data/character-catalogue";
import { DetailOverlay } from "./detail-overlay";
import { SpoilerReveal } from "./spoiler-reveal";
const spoilerFreeIntros = {
    historia: "A kindhearted cadet who looks out for the people around her.",
    floch: "A young soldier whose blunt honesty makes him stand out among the Scouts.",
    zeke: "A composed strategist who weighs his options before acting.",
    pieck: "An observant fighter whose relaxed manner hides a sharp tactical mind.",
    falco: "A compassionate young recruit who tries to understand people on both sides of a conflict.",
    gabi: "A fiercely competitive young recruit determined to prove herself.",
};
const publicRoles = {
    historia: "The kindhearted cadet",
    floch: "The outspoken recruit",
    zeke: "The calculating strategist",
    pieck: "The perceptive tactician",
    falco: "A kinder perspective",
    gabi: "The determined candidate",
};
function characterDisplayName(character) {
    return character.id === "historia" ? "Krista Lenz" : character.name;
}
function CharacterDossier({ character, close }) {
    const safeIntro = spoilerFreeIntros[character.id];
    const title = characterDisplayName(character);
    const facts = <div className="titan-dossier-facts">
    <section><h3>Known for</h3><p>{character.abilities}</p></section>
    <section><h3>Connections</h3><p>{character.relationships}</p></section>
  </div>;
    return <DetailOverlay title={title} label="Character" portrait={{ src: character.image, ...character.art }} close={close}>{titleId => <>
    <p className="eyebrow">{safeIntro ? "Character profile" : character.group}</p>
    <h2 id={titleId}>{title}</h2>
    {!safeIntro && <p className="titan-dossier-holder">{character.role}</p>}
    <p className="titan-dossier-intro">{safeIntro ?? character.intro}</p>
    {safeIntro ? <SpoilerReveal warning={character.id === "historia" ? "Includes a character identity reveal." : "Includes details from the Final Season."}>
      <p className="titan-dossier-holder">{character.id === "historia" ? character.name : `${character.group} · ${character.role}`}</p>
      <p className="titan-dossier-intro">{character.intro}</p>
      {facts}
    </SpoilerReveal> : facts}
  </>}</DetailOverlay>;
}
export function CharacterGallery() {
    const [filter, setFilter] = useState("All characters");
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const matches = characterCatalogue.filter(item => {
        const group = item.group === "Yeagerists" || item.group === "Marley" ? "" : item.group;
        const searchText = `${characterDisplayName(item)} ${publicRoles[item.id] ?? item.role} ${group}`;
        return (filter === "All characters" || group === filter) && searchText.toLowerCase().includes(query.trim().toLowerCase());
    });
    return <div className="titan-atlas character-atlas section-wrap">
    <div className="titan-atlas-controls">
      <div className="titan-atlas-filters" role="group" aria-label="Filter characters">{["All characters", "Scouts", "Cadets", "Garrison"].map(group => <button key={group} aria-pressed={filter === group} onClick={() => setFilter(group)}>{group}</button>)}</div>
      <label className="titan-search"><span className="sr-only">Find a character</span><input type="search" placeholder="Find a character…" value={query} onChange={event => setQuery(event.target.value)}/></label>
    </div>
    <p className="titan-atlas-count" role="status">{matches.length} of {characterCatalogue.length} characters</p>
    <div className="titan-atlas-field character-sticker-field">{matches.map(item => <button key={item.id} className="titan-figure character-figure" style={{ "--figure-height": "340px" }} onClick={() => setSelected(item)} aria-label={`Explore ${characterDisplayName(item)}`} aria-haspopup="dialog">
      <span className="titan-figure-art"><Image src={item.image} alt={characterDisplayName(item)} width={item.art.width} height={item.art.height} sizes="(max-width:600px) 46vw, (max-width:1000px) 30vw, 20vw" loading="eager"/></span>
      <span className="titan-figure-caption"><strong>{characterDisplayName(item)}</strong><span>{publicRoles[item.id] ?? item.role}</span></span>
    </button>)}</div>
    {!matches.length && <p className="titan-no-results">No characters match this search. Try another name.</p>}
    <p className="archive-note">Familiar faces from across the series. Select a character for a short introduction.</p>
    {selected && <CharacterDossier character={selected} close={() => setSelected(null)}/>}
  </div>;
}
