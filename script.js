document.addEventListener("DOMContentLoaded", () => {

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