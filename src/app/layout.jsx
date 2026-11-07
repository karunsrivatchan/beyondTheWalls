import Link from "next/link";
import localFont from "next/font/local";
import { Navigation } from "@/components/navigation";
import { ScrollbarVisibility } from "@/components/scrollbar-visibility";
import "./globals.css";
const animeFont = localFont({ src: "./fonts/NewRocker-Regular.ttf", variable: "--font-anime", weight: "400", display: "swap" });
export const metadata = { title: { default: "Beyond the Walls — Attack on Titan", template: "%s — Beyond the Walls" }, description: "An unofficial, cinematic journey into the world of Attack on Titan. Explore the story, its Titans, and the people who fight for freedom." };
export default function RootLayout({ children }) {
    return <html lang="en"><body className={animeFont.variable}><ScrollbarVisibility /><a href="#main" className="accessibility-skip">Skip to content</a><Navigation /><main id="main">{children}</main><footer className="site-footer"><LinkHome /><p>An unofficial fan project. Attack on Titan belongs to Hajime Isayama and its respective rights holders. No official affiliation.</p><span>DEDICATED TO THE STORY.</span></footer></body></html>;
}
function LinkHome() { return <Link href="/" className="footer-brand">BEYOND THE WALLS</Link>; }
