<!--
  date: 2024-03-22
  modified: 2024-03-22
  slug: experiment-ladybugs
  type: post
  categories: code, JavaScript
  tags: cool shit
  thumbnail: experiments/Screenshot_20240524-072454.png-edit-20240524072543.jpg
  description: Single element ladybugs
  related: random-in-css, experiment-*
-->

# Experiment: Ladybugs

I like making things with as little elements as possible (and a ton of CSS). These ladybugs are a single HTMLElement. They are also the main star in [a post about randomness in CSS](/random-in-css).

Since the bugs are single elements, all you need to see is some CSS.
<small>(ps: I cheated a bit with pseudo elements)</small>

```css
  :root {
    --radians: 0;
    --lightRadians: -1.1;
    --color: #e82;

    --rndMult: 9999973;

    --index: 111111;
  }
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
```
