// backend/src/services/coverImages.js

const COVER_IMAGES = {
    agua: [
        "https://meu-cdn.com/img/pokemon-water-1.jpg",
        "https://meu-cdn.com/img/pokemon-water-2.jpg",
    ],
    fogo: [
        "https://meu-cdn.com/img/pokemon-fire-1.jpg",
    ],
    geral: [
        "https://meu-cdn.com/img/pokemon-generic-1.jpg",
        "https://meu-cdn.com/img/pokemon-generic-2.jpg",
    ],
};

export function pickCoverImage(topic, generation) {
    const text = `${topic || ""} ${generation || ""}`.toLowerCase();

    if (text.includes("água") || text.includes("agua")) {
        return randomFrom(COVER_IMAGES.agua);
    }

    if (text.includes("fogo")) {
        return randomFrom(COVER_IMAGES.fogo);
    }

    return randomFrom(COVER_IMAGES.geral);
}

function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
