document.addEventListener("DOMContentLoaded", () => {

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

    wrapChars(document.querySelector(".hero__tag"));
    wrapChars(document.querySelector(".hero__bio"));
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