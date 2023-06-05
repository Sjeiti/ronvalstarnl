<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug: using-toggable-user-preference-media-features
  type: post
  header: christina-deravedisian-_ipepr0WJDA-unsplash.jpg
  headerColofon: photo by [Christina Deravedisian](https://unsplash.com/@christinadera)
  headerClassName: no-blur
  categories: code, CSS, JavaScript, accessibility
  tags: Angular, accounting, invoicing, Vue
  metaDescription: ...
-->

# Using toggable user preference media features

While implementing darkmode I stumbled upon [user preference media features](https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences), which is part of the W3C working draft Media Queries Level 5. Well, not exactly stumbled upon, more like searched for the correct way to implement darkmode.

The media query draft is what is says it is: a draft. Bit since it is from december 2021, a lot is alredy implemented in browsers. It is just subject to change.



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
