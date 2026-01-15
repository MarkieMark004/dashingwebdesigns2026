(() => {
  const content = document.getElementById("content");
  const navLinks = document.querySelectorAll("[data-page]");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const pages = new Set(["home", "portfolio", "about", "contact"]);
  let isInternalNav = false;

  const setActiveNav = (page) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.page === page);
    });
  };

  const getPageFromHash = () => {
    const hash = window.location.hash.replace("#/", "");
    return pages.has(hash) ? hash : "home";
  };

  const updateHash = (page) => {
    isInternalNav = true;
    window.location.hash = `/${page}`;
  };

  const initTypewriter = (page) => {
    if (page !== "home") {
      return;
    }
    const key = "dwd_headline_typed";
    if (sessionStorage.getItem(key)) {
      document.documentElement.classList.add("no-typewriter");
    } else {
      sessionStorage.setItem(key, "1");
    }
  };

  const initPortfolioCarousel = () => {
    const wrap = document.querySelector(".portfolio-embed-wrap");
    const frame = wrap ? wrap.querySelector("iframe") : null;
    const title = document.querySelector(".portfolio-title");
    const arrowNext = document.querySelector(
      ".portfolio-arrow-row .portfolio-arrow:not(.portfolio-arrow-left)"
    );
    const arrowPrev = document.querySelector(
      ".portfolio-arrow-row .portfolio-arrow-left"
    );

    if (!wrap || !frame || !arrowNext || !arrowPrev) {
      return;
    }

    const projects = [
      {
        title: "Etta - Personal Dashboard",
        url: "https://etta.dashingwebdesigns.com/",
      },
      {
        title: "Breaking Limits NZ",
        url: "https://breakinglimitsnz.com/",
      },
      {
        title: "Enbeat Dance Academy",
        url: "https://enbeatdanceacademy.com/us/",
      },
    ];

    let index = 0;

    const syncArrows = () => {
      if (index === 0) {
        arrowPrev.classList.add("is-hidden");
      } else {
        arrowPrev.classList.remove("is-hidden");
      }
    };

    const goTo = (direction) => {
      if (wrap.classList.contains("is-exiting")) {
        return;
      }

      wrap.classList.add("is-exiting");
      arrowNext.disabled = true;
      arrowPrev.disabled = true;

      window.setTimeout(() => {
        if (direction === "prev") {
          index = (index - 1 + projects.length) % projects.length;
        } else {
          index = (index + 1) % projects.length;
        }
        const project = projects[index];
        frame.src = project.url;
        frame.title = project.title;
        if (title) {
          title.textContent = project.title;
        }

        syncArrows();
        wrap.classList.remove("is-exiting");
        wrap.classList.add("is-entering");

        requestAnimationFrame(() => {
          wrap.classList.remove("is-entering");
        });

        window.setTimeout(() => {
          arrowNext.disabled = false;
          arrowPrev.disabled = false;
        }, 320);
      }, 300);
    };

    syncArrows();
    arrowNext.addEventListener("click", () => goTo("next"));
    arrowPrev.addEventListener("click", () => goTo("prev"));
  };

  const initPage = (page) => {
    initTypewriter(page);
    if (page === "portfolio") {
      initPortfolioCarousel();
    }
  };

  const loadPage = async (page) => {
    if (!content) {
      return;
    }
    const response = await fetch(`pages/${page}.html`, { cache: "no-cache" });
    if (!response.ok) {
      content.innerHTML = "<p>Page not found.</p>";
      return;
    }
    content.innerHTML = await response.text();
    setActiveNav(page);
    initPage(page);
  };

  const runPageTransition = async (page) => {
    document.body.classList.remove("is-page-entering", "is-page-exiting");
    document.body.classList.add("is-page-exiting");
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    document.body.classList.remove("is-page-exiting");
    document.body.classList.add("is-loading");
    await loadPage(page);
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-page-entering");
    window.setTimeout(() => {
      document.body.classList.remove("is-page-entering");
    }, 700);
    updateHash(page);
  };

  const navigateTo = (page, trigger) => {
    if (trigger && trigger.classList.contains("cta")) {
      runPageTransition(page);
      return;
    }

    runPageTransition(page);
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-page]");
    if (!link) {
      return;
    }
    event.preventDefault();
    const page = link.dataset.page;
    navigateTo(page, link);
    if (mobileNav && mobileNav.classList.contains("is-open")) {
      mobileNav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  window.addEventListener("hashchange", () => {
    if (isInternalNav) {
      isInternalNav = false;
      return;
    }
    runPageTransition(getPageFromHash());
  });

  loadPage(getPageFromHash());
})();
