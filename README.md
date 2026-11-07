# Beyond the Walls

A local Next.js / React / JavaScript Attack on Titan fan experience. The homepage uses your `WatermarkRemoved-Clips/Completed-Clip.mp4` as a scroll-controlled film. The original footage and images remain untouched.

## Run

```powershell
npm ci
npm run dev
```

Open the local URL printed by Next.js. The three routes are `/`, `/titans`, and `/characters`.

Development and builds use Next.js's supported Webpack mode because Turbopack's PostCSS worker exits prematurely on this Windows setup.

## Edit the cinematic

- `src/data/hero.js` controls the video paths, narrative text, normalized start/end times, and scroll distance. A range of `0.25`–`0.45` represents 25%–45% of the actual video duration.
- `src/components/cinematic-hero.jsx` owns GSAP pinning, the shared narrative timeline, and coalesced video seeks. Down advances the film; up reverses it. There is no continuous playback and no audio.
- The film responds to scrolling immediately, without an enable button, time display, or skip link. Reduced-motion preferences remove text travel; the explicitly requested video scrub smoothing remains active.
- The last frame is held at the end of the pinned sequence and remains visible as the hero scrolls away. There is no exit fade to black.
- Loading failure or a 25-second loading timeout leaves a static image with access to the rest of the page.
- The source film is approximately 35.32 seconds, 1920 × 1080. `public/media/hero-scrub-intra.mp4` is a 720p H.264 Constrained Baseline derivative with every frame independently decodable, no B-frames, no audio, and fast-start metadata. This keeps the cost of backward decoding low without shipping an image sequence.

After replacing the source clip, regenerate the web video and first-frame poster:

```powershell
node scripts/prepare-hero.mjs
```

The original is never rewritten. The browser reads duration from the generated file's metadata; no hardcoded playback duration is used.

## Content

`src/data/seasons.js` holds season and compilation-film information. `src/data/archive.js` holds Titan and character profiles. Each profile has a completed-season threshold; sensitive holder fields have their own threshold. No canonical weights are invented. Missing individual portraits currently use labeled monograms rather than unrelated character images.

The shared spoiler preference defaults to no spoilers and persists in local storage when available. Native HTML dialogs provide keyboard focus containment and Escape-to-close, with focus and scroll position restored on dismissal.

Sources for further editorial updates:

