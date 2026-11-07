"use client";
import { useId, useState } from "react";
export function SpoilerReveal({ warning, children, preview }) {
    const [revealed, setRevealed] = useState(false);
    const detailsId = useId();
    return <div className="spoiler-reveal">
    <p>{warning}</p>
    <button type="button" aria-expanded={revealed} aria-controls={detailsId} onClick={event => {
            event.stopPropagation();
            setRevealed(!revealed);
        }}>{revealed ? "Hide Spoilers" : "Reveal Spoilers"}</button>
    <div id={detailsId} hidden={!revealed}>{revealed && children}</div>
    {!revealed && preview}
  </div>;
}
