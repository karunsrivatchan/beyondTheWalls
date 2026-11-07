import { titans } from "./archive";
const coreDetails = {
    founding: ["Eren Yeager · skeletal form", "Largest displayed form", 800],
    colossal: ["Bertholdt Hoover / Armin Arlert", "60 m", 500],
    armored: ["Reiner Braun", "15 m", 260],
    female: ["Annie Leonhart", "14 m", 250],
    beast: ["Zeke Yeager", "17 m", 285],
    attack: ["Eren Yeager", "15 m", 260],
    jaw: ["Galliard form", "5 m", 160],
    cart: ["Pieck Finger", "4 m", 145],
    "war-hammer": ["Lara Tybur", "15 m", 260],
};
const coreForms = titans.map(item => ({
    ...item, image: item.id === "founding" ? "/media/titans/founding-detailed.webp" : item.id === "attack" ? "/media/titans/attack-game.webp" : `/media/titans/${item.id}-sticker.webp`,
    reconstructed: item.id === "founding",
    form: coreDetails[item.id][0], type: "Shifter",
    sizeLabel: coreDetails[item.id][1], displayHeight: coreDetails[item.id][2],
}));
// Full-body artwork only; similar Colossal and Galliard depictions are grouped.
// Head-only, incomplete and visually repetitive illustrations are omitted.
const additionalForms = [
    ["rod-reiss", "Rod Reiss", "Crawling Titan", "Abnormal", "Enormous crawling form", 470, 3, "An exceptional transformation creates a vast, crawling Titan whose heat and bulk threaten Orvud District.", true],
    ["ymir-founder", "The First Titan", "Ymir Fritz", "Shifter", "Original Founder", 430, 4, "Ymir Fritz is the first person to possess Titan power. Her original form precedes the division into the Nine Titans."],
    ["ymir-jaw", "Jaw Titan", "Ymir", "Shifter", "5 m", 160, 2, "Ymir's small, agile form has sharp claws and teeth without the prominent facial armor of later Jaw Titans."],
    ["falco-jaw", "Jaw Titan", "Falco Grice · first form", "Shifter", "Avian Jaw form", 190, 4, "Falco's first Jaw transformation has birdlike traits associated with the Beast Titan spinal fluid he ingested."],
    ["falco-flying", "Flying Jaw Titan", "Falco Grice", "Shifter", "Winged form", 300, 4, "Falco develops a winged Jaw form that carries the alliance through the skies during the final battle.", true],
    ["ksaver-beast", "Beast Titan", "Tom Ksaver · ram form", "Shifter", "Ram-like form", 280, 4, "Ksaver's Beast Titan takes the form of a bipedal ram, illustrating how different holders can produce different animals."],
    ["falco-pure", "Falco's Pure Titan", "Before inheriting the Jaw Titan", "Pure Titan", "Long-necked form", 285, 4, "Falco's first transformation creates a spindly Titan with a strikingly long neck, before he inherits the Jaw."],
    ["comrade-d", "Comrade D", "Restorationist Titan", "Pure Titan", "3–4 m class", 130, 3, "A fellow Eldian Restorationist is transformed on the Paradis coast. The name is an alias used for this distinctive Titan."],
    ["crawling", "Crawling Titan", "The journey to the sea", "Abnormal", "Stunted limbs", 125, 3, "The Scouts pass a slow, crawling Titan on their journey to the coast. Eren recognizes it as another victim of exile.", true],
];
export const titanCatalogue = [
    ...coreForms,
    ...additionalForms.map(([id, name, form, type, sizeLabel, displayHeight, reveal, intro, wide]) => ({
        id, name, form, type, sizeLabel, displayHeight, reveal, intro, wide,
        category: type, reconstructed: true, image: `/media/titans/${id}-sticker.webp`,
        physical: sizeLabel.includes(" m") ? sizeLabel : "A precise height is not specified here. Display scale is adapted for the gallery.",
        abilities: type === "Shifter" ? "Retains the abilities of its inherited Titan power, with features that vary by holder and form." : "Titan strength and regeneration. Behavior and body proportions distinguish this form.",
        limitations: type === "Shifter" ? "Transformation and recovery depend on the holder's condition and available stamina." : "The nape remains vulnerable. Pure Titans generally act without human-level control.",
    })),
];
