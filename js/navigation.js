export function initNavigation() {
  const nav = document.querySelector(".navigation");
  const toggle = document.querySelector(".navigation__toggle");
  const list = document.querySelector(".navigation__list");
  const links = document.querySelectorAll(".navigation__link");

  let lastScrollY = window.scrollY;
  const threshold = 10;

  function closeMenu() {
    list.classList.remove("nav-open");
    toggle.classList.remove("nav-open");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    list.classList.toggle("nav-open");
    toggle.classList.toggle("nav-open");

    document.body.style.overflow = list.classList.contains("nav-open")
      ? "hidden"
      : "";
  });

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("scroll", () => {
    if (list.classList.contains("nav-open")) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY < 50) {
      nav.classList.remove("navigation--hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY - lastScrollY > threshold) {
      nav.classList.add("navigation--hidden");
    } else if (lastScrollY - currentScrollY > threshold) {
      nav.classList.remove("navigation--hidden");
    }

    lastScrollY = currentScrollY;
  });
}
