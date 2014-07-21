---
layout: post
title: "masseuse routers"
description: ""
category: "examples"
tags: ["masseuse", "routers"]
---
{% include JB/setup %}

Absolute Basic Router:

```javascript
masseuse.Router.extend({
    excludeFromBeforeRouting : ['thisrouteis/excluded/:id'],
    routes : {
        'thisrouteis/excluded/:id' : 'excluded'
        '*catchall' : 'someMethodThatCalledLoadMainContent'
    },
    beforeRouting : beforeRouting,
    onRouteFail : onRouteFail,
    loadMainContent : loadMainContent
    
});

```

---

## excludeFromBeforeRouting

This is an array of routes that when hit, will not trigger `beforeRouting`.

For example:

```javascript
excludeFromBeforeRouting : ['login', 'logout', 'thisrouteis/excluded/:id'],
```

---

## routes

Make sure to reference the methods via strings and not via function reference if you want `onBeforeRouting` to work.
Routes in one router should be conceptually grouped.
If routes starts to get too big, create multiple routers.

[See backbone docs](http://backbonejs.org/#Router-routes)
The 'catchall' should contain at least one character after the star(and should be the last route in the routes obj).

---

## beforeRouting
Is a noop, if you define it, you must return a promise.
The promise that is returned, determines if you can pass, or if you shall not pass.

This is useful for things like auth.

```javascript
function beforeRouting() {
    var $deferred = $.Deferred()
   
    // If the deferred is resolved, then you can rage on.
    // If the deferred is rejected, then onRouteFail will be called.
    
    return $deferred.promise();
}
```

---

## onRouteFail
This method is called if the beforeRouting deferred is rejected.  
It is useful for logging people out, displaying an error page, etc. 

```javascript
function onRouteFail() {
    // this guy will be called when you reject beforeRouting deferred.
}
```    
    
---

## Modularization

[Example](todo:create massesuse examples example)

To create multiple routers:

1. Create a base router.

    ```javascript
    var BaseRouter = masseuse.Router.extend({
        // Shared methods
        loadMainContent: loadMainContent,
        beforeRouting: beforeRouting,
        onRouteFail: onRouteFail
    });
    ```
    
1. Create individual routers that extend the base router.

    ```javascript
    var LoginRouter = BaseRouter.extend({
        // Specific to this group of routes
        excludeFromBeforeRouting: ['login', 'logout', 'register'],
        routes: {
            'login': 'login',
            'logout': 'logout',
            'register': 'register'
        }
    });
    
    var AdminRouter = BaseRouter.extend({
        routes: {
            ...
        }
    });
    ```
    
1. Start up each individual router in the same place you would start your one router.

    ```javascript
    new LoginRouter();
    new AdminRouter();
    
    Backbone.history.start();
    ```

---

## loadMainContent

Loads a parent view into a DOM element and removes anything currently in that DOM element. Similar to changing a page
on a server side app.

```javascript
function loadMainContent (ViewType, options) {
    var $deferred = new $.Deferred(),
        newView;
    
    if (!options) {
        options = {};
    }
    
    if (options.modelData) {
        options.modelData.resources = resources;
    }
    newView = new viewTypes[ViewType](options);
    
    if (currentView) {
        currentView.remove();
    }
    
    newView.start()
        .done(function () {
            currentView = newView;
            $deferred.resolve(newView);
        })
        .fail(function () {
            $deferred.reject();
        });
    
    return $deferred.promise();
}
```

---

##Push State

On a server all routers should be redirect to the index.

```javascript
// Express router example
router.route('/example(/*)?').get(function (req, res, next) {
    showStaticPage(req, res, next, 'example');
});
```

---


create and link to working example
