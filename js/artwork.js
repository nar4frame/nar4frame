// ==================================================
// ARTWORK PAGE
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const artworkId = params.get("id");

    const currentArtwork = artworks.find(item => item.id === artworkId);

    
    if (!currentArtwork) {
        console.warn("Artwork tidak ditemukan");
        return;
    }

    // ==================================================
// SEO
// ==================================================

document.title = `${currentArtwork.title} | nar4frame`;

const absoluteImage = new URL(
    currentArtwork.image,
    window.location.origin
).href;

// Meta Description
document.querySelector('meta[name="description"]')
    ?.setAttribute("content", currentArtwork.story);

// Canonical
document.querySelector('link[rel="canonical"]')
    ?.setAttribute("href", window.location.href);

// Open Graph
document.querySelector('meta[property="og:title"]')
    ?.setAttribute("content", currentArtwork.title);

document.querySelector('meta[property="og:description"]')
    ?.setAttribute("content", currentArtwork.story);

document.querySelector('meta[property="og:image"]')
    ?.setAttribute("content", absoluteImage);

document.querySelector('meta[property="og:url"]')
    ?.setAttribute("content", window.location.href);

// Twitter / X
document.querySelector('meta[name="twitter:title"]')
    ?.setAttribute("content", currentArtwork.title);

document.querySelector('meta[name="twitter:description"]')
    ?.setAttribute("content", currentArtwork.story);

document.querySelector('meta[name="twitter:image"]')
    ?.setAttribute("content", absoluteImage);



    // ==================================================
// HERO
// ==================================================

document.getElementById("artwork-image").src = currentArtwork.image;
document.getElementById("artwork-image").alt = currentArtwork.title;

document.getElementById("artwork-category").textContent =
    currentArtwork.category.toUpperCase();

document.getElementById("artwork-title").textContent =
    currentArtwork.title;

document.getElementById("artwork-location").textContent =
    currentArtwork.location || "-";

document.getElementById("artwork-published").textContent =
    currentArtwork.published || "-";

document.getElementById("artwork-story").textContent =
    currentArtwork.story || "";


    // =====================================
// UNIQUE VIEW COUNTER
// =====================================

const storageKey = `nar4_view_${artworkId}`;

console.log("Storage Key:", storageKey);
console.log("Stored:", localStorage.getItem(storageKey));

const updateViewDisplay = () => {

    fetch(`https://nar4frame-analytics.nar4frame.workers.dev/view/${artworkId}`)

        .then(response => response.json())

        .then(data => {

            const viewElement = document.getElementById("artwork-views");

            if (!viewElement) return;

            const label = data.views === 1 ? "View" : "Views";

            viewElement.textContent = `${data.views} ${label}`;

        })

        .catch(error => {

            console.error("View Counter Error:", error);

        });

};

if (!localStorage.getItem(storageKey)) {

    fetch(`https://nar4frame-analytics.nar4frame.workers.dev/view/${artworkId}`, {

        method: "POST"

    })

    .then(() => {

        localStorage.setItem(storageKey, "true");

        updateViewDisplay();

    })

    .catch(error => {

        console.error("View Counter Error:", error);

    });

} else {

    updateViewDisplay();

}


// =====================================
// LIKE COUNTER
// =====================================

const likeStorageKey = `nar4_like_${artworkId}`;

const updateLikeDisplay = () => {

    fetch(`https://nar4frame-analytics.nar4frame.workers.dev/like/${artworkId}`)

        .then(response => response.json())

        .then(data => {

            const likeElement = document.getElementById("artwork-likes");

            if (!likeElement) return;

            const label = data.likes === 1 ? "Like" : "Likes";

            likeElement.textContent = `${data.likes} ${label}`;

        })

        .catch(error => {

            console.error("Like Counter Error:", error);

        });

};

const likeButton = document.getElementById("like-button");

if (likeButton) {

    updateLikeDisplay();

    likeButton.addEventListener("click", () => {

        if (localStorage.getItem(likeStorageKey)) return;

        fetch(`https://nar4frame-analytics.nar4frame.workers.dev/like/${artworkId}`, {

            method: "POST"

        })

        .then(response => {

            if (!response.ok) {

                throw new Error("Failed to save Like");

            }

            return response.json();

        })

        .then(() => {

            localStorage.setItem(likeStorageKey, "true");

            updateLikeDisplay();

        })

        .catch(error => {

            console.error("Like Counter Error:", error);

        });

    });

}


// ==================================================
// RELATED WORKS
// ==================================================

const relatedGallery = document.getElementById("related-gallery");

if (relatedGallery) {

    relatedGallery.innerHTML = "";

    const relatedWorks = artworks.filter(item =>
        item.category === currentArtwork.category &&
        item.id !== currentArtwork.id
    );

    relatedWorks.slice(0, 3).forEach(item => {

        relatedGallery.innerHTML += `
            <a href="artwork.html?id=${item.id}" class="gallery-item">

                <img src="${item.image}" alt="${item.title}">

                <h3>${item.title}</h3>

            </a>
        `;

    });

}


    // ==================================================
// PREVIOUS & NEXT
// ==================================================

const categoryArtworks = artworks.filter(item =>
    item.category === currentArtwork.category
);

const currentIndex = categoryArtworks.findIndex(item =>
    item.id === currentArtwork.id
);

const previousButton = document.getElementById("previous-artwork");
const nextButton = document.getElementById("next-artwork");

// Previous
if (currentIndex > 0) {

    previousButton.href =
        `artwork.html?id=${categoryArtworks[currentIndex - 1].id}`;

} else {

    previousButton.remove();

}

// Next
if (currentIndex < categoryArtworks.length - 1) {

    nextButton.href =
        `artwork.html?id=${categoryArtworks[currentIndex + 1].id}`;

} else {

    nextButton.remove();

}

});
