---
layout: page
title : hello
tagline: "Introduction"
---
{% include JB/setup %}

```javascript
hello('world');
```

* [TO DO's](2014/06/27/to-dos/) 

* goals
    * recipe book
    * exploratory tests
    * runnable samples

* masseuse
    * [starting a new project]({{ site.JB.BASE_PATH }}/2014/06/27/setting-up-masseuse/)
        * from start to deploy - example
    * views
        * [Async render example](http://solid-interactive.github.io/masseuse-examples/async-render)
        * [Drag and drop with jQuery UI example](http://solid-interactive.github.io/masseuse-examples/drag-and-drop)
        * Lifecycle and hooks
        * Child views
        * default options
            * viewOptions field
        * options.js
            * Listeners
            * Rivets options
            * Events
            * viewContext
            * Model
            * Model defaults
            * appendTo
            * wrapper
            * Collection
    * channels
    * models
        * [Validation example]()
        * proxy/computed/observer properties
        
    * workers (do not use - name appropriately and break into multiple amds)
        * refactoring a view to first create private methods, then grouping them, then extracting to amds
    * modals
    * naming conventions
        * directory structure
        * file names
        * path aliases
* promises
    * differences between Q / $
    * chaining
    * error handling
* rivets
    * keypaths
    * [Child view binder example](http://solid-interactive.github.io/masseuse-examples/new-child-view-binder)
    * [Two way binding example](http://solid-interactive.github.io/masseuse-examples/two-way-binding)
    * [Rivets Binder example]()
    * [Rivets Formatters example]()
    * binders 
        * existing masseuse ones
    * filters
    * adapters
    * if / unless
    * components
    * formatters
        * existing masseuse ones
    * rivets
    * iteration
* gh as a library
    * creating static pages
    * creating custom endpoints
    * using gh core separately (queries)


* requirejs
    * path aliases
* testing
    * browser
        * unit
        * integration
    * node     
        * unit
        * integration
* grunt
    * paths.json
    * release notes
    * deploy
* heroku
* foundation
* sass
    * mixins
    * https://github.com/davidtheclark/scut
* jade
    * mixins
    * blocks