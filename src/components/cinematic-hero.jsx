"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroBeats, heroEndTitle, heroMedia } from "@/data/hero";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function CinematicHero() {
    const root = useRef(null);
    const track = useRef(null);
    const video = useRef(null);
    const progress = useRef(null);
    const [status, setStatus] = useState("loading");
    const [source, setSource] = useState(null);
    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        let objectUrl;
        const timeout = setTimeout(() => controller.abort(), 25000);

        async function bufferFilm() {
            try {
                const response = await fetch(heroMedia.src, { signal: controller.signal });
                if (!response.ok)
                    throw new Error("Could not download the hero film");
                const film = await response.blob();
                if (active) {
                    objectUrl = URL.createObjectURL(film);
                    setSource(objectUrl);
                }
            } catch {
                if (active)
                    setStatus("error");
            } finally {
                clearTimeout(timeout);
            }
        }

        bufferFilm();
        return () => {
            active = false;
            clearTimeout(timeout);
            controller.abort();
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
        };
    }, []);

    useGSAP(() => {
        if (!source)
            return;
        const el = video.current;
        const container = root.current;
        const media = gsap.matchMedia();
        media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
            // The requested scroll smoothing also applies when OS motion reduction is on.
            // Keep reduced-motion copy stationary, without disabling the film's scrubbing.
            const reducedMotion = Boolean(ctx.conditions?.reduce);
            setStatus("loading");
            let requestedProgress = 0;
            let seekingProgress = 0;
            let renderedProgress = -1;
            let disposed = false;
            let trigger;
            let scrubTimeline;
            let timeline;
            let ready = false;
            let lastSeekAt = 0;
            let lastFrame = 0;
            let decodeTimeout;
            const beats = gsap.utils.toArray(".narrative-beat", container);
            const endTitle = container.querySelector(".hero-end-title");
            const masthead = container.querySelector(".hero-masthead");
            const renderProgress = (p) => {
                if (p === renderedProgress)
                    return;
                renderedProgress = p;
                timeline.time(p);
                progress.current.style.transform = `scaleX(${Math.min(1, p)})`;
            };
            // Coalesce scroll updates into one seek per source frame and keep the
            // captions with the frame that has finished seeking.
            const seek = () => {
                if (disposed || !ready || el.readyState < 1)
                    return;
                const now = performance.now();
                if (el.seeking && now - lastSeekAt < 500)
                    return;
                const frame = Math.round(Math.min(1, requestedProgress) * lastFrame);
                const target = frame === 0 ? 0 : (frame + 0.25) / heroMedia.fps;
                if (!el.seeking && Math.abs(el.currentTime - target) < 0.001) {
                    renderProgress(requestedProgress);
                    return;
                }
                lastSeekAt = now;
                seekingProgress = requestedProgress;
                el.currentTime = target;
            };
            const finishSeek = () => {
                if (ready && !disposed)
                    renderProgress(seekingProgress);
            };
            const fail = () => {
                if (disposed)
                    return;
                disposed = true;
                clearTimeout(decodeTimeout);
                gsap.ticker.remove(seek);
                el.pause();
                trigger?.kill();
                scrubTimeline?.kill();
                timeline?.kill();
                gsap.set(beats, { clearProps: "all" });
                gsap.set([endTitle, masthead], { clearProps: "all" });
                setStatus("error");
            };
            const initialize = () => {
                if (ready || disposed || !Number.isFinite(el.duration) || el.duration <= 0 || el.readyState < 2)
                    return;
                ready = true;
                lastFrame = Math.max(0, Math.round(el.duration * heroMedia.fps) - 1);
                clearTimeout(decodeTimeout);
                const playhead = { value: 0 };
                gsap.set(beats, { autoAlpha: 0, y: reducedMotion ? 0 : 25 });
                gsap.set(beats[0], { autoAlpha: 1, y: 0 });
                gsap.set(endTitle, { autoAlpha: 0, y: reducedMotion ? 0 : 16 });
                timeline = gsap.timeline({ paused: true });
                heroBeats.forEach((beat, index) => {
                    if (index !== 0)
                        timeline.to(beats[index], { autoAlpha: 1, y: 0, duration: 0.035, ease: "none" }, beat.start);
                    timeline.to(beats[index], { autoAlpha: 0, y: reducedMotion ? 0 : -22, duration: 0.035, ease: "none" }, beat.end - 0.035);
                });
                // Hold the final decoded frame before the section scrolls away naturally.
                timeline.to(masthead, { autoAlpha: 0, duration: 0.02 }, 0.98);
                timeline.to(endTitle, { autoAlpha: 1, y: 0, duration: 0.025, ease: "none" }, 1);
                timeline.to({}, { duration: heroMedia.endHold }, 1);
                scrubTimeline = gsap.to(playhead, {
                    paused: true,
                    value: timeline.duration(),
                    ease: "none",
                    onUpdate: () => { requestedProgress = playhead.value; },
                });
                trigger = ScrollTrigger.create({
                    id: "cinematic-hero", trigger: track.current, start: "top top",
                    end: `+=${heroMedia.scrollDistance}`,
                    animation: scrubTimeline, scrub: reducedMotion ? true : heroMedia.scrub,
                });
                ScrollTrigger.refresh();
                setStatus("ready");
            };
            el.addEventListener("loadeddata", initialize);
            el.addEventListener("canplay", initialize);
            el.addEventListener("seeked", finishSeek);
            el.addEventListener("error", fail);
            gsap.ticker.add(seek);
            el.muted = true;
            el.defaultMuted = true;
            el.pause();
            decodeTimeout = setTimeout(fail, 2500);
            if (el.error)
                fail();
            else
                initialize();
            return () => {
                disposed = true;
                clearTimeout(decodeTimeout);
                gsap.ticker.remove(seek);
                el.pause();
                el.removeEventListener("loadeddata", initialize);
                el.removeEventListener("canplay", initialize);
                el.removeEventListener("seeked", finishSeek);
                el.removeEventListener("error", fail);
                trigger?.kill();
                scrubTimeline?.kill();
                timeline?.kill();
                gsap.set(beats, { clearProps: "all" });
                gsap.set([endTitle, masthead], { clearProps: "all" });
            };
        });
        return () => media.revert();
    }, { scope: root, dependencies: [source], revertOnUpdate: true });
    return (<div ref={track} className={`hero-track hero-track-${status}`} style={{ "--hero-scroll-distance": `${heroMedia.scrollDistance}px` }}>
    <section ref={root} className={`cinematic-hero hero-${status}`} aria-label="Attack on Titan cinematic introduction">
      <video ref={video} className="hero-video" src={source || undefined} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true"/>
      <div className="hero-shade"/>
      <div className="hero-preloader" aria-hidden="true">
        <div className="hero-preloader-lockup">
          <p className="hero-preloader-mark" lang="ja">進撃の巨人</p>
          <p className="hero-preloader-title">Attack on Titan</p>
          <p className="eyebrow">Beyond the Walls</p>
          <div className="hero-preloader-rule"><span/></div>
          <p className="hero-preloader-caption">Preparing the cinematic</p>
        </div>
      </div>
      <div className="hero-masthead"><span>進撃の巨人</span><span>ATTACK ON TITAN</span></div>
      <div className="hero-narratives">
        {heroBeats.map((beat, index) => (<div key={beat.eyebrow} className={`narrative-beat beat-${beat.align} ${index === 0 ? "beat-opening" : ""}`} aria-hidden={index !== 0}>
            <p className="eyebrow"><span className="red-rule"/>{beat.eyebrow}</p>
            {index === 0 ? <h1>{beat.title[0]}<br /><em>{beat.title[1]}</em></h1> : <h2>{beat.title[0]}<br /><em>{beat.title[1]}</em></h2>}
            <p className="hero-description">{beat.description}</p>
          </div>))}
      </div>
      <div className="hero-end-title">
        <h2 aria-label={`${heroEndTitle.title} — ${heroEndTitle.subtitle}`}><span className="end-title-main">{heroEndTitle.title}</span><span className="end-title-sub">— {heroEndTitle.subtitle}</span></h2>
      </div>
      <div className="hero-progress" aria-hidden="true"><div ref={progress}/></div>
      <p className="sr-only">Scroll down to advance through the muted film; scroll up to reverse. The film shows a walled world, its inhabitants, and the arrival of a towering threat.</p>
      <p className={status === "error" ? "hero-status" : "sr-only"} role="status">{status === "error" ? "The film couldn’t load. You can still explore the archive below." : status === "loading" ? "Preparing the cinematic…" : ""}</p>
    </section></div>);
}
