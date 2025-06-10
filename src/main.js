import "./style.css";
import navigation from "./navigation";

// Elements setup

/**
 * The document's body
 */
const body = document.querySelector("body");

/**
 * Wrapper containing everything other than the header with navigation itself
 */
const content = document.getElementById("content");
if (!content)
  throw new Error(
    "[navbar] No element with id of content found! Focus trap will not work.",
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

const skipNavigation = document.getElementById("skipNavigation");

/**
 * Breakpoint from where to start switch to and from mobile navigation properties
 */
const media = window.matchMedia("(width <= 640px)"); // tailwind:sm

// Hide navbar on scroll
let lastScrollPos = 0;
window.addEventListener("scroll", () => {
  let currScrollPos = window.scrollY;

  lastScrollPos < currScrollPos
    ? navbar.classList.add("collapsed")
    : navbar.classList.remove("collapsed");

  lastScrollPos = currScrollPos;
});
skipNavigation.addEventListener("click", closeSlideover);

// Open and close the slideover
openBtn.addEventListener("click", () => {
  openSlideover();
  updateState();
});
closeBtn.addEventListener("click", () => {
  closeSlideover();
  updateState();
});
backdrop.addEventListener("click", () => {
  closeSlideover();
  updateState();
});
navLinks.forEach((item) => {
  item.addEventListener("click", () => {
    closeSlideover();
    updateState();
  });
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSlideover();
    updateState();
  }
});
window.addEventListener("resize", updateState);

function openSlideover() {
  slideover.classList.add("open");
  backdrop.classList.add("shown");
  openBtn.setAttribute("aria-expanded", "true");
}
function closeSlideover() {
  slideover.classList.remove("open");
  backdrop.classList.remove("shown");
  openBtn.setAttribute("aria-expanded", "false");
}

// Update navigation based on breakpoint
function updateState() {
  const isMobile = media.matches;
  const isOpen = slideover.classList.contains("open");
  setNavStates({ isMobile, isOpen });

  if (isMobile) navbar.classList.remove("collapsed");
}

function setNavStates({ isMobile, isOpen }) {
  slideover.toggleAttribute("inert", !(isMobile && isOpen));
  backdrop.toggleAttribute("inert", !(isMobile && isOpen));
  content.toggleAttribute("inert", isMobile && isOpen);
  navbar.toggleAttribute("inert", isMobile && isOpen);

  if (isMobile && isOpen) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "";
  }
}
