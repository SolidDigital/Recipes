---
layout: post
title: "Creating an object"
description: ""
category: style
tags: ["javascript", "objects"]
---
{% include JB/setup %}

When creating a larger object, it is important to separate the list of fields and methods from the definition of the fields.
Doing this allows a quick scan of the top of the file to see what may be available on the object and taking more time
by scrolling down will lead you to the details of the object.

Example of a new object:

```javascript
return {
    send : send,
    receive : receive,
    go : go
}

function send() { 
    ... 
}
function receive() { 
    ... 
}
function go() { 
    ... 
}
```

Defining an object and modifying the prototype follows a similar pattern. There are two options:

Option 1 - adding directly to the prototype

```javascript
Thing.prototype.send = send;
Thing.prototype.receive = receive;
Thing.prototype.go = go;

return Thing;

function Thing() {
    ...
}
function send() { 
    ... 
}
function receive() { 
    ... 
}
function go() { 
    ... 
}
```

Option 2 - creating an object to add to the prototype

```javascript
_.extend(Thing.prototype, {
    send : send
    receive : receive,
    go : go
});

return Thing;

function Thing() {
    ...
}
function send() { 
    ... 
}
function receive() { 
    ... 
}
function go() { 
    ... 
}
```

In all cases the general idea is to put the gist of things at the top of the file and the details below.

Private methods should be prefixed with `_`. Methods that are not truly private (enclosed), should not be 
prefixed. Private methods may be placed below the public methods they are called from or at the bottom of
the file.