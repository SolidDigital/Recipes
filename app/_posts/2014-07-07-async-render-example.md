---
layout: post
title: "Async render example"
description: ""
category: "examples"
tags: ["async", "life cycle", "beforeRender", "afterRender"]
---
{% include JB/setup %}

[Example code](http://solid-interactive.github.io/masseuse-examples/async-render)

beforeRender and afterRender are optionally async. If [beforeRender.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length) is 1 or greater, and $.Deferred() will be passed in, and the life cycle will only continue once it is resolved.


```javascript
masseuse.BaseView.extend({
    beforeRender : beforeRender
});
```

#### Synchronous

```javascript
function beforeRender() {
    this.doStuffQuickly();
}
```
#### Asynchronous

```javascript
function beforeRender($deferred) {
    this.doStuffThatTakeALongTime()
        .then($deferred.resolve);
}
```

When you make beforeRender async, it will not move onto the render method until its deferred is resolved.
