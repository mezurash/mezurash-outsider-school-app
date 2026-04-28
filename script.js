(function () {
  const PAGE_WIDTH = 1920;
  const MOBILE_BREAKPOINT = 1080;
  const FALLBACK_PAGE_HEIGHT = 18614;
  const DRAG_THRESHOLD = 5;
  const SCROLL_SPEED = 1.35;
  const AUTO_INTERVAL_MS = 2200;
  const REVEAL_STAGGER_MS = 180;
  const REVEAL_STAGGER_MAX_MS = 960;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function updateScale() {
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewport = document.querySelector(".page-viewport");
    const page = document.querySelector(".figma-page");

    if (viewportWidth <= MOBILE_BREAKPOINT) {
      document.documentElement.style.setProperty("--page-scale", "1");
      if (viewport) {
        viewport.style.height = "auto";
        viewport.style.minHeight = "";
      }
      return;
    }

    const scale = Math.min(1, viewportWidth / PAGE_WIDTH);
    document.documentElement.style.setProperty("--page-scale", String(scale));
    const pageHeight = page ? page.scrollHeight : FALLBACK_PAGE_HEIGHT;
    if (viewport) {
      viewport.style.height = `${pageHeight * scale}px`;
      viewport.style.minHeight = `${pageHeight * scale}px`;
    }
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

  function initRevealAnimations() {
    const selectors = [
      ".site-header",
      ".slice > :not(script)",
      ".section-heading > *",
      ".slice-hero__copy > *",
      ".slice-hero__visual > img",
      ".slice-about__body > *",
      ".metric-card > *",
      ".logo-strip > *",
      ".logo-strip div > img",
      ".slice-structure__head > *",
      ".structure-cards > article",
      ".structure-cards article > *",
      ".program-cover",
      ".program-cover__content > *",
      ".micro-proof > *",
      ".codigo-visual__copy > *",
      ".codigo-visual__stage > *",
      ".feature-card-row > article",
      ".feature-card-row article > *",
      ".chave-benefits__head > *",
      ".benefit-icons > article",
      ".benefit-icons article > *",
      ".time-grid > article",
      ".time-grid article > *",
      ".stats-row > article",
      ".stats-row article > *",
      ".proof__headline > *",
      ".chips > *",
      ".proof__bar > *",
      ".proof-carousel",
      ".proof-testimonial > *",
      ".proof-testimonial blockquote > *",
      ".quote > *",
      ".depo-header > *",
      ".testimonial-quote > *",
      ".alumni > h2",
      ".alumni-row",
      ".video-final__text > *",
      ".video-final__text > div > *",
      ".video-card",
      ".dots > *",
    ];
    const nodes = Array.from(new Set(document.querySelectorAll(selectors.join(","))));

    nodes.forEach((node) => {
      node.classList.add("reveal-fade-up");
    });

    const siblingIndexes = new WeakMap();
    nodes.forEach((node) => {
      const parent = node.parentElement;
      const currentIndex = siblingIndexes.get(parent) || 0;
      const delay = Math.min(currentIndex * REVEAL_STAGGER_MS, REVEAL_STAGGER_MAX_MS);
      node.style.setProperty("--reveal-delay", `${delay}ms`);
      siblingIndexes.set(parent, currentIndex + 1);
    });

    const openingNodes = Array.from(
      new Set(document.querySelectorAll([
        ".site-header",
        ".slice-hero",
        ".slice-hero__copy",
        ".slice-hero__copy > *",
        ".slice-hero__visual",
        ".slice-hero__visual > img",
      ].join(","))),
    );

    openingNodes.forEach((node) => {
      node.classList.remove("reveal-fade-up", "hero-reveal-bg");
      node.classList.add("is-revealed");
      node.style.removeProperty("--reveal-delay");
      node.style.removeProperty("--reveal-duration");
      node.style.removeProperty("--reveal-x");
      node.style.removeProperty("--reveal-y");
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px 18% 0px",
        threshold: 0.04,
      },
    );

    nodes
      .filter((node) => !openingNodes.includes(node))
      .forEach((node) => observer.observe(node));
  }

  function initSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  function initProgressBars() {
    const bars = Array.from(document.querySelectorAll(".progress"));
    if (bars.length === 0) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      bars.forEach((bar) => bar.classList.add("is-loaded"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-loaded");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.35,
      },
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  function initCustomCursor() {
    if (!finePointer) return;

    const cursor = document.createElement("div");
    cursor.className = "cursor-orb";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
    document.body.classList.add("has-custom-cursor");

    let hasPointer = false;

    function setInteractiveState(target) {
      const interactive = target.closest("a, button, [role='button'], .js-drag-scroll");
      const textTarget = !interactive && target.closest("input, textarea, select, [contenteditable='true'], p, h1, h2, h3, h4, h5, h6, blockquote, li");
      cursor.classList.toggle("is-interactive", Boolean(interactive));
      cursor.classList.toggle("is-text", Boolean(textTarget));
    }

    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      hasPointer = true;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("is-visible");
      setInteractiveState(event.target);
    });

    window.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") cursor.classList.add("is-dragging");
    });

    window.addEventListener("pointerup", () => {
      cursor.classList.remove("is-dragging");
    });

    window.addEventListener("pointercancel", () => {
      cursor.classList.remove("is-dragging");
    });

    window.addEventListener("blur", () => {
      cursor.classList.remove("is-dragging");
    });

    document.documentElement.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-visible", "is-interactive", "is-dragging");
    });

    document.documentElement.addEventListener("mouseenter", () => {
      if (hasPointer) cursor.classList.add("is-visible");
    });
  }

  updateScale();
  window.addEventListener("resize", updateScale);
  window.addEventListener("load", updateScale);
  const page = document.querySelector(".figma-page");
  if (page && "ResizeObserver" in window) {
    new ResizeObserver(updateScale).observe(page);
  }
  document.querySelectorAll(".js-drag-scroll").forEach(initCarousel);
  initSmoothAnchorScroll();
  initRevealAnimations();
  initProgressBars();
})();
