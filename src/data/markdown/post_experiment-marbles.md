<!--
  date: 2017-08-02
  modified: 2020-05-31
  slug: experiment-marbles
  type: post
  categories: code, game, JavaScript, work
  tags: 3D, WebGL, physics
  related: experiment-bezier experiment-blob experiment-boids experiment-clouds experiment-ff experiment-fire experiment-flowfield experiment-glass experiment-grid experiment-heart experiment-marbles experiment-plasma experiment-radialdifference experiment-snow experiment-spiralmap experiment-starzoom experiment-touches experiment-vertical experiment-voronoi
-->

# Experiment: marbles

Last week I saw an old image in my library of [something I created](https://test.sjeiti.com/knikkeren/) back in 2006\. It was a few marbles created using Flash and displacement mapping. Remember BitmapData and DisplacementMapFilter? No I didn’t either.  
But since I’m learning GLSL I thought this would be an excellent little experiment to recreate.  

Back then I did the physics myself but this time I wanted to concentrate on the WebGL part so I used Matter.js. Circles in Matter are really just a polygon of vertices, but it works just fine.  
So the physics part is plain JavaScript, the view is all GLSL.

## Some goals

I was going for looks, not creating anatomically correct glass and refraction. So the what you see is not 3D. If you nitpick there are all sorts of things that are off like the rotation of the marbles or the refraction over the hole. But overal it looks good.

What I wanted to learn from this experiment is:  
– more displacement mapping  
– realistic marble colors  
– object lighting  
– JavaScript lists to uniforms

What I also learned was:  
– passing a list of structs from JavaScript to the shader  
– passing uniform data can be faster than using prng in GLSL  
– GLSL operations order  
– environment mapping

## Getting started

I’m going to skip the setup because there are enough [WebGL boilerplates](https://www.google.com/search?q=WebGL+boilerplate) out there for you to get started with. Or you could fiddle around on [ShaderToy](http://shadertoy.com).  
I do want to point out that in most implementations you will see that the [WebGL2RenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) derived from [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) is simply called `gl`. So when you see `gl` it’s really the context from `canvas.getContext()`.

## JavaScript arrays to GLSL uniforms

The crux of the experiment was really getting a list of JavaScript data (marble positions) into the GLSL shader. There are sixteen methods you can use depending on the data.  
That might sound overwelming but it’s simply like this:

```glsl
gl.uniform[1234][fi][v]()
```

The digits are the number of variables to pass (float, vec2, vec3, vec4 etc…).  
Followed by the type: Floats or Integers.  
And an optional v passing the vector as array.

So for a plain JavaScript number you’d use `gl.uniform1f()` to pass it to a `uniform float`.  
For an array of marble positions you’d use `gl.uniform2fv()` to pass it to a `uniform vec2 myPositions[23]`.

<small>Here you can immediately see a property of GLSL that is a bit tricky to deal with: the array length must always be of type `const int`, but a `uniform` cannot be `const`. So the array length must fixed.  
There are tricks to overcome this if you need the freedom. One is to set the length to a maximum in GLSL and only calculate when properties are set.  
This is what I did at first: used `gl.uniform3fv()` to pass a `vec3` for marble x, y, radius. In the GLSL loop I’d first check for `marbleRadius!=0.0`.  
So in JavaScript your array would count 10 but in GLSL it would be 20.</small>

To use the `gl.uniform[1234][fi][v]()` method we first need to get the location:

```glsl
let uniformLocation = gl.getUniformLocation(program,'myFloat')
gl.uniform1f(uniformLocation,2.3)
```

Passing an array is slightly different. An array of vec2:

```glsl
let uniformLocation
uniformLocation = gl.getUniformLocation(program,'myPos[0]')
gl.uniform2f(uniformLocation,2.3,4.5)
uniformLocation = gl.getUniformLocation(program,'myPos[1]')
gl.uniform2f(uniformLocation,3.4,5.6)
```

And an example using the [v] variant (same effect as above):

```glsl
let uniformLocation
uniformLocation = gl.getUniformLocation(program,'myPos[0]')
gl.uniform2fv(uniformLocation,[2.3,4.5])
uniformLocation = gl.getUniformLocation(program,'myPos[1]')
gl.uniform2fv(uniformLocation,[3.4,5.6])
```

<small>By the way, `program` here refers to the [WebGLProgram](https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram), the return from `gl.createProgram()`. This is your vertex- and fragment shader combined.</small>

## Onto colored marbles

What I first did was pass a JavaScript Array to the shader as `vec3` where `vec3.z` would be the radius of the marble. I used the index of the array as the seed for a prng to get six floats for two rgb colors. This works but it’s not very efficient. Because when `gl_FragCoord.xy` is within radius of the marble it will have to get the two colors for each pixel. To put in perspective: for a marble with a 20 pixel radius we’d have to call the prng about 7500 times (PI*r²*6).

## What the struct?!

While searching on how to get JavaScript arrays to GLSL uniforms I also came upon a solution to pass JavaScript objects to an array of GLSL [structs](https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Structs). After reading up on structs (which are like a blueprint collection of properties, like an interface) I decided this was better suited for what I was doing. After implementing and ditching the prng it was indeed way faster.

In GLSL a struct for the marbles could look like this:

```glsl
const int numMarbles = 16;
struct Marble {
    vec2 position;
    float size;
    vec3 color1;
    vec3 color2;
};
uniform Marble marbles[numMarbles];
```

And passing the data from JavaScript to GLSL is similar to the stringifying of the array index, you’d also stringify the property name:

```glsl
let uniformLocation
uniformLocation = gl.getUniformLocation(program,'marbles[0].position')
gl.uniform2fv(uniformLocation,[position.x,position.y])
uniformLocation = gl.getUniformLocation(program,'marbles[0].size')
gl.uniform1f(uniformLocation,20)
uniformLocation = gl.getUniformLocation(program,'marbles[0].color1')
gl.uniform3fv(uniformLocation,[color1.r,color1.g,color1.b])
uniformLocation = gl.getUniformLocation(program,'marbles[0].color2')
gl.uniform3fv(uniformLocation,[color2.r,color2.g,color2.b])
```

Yeah this looks convoluted, but it’s for shows. I’m sure you can manage something more generic.

## Swirls and rotation

Like I said; this is not 3D. But I did want stuff to roll around somewhat realisticly. And marbles have these colorful swirls. So in the end what I’ve settled for is rotation depending on horizontal direction.
