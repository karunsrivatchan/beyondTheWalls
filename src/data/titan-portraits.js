// Upper-body crop windows preserve the face and end near the waist.
// Wide and crawling forms keep a wider crop to protect their unusual anatomy.
const portraitSizes = {
    armored: [894, 894], attack: [1200, 1200], beast: [433, 1100],
    cart: [699, 768], colossal: [1920, 1080], female: [442, 1392],
    founding: [1201, 613], jaw: [558, 563], "war-hammer": [494, 955],
    "rod-reiss": [1400, 913], "ymir-founder": [522, 1100],
    "ymir-jaw": [1349, 1020], "falco-jaw": [1208, 1100],
    "falco-flying": [1400, 927], "ksaver-beast": [622, 1100],
    "falco-pure": [582, 1100], "comrade-d": [579, 1100], crawling: [1400, 917],
};
export function titanPortrait(id, galleryImage) {
    const [width, height] = portraitSizes[id] ?? [1000, 1000];
    const crop = { female: .38, beast: .5, "war-hammer": .5, "ymir-founder": .48, "comrade-d": .5, "falco-pure": .6, "ksaver-beast": .55, armored: .72, attack: .66, founding: 1, colossal: 1, crawling: .9, "rod-reiss": .95, cart: .92, "falco-flying": .92 }[id] ?? .85;
    return {
        src: id === "colossal" ? "/media/colossal-close.jpg" : id === "founding" ? "/media/titans/founding-portrait.webp" : id === "female" ? "/media/titans/female-original.png" : galleryImage,
        width, height, crop,
        scenic: id === "colossal" || id === "founding",
    };
}
