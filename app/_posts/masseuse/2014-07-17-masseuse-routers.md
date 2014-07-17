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
## excludeFromBeforeRouting

## routes
[See backbone docs](http://backbonejs.org/#Router-routes)
The 'catchall' should contain at least one character after the star(and should be the last route in the routes obj).


TODO: issue a pull request(Routes order is not guaraneed?)
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
## onRouteFail
This method is called if the beforeRouting deferred is rejected.  
It is useful for logging people out, displaying an error page, etc. 

```javascript
function onRouteFail() {
    // this guy will be called when you reject beforeRouting deferred.
}
```    
    
    


Modularization
BeforeRouting
ExcludeFromBeforeRouting - global or per router
onRouterFail
loadMainContent
Push State
create and link to working example
