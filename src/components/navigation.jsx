"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
const links = [["/", "Home"], ["/titans", "Titans"], ["/characters", "Characters"]];
export function Navigation() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButton = useRef(null);
    const closeMenu = () => setMenuOpen(false);
    return <header className="site-header" onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget))
                closeMenu();
        }} onKeyDown={event => {
            if (menuOpen && event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                menuButton.current?.focus();
            }
        }}>
    <Link href="/" className="wordmark" aria-label="Beyond the Walls home" onClick={closeMenu}>
      BEYOND<span>THE WALLS</span>
    </Link>
    <button ref={menuButton} type="button" className="site-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(open => !open)}>
      <span aria-hidden="true"><i /><i /><i /></span>
    </button>
    <nav id="site-navigation" aria-label="Main navigation" data-open={menuOpen}>
      {links.map(([href, title]) => (<Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={closeMenu}>
          {title}
        </Link>))}
    </nav>
  </header>;
}
