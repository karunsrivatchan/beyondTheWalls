"use client";

import { useEffect, useRef, useState } from "react";

export function PageOpening({ children, pending = false }) {
    const content = useRef(null);
    const [artworkReady, setArtworkReady] = useState(false);
    const loading = pending || !artworkReady;

    useEffect(() => {
        let active = true;
        const finish = () => {
            if (active)
                setArtworkReady(true);
        };
        const timeout = setTimeout(finish, 20000);
        const images = Array.from(content.current.querySelectorAll("img"));
        // Use the responsive images the page actually renders, including cached images.
        Promise.allSettled([...images.map(image => image.decode()), document.fonts.ready]).then(() => {
            clearTimeout(timeout);
            finish();
        });
        return () => {
            active = false;
            clearTimeout(timeout);
        };
    }, []);

    return <>
        <div className={`page-preloader${loading ? " is-loading" : ""}`} role="status" aria-hidden={!loading}>
            <div>
                <p className="page-preloader-mark" lang="ja">進撃の巨人</p>
                <p className="page-preloader-title">Attack on Titan</p>
                <p className="eyebrow">Beyond the Walls</p>
                <div className="page-preloader-rule" aria-hidden="true"><span/></div>
                <p className="page-preloader-caption">Preparing the experience</p>
            </div>
        </div>
        <div ref={content}>
            {children}
        </div>
    </>;
}
