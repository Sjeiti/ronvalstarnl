<!--
  date: 2023-06-29
  modified: 2023-08-02
  slug: using-toggable-user-preference-media-features
  type: post
  header: christina-deravedisian-_ipepr0WJDA-unsplash.jpg
  headerColofon: photo by [Christina Deravedisian](https://unsplash.com/@christinadera)
  headerClassName: no-blur
  categories: code, CSS, JavaScript, accessibility
  tags: Angular, accounting, invoicing, Vue
  description: How to easily use prefers-media-queries and make them adjustable through user preferences.
-->

# Using toggable user preference media features

While implementing darkmode I stumbled upon [user preference media features](https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences), which is part of the W3C working draft Media Queries Level 5. Well, not exactly stumbled upon, more like: looked it up while searching for a good way to implement darkmode.

It is a draft, subject to change. But it is from 2021 and a lot of features are already implemented in browsers, [as you can see on "Can I use"](https://caniuse.com/?search=prefers-). 
You can read about [the W3C standardisation process](https://www.w3.org/2004/02/Process-20040205/tr.html) or [the CSS working group](https://wiki.csswg.org/) if you like to know more about it. This [list of drafts](https://drafts.csswg.org/) is also interesting reading material.

## Darkmode is a color-scheme

The media queries draft talks about [prefers-color-scheme (11.5)](https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme) which has the possible values `light` and `dark`.
This is a setting that exists in the user agent (browser) and might even depend on settings in the operating system (ie [IOS](https://support.apple.com/guide/mac-help/use-a-light-or-dark-appearance-mchl52e1c2d2/mac) or [Windows](https://support.microsoft.com/en-us/office/use-color-and-contrast-for-accessibility-in-microsoft-365-bb11486d-fc7d-4cd9-b344-16e2bc2a2387#bmkm_windows11dark)).

This preference might differ depending on device type. Your OS might switch to `dark` during nighttime. But maybe the user wants to set it individually per website.

The media query `prefers-color-scheme` is a fairly static value. It is also harder to work with than a plain `.color-scheme-dark` className onto the documentElement. Through which we could simply suffix parent selectors in pre-processors like so `.color-scheme-dark & {...}` (although this might not be adviseable as we'll see in a minute).


## Use JavaScript for media-queries

We can make it easier by using JavaScript, [`matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) in particular. But be aware that globally about 0.2% have JavaScript disabled.

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

Darkmode directly relates to `prefers-color-scheme`. But other `prefers-` queries may impact theming as well. We also have [`prefers-contrast`](https://www.w3.org/TR/mediaqueries-5/#prefers-contrast), [`prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion), [`prefers-reduced-transparency`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-transparency) and [`prefers-data`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-data). These are all media-queries that directly relate to accessibility, so very useful.

We can refactor the previous script into a generic method:

```JavaScript
/**
 * Finds any `prefers-` media-query through localStorage and matchMedia and sets documentElement classNames accordingly
 * @param {string} key
 * @param {string|string[]} values
 * @return {string}
 */
function findPrefers(key, values) {
  const storedValue = localStorage.getItem(key)
  return (Array.isArray(values)?values:[values])
      .find(value=>{
        const finalValue = storedValue||window.matchMedia(`(prefers-${key}: ${value})`).matches&&value
        finalValue&&document.documentElement.classList.add(`${key}-${finalValue}`)
        return value===finalValue
      })
}
```

By default, this method assumes a boolean state in the sense that for 'light' to be `false` you may assume 'dark' to be `true`. In which case only the className `.color-scheme-dark` would suffice because absense would mean the opposite.
For checking multiple values you can overload the second parameter with an array of values.

```JavaScript
findPrefers('color-scheme', 'dark')
findPrefers('contrast', ['more', 'less'])
findPrefers('reduced-motion', 'reduce')
findPrefers('reduced-transparency', 'reduce')
findPrefers('reduced-data', 'reduce')
```

## Now in cascading style sheets

The easiest way to handle these settings is by using CSS properties (or variables). The advantage is that there is a single place where everything is defined, and `var(--color-bg)` is just an implementation detail.

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

The downside to this method is that we've just replaced a media-query with a JavaScript solution. You might have heard the term 'progressive enhancement', this would be the opposite.
But we can add back the media-queries to overwrite the CSS properties.

```CSS
:root {
	--color-text: #333;
	--color-bg: #EEE;
}
@media (prefers-contrast: more) {
	:root {
		--color-text: #000;
		--color-bg: #FFF;
	}
}
@media (prefers-color-scheme: dark) {
	:root {
        --color-text: #EEE;
        --color-bg: #333;
	}
}
@media screen and (prefers-contrast: more) and (prefers-color-scheme: dark) {
	:root {
		--color-text: #FFF;
		--color-bg: #000;
	}
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

This works with- and without JavaScript. You might see here why parent selectors should be used sparingly, they'd only work with JavaScript enabled.

But now we have a double implementation. If we change the theme we'll have to do so in two places. Which is naughty because it is not DRY.

Since these classNames only work with JavaScript enabled, we might as well remove the hardcoded declarations and generate the CSS classes from analysing `document.styleSheets`.

```JavaScript
/**
 * Converts media-queries with `prefers-` into similar CSS classes.
 * The classes can then be used as direct user preference (ie darkmode).
 */
function insertRulesFromPrefersMediaRules(){
  Array.from(document.styleSheets).forEach(sheet=>
    getRules(sheet).forEach((mediaRule)=>{
      if (mediaRule.constructor===CSSMediaRule) {
        getRules(mediaRule).forEach((rule)=>{
          const {style, constructor, selectorText} = rule
          if (constructor===CSSStyleRule&&selectorText===':root') {
            const vars = Array.from(style).filter(name=>/^--/.test(name))
            if (vars.length) {
              const selector = (mediaRule.conditionText.match(/(?<=\()(prefers-[^)]*)/g)||[]).map(s=>'.'+s.replace(/\:\s/,'-').substring(8)).join('')
              const props = vars.map(name=>`${name}:${style.getPropertyValue(name).trim()};`).join('')
              selector&&props&&sheet.insertRule(`${selector}{${props}}`, sheet.cssRules.length)
            }
          }
        })
      }
    })
  )
}

/**
 * Get the rules with a try..catch to prevent CORS issues.
 * @param {CSSStyleSheet|CSSMediaRule} sheetOrRule
 * @return {(CSSStyleSheet|CSSMediaRule)[]}
 */
function getRules(sheetOrRule){
  const rules = []
  try { rules.push(...Array.from(sheetOrRule.cssRules)) } catch (err) {}
  return rules
}

```

The above script traverses all styleSheets. Their rules are checked by `try..catch` because external sheets may throw errors due to CORS. When a mediaRule is encountered it is checked for `prefers-[key]: [value]` occurrences and converted to the class selector `.[key]-[value]` containing the corresponding CSS variables.

## Summing up

To reduce CSS complexity use CSS properties to handle the `prefers-` media-queries.
For overriding specific `prefers-` per site JavaScript can be used to infer CSS classes from media-queries and add applicable classNames to the documentElement for override said CSS properties. It's state can be handled through localStorage.
