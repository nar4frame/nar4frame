async function loadComponent(id, file) {

    const target = document.getElementById(id);

    if (!target) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`${file} not found`);
        }

        target.innerHTML = await response.text();

    } catch (error) {

        console.error(error);

        target.innerHTML = `
            <div style="
                color:red;
                padding:20px;
                text-align:center;">
                Failed to load ${file}
            </div>
        `;
    }

}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("header", "components/header.html");

    const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("header nav a").forEach(link => {

    if (link.getAttribute("href") === currentPage) {

        link.classList.add("active");

    }

});

    await loadComponent("footer", "components/footer.html");

});

