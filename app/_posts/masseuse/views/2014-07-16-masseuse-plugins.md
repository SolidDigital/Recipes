---
layout: post
title: "masseuse plugins"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Masseuse plugins is an array of methods that can be defined in `options.plugins`.

All methods in the plugins array are called in order on `view.initialize()`.
The `options` object is passed into the plugin method, and the context of the
plugin method is the instance of the view.

This is a chance to customize the view by setting up life cycle event listeners
when a plugin method is called.

For example, a simple plugin could do something like below:

```javascript
options.plugins = [
    function (options) {
        this.listenTo('beforeRenderDone', function () {
            // DO WORK    
        });
    }
];
```