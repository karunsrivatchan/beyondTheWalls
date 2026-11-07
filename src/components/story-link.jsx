"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(useGSAP, ScrollToPlugin);
export function StoryLink() {
    const link = useRef(null);
    const scrollTween = useRef(null);
    const { contextSafe } = useGSAP(() => () => {
        scrollTween.current?.kill();
    }, { scope: link });
    const discover = (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return;
        const destination = document.getElementById("chronicle");
        if (!destination)
            return;
        event.preventDefault();
        // Create the context-safe animation inside the event, never during React rendering.
        contextSafe(() => {
            scrollTween.current?.kill();
            const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 100;
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            // Navigation is explicitly requested by the visitor; shorten travel for reduced motion.
            scrollTween.current = gsap.to(window, {
                duration: reducedMotion ? 0.45 : 1.35,
                ease: "power2.inOut",
                scrollTo: { y: destination, offsetY: headerHeight + 20, autoKill: true },
                onComplete: () => {
                    window.history.replaceState(window.history.state, "", "#chronicle");
                    document.getElementById("chronicle-heading")?.focus({ preventScroll: true });
                    scrollTween.current = null;
                },
            });
        })();
    };
    return (<a ref={link} href="#chronicle" className="story-link" onClick={discover} aria-controls="chronicle">
      <span className="story-link-label">Discover the story</span>
    </a>);
}
