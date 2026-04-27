(function () {
  const PAGE_WIDTH = 1920;
  const MOBILE_BREAKPOINT = 767;
  const FALLBACK_PAGE_HEIGHT = 18614;
  const DRAG_THRESHOLD = 5;
  const SCROLL_SPEED = 1.35;
  const AUTO_INTERVAL_MS = 2200;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateScale() {
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewport = document.querySelector(".page-viewport");
    const page = document.querySelector(".figma-page");

    if (viewportWidth <= MOBILE_BREAKPOINT) {
      document.documentElement.style.setProperty("--page-scale", "1");
      if (viewport) viewport.style.height = "auto";
      return;
    }

    const scale = Math.min(1, viewportWidth / PAGE_WIDTH);
    document.documentElement.style.setProperty("--page-scale", String(scale));
    const pageHeight = page ? page.scrollHeight : FALLBACK_PAGE_HEIGHT;
    if (viewport) viewport.style.height = `${pageHeight * scale}px`;
  }

  function getStepPx(el) {
    const item = el.children[0];
    if (!item) return 0;
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.gap || styles.columnGap || 0);
    return item.offsetWidth + gap;
  }

  function initCarousel(el) {
    const originalChildren = Array.from(el.children);
    if (originalChildren.length === 0) return;

    originalChildren.forEach((child) => {
      const clone = child.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.clone = "true";
      el.appendChild(clone);
    });

    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let moved = 0;
    let isPaused = false;

    function maybeReset() {
      const half = el.scrollWidth / 2;
      if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
    }

    el.addEventListener("mousedown", (event) => {
      isDown = true;
      moved = 0;
      startX = event.pageX - el.offsetLeft;
      scrollLeftStart = el.scrollLeft;
      el.classList.add("is-dragging");
    });

    window.addEventListener("mouseup", () => {
      isDown = false;
      el.classList.remove("is-dragging");
    });

    el.addEventListener("mouseleave", () => {
      isDown = false;
      isPaused = false;
      el.classList.remove("is-dragging");
    });

    el.addEventListener("mousemove", (event) => {
      if (!isDown) return;
      event.preventDefault();
      const x = event.pageX - el.offsetLeft;
      const walk = (x - startX) * SCROLL_SPEED;
      moved = Math.abs(walk);
      el.scrollLeft = scrollLeftStart - walk;
    });

    el.addEventListener(
      "click",
      (event) => {
        if (moved > DRAG_THRESHOLD) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true,
    );

    el.addEventListener("mouseenter", () => {
      isPaused = true;
    });
    el.addEventListener("mouseleave", () => {
      isPaused = false;
    });
    el.addEventListener("touchstart", () => {
      isPaused = true;
    }, { passive: true });
    el.addEventListener("touchend", () => {
      isPaused = false;
    });
    el.addEventListener("scroll", maybeReset, { passive: true });

    if (!reducedMotion) {
      setInterval(() => {
        if (isDown || isPaused) return;
        const step = getStepPx(el);
        if (step > 0) el.scrollBy({ left: step, behavior: "smooth" });
      }, AUTO_INTERVAL_MS);
    }
  }

  updateScale();
  window.addEventListener("resize", updateScale);
  window.addEventListener("load", updateScale);
  const page = document.querySelector(".figma-page");
  if (page && "ResizeObserver" in window) {
    new ResizeObserver(updateScale).observe(page);
  }
  document.querySelectorAll(".js-drag-scroll").forEach(initCarousel);
})();
