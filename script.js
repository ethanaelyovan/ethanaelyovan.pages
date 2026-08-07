document.addEventListener("DOMContentLoaded", () => {

    // ---- games / projects ----
    // Add or remove entries here to update the projects section — no HTML editing needed.
    const projects = [
        {
            img: "assets/projects/FloPipe.webp",
            alt: "FloPipe",
            name: "FloPipe",
            description: "Game artist for a GameJam of Gemastik, creating both the renders, graphic design, and in game 3d models and assets of the cozy sandbox-like block isometric puzzle game.",
            link: "flopipe.html"
        },
        {
            img: "assets/projects/CastOff.webp",
            alt: "Cast Off!",
            name: "Cast Off!",
            description: "Created designs, renders, visual concept art and packacking for a Set Collection and Resource Management Board Game",
            link: "castoff.html"
        }
    ];

    const projectsList = document.getElementById("projectsList");
    if (projectsList) {
        projectsList.innerHTML = projects.map(p => `
            <article class="project-card">
                <a class="project-card__thumb-link" href="${p.link}">
                    <img class="project-card__thumb" src="${p.img}" alt="${p.alt || ""}" loading="lazy">
                </a>
                <div class="project-card__body">
                    <h3 class="project-card__name">${p.name}</h3>
                    <p class="project-card__description">${p.description}</p>
                </div>
            </article>
        `).join("");
    }

    // Split text into per-character spans for the hover effect
    const wrapChars = (el) => {
        if (!el) return;
        const wrapped = Array.from(el.childNodes).map(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent
                    .split("")
                    .map(char => char === " " ? " " : `<span>${char}</span>`)
                    .join("");
            }
            // keep <br> and any other elements as-is
            return node.outerHTML || "";
        }).join("");
        el.innerHTML = wrapped;
    };

    wrapChars(document.querySelector(".quote__text"));
    document.querySelectorAll(".marquee__item").forEach(wrapChars);

    const galleryItems = document.querySelectorAll(".gallery__item");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImg");
    const closeButton = document.getElementById("lightboxClose");


    // Open lightbox
    galleryItems.forEach(item => {

        item.addEventListener("click", () => {

            const image = item.querySelector("img");

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.hidden = false;
            lightbox.classList.add("active");

        });

    });


    // Close button
    closeButton.addEventListener("click", () => {

        lightbox.classList.remove("active");
        lightbox.hidden = true;

    });


    // Click outside image closes
    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            lightbox.classList.remove("active");
            lightbox.hidden = true;

        }

    });


    // Escape closes
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            lightbox.classList.remove("active");
            lightbox.hidden = true;

        }

    });

});