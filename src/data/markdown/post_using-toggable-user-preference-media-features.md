<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug: signals
  type: post
  header: ...
  headerColofon: photo by [Takahiro Sakamoto](https://unsplash.com/@takahiro)
  headerClassName: no-blur darken
  categories: code, CSS, JavaScript, accessibility
  tags: Angular, accounting, invoicing, Vue
  metaDescription: ...
-->

# Using toggable user preference media features

https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences

```JavaScript
function findPrefers(key, value) {
  ;(
      localStorage.getItem(key)
      ||window.matchMedia(`(prefers-${key}: ${value})`).matches&&value
  )===value
  &&document.documentElement.classList.add(`${key}-${value}`)
}
```

```JavaScript
findPrefers('color-scheme', 'dark')
findPrefers('contrast', 'more')
findPrefers('reduced-motion', 'reduce')
findPrefers('reduced-transparency', 'reduce')
findPrefers('reduced-data', 'reduce')
```

```JavaScript
const key = 'color-scheme'
const value = 'dark'
this._select(`[data-${key}]`).addEventListener('click', ()=>{
  localStorage.setItem(key, document.documentElement.classList.toggle(`${key}-${value}`)?value:'light')
})
```

```CSS
:root {
  --color-text: #333;
  --color-bg: #EEE;
}
.contrast-more {
  --color-text: #000;
  --color-bg: #FFF;
}
.color-scheme-dark {
  --color-text: #EEE;
  --color-bg: #333;
}
.contrast-more.color-scheme-dark {
  --color-text: #FFF;
  --color-bg: #000;
}
```