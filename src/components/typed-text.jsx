"use client";
import { useEffect, useRef } from "react";
export function TypedText({ children }) {
    const ref = useRef(null);
    useEffect(() => {
        const element = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                element.dataset.typing = "active";
                observer.disconnect();
            }
        }, { threshold: .05 });
        observer.observe(element);
        return () => observer.disconnect();
    }, [children]);
    let index = 0;
    const interval = Math.min(.022, 1.8 / Math.max(children.length, 1));
    return <span ref={ref} className="typed-text" key={children}>
    <span className="sr-only">{children}</span>
    <span aria-hidden="true">{children.split(/(\s+)/).map((word, wordIndex) => /^\s+$/.test(word) ? word : <span className="typed-word" key={wordIndex}>{Array.from(word).map(character => <span className="typed-character" key={index} style={{ "--type-delay": `${index++ * interval}s` }}>{character}</span>)}</span>)}</span>
  </span>;
}
