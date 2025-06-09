import "./style.css";
import navigation from "./navigation";

// Elements setup

/**
 * Wrapper containing everything other than the header with navigation itself
 */
const page = document.getElementById("page");
if (!page)
  throw new Error(
    "[navbar] No element with id of page found! Focus trap will not work.",
  );

/**
 * Top bar with the logo, links, call to action etc.
 */
const navbar = document.getElementById("navbar");
if (!navbar) throw new Error("[navbar] No element with id of navbar found!");

/**
 * Clickable links inside of the entire navigation
 */
const navLinks = document.querySelectorAll("#slideover li");
if (!navLinks.length)
  throw new Error("[navbar] No navLinks found. Is your configuration correct?");

/**
 * Sidebar that opens when you click the hamburger menu
 */
const slideover = document.getElementById("slideover");
if (!slideover)
  throw new Error("[navbar] No element with id of slideover found!");

/**
 * Element that goes in-between the navbar and slideover, provides visual seperation and click-away to close functionality
 */
const backdrop = document.getElementById("backdrop");
if (!backdrop)
  throw new Error("[navbar] No element with id of backdrop found!");

/**
 * Button that opens the slideover; inside of the navbar
 */
const openBtn = document.getElementById("slideoverOpenBtn");
if (!openBtn)
  throw new Error("[navbar] No element with id of slideoverOpenBtn found!");

/**
 * Button that closes the slideover; inside of the slideover itself
 */
const closeBtn = document.getElementById("slideoverCloseBtn");
if (!closeBtn)
  throw new Error("[navbar] No element with id of slideoverCloseBtn found!");

/**
 * Breakpoint from where to start switch to and from mobile navigation properties
 */
const media = window.matchMedia("(width <= 640px)"); // tailwind:sm

// Hide navbar on scroll
let lastScrollPos = 0;
window.addEventListener("scroll", () => {
  let currScrollPos = window.scrollY;

  lastScrollPos < currScrollPos
    ? navbar?.classList.add("collapsed")
    : navbar?.classList.remove("collapsed");

  lastScrollPos = currScrollPos;
});

// Open and close the slideover
openBtn.addEventListener("click", () => openSlideover());
closeBtn.addEventListener("click", () => closeSlideover());
backdrop.addEventListener("click", () => closeSlideover());
navLinks.forEach((item) => {
  item.addEventListener("click", () => closeSlideover());
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSlideover();
});

function openSlideover() {
  slideover.classList.add("open");
  slideover.removeAttribute("inert");

  backdrop.classList.add("shown");
  backdrop.removeAttribute("inert");

  page.setAttribute("inert", "true");
  navbar.setAttribute("inert", "true");
}
function closeSlideover() {
  slideover.classList.remove("open");
  slideover.setAttribute("inert", "true");

  backdrop.classList.remove("shown");
  backdrop.setAttribute("inert", "true");

  page.removeAttribute("inert");
  navbar.removeAttribute("inert");
}

// Update navigation based on breakpoint
window?.addEventListener("resize", () => updateState());

function updateState() {
  const isMobile = media?.matches ?? false;
  const isOpen = slideover?.classList.contains("open") ?? false;

  if (isMobile) {
    if (isOpen) {
      slideover?.removeAttribute("inert");
      backdrop?.removeAttribute("inert");
      page?.setAttribute("inert", "true");
    }
  } else {
    if (isOpen) {
      slideover?.setAttribute("inert", "true");
      backdrop?.setAttribute("inert", "true");
      page?.removeAttribute("inert");
    }
  }
}