- [Official animation portal](https://aot-portal.com/animation/)
- [Crunchyroll watch order](https://www.crunchyroll.com/news/guides/2023/3/1/guide-attack-on-titan-watch-order)
- [The Last Attack compilation announcement](https://www.crunchyroll.com/news/latest/2024/8/17/attack-on-titan-the-movie-the-last-attack-anime-film-announced)
- [Titan reference](https://attackontitan.fandom.com/wiki/Nine_Titans)

This is an unofficial fan project, without affiliation with the creators or rights holders. Local asset availability does not establish rights for public distribution.

## Checks

```powershell
npm run lint
npm run build
```

## Animation references

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP matchMedia and cleanup](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/)

This project was created locally in the supplied asset folder; it has not been deployed.

## Verification

TypeScript, ESLint, and the Webpack production build passed. Chromium browser checks covered forward and reverse seeking with the final 1280 × 720 video, pinned positioning, synchronized text, a deliberately missing-video fallback, navigation, spoiler persistence, character filters, and dialog focus/scroll restoration. Responsive QA used desktop and 390px mobile viewports; physical iOS and Android devices were not tested.

The homepage hero is complete. The supporting archive pages contain initial structured profiles and season summaries; a full episode catalog and individual character portrait assets remain future content work.

The revised hero was also checked with reduced motion enabled: it initializes without activation, shows no enable/timer/skip controls, holds the final frame while scrolling farther down, scrolls away at full video opacity, and still reverses correctly. Lint and the production build (including TypeScript) passed.

## Typography and closing title

The final frame displays “Attack on Titan — Beyond the Walls” and holds it through the end of the pin and the normal scroll exit. Edit the wording in `heroEndTitle` in `src/data/hero.js`; `heroMedia.endHold` controls the final-frame reading time relative to the film timeline.

The shared typeface is locally hosted [New Rocker](https://github.com/google/fonts/tree/main/ofl/newrocker), with its Open Font License retained in `src/app/fonts/OFL-NewRocker.txt`. It provides angular Gothic letterforms inspired by the English logo, with a weathered metallic treatment on the closing title. It is not the official Attack on Titan logo font. Exact reproduction would require the matching font file or custom lettering reference.

Build worker concurrency is limited to one and Webpack memory optimizations are enabled to keep builds stable on this machine.

Typography QA confirmed the local font loaded, the closing title stayed within a 390px mobile viewport without horizontal overflow, the title and video remained at full opacity during the scroll exit, and reversing restored the earlier narrative. Desktop and mobile captures are saved in `qa/hero-anime-title-desktop.jpg` and `qa/hero-anime-title-mobile.jpg`. Lint and the production build, including TypeScript, passed after this update.

## Story introduction

The “The world is bigger than the walls” section uses the anime’s “This is freedom” cloud scene, served locally as `public/media/freedom-scene-anime.jpg`. Source: [Sportskeeda article](https://www.sportskeeda.com/anime/attack-titan-final-season-part-3-ending-ruin-everything) ([original 1920 × 1080 anime still](https://staticg.sportskeeda.com/editor/2023/03/3d635-16781652775034-1920.jpg)). The specific scene is displayed as requested; the global spoiler preference is unchanged. The section has a responsive 88–160px dark gap after the hero and a CSS transparency mask that fades the image into the page background at the bottom. Mobile composition reserves room above the copy to keep Eren visible. The artwork belongs to its respective rights holders.

`src/components/story-link.jsx` contains the “Discover the story” link. Its native `#chronicle` href remains usable without JavaScript. After hydration, GSAP ScrollToPlugin eases to the chronicle with an offset for the fixed navigation, permits manual scroll interruption, updates the URL after completion, and moves keyboard focus to the chronicle heading. The requested click navigation takes 1.35 seconds, shortened to 0.45 seconds for reduced-motion preferences. GSAP context cleanup cancels any remaining scroll tween when the component unmounts.

Verification: the production build (including TypeScript) and lint passed. Browser QA observed an intermediate scroll position between the start and destination, followed by the correct `#chronicle` hash and heading focus. The destination cleared the fixed header by 20px on both desktop and 390px mobile viewports. The anime image loaded, the mobile page had no horizontal overflow, and no browser console errors occurred. Captures: `qa/story-introduction-desktop.jpg` and `qa/story-introduction-mobile.jpg`.

The freedom-scene revision also passed build, TypeScript, lint, and browser checks. Measured hero-to-introduction spacing was 128px at a 1280px desktop width and 88px at a 390px mobile width. The image mask reaches full transparency at the bottom, and the mobile artwork uses a 500px composition to preserve Eren's outstretched pose above the copy. Story navigation still reaches the heading with the fixed-header offset and no browser console errors. Updated captures: `qa/freedom-story-desktop.jpg`, `qa/freedom-story-mobile.jpg`, and `qa/freedom-section-gap.jpg`.

The continuity update removes decorative arrow icons from all links, buttons, archive cards, season rows, and the spoiler dropdown. The introduction starts with the same 2px red rule as the hero. Neutral shading and a longer transparency fade blend the artwork into the shared charcoal background used by both the introduction and the chronicle, avoiding the previous background-color seam. The story button is centered without an unused icon column. Browser checks covered all three routes, the season dialog, matching divider colors/background colors, 390px mobile overflow, and keyboard story navigation; no arrow glyphs or console errors were found. Build, TypeScript, and lint passed. Captures: `qa/story-continuity-desktop.jpg` and `qa/story-continuity-mobile.jpg`.

The “Two sides. One fight for survival.” panels use the user-supplied images saved as `public/media/titans-ensemble.png` and `public/media/characters-ensemble.png`. The originals are copied unchanged into the project. Both panels use 16:9 artwork with captions below so the wide collages remain visible. Desktop shows two columns; mobile stacks the panels. Browser checks confirmed both images loaded, maintained their widescreen aspect ratio without horizontal overflow, and linked to the correct archives. Build, TypeScript, and lint passed. Captures: `qa/replacement-panels-desktop.jpg` and `qa/replacement-panels-mobile.jpg`.

## Chronicle posters

The homepage chronicle uses the official portrait key visuals from the [Attack on Titan visual gallery](https://aot-portal.com/special-gallery/kv/): Season One visual 1, Season Two visual 2, Season Three visual 5, The Final Season visual 2, and The Last Attack theatrical visual. Local JPEGs are resized to 684 × 963 and stored in `public/media/*-poster.jpg`. The gallery artwork belongs to the respective rights holders. Season rows retain the full portrait at desktop, tablet, and mobile widths; detail dialogs also display the complete poster without a landscape crop.

Poster verification: ESLint and production compilation/TypeScript passed. Browser inspection confirmed portrait season rows and an uncropped Season One dialog at mobile width. Preview: qa/chronicle-portrait-mobile.png.

## Season popup episode lists

`src/components/season-details.jsx` displays a portrait poster alongside an expanded storyline on desktop and stacks them on mobile. `src/data/episodes.js` holds the numbered episode groups: 25 / 12 / 22 / 28 regular episodes, followed by two Final Chapters specials for the final season. The theatrical entry lists the five compilation films. Storylines and episode titles follow the existing previous-season spoiler threshold; episode counts and numbers remain available while protected. Episode names were checked against the linked Wikipedia season references and TVmaze episode guide; shorter Season One titles omit the arc subtitles. Viewing notes explain the alternate seven-episode finale release.

Browser inspection confirmed the Season One poster, expanded storyline, all 25 numbered entries, and scrollable popup layout. Screenshot: `qa/season-episodes-popup.png`.

## Floating season reveal

Season clicks now use `src/components/season-overlay.jsx` instead of the archive dossier. A transparent fullscreen native dialog is portaled to the document body with explicit z-index layers (1000–1003). Its backdrop dims the homepage at 72% opacity with a light 3px blur. The selected portrait grows from the clicked thumbnail coordinates into a floating poster; text occupies an independent scroll area beside it on desktop and stacks beneath it on mobile. Close, Escape, and backdrop click fade the overlay away and restore the page scroll and trigger focus.

`src/components/typed-text.jsx` reveals text character by character when each block enters view. Full text remains available to assistive technology without repeated character announcements; word wrapping reserves the final layout, and reduced-motion preferences show the content immediately. Spoiler changes remount only the details column so newly revealed text types in without replaying the poster animation. Browser QA confirmed the enlarged poster over the dimmed homepage and Escape restoring focus to the originating season. Screenshot: `qa/season-floating-overlay.png`.

Closing a season now returns its floating poster to the originating thumbnail with a 650ms eased translate/scale animation. The source thumbnail stays hidden until the return completes to avoid a duplicate image. The destination is measured again on dismissal; the visible poster frame is frozen first so an early close can reverse from its current size. Text fades out in 200ms while the backdrop clears over the return animation. Reduced motion closes immediately. The close button, Escape, and backdrop share this dismissal path; animation completion triggers unmount and restores thumbnail visibility and focus. Browser inspection confirmed return to the original season row. Screenshot: `qa/season-poster-return.png`.

Poster motion refinement: opening now takes 1.1 seconds and closing takes 1 second, both with cubic-bezier(.4,0,.2,1) easing. The shadow grows as the poster lifts from its thumbnail and recedes as it settles back; backdrop fades match the poster durations. Detail text fades in over 650ms after a 300ms delay and fades out over 350ms.

## Scroll indicators and hero width

Native 3px scrollbars now start transparent, appear on actual scroll, and fade out over 400ms after 500ms of inactivity. `src/components/scrollbar-visibility.jsx` uses one passive capture listener for both document scrolling and independently scrolling popup regions, with timer cleanup on unmount. A registered CSS color property animates native thumb color without changing scrollbar width or page layout. Firefox uses its native thin-width fallback. The hero explicitly spans 100vw, clips horizontal overflow, and keeps its video in cover mode. Screenshot: `qa/hero-full-width.png`.

## Titan sticker gallery

The Titans page now displays all nine full-body Titan cutouts in an unframed composition, with the Colossal Titan spanning two desktop rows. Tablet and mobile layouts use three and two columns. The requested forms and names are visible together; detailed abilities and holder identities remain controlled by the existing spoiler preference. Clicking a cutout opens its existing dossier. All nine final transparent WebP assets and artist links are recorded in `public/media/titans/SOURCES.md`, including the built-in image-tool background-extraction prompt for the Beast Titan. The character archive remains on its existing card layout.

Titan gallery verification: all nine WebP assets have a non-opaque alpha channel. Browser checks confirmed the full-body composition, all nine accessible Titan buttons, and the Colossal dossier with protected holder information. Stitched desktop preview: qa/titan-sticker-gallery-preview.png.

## Expanded Titan atlas

The gallery now contains 20 distinct full-body forms, including Grisha and Kruger, Ymir's Jaw, Falco's Jaw and flying forms, Ksaver, Rod Reiss, the original Founder, and recognizable Pure Titans. Head-only and incomplete artwork is excluded. Similar Colossal and Galliard illustrations are consolidated; known holders remain in their dossiers. The skeletal Founder spans a dedicated full-width stage with a smaller Colossal reference. Screen composition emphasizes relative scale rather than literal height ratios.

Search and category filters narrow the same catalogue. The added illustrations are generated reconstructions and are disclosed in the gallery, dossiers and asset notes. Browser QA confirmed all 20 unique entries, all images loaded, Falco search returning three forms, the Pure Titan filter returning two entries, and the protected dossier. At 390px the document had no horizontal overflow. Production build including TypeScript and targeted ESLint passed. Desktop and mobile captures are in `qa/titan-final-*.jpg`.

Founding artwork refinement: replaced the flat Walfas-style asset with founding-detailed.webp, a detailed transparent full-body restoration based on HiGuys920's 2024 3D reference. Source and built-in image-tool prompts are recorded in public/media/titans/FOUNDING-ART.md. Browser inspection confirmed the new asset loaded in the large Founder stage; screenshot: qa/founding-replacement-desktop.jpg. Targeted ESLint passed.

Attack Titan artwork revision: Eren now uses the complete Attack on Titan 2 game render with native transparency (public/media/titans/attack-game.webp). The earlier blue crouching artwork is no longer displayed. Grisha's unsatisfactory reconstruction was omitted under the user's instruction to skip forms without suitable full-body artwork; available alternatives were cropped portraits or model sheets, and image-tool edits were rejected. The catalogue now has 18 entries. Browser QA confirmed one Attack Titan result and the replacement image loaded. Targeted ESLint passed. Screenshot: qa/attack-replacement.jpg.

## Fullscreen Titan dossiers
Titan clicks now open the dedicated TitanDossier component in a native fullscreen dialog. Desktop uses an enlarged upper-body portrait on the left and an independent scrolling details pane on the right. Mobile stacks the portrait above the copy. Close and Escape restore page scrolling and focus to the original Titan button. Spoiler controls remain available inside the reading pane, and portraits stay visible as in the gallery. Thin scrollbars fade after inactivity; reduced motion skips the opening animation. Browser QA measured a 1280x720 dialog filling the 1280x720 viewport, confirmed no horizontal overflow at 390px, and checked close/Escape, spoiler protection and focus restoration. TypeScript, targeted ESLint and production build passed. Preview: qa/titan-fullscreen-desktop.jpg.

Titan portrait framing correction: dossier artwork now aligns to the bottom-left with contained dimensions, no negative offsets or oversized crops. Crawling and Founding faces are fully visible on desktop and 390px mobile. Separate high-resolution Colossal and Founding close-ups serve dossiers; Female uses the artist's original 442x1392 PNG. Source dimensions cap enlargement, and dossier images bypass additional lossy optimization. Browser QA confirmed left=0 and bottom=720 for the Female portrait at 1280x720, and no horizontal mobile overflow. Build, TypeScript and targeted ESLint passed. Captures: qa/titan-corner-crawling.jpg and qa/titan-corner-founding.jpg.

Titan overlay interaction refinement: portraits now use individual upper-body crop fractions, with complete face framing for wide forms, and pop from the bottom-left over 900ms. The details pane slides in after 950ms over 650ms. The dialog itself is transparent; a 48%-opaque dark backdrop keeps the Titans page visible, with extra shading behind the copy. The explicitly requested animation overrides the site's blanket reduced-motion reset for this reveal. Any click in the dialog, including artwork, text or empty space, dismisses it; Escape remains supported. Spoiler preferences are changed on the underlying page and remain enforced in the overlay. Browser QA confirmed the animation names/durations, text initially transparent before its delay, final opacity 1, and dismissal via text and image clicks. TypeScript, ESLint and build passed. Preview: qa/titan-animated-overlay.jpg.

## Expanded Characters archive
The Characters page now matches the Titans gallery and overlay: 22 familiar characters appear as transparent full-body cutouts, with search and group filters. Profiles are deliberately brief: an introduction, what the character is known for, and key connections. Four Final Season profiles respect the completed-season preference. DetailOverlay is shared by both archives, preserving bottom-left upper-body framing, the 900ms portrait reveal, text sliding in after 950ms, transparent 48% backdrop, thin fading scrollbars, click-anywhere dismissal, Escape, focus restoration, and mobile stacking. Artwork sources, extraction prompts and paths are documented in public/media/characters/SOURCES.md. Final full-resolution assets are local lossless WebP files. Browser QA covered character search, the four-person Marley filter, spoiler protection, text-click and Escape dismissal, a 390px layout without horizontal overflow, and the existing Titan overlay after the shared-component refactor. All 22 assets have alpha transparency and matching manifest dimensions. Production build, TypeScript and targeted ESLint passed. Captures: qa/characters-gallery-desktop.jpg, qa/characters-overlay-desktop.jpg, qa/characters-overlay-mobile.jpg.

Floch Forster added as the 23rd character with a full-body game cutout, a Yeagerists filter, and a brief Final Season profile covering his development from Scout recruit to Yeagerist leader. Uses the existing animated overlay and spoiler protection.


Hero seek recovery: video seeking now works from metadata readiness, retries the latest scroll target on loadeddata/canplay, and unlocks browser decoding through a brief muted play/pause on the first successful interaction. A 25-second slow-load notice no longer removes the source or prevents late initialization. Browser QA confirmed forward scrubbing to 18.56 seconds, reverse to 6.19 seconds, continued pinning, and paused playback between scrolls. Preview: qa/hero-scroll-recovery.jpg.



Hero scrubbing rebuild: the active asset is now hero-scrub-intra.mp4 (34,933,612 bytes). Every frame is a sync frame, trading a larger download for independent forward/reverse decoding. A new filename avoids reusing the prior cached encode. A GSAP ticker pumps the latest target, allows one seek at a time, and retries after a one-second stuck-seek timeout. It no longer depends on seeked events to continue. The video source is declared in markup for early preloading and is not reset on mount. Metadata initializes the pin; decoded data marks the film ready. The timeline uses a 1.1-second scrub and 180 pixels per video second, with reduced travel for copy. Video and shading use nonnegative stacking layers. QA confirmed HTTP 206 byte-range serving, advancing to 17.54 seconds then reversing to 4.67 seconds, visible changes in the rendered film, and paused playback between input. Captures: qa/hero-smooth-forward.jpg and qa/hero-smooth-reverse.jpg.

