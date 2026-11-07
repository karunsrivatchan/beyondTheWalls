"use client";
import { useEffect } from "react";
export function ScrollbarVisibility() {
    useEffect(() => {
        const timers = new Map();
        function onScroll(event) {
            const scroller = event.target === document ? document.documentElement : event.target;
            if (!(scroller instanceof Element))
                return;
            scroller.setAttribute("data-scrolling", "true");
            const previous = timers.get(scroller);
            if (previous)
                clearTimeout(previous);
            timers.set(scroller, setTimeout(() => {
                scroller.removeAttribute("data-scrolling");
                timers.delete(scroller);
            }, 500));
        }
        // Capture also observes the independent scroll regions inside native dialogs.
        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        return () => {
            document.removeEventListener("scroll", onScroll, true);
            timers.forEach((timer, scroller) => {
                clearTimeout(timer);
                scroller.removeAttribute("data-scrolling");
            });
        };
    }, []);
    return null;
}
