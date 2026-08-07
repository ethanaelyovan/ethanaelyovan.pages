/**
 * Reusable auto-scrolling, user-controllable image carousel.
 * Usage:
 *   <section class="card-carousel" id="myCarousel">
 *     <button class="card-carousel__nav card-carousel__nav--prev" aria-label="Previous">&larr;</button>
 *     <div class="card-carousel__viewport">
 *       <div class="card-carousel__track"></div>
 *     </div>
 *     <button class="card-carousel__nav card-carousel__nav--next" aria-label="Next">&rarr;</button>
 *   </section>
 *
 *   <script src="carousel.js"></script>
 *   <script>
 *     initCardCarousel('#myCarousel', [
 *       'assets/.../card-01.webp',
 *       'assets/.../card-02.webp'
 *     ]);
 *   </script>
 */
function initCardCarousel(containerSelector, images, options = {}) {
    const container = document.querySelector(containerSelector);
    if (!container || !images || !images.length) return;

    const track = container.querySelector(".card-carousel__track");
    if (!track) return;

    const speed = options.speed || 0.035; // px per ms — how fast it auto-scrolls
    const resumeDelay = options.resumeDelay || 1400; // ms of inactivity before auto-scroll resumes
    const step = options.step || 260; // px moved per arrow-button click

    // Duplicate the list so the loop can wrap seamlessly
    const doubled = images.concat(images);
    track.innerHTML = doubled
        .map(src => `<img class="card-carousel__item" src="${src}" alt="" loading="lazy" draggable="false">`)
        .join("");

    let offset = 0;
    let dragging = false;
    let paused = false;
    let startX = 0;
    let startOffset = 0;
    let lastTime = null;
    let resumeTimeout = null;

    const loopWidth = () => track.scrollWidth / 2;

    const setTransform = () => {
        track.style.transform = `translateX(${-offset}px)`;
    };

    const wrap = (value) => {
        const lw = loopWidth();
        if (!lw) return value;
        return ((value % lw) + lw) % lw;
    };

    const scheduleResume = () => {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => { paused = false; }, resumeDelay);
    };

    const tick = (time) => {
        if (lastTime === null) lastTime = time;
        const dt = time - lastTime;
        lastTime = time;

        if (!dragging && !paused) {
            offset = wrap(offset + speed * dt);
            setTransform();
        }

        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // ---- drag / swipe ----
    track.addEventListener("pointerdown", (e) => {
        dragging = true;
        paused = true;
        startX = e.clientX;
        startOffset = offset;
        clearTimeout(resumeTimeout);
        track.setPointerCapture(e.pointerId);
    });

    track.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        offset = wrap(startOffset - (e.clientX - startX));
        setTransform();
    });

    const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        scheduleResume();
    };

    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("pointerleave", endDrag);

    // ---- pause on hover (mouse only, not touch) ----
    container.addEventListener("mouseenter", () => { paused = true; });
    container.addEventListener("mouseleave", () => {
        if (!dragging) scheduleResume();
    });

    // ---- prev / next buttons ----
    const nudge = (dir) => {
        paused = true;
        offset = wrap(offset + dir * step);
        setTransform();
        scheduleResume();
    };

    const prevBtn = container.querySelector(".card-carousel__nav--prev");
    const nextBtn = container.querySelector(".card-carousel__nav--next");
    if (prevBtn) prevBtn.addEventListener("click", () => nudge(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => nudge(1));
}