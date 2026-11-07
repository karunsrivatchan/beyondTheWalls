import Link from "next/link";
import Image from "next/image";
import { CinematicHero } from "@/components/cinematic-hero";
import { SeasonExplorer } from "@/components/season-explorer";
import { StoryLink } from "@/components/story-link";
export default function Home() {
    return <>
    <CinematicHero />
    <div className="story-motto"><p>Shinzo wo Sasageyo!</p></div>
    <section id="explore" className="intro-section" aria-labelledby="intro-heading">
      <div className="intro-divider" aria-hidden="true"/>
      <div className="intro-artwork" aria-hidden="true"><Image className="intro-background" src="/media/freedom-scene-anime.jpg" alt="" fill sizes="100vw"/></div>
      <div className="intro-shade" aria-hidden="true"/>
      <div className="section-wrap intro-content">
        <p className="eyebrow">HUMANITY. SURVIVAL. FREEDOM.</p>
        <div className="intro-grid">
          <h2 id="intro-heading">The world is<br />bigger than<br /><em>the walls.</em></h2>
          <div>
            <p>For generations, humanity has lived in the shadow of towering walls. Outside, the Titans wait. Inside, a question grows.</p>
            <p className="intro-question">Is surviving the same as living?</p>
            <StoryLink />
          </div>
        </div>
      </div>
    </section>
    <SeasonExplorer />
    <section className="archive-gateway section-wrap">
      <div className="section-heading"><p className="eyebrow">KNOW THE WORLD</p><h2>Two sides.<br /><em>One fight for survival.</em></h2></div>
      <div className="gateway-grid">
        <Link href="/titans" className="gateway">
          <div className="gateway-artwork"><Image src="/media/titans-ensemble.png" alt="Illustrated collage of Titan faces" width={1280} height={720} sizes="(max-width: 600px) 100vw, 50vw"/></div>
          <div className="gateway-copy"><span className="eyebrow">THE FORCES BEYOND</span><h3>The Titans</h3><p>Uncover the power behind the fear.</p></div>
        </Link>
        <Link href="/characters" className="gateway">
          <div className="gateway-artwork"><Image src="/media/characters-ensemble.png" alt="Attack on Titan character ensemble" width={1529} height={860} sizes="(max-width: 600px) 100vw, 50vw"/></div>
          <div className="gateway-copy"><span className="eyebrow">THE PEOPLE WITHIN</span><h3>The Characters</h3><p>Meet the resolve that stands against it.</p></div>
        </Link>
      </div>
    </section>
  </>;
}
