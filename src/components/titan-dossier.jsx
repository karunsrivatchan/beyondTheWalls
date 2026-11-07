"use client";
import { titanPortrait } from "@/data/titan-portraits";
import { DetailOverlay } from "./detail-overlay";
import { SpoilerReveal } from "./spoiler-reveal";
const formPreviews = {
    "rod-reiss": { title: "Giant Crawling Titan", intro: "An enormous Titan that moves by dragging its body along the ground." },
    "ymir-founder": { intro: "A towering figure with a distinct skeletal silhouette." },
    "ymir-jaw": { intro: "A small, agile form with sharp claws and teeth." },
    "falco-jaw": { intro: "A compact form with a birdlike face and prominent talons." },
    "falco-flying": { intro: "A winged Titan with a broad wingspan and avian features." },
    "ksaver-beast": { intro: "An animal-like Titan distinguished by curved horns." },
    "falco-pure": { title: "Long-Necked Pure Titan", intro: "A spindly Titan with long limbs and a strikingly long neck." },
    "comrade-d": { title: "Small Pure Titan", intro: "A small Pure Titan with a distinctive appearance." },
    crawling: { intro: "A slow-moving Titan with short limbs and a low posture." },
};
export function titanDisplayTitle(titan) {
    return formPreviews[titan.id]?.title ?? titan.name;
}
export function TitanDossier({ titan, close }) {
    const portrait = titanPortrait(titan.id, titan.image);
    const preview = formPreviews[titan.id];
    const title = titanDisplayTitle(titan);
    const facts = <div className="titan-dossier-facts">
    <section><h3>Physical characteristics</h3><p>{titan.physical}</p></section>
    <section><h3>Abilities</h3><p>{titan.abilities}</p></section>
    <section><h3>Limitations</h3><p>{titan.limitations}</p></section>
  </div>;
    return <DetailOverlay title={title} label="Titan" portrait={portrait} close={close}>{titleId => <>
    <p className="eyebrow">{titan.type} · {titan.sizeLabel}</p>
    <h2 id={titleId}>{title}</h2>
    <p className="titan-dossier-intro">{preview?.intro ?? titan.intro}</p>
    {titan.reveal === 0 && facts}
    {(titan.reveal > 0 || titan.holder) && <SpoilerReveal warning="These details may reveal Titan identities or events from the series.">
      <p className="titan-dossier-holder">{preview?.title ? `${titan.name} · ${titan.form}` : titan.form}</p>
      {preview && <p className="titan-dossier-intro">{titan.intro}</p>}
      {titan.reveal > 0 && facts}
      {titan.holder && <div className="titan-dossier-facts"><section><h3>Known holders</h3><p>{titan.holder.name}</p></section></div>}
    </SpoilerReveal>}
    {titan.reconstructed && !portrait.scenic && <p className="titan-dossier-art-note">Illustrated reconstruction of this anime form.</p>}
  </>}</DetailOverlay>;
}
