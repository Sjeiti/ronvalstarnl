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

While implementing darkmode I stumbled upon [user preference media features](https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences), which is part of the W3C working draft Media Queries Level 5. Well, not exactly stumbled upon, more like: looked it up while searching for a good way to implement darkmode.

It is a draft, subject to change. But it is from 2021 and a lot of featutes are already implemented in browsers, [as you can see on caniuse](https://caniuse.com/?search=prefers-). 
You can read about [the W3C standardisation process](https://www.w3.org/2004/02/Process-20040205/tr.html) or [the CSS working group](https://wiki.csswg.org/) if you like to know more about it. This [list of drafts](https://drafts.csswg.org/) is also interesting reading material.

## Darkmode is a color-scheme

The media queries draft talks about [prefers-color-scheme (11.5)](https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme) which has the possible values `light` and `dark`.
This is a setting that exists in the user agent (browser) and might even depend on setting in the operating system (ie [IOS](https://support.apple.com/guide/mac-help/use-a-light-or-dark-appearance-mchl52e1c2d2/mac) or [Windows](https://support.microsoft.com/en-us/office/use-color-and-contrast-for-accessibility-in-microsoft-365-bb11486d-fc7d-4cd9-b344-16e2bc2a2387#bmkm_windows11dark)).

This preference might differ depending on device type. Your OS might switch to `dark` during nighttime. But maybe the user wants to set it individually per website.

So a media query like this is a fairly static value. It is also harder to work with than a plain `color-scheme-dark` onto the documentElement. Especially since you can simply suffix parent selectors in pre-processors (`.color-scheme-dark & {...}`).


## Use JavaScript for media-queries

We can mitigate that by using JavaScript, [`matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) in particular. But be aware that globally about 0.2% have JavaScript disabled.

So we want to check `prefers-color-scheme`, but we also want users to have the option to override it and save the choice to `localStorage`.
We'll do the saving later, first we need get the value, either from `localStorage`, or from `matchMedia`, and set a class on the `documentElement`.

```JavaScript
  const dark = 'dark';
  (
      localStorage.getItem('color-scheme')
      ||window.matchMedia(`(prefers-color-scheme: ${dark})`).matches
      &&dark
  )===value
  &&document.documentElement.classList.add(`color-scheme-${value}`)
```

Storing the state through a toggle button.

```JavaScript
const key = 'color-scheme'
const value = 'dark'
document.querySelector('.darkmode-toggle').addEventListener('click', ()=>{
  localStorage.setItem(key, document.documentElement.classList.toggle(`${key}-${value}`)?value:'light')
})
```


## Other preferences

Darkmode directly relates to `prefers-color-scheme`. But other `prefers-` queries may impact theming as well. We also have [`prefers-contrast`](https://www.w3.org/TR/mediaqueries-5/#prefers-contrast), [`prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion), [`prefers-reduced-transparency`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-transparency) and [`prefers-data`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-data). 


```JavaScript
function findPrefers(key, value) {
  (
      localStorage.getItem(key)
      ||window.matchMedia(`(prefers-${key}: ${value})`).matches
      &&value
  )===value
  &&document.documentElement.classList.add(`${key}-${value}`)
}
```

This does assume a boolean state, so when checking `prefers-contrast` you will have to check multiple values.

```JavaScript
findPrefers('color-scheme', 'dark')
findPrefers('contrast', 'more')
findPrefers('contrast', 'less')
findPrefers('reduced-motion', 'reduce')
findPrefers('reduced-transparency', 'reduce')
findPrefers('reduced-data', 'reduce')
```

## Now in cascading style sheets

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
