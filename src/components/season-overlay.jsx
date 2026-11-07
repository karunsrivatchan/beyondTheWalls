"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { SeasonDetails } from "./season-details";
import { TypedText } from "./typed-text";
export function SeasonOverlay({ season, origin, close }) {
    const ref = useRef(null);
    const poster = useRef(null);
    const titleId = useId();
    const [leaving, setLeaving] = useState(false);
    const returnAnimation = useRef(null);
    const closing = useRef(false);
    function dismiss() {
        if (closing.current)
            return;
        closing.current = true;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            close();
            return;
        }
        const artwork = poster.current;
        // Measure the visible frame first, including an opening animation in progress.
        const current = artwork.getBoundingClientRect();
        const target = origin.element.getBoundingClientRect();
        Object.assign(artwork.style, {
            animation: "none", position: "fixed", left: `${current.left}px`,
            top: `${current.top}px`, width: `${current.width}px`, margin: "0",
            transform: "none",
        });
        ref.current.style.overflow = "hidden";
        setLeaving(true);
        returnAnimation.current = artwork.animate([
            { transform: "translate(0,0) scale(1)", filter: "drop-shadow(0 24px 48px #000b)" },
            { transform: `translate(${target.left - current.left}px,${target.top - current.top}px) scale(${target.width / current.width})`, filter: "drop-shadow(0 0 0 transparent)" },
        ], { duration: 1000, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
        void returnAnimation.current.finished.then(close, () => { });
    }
    useEffect(() => {
        const dialog = ref.current;
        const previousFocus = document.activeElement;
        const overflow = document.body.style.overflow;
        const padding = document.body.style.paddingRight;
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        document.body.style.overflow = "hidden";
        dialog.showModal();
        const box = poster.current.getBoundingClientRect();
        poster.current.style.setProperty("--poster-x", `${origin.x - box.left}px`);
        poster.current.style.setProperty("--poster-y", `${origin.y - box.top}px`);
        poster.current.style.setProperty("--poster-scale", `${origin.width / box.width}`);
        dialog.dataset.ready = "true";
        const hiddenSource = origin.element.animate([{ visibility: "hidden" }, { visibility: "hidden" }], { duration: 1, fill: "both" });
        return () => {
            returnAnimation.current?.cancel();
            hiddenSource.cancel();
            dialog.close();
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = padding;
            previousFocus?.focus({ preventScroll: true });
        };
    }, [origin]);
    return createPortal(<dialog ref={ref} className={`season-overlay${leaving ? " is-leaving" : ""}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); dismiss(); }} onClick={event => { if (event.target === ref.current)
        dismiss(); }}>
    <button className="season-overlay-close" onClick={dismiss} autoFocus aria-label="Close season">×</button>
    <div className="season-overlay-stage" onClick={event => { if (event.target === event.currentTarget)
        dismiss(); }}>
      <div ref={poster} className="season-overlay-art" style={{ "--poster-scale": .8 }}>
        <Image src={season.image} alt={`${season.title} official poster`} width={684} height={963} sizes="(max-width: 700px) 50vw, 380px" priority/>
      </div>
      <div className="season-overlay-copy">
        <h2 id={titleId}><TypedText>{season.title}</TypedText></h2>
        <SeasonDetails season={season}/>
      </div>
    </div>
  </dialog>, document.body);
}
