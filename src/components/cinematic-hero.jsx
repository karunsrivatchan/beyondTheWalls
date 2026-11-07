"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroBeats, heroEndTitle, heroMedia } from "@/data/hero";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function CinematicHero() {
    const root = useRef(null);
    const video = useRef(null);
    const progress = useRef(null);
    const [status, setStatus] = useState("loading");
    useGSAP(() => {
        const el = video.current;
        const container = root.current;
        const media = gsap.matchMedia();
        media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
            // The requested scroll smoothing also applies when OS motion reduction is on.
            // Keep reduced-motion copy stationary, without disabling the film's scrubbing.
            const reducedMotion = Boolean(ctx.conditions?.reduce);
            setStatus("loading");
            let target = 0;
            let disposed = false;
            let trigger;
            let timeline;
            let ready = false;
            let lastSeekAt = 0;
            let priming = false;
            let primed = false;
            let primeTimeout;
            const beats = gsap.utils.toArray(".narrative-beat", container);
            const endTitle = container.querySelector(".hero-end-title");
            const masthead = container.querySelector(".hero-masthead");
            // Pump the latest GSAP target independently of media events. One seek is
            // normally in flight; a lost seeked event cannot permanently stop the film.
            const seek = () => {
                if (disposed || priming || !ready || el.readyState < 1)
                    return;
                const now = performance.now();
                if (el.seeking) {
                    if (now - lastSeekAt < 1000)
                        return;
                }
                else if (Math.abs(el.currentTime - target) < 1 / (heroMedia.fps * 2))
                    return;
                lastSeekAt = now;
                el.currentTime = target;
            };
            const scheduleSeek = () => seek();
            const update = (p) => {
                target = p * Math.max(0, el.duration - 1 / heroMedia.fps);
                if (progress.current)
                    progress.current.style.transform = `scaleX(${p})`;
                scheduleSeek();
            };
            const fail = () => {
                if (disposed)
                    return;
                disposed = true;
                clearTimeout(primeTimeout);
                gsap.ticker.remove(seek);
                el.pause();
                trigger?.kill(true);
                timeline?.kill();
                gsap.set(beats, { clearProps: "all" });
                gsap.set([endTitle, masthead], { clearProps: "all" });
                setStatus("error");
                ScrollTrigger.refresh();
            };
            const initialize = () => {
                if (ready || disposed || !Number.isFinite(el.duration) || el.duration <= 0 || el.readyState < 1)
                    return;
                ready = true;
                if (el.readyState >= 2)
                    setStatus("ready");
                const playhead = { value: 0 };
                gsap.set(beats, { autoAlpha: 0, y: reducedMotion ? 0 : 25 });
                gsap.set(beats[0], { autoAlpha: 1, y: 0 });
                gsap.set(endTitle, { autoAlpha: 0, y: reducedMotion ? 0 : 16 });
                timeline = gsap.timeline({ paused: true });
                timeline.to(playhead, { value: 1, duration: 1, ease: "none", onUpdate: () => update(playhead.value) }, 0);
                heroBeats.forEach((beat, index) => {
                    if (index !== 0)
                        timeline.to(beats[index], { autoAlpha: 1, y: 0, duration: 0.035, ease: "none" }, beat.start);
                    timeline.to(beats[index], { autoAlpha: 0, y: reducedMotion ? 0 : -22, duration: 0.035, ease: "none" }, beat.end - 0.035);
                });
                // Hold the final decoded frame before the section scrolls away naturally.
                timeline.to(masthead, { autoAlpha: 0, duration: 0.02 }, 0.98);
                timeline.to(endTitle, { autoAlpha: 1, y: 0, duration: 0.025, ease: "none" }, 1);
                timeline.to({}, { duration: heroMedia.endHold }, 1);
                trigger = ScrollTrigger.create({
                    id: "cinematic-hero", trigger: container, start: "top top",
                    end: () => `+=${gsap.utils.clamp(heroMedia.minScroll, heroMedia.maxScroll, el.duration * heroMedia.pixelsPerSecond)}`,
                    pin: true, animation: timeline, scrub: heroMedia.scrub, anticipatePin: 1, invalidateOnRefresh: true,
                    onRefresh: (self) => update(Math.min(1, self.progress * (1 + heroMedia.endHold))),
                });
                ScrollTrigger.refresh();
            };
            const resume = () => {
                initialize();
                if (ready && !disposed && el.readyState >= 2)
                    setStatus("ready");
                if (ready && !disposed)
                    scheduleSeek();
            };
            el.addEventListener("loadedmetadata", resume);
            el.addEventListener("loadeddata", resume);
            el.addEventListener("canplay", resume);
            el.addEventListener("seeked", scheduleSeek);
            el.addEventListener("error", fail);
            gsap.ticker.add(seek);
            el.muted = true;
            el.defaultMuted = true;
            el.pause();
            // The declarative src lets the browser preload before React initializes;
            // do not reset the decoder on mount or a motion-preference change.
            initialize();
            // Some mobile browsers require play() inside a gesture to unlock decoding.
            // Pause immediately after it succeeds, then restore the scroll target.
            const prime = () => {
                if (disposed || priming || primed)
                    return;
                priming = true;
                primeTimeout = setTimeout(() => {
                    el.pause();
                    priming = false;
                    scheduleSeek();
                }, 1200);
                el.play().then(() => {
                    el.pause();
                    primed = true;
                    resume();
                }).catch(() => { }).finally(() => {
                    clearTimeout(primeTimeout);
                    priming = false;
                    scheduleSeek();
                });
            };
            window.addEventListener("pointerdown", prime);
            window.addEventListener("keydown", prime);
            window.addEventListener("touchstart", prime, { passive: true });
            window.addEventListener("wheel", prime, { passive: true });
            return () => {
                disposed = true;
                clearTimeout(primeTimeout);
                gsap.ticker.remove(seek);
                window.removeEventListener("pointerdown", prime);
                window.removeEventListener("keydown", prime);
                window.removeEventListener("touchstart", prime);
                window.removeEventListener("wheel", prime);
                el.pause();
                el.removeEventListener("loadedmetadata", resume);
                el.removeEventListener("loadeddata", resume);
                el.removeEventListener("canplay", resume);
                el.removeEventListener("seeked", scheduleSeek);
                el.removeEventListener("error", fail);
                trigger?.kill(true);
                timeline?.kill();
                gsap.set(beats, { clearProps: "all" });
                gsap.set([endTitle, masthead], { clearProps: "all" });
            };
        });
        return () => media.revert();
    }, { scope: root });
    return (<section ref={root} className={`cinematic-hero hero-${status}`} aria-label="Attack on Titan cinematic introduction">
      <video ref={video} className="hero-video" src={heroMedia.src} poster={heroMedia.poster} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true"/>
      <div className="hero-shade"/>
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
      <p className="hero-status" role="status">{status === "error" ? "The film couldn’t load. You can still explore the archive below." : status === "loading" ? "Preparing the cinematic…" : ""}</p>
    </section>);
}
