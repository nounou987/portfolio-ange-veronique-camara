const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const heroSection = document.querySelector(".hero-animate");
const heroFrame = document.querySelector(".hero-image-frame");

function closeMenu() {
  if (!mainNav || !navToggle) {
    return;
  }

  if (mainNav.classList.contains("open")) {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

navToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href")?.substring(1);
    const targetElement = targetId ? document.getElementById(targetId) : null;

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    threshold: 0.35,
    rootMargin: "-15% 0px -45% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

function updateHeroParallax(clientX, clientY) {
  if (!heroFrame || window.innerWidth <= 1080) {
    return;
  }

  const bounds = heroFrame.getBoundingClientRect();
  const x = (clientX - bounds.left) / bounds.width - 0.5;
  const y = (clientY - bounds.top) / bounds.height - 0.5;
  const rotateY = x * 12;
  const rotateX = y * -8;

  heroFrame.style.transform = `perspective(1400px) rotateY(${rotateY - 8}deg) rotateX(${rotateX + 2}deg) translateY(${window.scrollY * -0.015}px)`;
}

heroSection?.classList.add("hero-visible");

heroSection?.addEventListener("mousemove", (event) => {
  updateHeroParallax(event.clientX, event.clientY);
});

heroSection?.addEventListener("mouseleave", () => {
  if (!heroFrame) {
    return;
  }

  heroFrame.style.transform = window.innerWidth > 1080
    ? "perspective(1400px) rotateY(-8deg) rotateX(2deg)"
    : "none";
});

window.addEventListener(
  "scroll",
  () => {
    if (!heroFrame || window.innerWidth <= 1080) {
      return;
    }

    heroFrame.style.transform = `perspective(1400px) rotateY(-8deg) rotateX(2deg) translateY(${window.scrollY * -0.03}px)`;
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 780) {
    closeMenu();
  }

  if (!heroFrame) {
    return;
  }

  heroFrame.style.transform = window.innerWidth > 1080
    ? "perspective(1400px) rotateY(-8deg) rotateX(2deg)"
    : "none";
});
