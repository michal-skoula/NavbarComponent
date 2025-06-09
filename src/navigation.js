//@ts-check
//prettier-ignore

/**
 * @typedef {Object} NavigationItem
 * @property {string} label - The display text for the navigation item.
 * @property {string} href - The URL or path the navigation item links to.
 * @property {NavigationItem[]} [items] - Nested navigation items (can nest infinitely).
 */

/** @type {NavigationItem[]} */
export default [
  { 
    label: "Domů", 
    href: "/", 
    items: [] 
  },
  {
    label: "O nás",
    href: "/about",
    items: [
      { label: "O společnosti", href: "/about/company", items: [] },
      { label: "Naše mise", href: "/about/our-mission", items: [] },
    ],
  },
  {
    label: "Projekty",
    href: "/projects",
    items: [
      { label: "Rekonstrukce domu", href: "/project/rekonstrukce", items: [] },
      { label: "Instalace klimatizace", href: "/project/instalace", items: [] },
      { label: "Design interiéru", href: "/project/design", items: [] },
    ],
  },
  { 
    label: "Kontakt", 
    href: "/contact", 
    items: [] 
  },
];
