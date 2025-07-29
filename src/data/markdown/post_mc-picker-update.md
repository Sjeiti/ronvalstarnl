<!--
  date: 2025-07-29
  modified: 2025-07-29
  slug:mc-picker-update
  type: post
  header: colorbox.jpg
  categories: Javascript, code
  tags: color, CSS
--> 

# Added alpha to MCPicker

A regular `input[type=color]` has a variety of user interfaces depending on platform or browser. Some ok but all different, which is why I made [MC Picker](/mc-picker) a few years back: a simple script that works on any color input and looks like this:
<style>
.mcpicker {

  --mcp-color: #f04;
  --mcp-w: 14rem;
  --mcp-w: 18rem;
  --mcp-h: 8rem;
  --mcp-h: 10rem;
  --mcp-gutter: 1rem;
  --mcp-font-size: 0.8rem;

  position: relative;
  width: var(--mcp-w);
  height: var(--mcp-h);
  margin-bottom: 0.5rem;
  z-index: 99;
  background-color: var(--mcp-color);
  box-shadow:
      0 0 0 1px white,
      0 2px 4px rgba(0, 0, 0, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.3);
  /* color */
  div {
    position: relative;
    width: 100%;
    height: calc(100% - 2*var(--mcp-gutter));
    user-select: none;
    background:
      linear-gradient(to top, black, rgba(0,0,0,0)),
      linear-gradient(to left, red, white)
    ;
    .mcpicker--alpha & {
      width: calc(100% - var(--mcp-gutter));
    }
    &:first-of-type {
      .mcpicker--list & {
        height: calc(100% - 3*var(--mcp-gutter));
      }
    }
    /* color marker */
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      width: 0.5rem;
      height: 0.5rem;
      transform: translate(50%,-50%);
      border-radius: 1rem;
      box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
      pointer-events: none;
    }
    /* huey */
    & + div {
      height: var(--mcp-gutter);
      background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
      /* huey marker */
      &:after {
        right: 3%;
        width: 3px;
        height: inherit;
        transform: translateX(-2px);
        box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
      }
      /* optional alpha */
      & + div {
        position: absolute;
        right: 0;
        top: 0;
        width: var(--mcp-gutter)!important;
        height: calc(100% - var(--mcp-gutter));
        --mcp-checker-c1: #444;
        --mcp-checker-c2: #bbb;
        --mcp-checker: calc(var(--mcp-gutter)/1.5);
        --mcp-checker-2: calc(var(--mcp-checker)/2);
        --mcp-checker-2m: calc(var(--mcp-checker)/-2);
        background: 
          linear-gradient(var(--mcp-color), transparent),
          linear-gradient(45deg, var(--mcp-checker-c1) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, var(--mcp-checker-c1) 75%),
          linear-gradient(45deg, transparent 75%, var(--mcp-checker-c1) 75%),
          linear-gradient(45deg, var(--mcp-checker-c1) 25%, var(--mcp-checker-c2) 25%)
        ;
        background-size:
          100% 100%,
          var(--mcp-checker) var(--mcp-checker),
          var(--mcp-checker) var(--mcp-checker),
          var(--mcp-checker) var(--mcp-checker),
          var(--mcp-checker) var(--mcp-checker)
        ;       
        background-position: 
          0 0, 
          0 0, 
          0 0, 
          var(--mcp-checker-2m) var(--mcp-checker-2m), 
          var(--mcp-checker-2) var(--mcp-checker-2)
        ;
        /* alpha marker */
        &:after {
          top: 1rem;
          width: inherit;
          height: 3px;
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
        }
      }
    }
  }
  /* inputs */
  input {
    width: 40%;
    height: var(--mcp-gutter);
    display: block;
    float: left;
    margin: 0;
    padding: 0.125rem 0.25rem;
    border: 0;
    border-radius: 0;
    box-sizing: border-box;
    outline: none;
    box-shadow: none;
    background-color: transparent;
    font-size: var(--mcp-font-size);
    line-height: 1rem;
    font-family: monospace;
    font-weight: 600;
    text-align: center;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* rgb inputs */ 
    &[type=number] {
      -moz-appearance:textfield;
      box-shadow: 1px 0 0 rgba(white,0.5) inset;
    }
    +input {
      &,+input {
        &,+input {
          width: calc(60% / 3);
        }
      }
    }
    /* alpha */ 
    +input {
      &,+input {
        &,+input {
          &,+input {
            .mcpicker--alpha & {
              width: calc(60% / 4);
            }
          }
        }
      }
    }
  }
  /* list */
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    .mcpicker--alpha & {
      width: calc(100% - var(--mcp-gutter));
    }
    li {
      flex: 1 1 auto;
      height: var(--mcp-swatch);
      height: var(--mcp-gutter);
      &:has(.current) {
        z-index: 1;
      }
    }
    button {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      overflow: hidden;
      &.current {
        box-shadow: 0 0 0 1px white inset,0 0 0 1px black;
      }
    }
  }
}   
</style>
<div class="mcpicker mcpicker_g1"><div></div><div></div><input maxlength="7" value="#FF0044"><input type="number" value="255"><input type="number" value="0"><input type="number" value="196"></div>


## Alpha

One annoying thing that all these native implementations have in common is that they do not support alpha channels. Even though `#FF004480` is a perfectly valid color in CSS. MC Picker now supports alpha as well, by means of a `input[type=color][data-alpha=127]`.

<div class="mcpicker mcpicker--alpha mcpicker_g1"><div></div><div></div><div></div><input maxlength="7" value="#FF0044"><input type="number" value="255"><input type="number" value="0"><input type="number" value="68"><input type="number" value="68"></div>


## ps

I also added dataList support

<div class="mcpicker mcpicker--list mcpicker_g1"><ul>
<li><button style="background-color:#FF0044;" class="current"></button></li>
<li><button style="background-color:#DD0044;"></button></li>
<li><button style="background-color:#BB0044;"></button></li>
<li><button style="background-color:#990044;"></button></li>
<li><button style="background-color:#770044;"></button></li>
<li><button style="background-color:#550044;"></button></li>
<li><button style="background-color:#330044;"></button></li>
<li><button style="background-color:#110044;"></button></li>
</ul><div></div><div></div><input maxlength="7" value="#FF0044"><input type="number" value="255"><input type="number" value="0"><input type="number" value="68"></div>
