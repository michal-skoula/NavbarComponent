import "./style.css";

/*
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

/*
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

/*
 * ------------------
 *   Dropdown logic
 * ------------------
 */

class Dropdown {
  /** @type {HTMLElement} */
  dropdown;

  /** @type {HTMLElement} */
  dButton;

  /** @type {HTMLElement} */
  dList;

  /** @type {HTMLElement[]} */
  links;

  constructor(dropdownElem) {
    this.dropdown = dropdownElem;
    this.dButton = this.dropdown.querySelector("& > button");
    this.dList = this.dropdown.querySelector("& > ul");
    this.links = this.dList.querySelectorAll("& > li > a");

    this.registerBasicEventListeners();
    this.registerKeyboardInputEventListeners();
  }

  isOpen() {
    return this.dropdown.classList.contains("open");
  }

  openDropdown() {
    closeAllDropdowns();
    this.dList.addEventListener("transitionend", this.setFocusOnFirstLink());
    this.dList.removeEventListener("transitionend", this.setFocusOnFirstLink());

    this.dropdown.classList.add("open");
  }

  closeDropdown(shouldFocus = true) {
    this.dropdown.classList.remove("open");
    this.dropdown.classList.remove("hover");

    if (shouldFocus) {
      this.dButton.focus();
    }
  }

  setFocusOnFirstLink() {
    console.log("focusing");
    setTimeout(() => this.links[0].focus(), 10);
  }

  registerBasicEventListeners() {
    // If any dropdown is toggled open, don't open another one on hover
    this.dropdown.addEventListener("mouseenter", () => {
      for (const d of dropdowns) {
        if (d.isOpen()) {
          return;
        }
      }
      this.dropdown.classList.add("hover");
    });

    this.dropdown.addEventListener("mouseleave", () => {
      this.dropdown.classList.remove("hover");
    });

    // Close when any link is clicked
    this.links.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeDropdown();
      });
    });

    // Toggle open when clicked
    this.dButton.addEventListener("click", () => {
      this.dropdown.classList.contains("open")
        ? this.closeDropdown()
        : this.openDropdown();
    });
  }

  registerKeyboardInputEventListeners() {
    // Handle key inputs
    this.dButton.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        this.isOpen() ? this.closeDropdown() : this.openDropdown();
      } else if (e.key === "Escape") {
        this.closeDropdown();
      }
    });

    this.dList.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeDropdown();
    });
  }
}

/** @type {HTMLElement[]} */
const dropdownElems = document.querySelectorAll("li[nav-submenu]");

/** @type {Dropdown[]} */
let dropdowns = [];
dropdownElems.forEach((d) => {
  dropdowns.push(new Dropdown(d));
});

function closeAllDropdowns() {
  dropdowns.forEach((d) => {
    d.closeDropdown(false);
  });
}

// Closes dropdown automatically when clicking elsewhere
document.addEventListener("click", (e) => {
  dropdowns.forEach((d) => {
    if (
      d.isOpen &&
      !(e.target === d.dropdown || d.dropdown.contains(e.target))
    ) {
      d.closeDropdown(false);
    }
  });
});
