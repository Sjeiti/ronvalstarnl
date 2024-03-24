<!--
  date: 2024-03-23
  modified: 2024-03-23
  slug: no-random-in-css
  type: post
  header: manas-taneja-Mse8VazeO-c-unsplash.jpg
  headerColofon: photo by [Manas Tajena](https://unsplash.com/@manastaneja)
  headerClassName: no-blur darken
  categories: code
  tags: cool shit, prng
  description: 
  related: experiment-ladybugs
-->

# No random in CSS

CSS has functions; you can calculate values. Apart from basic adding, subtracting, đividing and multiplying, you can also use `max`, `min` and even do trigonomic calculations with `sin` and `cos`.

This can be very useful for use in conjunction with CSS properties. You can, for instance, apply a `transform: rotate(var(--degrees));`, and split those degrees in x- and y-offsets using `sin(calc(var(--degrees)/180*pi))`.

I've made a small example with these cute little ladybugs, because I detest aphids and their filthy ability to reproduce asexually.
The ladybug is a single element that is rotated by a `--degrees` property. The coloring is a background with layered radial gradients, where the highlight and shadow are moves by calculating the offset from that `--degrees` property. The box-shadow uses the same x- and y-offsets.

```CSS
:root {
  --degrees: 45;
  --lightRadians: -1.1;
}
div {
  --radians: calc(var(--degrees)/180*pi);

  --rdns: calc(var(--radians) + var(--lightRadians));

  --remX: calc(cos(var(--rdns))*1rem);
  --remY: calc(sin(var(--rdns))*-1rem);

  --percX: calc(cos(var(--rdns))*1%);
  --percY: calc(sin(var(--rdns))*-1%);
}
```
 
```html
<!--example-->
<style>
  body {
    min-height: 14rem;
    background: #462 radial-gradient(circle at 10% 10%, #fff4, transparent);
  }
  :root {
    --radians: 0;
    --lightRadians: -1.1;
    --color: #e82;

    --rndMult: 9999973;

    --index: 111111;
  }
  input{width:100%;}
  .ladybug {
    --rdns: calc(var(--radians) + var(--lightRadians));
    --remX: calc(cos(var(--rdns))*1rem);
    --remY: calc(sin(var(--rdns))*-1rem);
    --percX: calc(cos(var(--rdns))*1%);
    --percY: calc(sin(var(--rdns))*-1%);

    position: absolute;
    width: 1.4rem;
    height: 2rem;
    transform: rotate(calc(var(--radians)*1rad));
    transform-origin: 50% 50%;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: -10%;
      top: -10%;
      width: 120%;
      height: 120%;
      background:
        linear-gradient( 30deg, transparent 0% 49%, #000 49% 51%, transparent 51% 100%),
        linear-gradient(  0deg, transparent 0% 49%, #000 49% 51%, transparent 51% 100%),
        linear-gradient(-30deg, transparent 0% 49%, #000 49% 51%, transparent 51% 100%)
      ;
    }
    
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50% 50% 60% 60%;
      background-color: var(--color);
      background-image: radial-gradient(ellipse at calc(50% - 20 * var(--percX)) calc(50% - 20 * var(--percY)), #FFFA 0%, transparent 30%),
          radial-gradient(circle at 80% 5%, #FFF 0 8%, transparent 8%),
          radial-gradient(circle at 20% 5%, #FFF 0 8%, transparent 8%),
          radial-gradient(circle at 50% -10%, #000 0% 35%, transparent 35%),
          radial-gradient(circle at 20% 50%, #000 0 10%, transparent 12%),
          radial-gradient(circle at 80% 50%, #000 0 10%, transparent 12%),
          radial-gradient(circle at 35% 80%, #000 0 7%, transparent 9%),
          radial-gradient(circle at 65% 80%, #000 0 7%, transparent 9%),
          linear-gradient(90deg, transparent 0% 48%, #0008 48% 52%, transparent 52% 100%);
      box-shadow: calc(0.4 * var(--remX)) calc(0.4 * var(--remY)) 0.5rem #FFF3 inset,
          calc(-0.4 * var(--remX)) calc(-0.4 * var(--remY)) 0.4rem #0008 inset,
          calc(0.4 * var(--remX)) calc(0.4 * var(--remY)) 0.1rem #0005;
      transition: background-color calc(2.7 * var(--animT)) linear;
    }
  }
</style>

<div>
  <div class="ladybug" style="left: 50%;top:50%;scale:4;--radians:0.5;z-index: 1;"></div>
  <input type="range"/>
</div>

<script>
    const w = document.documentElement.clientWidth // todo update onresize
    const h = document.documentElement.clientHeight
    const input = document.querySelector('input')
    const ladybug = document.querySelector('.ladybug')
    const step = 60
    const num = w*h/3E3<<0

    input.addEventListener('input', e=>{
      const value = e.currentTarget.value
      ladybug.style.setProperty('--radians', value/50*Math.PI)
    })
</script>
```

CSS functions can probably be used for more useful things. Unfortunately CSS does not come with randomisation. I've [written about about random generators before](/randomness-in-generative-code) and they are fairly easy to implement. All you need is a sufficiently large number and a [modulo function](https://en.m.wikipedia.org/wiki/Modulo). 

But wait, [there is a CSS modulo function](https://developer.mozilla.org/en-US/docs/Web/CSS/mod), it's in the [CSS4 specs](https://drafts.csswg.org/css-values/#funcdef-mod). Safari and Firefox support it, but not Chrome.
I've tested in both, but unfortunately calculations do not go high enough for simple PRNG's. These normally make use of divisors starting at 2^31-1  (a Mersenne prime). It works with smaller numbers though, if your seeds don't go too high. 
The reason large prime numbers are used as modulo is to get a result that does not repeat (immediately).
Another difficulty is that normally the outcome for a PRNG is used as the seed (or input) in the next calculation, this is impossible in CSS.

Usually the PRNG result is divided by it's modulo to create a range from 0 to 1. We might not have a modulo function in CSS' (in Chrome), but we do have another function that turns any number into one between -1 and 1: the `sin` function.
This doesn't fly for long because the seemingly irregular results turn regular after a number of iterations. But it's better than nothing.

The following works by giving each 'instance' an index number for seed. Since we will not be using the results as a seed we might as well discard the increment number. We only multiply the seed with a very large number.

```CSS
:root {
  --rndMult: 9999973;
  --index: 1;
}
div {
  --seed: calc((1 + var(--index))*var(--rndMult));
  --rand: calc(0.5 + 0.5*sin(var(--seed)));
}
```

```html
<!--example-->
<style>
  body, html {                                      position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  
  html {box-sizing: border-box;}
  *, *:before, *:after {box-sizing: inherit;}

  :root {
    --range: 0;
    --index: 111111;
    --color: #59BFC1;
    --rndMult: 6247;
  }

  input {width:95%;}

  div {
    --px: calc(1px*var(--range));
    --pc: calc(0.1%*var(--range));

    --seed: calc((var(--range) + var(--index))*var(--rndMult));
    --rand: calc(0.5 + 0.5*sin(var(--seed)));
    --randpc: calc(var(--rand)*100%);
    
    min-height: 2px;
  }

  .random {background:linear-gradient(90deg, var(--color) 0 var(--randpc),transparent var(--randpc) 100%);}
</style>

<label>index <span></span><input type="range" max="1000" class="seed" /></label>
<label>multiplier <span></span><input type="range" max="10000000" class="multiplier" /></label>

<script>
const {body} = document

const inputSeed = document.querySelector('.seed')
const inputMult = document.querySelector('.multiplier')

document.addEventListener('input', e=>{
  const {target, target: {value}} = e
  const prop = target===inputSeed&&'--range'
      ||target===inputMult&&'--rndMult'
      ||''
  body.style.setProperty(prop, value)
  target.parentNode.querySelector('span').innerText = value
})
document.dispatchEvent(new CustomEvent('input'))

Array.from(new Array(80)).forEach((o,i)=>{
  const div = document.createElement('div')
  div.classList.add('random')
  div.style.setProperty('--index', i)
  document.body.appendChild(div)
})

</script>
```

Some multiplier values produce quite nice results. But you'll notice the values turn regular after a couple of iterations.
I've used this technique for positioning the dots on the ladybugs, and for colouring.

```html
<!--example-->
<style>
  body {
    min-height: 14rem;
    background: #462 radial-gradient(circle at 10% 10%, #fff4, transparent);
  }
  :root {
    --radians: 0;
    --lightRadians: -1.1;
    --animT: 500ms;
    --color: #e82;

    --rndMult: 9999973;
    --index: 111111;
  }
  input{width:95%;}
  .ladybug {
    --rdns: calc(var(--radians) + var(--lightRadians));
    --remX: calc(cos(var(--rdns))*1rem);
    --remY: calc(sin(var(--rdns))*-1rem);
    --percX: calc(cos(var(--rdns))*1%);
    --percY: calc(sin(var(--rdns))*-1%);


    --seed0: calc((1 + var(--index))*var(--rndMult));
    --rand0: calc(0.5 + 0.5*sin(var(--seed0)));

    --seed1: calc((2 + var(--index))*var(--rndMult));
    --rand1: calc(0.5 + 0.5*sin(var(--seed1)));

    --seed2: calc((3 + var(--index))*var(--rndMult));
    --rand2: calc(0.5 + 0.5*sin(var(--seed2)));

    --seed3: calc((4 + var(--index))*var(--rndMult));
    --rand3: calc(0.5 + 0.5*sin(var(--seed3)));

    --seed4: calc((5 + var(--index))*var(--rndMult));
    --rand4: calc(0.5 + 0.5*sin(var(--seed4)));

    --seed5: calc((6 + var(--index))*var(--rndMult));
    --rand5: calc(0.5 + 0.5*sin(var(--seed5)));

    --seed6: calc((7 + var(--index))*var(--rndMult));
    --rand6: calc(0.5 + 0.5*sin(var(--seed6)));
    
    --color: hsl(calc(20 * var(--rand4)) calc(100% - 40% * var(--rand5)) calc(35% + 15% * var(--rand6)));

    position: absolute;
    width: 1.4rem;
    height: 2rem;
    transform: rotate(calc(var(--radians)*1rad));
    transform-origin: 50% 50%;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: -10%;
      top: -10%;
      width: 120%;
      height: 120%;
      background:
        linear-gradient( 30deg, transparent 0% 49%, #000 49% 51%, transparent 51% 100%),
        linear-gradient(  0deg, transparent 0% 49%, #000 49% 51%, transparent 51% 100%),
        linear-gradient(-30deg, transparent 0% 49%, #000 49% 51%, transparent 51% 100%)
      ;
    }
    
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50% 50% 60% 60%;
      background-color: var(--color);
      background-image: radial-gradient(ellipse at calc(50% - 20 * var(--percX)) calc(50% - 20 * var(--percY)), #FFFA 0%, transparent 30%),
          radial-gradient(circle at 80% 5%, #FFF 0 8%, transparent 8%),
          radial-gradient(circle at 20% 5%, #FFF 0 8%, transparent 8%),
          radial-gradient(circle at 50% -10%, #000 0% 35%, transparent 35%),
          radial-gradient(circle at calc(50% + 35% * var(--rand0)) calc(30% + 30% * var(--rand2)), #000 0 10%, transparent 12%),
          radial-gradient(circle at calc(50% - 35% * var(--rand0)) calc(30% + 30% * var(--rand2)), #000 0 10%, transparent 12%),
          radial-gradient(circle at calc(50% + 30% * var(--rand1)) calc(60% + 30% * var(--rand3)), #000 0 7%, transparent 9%),
          radial-gradient(circle at calc(50% - 30% * var(--rand1)) calc(60% + 30% * var(--rand3)), #000 0 7%, transparent 9%),
          linear-gradient(90deg, transparent 0% 48%, #0008 48% 52%, transparent 52% 100%);
      box-shadow: calc(0.4 * var(--remX)) calc(0.4 * var(--remY)) 0.5rem #FFF3 inset,
          calc(-0.4 * var(--remX)) calc(-0.4 * var(--remY)) 0.4rem #0008 inset,
          calc(0.4 * var(--remX)) calc(0.4 * var(--remY)) 0.1rem #0005;
    }
  }
</style>

<div>
  <div class="ladybug" style="left: 20%;top:50%;scale:4;--radians:0.5;--index: 1;"></div>
  <div class="ladybug" style="left: 40%;top:50%;scale:4;--radians:0.5;--index: 31;"></div>
  <div class="ladybug" style="left: 60%;top:50%;scale:4;--radians:0.5;--index: 55;"></div>
  <div class="ladybug" style="left: 80%;top:50%;scale:4;--radians:0.5;--index: 77;"></div>
  <input type="range" max="1000"/>
</div>

<script>
    const input = document.querySelector('input')
    const ladybugs = document.querySelectorAll('.ladybug')
    input.addEventListener('input', e=>{
      const value = e.currentTarget.value
      ladybugs.forEach((ladybug,i)=>{
        ladybug.style.setProperty('--index', value/4*(i+1))
      })
    })
</script>
```

So randomness in pure CSS is possible but it requires quite some boilerplate. The values also tend to regularity quite fast, but it is good enough to create simple variation.
All we have to do now is wait for Chrome to implement the CSS `mod` function, and hope Firefox increases the number size.
