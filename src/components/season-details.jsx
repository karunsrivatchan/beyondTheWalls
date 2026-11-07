import { episodeGroups } from "@/data/episodes";
import { TypedText } from "./typed-text";
import { SpoilerReveal } from "./spoiler-reveal";
function EpisodeList({ season, showTitles }) {
    const films = season.id === 5;
    return <section className="season-episodes" aria-label={films ? "Film list" : "Episode list"}>
      <h3><TypedText>{season.id === 5 ? "Film list" : "Episode list"}</TypedText></h3>
      {episodeGroups[season.id].map(group => <div className="episode-group" key={group.title}>
        <h4><TypedText>{group.title}</TypedText></h4>
        <ol className="episode-list" start={group.start}>
          {group.titles.map((title, index) => <li key={title}>
            <span className="episode-number"><TypedText>{`${season.id === 5 ? "Film" : group.title.includes("Specials") ? "Special" : "Ep."} ${String(group.start + index).padStart(2, "0")}`}</TypedText></span>
            <span><TypedText>{showTitles ? title : "Title hidden"}</TypedText></span>
          </li>)}
        </ol>
      </div>)}
      <p className="episode-caption"><TypedText>{season.id === 5 ? "Compilation films revisit the television story; they are not additional seasons." : "Listed in viewing order. English titles may vary slightly by release."}</TypedText></p>
    </section>;
}
export function SeasonDetails({ season }) {
    return <>
    <div className="season-storyline">
      <p className="eyebrow"><TypedText>{`${season.years} · ${season.format}`}</TypedText></p>
      <p><TypedText>{season.intro}</TypedText></p>
      <h3><TypedText>At its heart</TypedText></h3><p><TypedText>{season.themes}</TypedText></p>
    </div>
    {season.id === 5 ? <EpisodeList season={season} showTitles/> :
            <SpoilerReveal warning="The storyline and episode titles may contain spoilers." preview={<EpisodeList season={season} showTitles={false}/>}>
        <div className="season-storyline">
          <h3><TypedText>Storyline</TypedText></h3>
          <p><TypedText>{season.overview}</TypedText></p>
        </div>
        <EpisodeList season={season} showTitles/>
      </SpoilerReveal>}
    <h3><TypedText>Viewing notes</TypedText></h3><p><TypedText>{season.note}</TypedText></p>
    <a className="source-link" href={season.id === 5 ? "https://www.crunchyroll.com/news/guides/2023/3/1/guide-attack-on-titan-watch-order" : `https://en.wikipedia.org/wiki/Attack_on_Titan_season_${season.id}`} target="_blank" rel="noreferrer"><TypedText>{season.id === 5 ? "Viewing guide" : "Episode reference"}</TypedText></a>
  </>;
}
