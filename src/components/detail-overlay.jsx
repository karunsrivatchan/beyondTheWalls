"use client";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
// Both archives share the same crop, entrance sequence and dismissal behavior.
export function DetailOverlay({ title, label, portrait, close, children }) {
    const dialog = useRef(null);
    const titleId = useId();
    useEffect(() => {
        const element = dialog.current;
        const trigger = document.activeElement;
        const overflow = document.body.style.overflow;
        const padding = document.body.style.paddingRight;
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        document.body.style.overflow = "hidden";
        element.showModal();
        return () => {
            element.close();
            document.body.style.overflow = overflow;
            document.body.style.paddingRight = padding;
            trigger?.focus({ preventScroll: true });
        };
    }, []);
    return createPortal(<dialog ref={dialog} className="titan-dossier" aria-labelledby={titleId} onClick={close} onCancel={event => { event.preventDefault(); close(); }}>
    <button className="titan-dossier-close" autoFocus aria-label={`Close ${label} details`}>×</button>
    <div className={`titan-dossier-portrait${portrait.scenic ? " titan-dossier-portrait-scenic" : ""}`} style={{ "--portrait-width": `${portrait.width}px`, "--crop-ratio": portrait.width / (portrait.height * portrait.crop) }}>
      <div className="titan-dossier-crop"><Image src={portrait.src} alt={title} width={portrait.width} height={portrait.height} unoptimized priority/></div>
    </div>
    <section className="titan-dossier-copy" tabIndex={0} aria-label={`${label} details`}>{children(titleId)}</section>
    <p className="titan-dossier-dismiss-hint">Click anywhere to close</p>
  </dialog>, document.body);
}
