import "./style.css";

// Elements setup

/**
 * Top bar with the logo, links, call to action etc.
 */
const navbar = document.getElementById("navbar") ?? null;

/**
 * Sidebar that opens when you click the hamburger menu
 */
const slideover = document.getElementById("slideover") ?? null;

/**
 * Button that opens the slideover; inside of the navbar
 */
const openBtn = document.getElementById("slideoverOpenBtn") ?? null;

/**
 * Button that closes the slideover; inside of the slideover itself
 */
const closeBtn = document.getElementById("slideoverCloseBtn") ?? null;

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
openBtn?.addEventListener("click", () => openSlideover());
closeBtn?.addEventListener("click", () => closeSlideover());

function openSlideover() {
  slideover.classList.add("open");
  console.log("Opened");
}
function closeSlideover() {
  slideover.classList.remove("open");
  console.log("Closed");
}
