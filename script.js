(() => {
  const key = "dwd_headline_typed";
  if (sessionStorage.getItem(key)) {
    document.documentElement.classList.add("no-typewriter");
  } else {
    sessionStorage.setItem(key, "1");
  }
})();

(() => {
  const ctas = document.querySelectorAll(".cta");
  if (!ctas.length) {
    return;
  }

  ctas.forEach((cta) => {
    cta.addEventListener("click", (event) => {
      event.preventDefault();

      const exitClass = cta.classList.contains("cta-left")
        ? "cta-exit-left"
        : "cta-exit";

      document.body.classList.add(exitClass);

      window.setTimeout(() => {
        window.location.href = cta.getAttribute("href");
      }, 260);
    });
  });
})();

(() => {
  const wrap = document.querySelector(".portfolio-embed-wrap");
  const frame = wrap ? wrap.querySelector("iframe") : null;
  const title = document.querySelector(".portfolio-title");
  const arrowNext = document.querySelector(
    ".portfolio-arrow:not(.portfolio-arrow-left)"
  );
  const arrowPrev = document.querySelector(".portfolio-arrow-left");

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
      url: "https://enbeatdanceacademy.com/",
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

  syncArrows();

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

  arrowNext.addEventListener("click", () => goTo("next"));
  arrowPrev.addEventListener("click", () => goTo("prev"));
})();
