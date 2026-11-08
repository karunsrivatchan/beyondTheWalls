import { PageOpening } from "@/components/page-opening";
import { TitanGallery } from "@/components/titan-gallery";
export const metadata = { title: "The Titans" };
export default function TitansPage() {
    return <PageOpening><section className="archive-intro section-wrap titan-page-intro"><div><p className="eyebrow">THE TITAN ARCHIVE</p><h1>Beyond <em>the Nine.</em></h1></div><p>From the first Titan to the Rumbling. Explore the named Titans and recognizable forms from across the anime.</p></section><TitanGallery /></PageOpening>;
}
