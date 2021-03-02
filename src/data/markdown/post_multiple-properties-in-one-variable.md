<!--
  id: 1826
  description: Multiple properties as variables can take up a lot of space. Here's a way to store them in a single variable using bitwise operations.
  date: 2013-01-22
  modified: 2021-03-02
  slug: multiple-properties-in-one-variable
  type: post
  excerpt: <p>Objects with multiple properties with each their own variable can get a bit messy. Here&#8217;s a nice solution to store multiple properties in a single variable.</p>
  categories: code, JavaScript
  tags: bitwise, and, or, pipe
  metaKeyword: properties
  metaTitle: Storing multiple properties in a single integer using bitwise AND
  metaDescription: Multiple properties as variables can take up a lot of space. Here's a way to store them in a single variable using bitwise operations.
-->

# Storing multiple properties in one integer using bitwise AND

Objects with multiple properties with each their own variable can get a bit messy. Here’s a nice solution to store multiple properties in a single variable.

Watch:

```JavaScript
function bitwisenate(...args) {
  return args.reduce((acc,key,index)=>(acc[key] = 2**index, acc), {})
}

function isPartOf(parts, part) {
  return !!(part&parts)
}

const {WALK, CRAWL, RUN, FLY, SWIM} = bitwisenate('WALK', 'CRAWL', 'RUN', 'FLY', 'SWIM')

function creature(name, abilities){
  return {
    name
    ,can: isPartOf.bind(null, abilities)
  }
}

const humans = creature('humans', WALK|RUN|CRAWL|SWIM)
const fishes = creature('fishes', SWIM)
const turtles = creature('turtles', SWIM|CRAWL)
const pigs = creature('pigs', WALK|SWIM)

humans.can(WALK) // returns true
fishes.can(WALK) // returns false
turtles.can(RUN) // returns false
pigs.can(FLY) // returns false
```

So the abilities itself are stored in a single private variable (`abilities`), but we can easily test any ability with the `creature.can` method. Nice huh?

## Spoiler alert

But let me take some of the magic away by explaining what really happens.  
As you might have noticed the abilities (WALK, CRAWL, RUN...) are powers of two (`1,2,4,8,16...`). This corresponds to the binary equivalent of the decimal power of ten. The same sequence in binary is: `1,10,100,1000,10000`.  
So adding any of the properties will always result in a unique number: ie the decimal `2` and `8` result in the binary `1010` (the properties are not really added but we’ll come to that).

## Bitwise AND

The trick lies in the `&` operator, or bitwise AND. [Bitwise operations](http://en.wikipedia.org/wiki/Bitwise_operation) are extremely fast calculations because they are handled directly by the processor.  
Bitwise AND compares the binary equivalent of two numbers and returns a new number where the 1’s coincide. Like this:  

```-large 
0101 & // 5
0011 = // 3
0001   // 1
```

In the example a pig is able walk and swim, so that’s `1|16=17`, which is `10001` in binary. So to test if pigs can fly you’d do `17&8`, which is zero because:  

```-large
10001 & // 17
01000 = // 8
00000   // 0
```

## Bitwise OR

You might also notice that the abilities are added by means of another bitwise operator: the bitwise OR, represented by the pipe sign: `|`. Bitwise OR is not the same as adding, but we are dealing with powers of two, so in this case it is. Bitwise OR really works like this:  

```-large
0101 | // 5
0011 = // 3
0111   // 7
```

## Impress your friends 

So that’s basically how it works. Fast. Practical in numerous cases (for storing a bunch of checkboxes in a database for instance). Very useful to keep your code clean and minimal (assuming you know how to read bitwise operators, but now you do). Plus looking at the variable ‘ability’ alone immediately tells you a great deal about the rest of the code:

 - capital properties tells you they are constant, so they don’t change
 - binary sequence tells you the properties are stored as a single variable
 - binary sequence also tells you an object can have multiple properties, but only one of each

There is however a maximum to all this. Bitwise operations in JavaScript are done on 32 bit numbers. But that should be more than enough for most.

## ps

We didn't use it, but since you now know how bitwise AND and OR work you might want to know about the third bitwise operator: XOR represented by the `^` sign. 

```-large
0101 ^ // 5
0011 = // 3
0110   // 6
``` 
