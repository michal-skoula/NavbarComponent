## Responsive navbar component

### About

I couldn't find any navbar component online that was truly accessible and responsive according to my needs, so I built this one! It's built using TailwindCSS and JavaScript so that it can easily be added into any app. The provided styling is minimal, so that it can easily fit your needs.

The layout is defined in `navigation.js` using a simple schema that can easily be connected to a CRM like WordPress or an API.

### How to use

The navigation expects all content of the page **other than the navigation** to be inside of a wrapper with an id of `page` like so:

```html
<header>
  <!-- Navigation -->
</header>
<div id="page">
  <!-- The rest of your content -->
  <main>
    <!-- ... -->
  </main>
  <footer>
    <!-- ... -->
  </footer>
</div>
```

If you skip this step, the navigation will **not trap focus when opened!**

Once you update your HTML accordingly, you may define the navbar layout inside of `/src/navigation.js`. There, you'll find a simple schema representing your navigation structure. This navbar is able to be nested **infinitely**.

In order to customize the breakpoint, you need to edit the following:

- `const media = `
