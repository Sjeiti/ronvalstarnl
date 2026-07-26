---
date: 9999-99-99
modified: 9999-99-99
slug: accessible-autocompletion
type: post
categories: [code]
header: plastic-wall.jpg
headerClassName: [no-blur,darken]
---

# Accessible autocompletion

This week I'm debugging some stupid legacy autocompletion code.

Somewhere something was causing the autocomplete list to move in paralax with the related input. Since we had recently done an Angular upgrade, I assumed that was the cause, or rather: the CDK overlay this autocomplete was built upon.

This excuse for an implementation was a whopping 670 lines of ... I don't know. I'm sure its doing something. It has RxJS.

I never learned RxJS. I tried to learn it once ten years ago. Then I took all the RxJS examples I had and ported them to vanilla to see the difference, and decided learning RxJS would be a waste of time (which would be a nice post if I could be bothered).

My colleague suggested I start looking for third party solutions, because we’ll soon be needing non-Angular autocompletion anyway.  
After testing about four autocomoletion packages, and finding flaws in each, I wrote an implementation from scratch in about 200 lines, fully accessible.

And yes, I could push this onto the pile called NPM, or I could just walk you through the logic. Because small NPM packages are dumb anyway.


## Oops

But before we dive into it, I have to confess: the autocomplete on the search on this site was not accesaible. And I have no excuse because I wasn't using any RxJS.



## A11Y

A11Y mostly boils down to colors, keyboard interaction, and screenreaders. For generic autocompletion there is a native solution that is already fully accessible. And it looks like this:

```html
<label>For breakfast <input list="breakfast" /></label>
<datalist id="breakfast">
  <option value="coffee">Coffee</option>
  <option value="fruit">Fruit</option>
  <option value="bread">Bread</option>
  <option value="pancakes">Pancakes</option>
  <option value="you">You</option>
</datalist>
```
<br/>

```html
<!--example-->
<label>For breakfast <input list="breakfast" /></label>
<datalist id="breakfast">
  <option value="coffee">Coffee</option>
  <option value="fruit">Fruit</option>
  <option value="bread">Bread</option>
  <option value="pancakes">Pancakes</option>
  <option value="you">You</option>
</datalist>
```

Perfect for most use-cases, but also in shadow-DOM, so hard to style. And a lot of times you need a list that is a bit more complex.

Also, sadly this does not work in Firefox mobile. Here is the [seven year old bug report](https://bugzilla.mozilla.org/show_bug.cgi?id=1535985).


## Implementing our own

For the browser to know we’re implementing our own autocompletion, we need to add some attributes: `[role=combobox]` to indicate the input field is combined with a list of options, and `[aria-autocomplete=list]`  to assign the type of interaction used.  
It is also advised to disable native autocompletion through `[autocomplete=false]` .

We’ll list our options in an `HTMLUListElement` because that is semantically correct; the browser and screen-reader will treat it in a specific way. You should know the term DOM or Document Object Model, for accessibility there is  the equivalent AOM or Accessibility Object Model. An `HTMLUListElement` is read in a specific way.




```
  // Barebones accessible autocompletion implementation.
  // An `HTMLInputElement` is focused and a list of suggestions is shown depending on the current value.
  // The suggestions are show in an `HTMLUListElement`. Only one is shown at the time.
  // The `input` defined to have an autocomplete list by `role=combobox` and `input[aria-autocomplete=list]`.
  // The `input` is related to a list by `ul.id`: `input[aria-controls=my-ul-id]`.
  // A show list is indicated by `aria-expanded=true`.
  // Keyboard navigation controls list highlighting while keeping focus within the `input`.
  // Highlighted list-items are indicated on the input by `input[aria-activedescendant=my-li-id]`
```
