# Character artwork

The Characters page uses 22 familiar characters, with one entry per person. This is an unofficial fan project; artwork belongs to its original creators and franchise rights holders.

## Official full-body sources

Eren, Mikasa, Armin, Levi, Erwin, Hange, Jean, Connie, Sasha, Historia, Ymir, Reiner, Bertholdt, Annie, Hannes, Dot Pixis, Marco and Petra use transparent renders from the official [Attack on Titan 2 character gallery](https://www.koeitecmoamerica.com/attackontitan2/characters.html). Exact public PNG URLs are preserved in `qa/character-downloads.json` and the original downloads in `qa/character-sources/`.

Zeke, Pieck, Falco and Gabi use the official [Final Season character design sheets](https://shingeki.tv/final/character/). The separate inset face on each sheet was removed with the built-in image tool to leave one complete standing character on transparency. These four assets are extracted/retouched derivatives of the official reference sheets; no new character design or pose was requested.

Full-body gallery assets are stored locally as lossless transparent WebP. The popup reuses each full-resolution asset and applies a CSS upper-body crop. The gallery uses the complete figure. `src/data/character-art.json` records each asset's real dimensions and popup crop fraction. `scripts/prepare-characters.mjs` prepares local copies and a QA contact sheet without enlarging source artwork.

## Built-in image-tool extraction prompt

One call per Final Season character, each using that character's official sheet as the edit target:

“Background-extraction edit only. This is an official Attack on Titan character design sheet with one complete clothed standing character and one separate inset head portrait. Keep ONLY the large complete standing character, preserving the exact original anime face, hair, uniform, pose, colors, proportions and all hands and feet. Remove the separate inset head portrait completely and leave real alpha transparency where it was. Preserve existing background transparency. Do not redraw, redesign, change pose, add text or objects. Center the complete standing figure with clear padding. Crisp clean anime source artwork, transparent background.”

The selected generated output paths are recorded in `qa/character-extractions.json`. All final assets are in `public/media/characters/`.

## Floch Forster
Floch uses the full-body Attack on Titan 2 game render preserved in the [Attack on Titan Wiki image gallery](https://attackontitan.fandom.com/wiki/Floch_Forster_(Anime)/Image_Gallery). The original PNG is recorded in qa/character-downloads.json. Its native 330 x 1012 pixels and alpha transparency are preserved in a lossless WebP; the popup uses a 52% upper-body crop. No generated art or enlargement was used.

