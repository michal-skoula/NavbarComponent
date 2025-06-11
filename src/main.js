import "./style.css";

/**
 * ------------------
 *   Elements setup
 * ------------------
 */

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
const navBreakpoint = getComputedStyle(document.documentElement)
  .getPropertyValue("--breakpoint-nav")
  .trim();
const media = window.matchMedia(`(width <= ${navBreakpoint})`);

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

/**
 * -------------------
 *   Slideover logic
 * -------------------
 */

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

// Waits for transition to finish, then focus button to change state
slideover.addEventListener("transitionend", () => {
  slideover.classList.contains("open") ? closeBtn.focus() : openBtn.focus();
});

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

  isMobile && isOpen
    ? (body.style.overflow = "hidden")
    : (body.style.overflow = "");
}

/**
 * ------------------
 *   Dropdown logic
 * ------------------
 */

/** @type HTMLElement[] */
const dropdowns = document.querySelectorAll("li[nav-submenu]");

// Closes previously open dropdown before opening the current one
function closeAllDropdowns() {
  dropdowns.forEach((d) => {
    d.classList.remove("open");
    //TODO: remove aria-open attribute
  });
}

// Closes dropdown automatically when clicking elsewhere
document.addEventListener("click", (e) => {
  dropdowns.forEach((d) => {
    if (d === e.target || d.contains(e.target)) return;
    closeAllDropdowns();
  });
});

// Listen for focus changes on the whole document
// document.addEventListener("focusin", (e) => {
//   console.log(e.target);
//   dropdowns.forEach((d) => {
//     if (!(d === e.target || d.contains(e.target))) {
//       console.log("out");
//     }
//     return;
//   });
//   // dropdowns.forEach((d) => {
//   //   // If the newly focused element is NOT the dropdown or a child, close it
//   //   if (!(d === e.target || d.contains(e.target))) {
//   //     d.classList.remove("open");
//   //   }
//   // });
// });

// Dropdown setup and logic
dropdowns.forEach((d) => {
  /** @type HTMLElement */
  const dButton = d.querySelector("& > button");

  /** @type HTMLElement */
  const dList = d.querySelector("& > ul");

  /** @type HTMLElement[] */
  const items = dList.querySelectorAll("& > li > a");

  // Set IDs for keyboard navigation
  let counter = 1;
  items.forEach((item) => {
    item.setAttribute("nav-child-id", counter);
    counter++;
  });
  counter = undefined;

  // Event listeners
  d.addEventListener("mouseenter", () => {
    d.classList.add("hover");
  });
  d.addEventListener("mouseleave", () => {
    d.classList.remove("hover");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      closeDropdown();
    });
  });

  dButton.addEventListener("click", () => {
    d.classList.contains("open") ? closeDropdown() : openDropdown();
  });

  // Handle key inputs
  dButton.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      d.classList.contains("open") ? closeDropdown() : openDropdown();
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  });

  dList.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

  function openDropdown() {
    closeAllDropdowns();
    d.classList.add("open");
    dList.setAttribute("aria-expanded", "true");
    setTimeout(() => items[0].focus(), 50);

    dList.addEventListener("transitionend", () => {});
    console.log("o");
  }
  function closeDropdown() {
    closeAllDropdowns();
    d.classList.remove("open");
    d.classList.remove("hover");
    dList.setAttribute("aria-expanded", "false");

    dButton.focus();
    console.log("c");
  }
});

// Right now im thinking .hovered, .focused and .toggled apply exactly the same
// styles but:
//    focused can only be removed by unfocusing
//    hovered can only be removed by unhovering
//    toggled can be removed by: selecting a new dropdown, pressing esc, clicking away
//                               i think i can use if not hovered and clicks!
