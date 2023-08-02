<!--
  date: 2023-03-17
  modified: 2023-03-17
  slug: custom-local-eslint-rules
  type: post
  categories: code
  tags: 
  header: ian-talmacs-AUlaz_3SLDg-unsplash.jpg
  headerColofon: image by [Ian Talmacs](https://unsplash.com/@iantalmacs)
  headerClassName: no-blur darken
--> 

# How to easily implement custom local ESLint rules

[ESLint](https://en.wikipedia.org/wiki/ESLint) is the [linter](https://en.wikipedia.org/wiki/Lint_(software)) for EcmaScript, that means static code analysis for JavaScript as well as TypeScript and JSX.

A year back I created two custom ESLint rules that I wanted to use in a current project. Then I remembered I don't have the code because it was written on the machine of the client I was working for at that time.

I implemented it a second time. But because I ran into some small things, the solutions to which I found in different places, I thought I'd put it all together here. Just in case I forget next year.


## Why use custom rules?

Linters touch the most fundamental rules of a codebase or project. They are often defined once across all teams within a company. With different ways of working (as in WoW) oftentimes standardized linting configurations like the one from [Google](https://github.com/google/eslint-config-google) or [AirBnB](https://github.com/airbnb/javascript) fall short.

The two rules I wanted to add for instance have everything to do with development.
In my IntellIJ IDE I have a *live template* that looks like this: `console.log('$LOG$',$LOG$$END$) // todo: remove log`. The suffixed todo gives a clear indication in the scrollbar margin to remove the log when I'm done. But among less immediate todo's, it is sometimes overlooked. A custom ESLint rule can prevent this from being pushed to the repository.
Similarly there is a specific function call I never want to push. For faster development I often infix the tests I write with `only`, as in `it.only('should', ...etc)`. That way only the tests I am writing are executed. But when I'm done writing and push it I want all the tests to be executed. A custom ESLint rule would make sure any `.only` instances are removed prior to pushing.


## How to configure a custom rule

I got a bit stuck configuring the rules and had to do a [Wayback Machine](http://web.archive.org/web/20220814205319/https://eslint.org/docs/latest/developer-guide/working-with-rules#runtime-rules) sanity check to explain my confusion. There used to be another way to use custom (runtime) rules by setting CLI param `--rulesdir` but this has been deprecated.

As of ESLint 3 the way to use a custom rule is to write and configure it as a plugin. Unfortunately [the documentation is lacking](https://eslint.org/docs/latest/extend/custom-rules) as it does not explain how to install said plugin locally.

So here's the rundown:

You can use a local module as a dependency by installing it through NPM or Yarn. The syntax is `npm i -D file:[location]` or `yarn add --dev file:[location]`.
Since we're trying to install it as a package, the location is a folder with a small custom `package.json`.

```JSON
{
  "name": "eslint-plugin-custom-rules",
  "version": "1.0.0",
  "main": "index.js"
}
```

Any ESLint plugin must be prefixed as such. So the name in `package.json` is `eslint-plugin-custom-rules` (prefixed `eslint-plugin-`). Yet the plugin is referenced in `.eslintrc.js` as `custom-rules`.

That same name is also prefixed in the rules. So your `.eslintrc.js` will look something like this:

```JavaScript
module.exports = {
  
  (...)

  plugins: [

    (...)

    'custom-rules'
  ],

  rules: {

    'custom-rules/no-todo-remove': 'warn',
    'custom-rules/no-test-only': 'error',

    (...)
  }
}

```

The latter part of the rule `/no-todo-remove` refers to the rule name as is configured in the `index.js` of your local package. Which brings us to...


## Setting up the plugin

The `index.js` as main of your local plugin package, is simply an exported object literal with a rules property:

```JavaScript
module.exports = {
  rules: {
    'no-todo-remove': require('./rules/noTodoRemove'),
    'no-test-only': require('./rules/noTestOnly')
  }
}
```

The rules may be written inline, which would replace the `require` with `{meta:{(...)}, create(context){(...)}}`. This might suffice for a single rule, but it is better to structure it into different files. In my case the file structure I use is the following:

```bash
├──.eslint
│   ├──index.js
│   ├──package.json
│   ├──rules
│   │  ├──noTodoRemove.js
│   │  └──noTestOnly.js
```


## Writing the custom rule

[The documentation](https://eslint.org/docs/latest/extend/custom-rules) on writing the actual rule is extensive but lacks some basic explanations; namely about what AST is and how to use it. We'll get to that in a minute. First a basic custom rule:

```JavaScript
module.exports = {
  create(context) {
    const code = context.getSourceCode()
    return {
      CallExpression(node){
        const {trailing} = code.getComments(node)
        const remove = trailing.filter(({value})=>/^\stodo:\sremove\slog$/.test(value))
        remove.length&&context.report(node, 'Logs marked for removal should be removed')
      }
    }
  }
}
```

The return value in the `create` method is where most of the magic happens. In this particular example comments are retrieved and tested against a regex. 

The used callback is `CallExpression`. The ESLint documentation simply assumes we all know how this magic works and does not really elaborate. So I'll try: properties of the return object are callback methods named for points in a structure called AST.

### What is AST?

AST is short for [*abstract syntax tree*](https://en.wikipedia.org/wiki/Abstract_syntax_tree). Source code is converterd by a lexer/parser into a logical structure consisting of arrays and objects (a tree). This tree can then be used to execute code, or in our case, analyse it.

### Return methods

The `CallExpression(node)` is a particular type of point in that syntax tree. You can check the ESlint documentation for possible properties of the return object of that `create(context)`.

But there is also a very useful tool called [ASTExplorer](https://astexplorer.net/). You just paste your code and see how it compares to the actual syntax tree.
This also helps when writing your rule since you can easily check what your `node` contains.

So the methods in the return object are called while traversing the AST.

You can then test and analyse the code in these callback methods. To make your custom rule fail you need to call the `report` method:

```JavaScript
context.report(node, 'All your base are belong to us!')
```

### --Fix

That `report` method is also where fixes can be configured (if any). Instead of `.report(node, message)` we can overload the method with an options object.

For our `noTestOnly.js` this would look something like:

```JavaScript
const parent = ['context', 'it', 'describe', 'test']
module.exports = {
  create(context) {
    return {
      MemberExpression(node){
        const {object: {name}, property: {name:call}} = node
        const isOnly = call==='only'&&parent.includes(name)
        isOnly&&context.report({
          node,
          message: 'The expression `.only(` should never be committed.',
          fix(fixer){
            const [from, to] = node.property.range
            return fixer.removeRange([from-1, to])
          }
        })
      }
    }
  }
}
```


### Easy

That are really the basics just to get you up and running with a simple custom rule (I've completely left out the `meta` property). Make sure to read up on [context methods](https://eslint.org/docs/latest/extend/custom-rules-deprecated#the-context-object).

_And may your linter fail often._
