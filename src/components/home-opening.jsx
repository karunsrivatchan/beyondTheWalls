"use client";

import { useState } from "react";
import { CinematicHero } from "@/components/cinematic-hero";
import { PageOpening } from "@/components/page-opening";

export function HomeOpening({ children }) {
    const [heroReady, setHeroReady] = useState(false);

    return <PageOpening pending={!heroReady}>
        <CinematicHero onSettled={setHeroReady}/>
        {children}
    </PageOpening>;
}
