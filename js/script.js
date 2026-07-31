console.log("nar4frame loaded");

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ACTIVE NAVIGATION
    // ==================================================

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll("header nav a");

    navLinks.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }

    });

    // ==================================================
    // GALLERY
    // ==================================================

    const filterButtons = document.querySelectorAll(".filter-menu button");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const loadMoreBtn = document.querySelector("#load-more .btn");

    if (galleryItems.length) {

        const itemsPerPage = 6;

        let currentCategory = "all";
        let visibleItems = itemsPerPage;

        function updateGallery() {

            let visibleCount = 0;

            galleryItems.forEach(item => {

                const match =
                    currentCategory === "all" ||
                    item.classList.contains(currentCategory);

                if (match && visibleCount < visibleItems) {

                    item.style.display = "";

                    visibleCount++;

                } else {

                    item.style.display = "none";

                }

            });

            if (loadMoreBtn) {

                const totalVisible = [...galleryItems].filter(item =>
                    currentCategory === "all" ||
                    item.classList.contains(currentCategory)
                ).length;

                loadMoreBtn.style.display =
                    visibleItems >= totalVisible ? "none" : "";

            }

        }

        // FILTER

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                filterButtons.forEach(btn =>
                    btn.classList.remove("active")
                );

                button.classList.add("active");

                currentCategory = button.textContent.trim().toLowerCase();

                visibleItems = itemsPerPage;

                updateGallery();

            });

        });

        // LOAD MORE

        if (loadMoreBtn) {

            loadMoreBtn.addEventListener("click", () => {

                visibleItems += itemsPerPage;

                updateGallery();

            });

        }

        updateGallery();

    }

});

